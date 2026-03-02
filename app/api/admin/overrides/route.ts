export const dynamic = 'force-dynamic';

import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { ShopConfig, Barber } from '@/lib/models/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { id, overrides } = await request.json();
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        await shopRef.collection('barbers').doc(id).update({
            serviceOverrides: overrides
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
