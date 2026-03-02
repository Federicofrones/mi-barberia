export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const snapshot = await adminDb.collection(`shops/${globalConfig.shopId}/barbers`).orderBy('order', 'asc').get();
        const barbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ barbers });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
