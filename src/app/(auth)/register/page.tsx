'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@/lib/firebase/client';
import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Kullanıcı profilini güncelle
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Firebase Realtime Database'e kullanıcı kaydet
      await set(ref(database, `users/${userCredential.user.uid}`), {
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        role: 'publisher',
        isApproved: false,
        isBanned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      toast.success('Kayıt başarılı! Admin onayı bekleniyor.');
      router.push('/login');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error('Kayıt başarısız: ' + error.message);
      } else {
        toast.error('Bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-950 p-4">
      <div className="w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl p-8 border border-dark-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Kayıt Ol</h1>
          <p className="text-dark-400 mt-2">Yayıncı hesabı oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Ad Soyad
            </label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              E-posta
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Şifre
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="•••••••• (min 6 karakter)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Şifre Tekrar
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-dark-400 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
