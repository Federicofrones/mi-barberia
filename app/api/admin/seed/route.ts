export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);

        // 1. Create or Update Shop
        await shopRef.set({
            timezone: "America/Montevideo",
            currency: "UYU",
            bookingRules: {
                slotMinutes: 15,
                minNoticeMinutes: 60,
                cancelNoticeMinutes: 120,
                maxDaysAhead: 30,
                maxBookingsPerHourPerIp: 3,
                alignToSlot: true,
            },
            limits: {
                maxBarbers: 6,
            }
        });

        // 2. Create sample services
        const services = [
            { name: "Corte Tradicional", baseDurationMin: 30, price: 500, serviceCost: 50, isActive: true },
            { name: "Corte y Barba", baseDurationMin: 45, price: 800, serviceCost: 100, isActive: true },
            { name: "Platinado", baseDurationMin: 120, price: 2500, serviceCost: 500, isActive: true }
        ];

        for (let i = 0; i < services.length; i++) {
            const s = services[i];
            await shopRef.collection('services').doc(`serv_${i}`).set(s);
        }

        // 3. Create Sample Barber
        const demoBarber = {
            displayName: "Juan el Barbero",
            isActive: true,
            order: 1,
            workingHours: {
                mon: { start: "09:00", end: "20:00" },
                tue: { start: "09:00", end: "20:00" },
                wed: { start: "09:00", end: "20:00" },
                thu: { start: "09:00", end: "20:00" },
                fri: { start: "09:00", end: "20:00" },
                sat: { start: "09:00", end: "14:00" },
                sun: null
            },
            commission: {
                type: "percentage",
                value: 50,
                includeTips: true
            }
        };

        await shopRef.collection('barbers').doc('barber_01').set(demoBarber);

        // 4. Try to create Admin User (Optional if you already have one)
        let uid = "";
        try {
            const userRecord = await adminAuth.createUser({
                email: 'admin@barberia.com',
                password: 'Password123!',
                displayName: 'Administrador'
            });
            uid = userRecord.uid;
            await shopRef.collection('admins').doc(uid).set({ createdAt: new Date() });
        } catch (e: any) {
            if (e.code === 'auth/email-already-exists') {
                const user = await adminAuth.getUserByEmail('admin@barberia.com');
                await shopRef.collection('admins').doc(user.uid).set({ createdAt: new Date() });
            } else {
                console.error("Auth creation failed:", e.message);
            }
        }

        return NextResponse.json({ success: true, message: "Seed completado" });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
