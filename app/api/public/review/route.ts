import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { appointmentId, rating, comment, token } = body;

        if (!appointmentId || !rating) {
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
        }

        // 1. Verify appointment exists and token matches (Security)
        const appRef = adminDb.collection(`shops/${globalConfig.shopId}/appointments`).doc(appointmentId);
        const appSnap = await appRef.get();

        if (!appSnap.exists) {
            return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
        }

        const appData = appSnap.data() as any;

        // You could check token here if you stored one, but for now we'll allow if status is 'done'
        if (appData.status !== 'done') {
            return NextResponse.json({ error: "El turno debe estar finalizado para dejar una reseña" }, { status: 400 });
        }

        // 2. Create Review
        const reviewRef = adminDb.collection(`shops/${globalConfig.shopId}/reviews`).doc();
        const reviewData = {
            id: reviewRef.id,
            appointmentId,
            barberId: appData.barberId,
            barberName: appData.barberName,
            clientName: appData.clientName,
            serviceName: appData.serviceName,
            rating: Number(rating),
            comment: comment || "",
            status: 'pending', // Pending moderation (Admin decides if it goes to the public feed)
            createdAt: FieldValue.serverTimestamp()
        };

        await reviewRef.set(reviewData);

        // 3. Mark appointment as reviewed (optional)
        await appRef.update({ hasReview: true });

        return NextResponse.json({ success: true, reviewId: reviewRef.id });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
