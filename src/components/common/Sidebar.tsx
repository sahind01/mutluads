'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChartBarIcon, CodeBracketIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/publisher', icon: HomeIcon, label: 'Dashboard' },
    { href: '/publisher/sites', icon: GlobeAltIcon, label: 'Sitelerim' },
    { href: '/publisher/ads', icon: CodeBracketIcon, label: 'Reklam Kodları' },
    { href: '/publisher/stats', icon: ChartBarIcon, label: 'İstatistikler' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-900 border-r border-dark-700 overflow-y-auto hidden md:block">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === link.href
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
