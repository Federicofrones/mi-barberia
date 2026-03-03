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

        const barberId = session.role === 'admin' ? searchParams.get('barberId') || session.barberId : session.barberId;

        if (!dateKey || !barberId) {
            return NextResponse.json({ stats: null });
        }

        const statsDoc = await adminDb.doc(`shops/${globalConfig.shopId}/barberDailyStats/${barberId}_${dateKey}`).get();

        if (!statsDoc.exists) {
            return NextResponse.json({
                stats: {
                    doneCount: 0,
                    revenueNet: 0,
                    tips: 0,
                    commissionTotal: 0
                }
            });
        }

        return NextResponse.json({ stats: statsDoc.data() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
