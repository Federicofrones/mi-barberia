export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { ShopConfig, Service, Barber } from '@/lib/models/types';

export async function GET() {
    try {
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        // Fetch configs, services, and barbers in parallel
        const [shopSnap, servicesSnap, barbersSnap] = await Promise.all([
            shopRef.get(),
            shopRef.collection('services').where('isActive', '==', true).get(),
            shopRef.collection('barbers').where('isActive', '==', true).orderBy('order', 'asc').limit(6).get() // Max 6 actives
        ]);

        if (!shopSnap.exists) {
            return NextResponse.json({ error: "Shop no configurada" }, { status: 404 });
        }

        const shop = shopSnap.data() as ShopConfig;

        const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        const barbers = barbersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Barber[];

        return NextResponse.json({
            shop,
            services,
            barbers
        });
    } catch (error: any) {
        console.error("Bootstrap API error:", error);
        return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
    }
}
