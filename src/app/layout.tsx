import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/common/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reklam Ağı - Ad Network',
  description: 'Modern Reklam Yönetim Sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'toast-custom',
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
