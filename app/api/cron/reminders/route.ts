export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { Appointment } from '@/lib/models/types';
import { now } from '@/lib/models/time';

export async function POST(request: Request) {
    try {
        const cronSecret = process.env.CRON_SECRET;
        if (cronSecret) {
            const authHeader = request.headers.get('x-cron-secret');
            if (authHeader !== cronSecret) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const tomorrow = now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        // Find tomorrow's appointments
        const snapshot = await shopRef.collection('appointments')
            .where('dateKey', '==', tomorrow)
            .where('status', '==', 'confirmed')
            .get();

        let count = 0;

        for (const doc of snapshot.docs) {
            const app = doc.data() as Appointment;

            if (!app.reminder?.sent24h && app.clientPhone) {
                // Here you would call the WhatsApp API
                // sendWhatsAppMessage(app.clientPhone, "Recordatorio de turno...");
                // In this implementation, we simulate and update state
                console.log(`Sending reminder to ${app.clientPhone} for ${app.serviceName}`);

                await doc.ref.update({
                    'reminder.sent24h': true,
                });

                count++;
            }
        }

        return NextResponse.json({ success: true, sent: count });
    } catch (error: any) {
        console.error("Cron error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
