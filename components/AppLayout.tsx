'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getStoredUser, apiRequest } from '../lib/api';
import { Sparkles } from 'lucide-react';

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
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
              OmniSocial AI Engine
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Initializing sovereign workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-950">
      {/* Top Navigation */}
      <Navbar currentBrandId={activeBrandId} onBrandChange={onBrandChange} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          unreadInboxCount={unreadCount}
          commentsCount={commentsCount}
          dmsCount={dmsCount}
          userRole={user?.role}
        />

        {/* Main Content View with Architectural Light Atmosphere */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Subtle Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none select-none"
            style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
