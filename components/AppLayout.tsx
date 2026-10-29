'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getStoredUser, apiRequest } from '../lib/api';

interface AppLayoutProps {
  children: React.ReactNode;
  activeBrandId?: string;
  onBrandChange?: (brandId: string) => void;
}

export default function AppLayout({ children, activeBrandId, onBrandChange }: AppLayoutProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [dmsCount, setDmsCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(stored);

    // Fetch unread count for sidebar
    apiRequest('/inbox')
      .then((res) => {
        if (res.unreadCount !== undefined) setUnreadCount(res.unreadCount);
        if (res.commentsCount !== undefined) setCommentsCount(res.commentsCount);
        if (res.dmsCount !== undefined) setDmsCount(res.dmsCount);
      })
      .catch(() => {});
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading OmniSocial AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentBrandId={activeBrandId} onBrandChange={onBrandChange} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          unreadInboxCount={unreadCount}
          commentsCount={commentsCount}
          dmsCount={dmsCount}
          userRole={user?.role}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

