'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-16 p-6 md:p-8">{children}</main>
    </div>
  );
}
