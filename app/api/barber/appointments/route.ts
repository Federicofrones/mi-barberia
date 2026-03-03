import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireBarberSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const session = await requireBarberSession(request as any) as any;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const dateKey = searchParams.get('dateKey');

        // If it's a barber, they can only see THEIR appointments
        // Unless it's an admin impersonating or checking
        const barberId = session.role === 'admin' ? searchParams.get('barberId') || session.barberId : session.barberId;

        if (!dateKey || !barberId) {
            return NextResponse.json({ appointments: [] });
        }

        const snapshot = await adminDb.collection(`shops/${globalConfig.shopId}/appointments`)
            .where('dateKey', '==', dateKey)
            .where('barberId', '==', barberId)
            .get();

        const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ appointments });
    } catch (error: any) {
        console.error("Barber Appts Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
