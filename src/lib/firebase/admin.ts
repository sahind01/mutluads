import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

let adminApp: any;

if (!getApps().length) {
  try {
    // Vercel'de environment variable olarak FIREBASE_SERVICE_ACCOUNT ekleyin
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } else {
      // Development ortamı için - sadece build geçsin diye
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://dummy.firebaseio.com',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback - build'in geçmesi için
    adminApp = initializeApp({
      projectId: 'dummy-project',
      databaseURL: 'https://dummy.firebaseio.com',
    });
  }
} else {
  adminApp = getApp();
}

const adminAuth = getAuth(adminApp);
const adminDb = getDatabase(adminApp);

export { adminApp, adminAuth, adminDb };
