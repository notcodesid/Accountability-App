import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
// Initialize Firebase Admin SDK
// In production, you should use service account credentials
// For local development, the SDK can use Application Default Credentials
if (!admin.apps.length) {
    admin.initializeApp({
        // If running in production, you should provide service account details
        // credential: admin.credential.cert({
        //   projectId: process.env.FIREBASE_PROJECT_ID,
        //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        // }),
        // For development, this will use Application Default Credentials
        // https://firebase.google.com/docs/admin/setup#initialize-sdk
        credential: admin.credential.applicationDefault(),
    });
}
export const auth = getAuth();
export default admin;
