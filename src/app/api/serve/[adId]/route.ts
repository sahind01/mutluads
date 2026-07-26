import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { adId: string } }
) {
  try {
    const { adId } = params;

    // Reklam bilgilerini al
    const adRef = adminDb.ref(`ads/${adId}`);
    const snapshot = await adRef.get();

    if (!snapshot.exists()) {
      return new NextResponse('Ad not found', { status: 404 });
    }

    const adData = snapshot.val();

    // Site ID'sini referer'dan al
    const referer = request.headers.get('referer') || '';
    let siteId = '';
    try {
      const url = new URL(referer);
      siteId = url.hostname;
    } catch {
      return new NextResponse('Invalid referer', { status: 400 });
    }

    if (!siteId) {
      return new NextResponse('No referer', { status: 400 });
    }

    // Site kontrolü
    const siteRef = adminDb.ref(`sites`);
    const sitesSnapshot = await siteRef.get();
    let foundSite = false;
    let userId = '';

    if (sitesSnapshot.exists()) {
      const sites = sitesSnapshot.val();
      for (const [uid, userSites] of Object.entries(sites)) {
        if (userSites && typeof userSites === 'object') {
          for (const [siteUid, siteData] of Object.entries(userSites as Record<string, any>)) {
            if (siteData && siteData.url) {
              try {
                const siteUrl = new URL(siteData.url);
                if (siteUrl.hostname === siteId) {
                  foundSite = true;
                  userId = uid;
                  break;
                }
              } catch {
                continue;
              }
            }
          }
        }
        if (foundSite) break;
      }
    }

    if (!foundSite) {
      return new NextResponse('Site not found', { status: 404 });
    }

    // Impression kaydet
    const statRef = adminDb.ref(`stats/${userId}`);
    const date = new Date().toISOString().split('T')[0];
    const impressionRef = statRef.push();
    await impressionRef.set({
      userId,
      siteId: siteId,
      adId: adId,
      type: 'impression',
      count: 1,
      date: date,
      createdAt: Date.now(),
    });

    // Gerçek reklam kodunu döndür
    const script = `
      <script>
        (function() {
          // Adsterra veya diğer ağ kodları
          try {
            ${adData.code || ''}
          } catch(e) {
            console.error('Ad script error:', e);
          }
          
          // Tıklama takibi
          document.addEventListener('click', function(e) {
            var target = e.target;
            while (target && target !== document.body) {
              if (target.tagName === 'A' && target.href) {
                fetch('${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/track-click', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    adId: '${adId}',
                    siteId: '${siteId}'
                  })
                }).catch(function() {});
                break;
              }
              target = target.parentElement;
            }
          });
        })();
      </script>
    `;

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error serving ad:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
