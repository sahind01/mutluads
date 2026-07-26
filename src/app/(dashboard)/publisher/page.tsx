'use client';

import { useEffect, useState } from 'react';
import { auth, database } from '@/lib/firebase/client';
import { ref, get, onValue } from 'firebase/database';
import { StatsOverview } from '@/components/publisher/StatsOverview';
import { AdCode } from '@/components/publisher/AdCode';
import toast from 'react-hot-toast';

interface Site {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

interface Ad {
  id: string;
  name: string;
  type: string;
  code: string;
  isActive: boolean;
}

export default function PublisherDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    impressions: 0,
    clicks: 0,
    earnings: 0,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Siteleri dinle
    const sitesRef = ref(database, `sites/${user.uid}`);
    const unsubscribeSites = onValue(sitesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sitesArray = Object.entries(data).map(([id, site]: [string, any]) => ({
          id,
          ...site,
        }));
        setSites(sitesArray.filter(s => s.isActive));
      } else {
        setSites([]);
      }
    });

    // Reklamları dinle
    const adsRef = ref(database, `ads`);
    const unsubscribeAds = onValue(adsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const adsArray = Object.entries(data).map(([id, ad]: [string, any]) => ({
          id,
          ...ad,
        }));
        // Kullanıcıya atanmış ve aktif reklamları filtrele
        const userAds = adsArray.filter(
          ad => ad.isActive && ad.assignedUsers?.includes(user.uid)
        );
        setAds(userAds);
      } else {
        setAds([]);
      }
    });

    // İstatistikleri dinle
    const statsRef = ref(database, `stats/${user.uid}`);
    const unsubscribeStats = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let totalImp = 0;
        let totalClicks = 0;
        let totalEarnings = 0;
        
        Object.values(data).forEach((stat: any) => {
          if (stat.type === 'impression') {
            totalImp += stat.count || 0;
            // CPM: $1.00 / 1000 gösterim
            totalEarnings += (stat.count || 0) * 0.001;
          } else if (stat.type === 'click') {
            totalClicks += stat.count || 0;
            // CPC: $0.10 / tıklama
            totalEarnings += (stat.count || 0) * 0.1;
          }
        });
        
        setStats({
          impressions: totalImp,
          clicks: totalClicks,
          earnings: totalEarnings,
        });
      }
    });

    setLoading(false);

    return () => {
      unsubscribeSites();
      unsubscribeAds();
      unsubscribeStats();
    };
  }, []);

  if (loading) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Yayıncı Dashboard</h1>
      </div>

      <StatsOverview
        impressions={stats.impressions}
        clicks={stats.clicks}
        earnings={stats.earnings}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Sitelerim</h2>
          {sites.length === 0 ? (
            <p className="text-dark-400">Henüz site eklenmemiş.</p>
          ) : (
            <ul className="space-y-2">
              {sites.map((site) => (
                <li key={site.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{site.name}</p>
                    <p className="text-sm text-dark-400">{site.url}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    site.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                  }`}>
                    {site.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h2 className="text-lg font-semibold text-white mb-4">Reklam Kodları</h2>
          {ads.length === 0 ? (
            <p className="text-dark-400">Size atanmış reklam kodu yok.</p>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <AdCode key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
