'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import FloatingActionDock from './ui/FloatingActionDock';
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
  const [commentsCount, setCommentsCount] = useState(4);
  const [dmsCount, setDmsCount] = useState(2);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(stored);

    // Fetch unread count for navbar & dock
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
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#111215] flex items-center justify-center text-white shadow-xl animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-widest">
              OmniSocial Cadra Engine
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">Initializing sovereign light canvas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#0F1012] selection:bg-neutral-900 selection:text-white w-full">
      {/* Cadra Top Navigation */}
      <Navbar 
        currentBrandId={activeBrandId} 
        onBrandChange={onBrandChange}
        unreadCount={unreadCount}
        commentsCount={commentsCount}
        dmsCount={dmsCount}
      />

      {/* Floating Vertical Left Capsule Action Dock */}
      <FloatingActionDock />

      {/* Main Full-Width Architectural Canvas - Natural Smooth Scrollable View */}
      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 relative xl:pl-20 w-full max-w-full">
        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
