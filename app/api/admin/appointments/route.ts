export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';
import { z } from 'zod';

const ApptQuery = z.object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export async function GET(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const parsed = ApptQuery.safeParse({ dateKey: searchParams.get('dateKey') });

        if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

        const { dateKey } = parsed.data;

        const snapshot = await adminDb.collection(`shops/${globalConfig.shopId}/appointments`)
            .where('dateKey', '==', dateKey)
            .get();

        const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ appointments });
    } catch (error: any) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
