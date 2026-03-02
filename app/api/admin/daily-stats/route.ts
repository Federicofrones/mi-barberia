export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const dateKey = searchParams.get('dateKey');

        if (!dateKey) return NextResponse.json({ error: "dateKey requerido" }, { status: 400 });

        const statsSnap = await adminDb.doc(`shops/${globalConfig.shopId}/dailyStats/${dateKey}`).get();

        return NextResponse.json({ stats: statsSnap.exists ? statsSnap.data() : null });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
