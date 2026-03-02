export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { ShopConfig, Service, Barber, Appointment } from '@/lib/models/types';
import { now, fromDateKey, parseTime } from '@/lib/models/time';
import { generateSlots } from '@/lib/calendar/timeUtils';
import { z } from 'zod';

const AvailabilitySchema = z.object({
    barberId: z.string().min(1),
    serviceId: z.string().min(1),
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = AvailabilitySchema.safeParse({
            barberId: searchParams.get('barberId'),
            serviceId: searchParams.get('serviceId'),
            dateKey: searchParams.get('dateKey'),
        });

        if (!parsed.success) {
            return NextResponse.json({ error: "Parámetros inválidos", details: parsed.error.issues }, { status: 400 });
        }
        const { barberId, serviceId, dateKey } = parsed.data;

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        const [shopSnap, barberSnap, serviceSnap, appointmentsSnap] = await Promise.all([
            shopRef.get(),
            shopRef.collection('barbers').doc(barberId).get(),
            shopRef.collection('services').doc(serviceId).get(),
            shopRef.collection('appointments')
                .where('barberId', '==', barberId)
                .where('dateKey', '==', dateKey)
                .where('status', 'in', ['pending', 'confirmed'])
                .get()
        ]);

        if (!shopSnap.exists || !barberSnap.exists || !serviceSnap.exists) {
            return NextResponse.json({ error: "Recursos no encontrados" }, { status: 404 });
        }

        const shop = shopSnap.data() as ShopConfig;
        const barber = barberSnap.data() as Barber;
        const service = serviceSnap.data() as Service;

        if (!barber.isActive || !service.isActive) {
            return NextResponse.json({ error: "Barbero o servicio inactivo" }, { status: 400 });
        }

        // Determine actual duration
        const durationMin = barber.serviceOverrides?.[serviceId]?.durationMin || service.baseDurationMin;

        // Determine day of week
        const targetDate = fromDateKey(dateKey);
        const dayOfWeek = targetDate.toFormat('ccc').toLowerCase(); // e.g., 'mon', 'tue'
        const workingHours = barber.workingHours[dayOfWeek];

        if (!workingHours) {
            return NextResponse.json({ slots: [] }); // Not working this day
        }

        // Parse existing appointments for overlaps
        const existingAppointments = appointmentsSnap.docs.map(doc => {
            const app = doc.data() as Appointment;
            const start = app.startAt as unknown as any;
            const startDate = start.toDate ? start.toDate() : new Date(start._seconds * 1000);
            const startMinOfDay = startDate.getHours() * 60 + startDate.getMinutes();
            return {
                startTime: startMinOfDay,
                endTime: startMinOfDay + app.durationMin
            };
        });

        const startObj = parseTime(workingHours.start, targetDate);
        const endObj = parseTime(workingHours.end, targetDate);

        const slots = generateSlots(
            startObj,
            endObj,
            shop.bookingRules.slotMinutes,
            durationMin,
            existingAppointments,
            now(),
            shop.bookingRules.minNoticeMinutes
        );

        return NextResponse.json({
            slots: slots.map(s => s.toFormat('HH:mm')),
            durationMin
        });
    } catch (error: any) {
        console.error("Availability API error:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}
