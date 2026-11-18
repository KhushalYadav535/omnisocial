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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
  const [unreadDmsCount, setUnreadDmsCount] = useState(0);
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

    // Fetch unread count for navbar & sidebar
    apiRequest('/inbox')
      .then((res) => {
        if (res.unreadCount !== undefined) setUnreadCount(res.unreadCount);
        if (res.unreadCommentsCount !== undefined) setUnreadCommentsCount(res.unreadCommentsCount);
        if (res.unreadDmsCount !== undefined) setUnreadDmsCount(res.unreadDmsCount);
        if (res.commentsCount !== undefined) setCommentsCount(res.commentsCount);
        if (res.dmsCount !== undefined) setDmsCount(res.dmsCount);
      })
      .catch(() => {});
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white shadow-xl animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
              StudioFlow
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Initializing sovereign light canvas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EDE9FE] selection:text-[#7C3AED] w-full">
      {/* StudioFlow Left Sidebar Navigation */}
      <Sidebar
        unreadInboxCount={unreadCount}
        commentsCount={commentsCount}
        dmsCount={dmsCount}
        userRole={user?.role}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Architectural Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* StudioFlow Top Navigation Bar */}
        <Navbar 
          currentBrandId={activeBrandId} 
          onBrandChange={onBrandChange}
          unreadCount={unreadCount}
          unreadCommentsCount={unreadCommentsCount}
          unreadDmsCount={unreadDmsCount}
          commentsCount={commentsCount}
          dmsCount={dmsCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 relative w-full max-w-full overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
