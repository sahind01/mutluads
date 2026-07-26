import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// Not: Firebase Admin SDK için service account JSON dosyası gerekli
// Vercel'e deploy ederken env variable olarak ekleyin

const adminApp = !getApps().length 
  ? initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  : getApp();

const adminAuth = getAuth(adminApp);
const adminDb = getDatabase(adminApp);

export { adminApp, adminAuth, adminDb };
