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

        // Check if user is in Admins collection
        const adminDoc = await adminDb.doc(`shops/${globalConfig.shopId}/admins/${decodedToken.uid}`).get();

        if (!adminDoc.exists) {
            return NextResponse.json({ error: "No eres administrador" }, { status: 403 });
        }

        // Create secure HTTP Only session
        await createSessionCookie(decodedToken.uid, 7); // 7 days expiration

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed", details: error.message }, { status: 401 });
    }
}

export async function DELETE() {
    await clearSession();
    return NextResponse.json({ success: true });
}
