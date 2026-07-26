'use client';

import { useState, useEffect } from 'react';
import { auth, database } from '@/lib/firebase/client';
import { ref, onValue } from 'firebase/database';
import { StatsOverview } from '@/components/publisher/StatsOverview';

export default function StatsPage() {
  const [stats, setStats] = useState({ impressions: 0, clicks: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const statsRef = ref(database, `stats/${user.uid}`);
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let totalImp = 0;
        let totalClicks = 0;
        let totalEarnings = 0;
        
        Object.values(data).forEach((stat: any) => {
          if (stat.type === 'impression') {
            totalImp += stat.count || 0;
            totalEarnings += (stat.count || 0) * 0.001;
          } else if (stat.type === 'click') {
            totalClicks += stat.count || 0;
            totalEarnings += (stat.count || 0) * 0.1;
          }
        });
        
        setStats({
          impressions: totalImp,
          clicks: totalClicks,
          earnings: totalEarnings,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">İstatistikler</h1>
      <StatsOverview {...stats} />
      
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <h2 className="text-lg font-semibold text-white mb-4">Detaylı Bilgi</h2>
        <div className="space-y-2 text-dark-300">
          <p>• CPM: $1.00 / 1000 gösterim</p>
          <p>• CPC: $0.10 / tıklama</p>
          <p>• Toplam gösterim: {stats.impressions.toLocaleString('tr-TR')}</p>
          <p>• Toplam tıklama: {stats.clicks.toLocaleString('tr-TR')}</p>
        </div>
      </div>
    </div>
  );
}
