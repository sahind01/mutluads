'use client';

import { useEffect, useState } from 'react';
import { auth, database } from '@/lib/firebase/client';
import { ref, onValue } from 'firebase/database';

export default function PublisherDashboard() {
  const [stats, setStats] = useState({ impressions: 0, clicks: 0, earnings: 0 });

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
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Yayıncı Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <p className="text-sm text-dark-400">Gösterim</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.impressions.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <p className="text-sm text-dark-400">Tıklama</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.clicks.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <p className="text-sm text-dark-400">Tahmini Kazanç</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">${stats.earnings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
