export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminSession, unauthorizedResponse } from '@/lib/apiAuth';
import { globalConfig } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);
        const brandingDoc = await shopRef.collection('config').doc('branding').get();

        if (!brandingDoc.exists) {
            return NextResponse.json({
                logoUrl: '/brand/logo.png',
                gallery: [
                    '/gallery/1.png',
                    '/gallery/2.png',
                    '/gallery/3.png',
                    '/gallery/4.png',
                    '/gallery/5.png',
                    '/gallery/6.png',
                ]
            });
        }

        return NextResponse.json(brandingDoc.data());
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await requireAdminSession(request as any);
        if (!session) return unauthorizedResponse();

        const data = await request.json();
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        await shopRef.collection('config').doc('branding').set(data, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
