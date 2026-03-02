import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    // Handle newlines in private keys
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    try {
        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        } else {
            admin.initializeApp(); // Fallback to default credentials in production
        }
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
