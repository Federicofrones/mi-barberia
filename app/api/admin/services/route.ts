export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const snapshot = await adminDb.collection(`shops/${globalConfig.shopId}/services`).get();
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ services });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { id, ...data } = body;

        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);
        if (id) {
            await shopRef.collection('services').doc(id).update(data);
        } else {
            await shopRef.collection('services').add(data);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
