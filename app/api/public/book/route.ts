export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { ShopConfig, Service, Barber, Appointment } from '@/lib/models/types';
import { now, parseTime } from '@/lib/models/time';
import { generateCancelToken } from '@/lib/models/crypto';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';

const BookSchema = z.object({
    barberId: z.string().min(1),
    serviceId: z.string().min(1),
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timeKey: z.string().regex(/^\d{2}:\d{2}$/), // 'HH:mm'
    clientName: z.string().min(2),
    clientPhone: z.string().min(8),
    clientEmail: z.string().email().optional().or(z.literal('')),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = BookSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Datos inválidos", details: parsed.error.issues }, { status: 400 });
        }
        const { barberId, serviceId, dateKey, timeKey, clientName, clientPhone, clientEmail } = parsed.data;

        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const hourKey = now().toFormat('yyyy-MM-dd-HH');
        const rateLimitId = `${ip}_${hourKey}`;

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        // RATE LIMITING & ATOMIC BOOKING
        const result = await adminDb.runTransaction(async (t) => {
            // 1. Get configs
            const shopSnap = await t.get(shopRef);
            if (!shopSnap.exists) throw new Error("Shop no encontrada");
            const shop = shopSnap.data() as ShopConfig;

            // 2. Rate Limiting Check
            const rateLimitRef = shopRef.collection('bookingRateLimits').doc(rateLimitId);
            const rateLimitSnap = await t.get(rateLimitRef);
            if (rateLimitSnap.exists && rateLimitSnap.data()?.count >= shop.bookingRules.maxBookingsPerHourPerIp) {
                throw new Error("Has superado el límite de reservas por hora");
            }

            // 3. Get Barber & Service
            const barberRef = shopRef.collection('barbers').doc(barberId);
            const serviceRef = shopRef.collection('services').doc(serviceId);
            const [barberSnap, serviceSnap] = await Promise.all([t.get(barberRef), t.get(serviceRef)]);

            if (!barberSnap.exists || !serviceSnap.exists) throw new Error("Recursos no encontrados");

            const barber = barberSnap.data() as Barber;
            const service = serviceSnap.data() as Service;

            if (!barber.isActive || !service.isActive) throw new Error("Servicio o barbero inactivo");

            // 4. Time Overlap Check
            const durationMin = barber.serviceOverrides?.[serviceId]?.durationMin || service.baseDurationMin;
            const targetStartObj = parseTime(timeKey, now().set({ year: Number(dateKey.slice(0, 4)), month: Number(dateKey.slice(5, 7)), day: Number(dateKey.slice(8, 10)) }));
            const targetEndObj = targetStartObj.plus({ minutes: durationMin });

            const newStartMin = targetStartObj.hour * 60 + targetStartObj.minute;
            const newEndMin = targetEndObj.hour * 60 + targetEndObj.minute;

            const existingAppsSnap = await t.get(
                shopRef.collection('appointments')
                    .where('barberId', '==', barberId)
                    .where('dateKey', '==', dateKey)
                    .where('status', 'in', ['pending', 'confirmed'])
            );

            for (const doc of existingAppsSnap.docs) {
                const app = doc.data() as Appointment;
                const appStartObj = app.startAt as unknown as any;
                const appDate = appStartObj.toDate ? appStartObj.toDate() : new Date(appStartObj._seconds * 1000);
                const appStartMin = appDate.getHours() * 60 + appDate.getMinutes();
                const appEndMin = appStartMin + app.durationMin;

                // Ovelap condition
                if (newStartMin < appEndMin && newEndMin > appStartMin) {
                    throw new Error("El horario seleccionado ya no está disponible (ocupado intermedial)");
                }
            }

            // 5. Success! Create Appointment & Update Rate Limit
            const { token, hash } = generateCancelToken();

            const newAppRef = shopRef.collection('appointments').doc();
            const newAppointment: Appointment = {
                createdFrom: 'public',
                status: 'pending',
                startAt: targetStartObj.toJSDate() as any,
                endAt: targetEndObj.toJSDate() as any,
                dateKey,
                barberId,
                barberName: barber.displayName,
                serviceId,
                serviceName: service.name,
                durationMin,
                pricing: {
                    basePrice: service.price,
                    finalPrice: service.price,
                },
                costing: {
                    serviceCost: service.serviceCost || 0,
                },
                clientName,
                clientPhone,
                clientEmail: clientEmail || '',
                cancelTokenHash: hash,
                createdAt: FieldValue.serverTimestamp() as any,
            };

            t.set(newAppRef, newAppointment);

            // Increment Rate limit
            t.set(rateLimitRef, {
                ip,
                hourKey,
                count: FieldValue.increment(1),
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            return { appointmentId: newAppRef.id, token, newAppointment };
        });

        return NextResponse.json({
            success: true,
            appointmentId: result.appointmentId,
            cancelToken: result.token,
            appointment: result.newAppointment
        });
    } catch (error: any) {
        console.error("Booking API error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
