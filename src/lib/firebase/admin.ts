import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// Firebase Admin SDK için service account gerekli
// Vercel'e deploy ederken env variable olarak ekleyin

let adminApp: any;

if (!getApps().length) {
  try {
    // Service account JSON'ı env'den oku
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } else {
      // Development ortamı için dummy
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    adminApp = getApps()[0] || initializeApp({});
  }
} else {
  adminApp = getApp();
}

const adminAuth = getAuth(adminApp);
const adminDb = getDatabase(adminApp);

export { adminApp, adminAuth, adminDb };
