export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';
import { z } from 'zod';

const ApproveSchema = z.object({
    appointmentId: z.string().min(1),
    action: z.enum(['approve', 'cancel'])
});

export async function POST(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const parsed = ApproveSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

        const { appointmentId, action } = parsed.data;
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);
        const appRef = shopRef.collection('appointments').doc(appointmentId);

        const appSnap = await appRef.get();
        if (!appSnap.exists) throw new Error("Turno no encontrado");

        if (action === 'approve') {
            await appRef.update({ status: 'confirmed' });
        } else {
            await appRef.update({ status: 'cancelled' });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
