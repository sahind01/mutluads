'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import toast from 'react-hot-toast';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Çıkış yapıldı');
      router.push('/login');
    } catch (error) {
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900 border-b border-dark-700 h-16 flex items-center px-6">
      <h1 className="text-xl font-bold text-white">Reklam Ağı</h1>
      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition"
        >
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}
