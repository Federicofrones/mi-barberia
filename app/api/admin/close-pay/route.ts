export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireBarberSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';
import { Appointment, Barber, Payment, DailyStats, BarberDailyStats, ShopConfig } from '@/lib/models/types';
import { calculateCommission } from '@/lib/models/math';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

const PaySchema = z.object({
    appointmentId: z.string().min(1),
    method: z.enum(['cash', 'card', 'transfer']),
    paymentMethod: z.enum(['cash', 'card', 'transfer']).optional(), // Support both names
    discount: z.number().min(0).default(0),
    tip: z.number().min(0).default(0),
});

export async function POST(request: Request) {
    try {
        const session = await requireBarberSession(request as any) as any;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const parsed = PaySchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

        const { appointmentId, discount, tip } = parsed.data;
        const method = parsed.data.method || parsed.data.paymentMethod;

        if (!method) return NextResponse.json({ error: "Método de pago requerido" }, { status: 400 });

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        await adminDb.runTransaction(async (t) => {
            const appRef = shopRef.collection('appointments').doc(appointmentId);
            const appSnap = await t.get(appRef);

            if (!appSnap.exists) throw new Error("Turno no encontrado");
            const appointment = appSnap.data() as Appointment;

            // Security check: Barbers can only close THEIR appointments
            if (session.role === 'barber' && appointment.barberId !== session.barberId) {
                throw new Error("No tienes permiso para cerrar este turno");
            }

            if (appointment.status === 'done' || appointment.status === 'cancelled') {
                throw new Error(`Turno ya procesado (${appointment.status})`);
            }

            // Fetch Barber for commission rules
            const barberRef = shopRef.collection('barbers').doc(appointment.barberId);
            const barberSnap = await t.get(barberRef);
            if (!barberSnap.exists) throw new Error("Barbero no encontrado");
            const barber = barberSnap.data() as Barber;

            // Calculations
            const basePrice = appointment.pricing.basePrice;
            const { finalPrice, commissionBase, commissionAmount } = calculateCommission(
                basePrice,
                discount,
                tip,
                barber.commission
            );

            const serviceCost = appointment.costing.serviceCost;
            const businessAmount = commissionBase - commissionAmount;
            const profitNet = businessAmount - serviceCost;

            // 1. Create Payment
            const paymentRef = shopRef.collection('payments').doc();
            const newPayment: Payment = {
                appointmentId,
                dateKey: appointment.dateKey,
                barberId: appointment.barberId,
                barberName: appointment.barberName,
                method,
                amount: finalPrice,
                tip,
                discount,
                commission: {
                    type: barber.commission.type,
                    value: barber.commission.value,
                    commissionBase,
                    commissionAmount
                },
                businessAmount,
                costing: {
                    serviceCost,
                    profitGross: businessAmount,
                    profitNet
                },
                createdAt: FieldValue.serverTimestamp() as any,
                createdBy: session.uid as string
            };
            t.set(paymentRef, newPayment);

            // 2. Update Appointment
            t.update(appRef, {
                status: 'done',
                'pricing.discount': discount,
                'pricing.finalPrice': finalPrice
            });

            // 3. Update Daily Stats
            const dateKey = appointment.dateKey;
            const dailyStatsRef = shopRef.collection('dailyStats').doc(dateKey);
            t.set(dailyStatsRef, {
                revenue: {
                    net: FieldValue.increment(finalPrice),
                    tips: FieldValue.increment(tip),
                    discounts: FieldValue.increment(discount),
                    gross: FieldValue.increment(finalPrice + tip)
                },
                commissions: { total: FieldValue.increment(commissionAmount) },
                costs: { services: FieldValue.increment(serviceCost) },
                profit: { net: FieldValue.increment(profitNet) },
                paymentMethods: {
                    [method]: FieldValue.increment(finalPrice + tip)
                },
                appointments: { done: FieldValue.increment(1) },
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            // 4. Update Barber Daily Stats
            const barberStatsRef = shopRef.collection('barberDailyStats').doc(`${appointment.barberId}_${dateKey}`);
            t.set(barberStatsRef, {
                barberId: appointment.barberId,
                barberName: appointment.barberName,
                dateKey,
                doneCount: FieldValue.increment(1),
                revenueNet: FieldValue.increment(finalPrice),
                tips: FieldValue.increment(tip),
                commissionTotal: FieldValue.increment(commissionAmount),
                businessTotal: FieldValue.increment(businessAmount),
                serviceCostTotal: FieldValue.increment(serviceCost),
                profitNet: FieldValue.increment(profitNet),
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Payment API error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
