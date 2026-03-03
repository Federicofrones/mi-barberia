import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireBarberSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const session = await requireBarberSession(request as any) as any;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const appRef = adminDb.collection(`shops/${globalConfig.shopId}/appointments`).doc(appointmentId);
        const appSnap = await appRef.get();

        if (!appSnap.exists) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const appData = appSnap.data() as any;

        // Security check: Barbers can only modify THEIR appointments
        if (session.role === 'barber' && appData.barberId !== session.barberId) {
            return NextResponse.json({ error: "Forbidden: Not your appointment" }, { status: 403 });
        }

        // Update status
        await appRef.update({ status });

        return NextResponse.json({ success: true, newStatus: status });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
