export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { Appointment, ShopConfig } from '@/lib/models/types';
import { verifyCancelToken } from '@/lib/models/crypto';
import { now } from '@/lib/models/time';
import { z } from 'zod';

const CancelSchema = z.object({
    appointmentId: z.string().min(1),
    token: z.string().min(1),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = CancelSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }
        const { appointmentId, token } = parsed.data;

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        await adminDb.runTransaction(async (t) => {
            const appRef = shopRef.collection('appointments').doc(appointmentId);
            const appSnap = await t.get(appRef);

            if (!appSnap.exists) throw new Error("Turno no encontrado");
            const appointment = appSnap.data() as Appointment;

            if (appointment.status === 'done' || appointment.status === 'cancelled') {
                throw new Error(`El turno ya está ${appointment.status}`);
            }

            if (!appointment.cancelTokenHash || !verifyCancelToken(token, appointment.cancelTokenHash)) {
                throw new Error("Token de cancelación inválido");
            }

            // Time condition: now <= startAt - cancelNoticeMinutes
            const shopSnap = await t.get(shopRef);
            const shop = shopSnap.data() as ShopConfig;

            const startAtObj = appointment.startAt as unknown as any;
            const startDate = startAtObj.toDate ? startAtObj.toDate() : new Date(startAtObj._seconds * 1000);

            const deadline = new Date(startDate.getTime() - shop.bookingRules.cancelNoticeMinutes * 60000);

            if (now().toJSDate() > deadline) {
                throw new Error(`Es muy tarde para cancelar (aviso mínimo: ${shop.bookingRules.cancelNoticeMinutes}m)`);
            }

            t.update(appRef, {
                status: 'cancelled',
                updatedAt: new Date()
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
