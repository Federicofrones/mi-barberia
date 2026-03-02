export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';
import { z } from 'zod';

const UpdateSchema = z.object({
    appointmentId: z.string().min(1),
    durationMin: z.number().min(5).optional(),
    status: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const parsed = UpdateSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

        const { appointmentId, ...updates } = parsed.data;
        const appRef = adminDb.collection(`shops/${globalConfig.shopId}/appointments`).doc(appointmentId);

        await appRef.update(updates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update appointment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
