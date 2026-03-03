import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireBarberSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const session = await requireBarberSession(request as any) as any;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Barbers see ONLY their reviews, admins can see all or specify
        const barberId = session.role === 'admin' ? new URL(request.url).searchParams.get('barberId') : session.barberId;

        let query = adminDb.collection(`shops/${globalConfig.shopId}/reviews`).orderBy('createdAt', 'desc');

        if (barberId) {
            query = query.where('barberId', '==', barberId);
        }

        const snapshot = await query.limit(50).get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ reviews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
