import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';

export async function GET() {
    try {
        // Fetch only reviews with rating 4 or 5 and that are not 'private'
        const snapshot = await adminDb.collection(`shops/${globalConfig.shopId}/reviews`)
            // .where('status', '==', 'approved') // Optionally moderate
            .where('rating', '>=', 4)
            .orderBy('rating', 'desc')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            clientName: doc.data().clientName,
            barberName: doc.data().barberName,
            comment: doc.data().comment,
            rating: doc.data().rating,
            createdAt: doc.data().createdAt
        }));

        return NextResponse.json({ reviews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
