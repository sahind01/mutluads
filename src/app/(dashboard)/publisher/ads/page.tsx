'use client';

import { useState, useEffect } from 'react';
import { auth, database } from '@/lib/firebase/client';
import { ref, onValue } from 'firebase/database';
import { AdCode } from '@/components/publisher/AdCode';

interface Ad {
  id: string;
  name: string;
  type: string;
  code: string;
  isActive: boolean;
  assignedUsers: string[];
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const adsRef = ref(database, 'ads');
    const unsubscribe = onValue(adsRef, (snapshot) => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Reklam Kodları</h1>
      
      {ads.length === 0 ? (
        <div className="bg-dark-800 rounded-xl p-12 text-center border border-dark-700">
          <p className="text-dark-400">Size atanmış aktif reklam kodu bulunmuyor.</p>
          <p className="text-dark-500 text-sm mt-2">Admin tarafından size reklam atanmasını bekleyin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <AdCode key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
