import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { createSessionCookie, clearSession } from '@/lib/session';
import { globalConfig } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idToken } = body;

        // Verify raw Firebase token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        // 1. Check if user is in Admins collection
        const adminDoc = await adminDb.doc(`shops/${globalConfig.shopId}/admins/${uid}`).get();

        if (adminDoc.exists) {
            await createSessionCookie({ uid, role: 'admin' }, 7);
            return NextResponse.json({ success: true, role: 'admin' });
        }

        // 2. Check if user is a Barber (by email matching)
        // We search in the barbers collection for a barber with this email
        const barberQuery = await adminDb.collection(`shops/${globalConfig.shopId}/barbers`)
            .where('email', '==', email)
            .where('isActive', '==', true)
            .limit(1)
            .get();

        if (!barberQuery.empty) {
            const barberDoc = barberQuery.docs[0];
            await createSessionCookie({
                uid,
                role: 'barber',
                barberId: barberDoc.id
            }, 7);

            return NextResponse.json({ success: true, role: 'barber' });
        }

        return NextResponse.json({ error: "No tienes permisos de acceso" }, { status: 403 });

    } catch (error: any) {
        console.error("Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed", details: error.message }, { status: 401 });
    }
}

export async function DELETE() {
    await clearSession();
    return NextResponse.json({ success: true });
}
