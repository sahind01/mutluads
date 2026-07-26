'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CodeBracketIcon,
  GlobeAltIcon,
  UsersIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'admin' | 'publisher'>('publisher');

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserRole(data.role || 'publisher');
        }
      }
    };
    fetchUserRole();
  }, []);

  const isActive = (path: string) => pathname === path;

  const publisherLinks = [
    { href: '/publisher', icon: HomeIcon, label: 'Dashboard' },
    { href: '/publisher/sites', icon: GlobeAltIcon, label: 'Sitelerim' },
    { href: '/publisher/ads', icon: CodeBracketIcon, label: 'Reklam Kodları' },
    { href: '/publisher/stats', icon: ChartBarIcon, label: 'İstatistikler' },
  ];

  const adminLinks = [
    { href: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { href: '/admin/users', icon: UsersIcon, label: 'Kullanıcılar' },
    { href: '/admin/ads', icon: CodeBracketIcon, label: 'Reklamlar' },
    { href: '/admin/stats', icon: ChartBarIcon, label: 'İstatistikler' },
  ];

  const links = userRole === 'admin' ? adminLinks : publisherLinks;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-900 border-r border-dark-700 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive(link.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
