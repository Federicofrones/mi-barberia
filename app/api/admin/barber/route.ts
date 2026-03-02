export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { id, ...data } = body;

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        // Limits
        if (!id && data.isActive) {
            const activeSnaps = await shopRef.collection('barbers').where('isActive', '==', true).get();
            const shopSnap = await shopRef.get();
            const max = shopSnap.data()?.limits?.maxBarbers || 6;
            if (activeSnaps.size >= max) {
                return NextResponse.json({ error: `Límite de ${max} barberos activos alcanzado.` }, { status: 400 });
            }
        }

        if (id) {
            await shopRef.collection('barbers').doc(id).update(data);
        } else {
            await shopRef.collection('barbers').add(data);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
