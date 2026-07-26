'use client';

import { useState, useEffect } from 'react';
import { auth, database } from '@/lib/firebase/client';
import { ref, push, onValue, remove, update } from 'firebase/database';
import toast from 'react-hot-toast';

interface Site {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: number;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const sitesRef = ref(database, `sites/${user.uid}`);
    const unsubscribe = onValue(sitesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sitesArray = Object.entries(data).map(([id, site]: [string, any]) => ({
          id,
          ...site,
        }));
        setSites(sitesArray);
      } else {
        setSites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    // URL kontrolü
    try {
      new URL(formData.url);
    } catch {
      toast.error('Geçerli bir URL girin (https://... dahil)');
      return;
    }

    setSubmitting(true);
    try {
      const sitesRef = ref(database, `sites/${user.uid}`);
      await push(sitesRef, {
        name: formData.name.trim(),
        url: formData.url.trim(),
        isActive: true,
        createdAt: Date.now(),
        userId: user.uid,
      });
      
      toast.success('Site başarıyla eklendi!');
      setFormData({ name: '', url: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Site eklenirken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!confirm('Bu siteyi silmek istediğinize emin misiniz?')) return;
    
    const user = auth.currentUser;
    if (!user) return;

    try {
      await remove(ref(database, `sites/${user.uid}/${siteId}`));
      toast.success('Site silindi');
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleToggle = async (siteId: string, currentStatus: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await update(ref(database, `sites/${user.uid}/${siteId}`), {
        isActive: !currentStatus,
      });
      toast.success('Site durumu güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  if (loading) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Sitelerim</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {showForm ? 'İptal' : '+ Yeni Site Ekle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: Blog Sitesi"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ornek.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Ekleniyor...' : 'Site Ekle'}
            </button>
          </form>
        </div>
      )}

      {sites.length === 0 ? (
        <div className="bg-dark-800 rounded-xl p-12 text-center border border-dark-700">
          <p className="text-dark-400">Henüz site eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site) => (
            <div key={site.id} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-white font-semibold text-lg">{site.name}</h3>
              <p className="text-dark-400 text-sm mt-1">{site.url}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  site.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                }`}>
                  {site.isActive ? 'Aktif' : 'Pasif'}
                </span>
                <button
                  onClick={() => handleToggle(site.id, site.isActive)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {site.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="text-sm text-red-400 hover:text-red-300 ml-auto"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
