import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, siteId } = body;

    if (!adId || !siteId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // User ID'yi siteId'den bul
    const siteRef = adminDb.ref(`sites`);
    const snapshot = await siteRef.get();
    let userId = '';

    if (snapshot.exists()) {
      const sites = snapshot.val();
      for (const [uid, userSites] of Object.entries(sites)) {
        if (typeof userSites === 'object') {
          for (const [siteUid, site] of Object.entries(userSites as any)) {
            if (site.id === siteId) {
              userId = uid;
              break;
            }
          }
        }
        if (userId) break;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Click kaydet
    const statRef = adminDb.ref(`stats/${userId}`);
    const date = new Date().toISOString().split('T')[0];
    const clickRef = statRef.push();
    await clickRef.set({
      userId,
      siteId,
      adId,
      type: 'click',
      count: 1,
      date,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
