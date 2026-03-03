export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireBarberSession, unauthorizedResponse } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const session = await requireBarberSession(request as any);
        if (!session || !session.barberId) return unauthorizedResponse();

        const body = await request.json();
        const { active } = body;

        await adminDb
            .collection('shops')
            .doc(globalConfig.shopId)
            .collection('barbers')
            .doc(session.barberId as string)
            .update({
                isShiftActive: active,
                lastSeen: new Date()
            });

        return NextResponse.json({ success: true, active });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
