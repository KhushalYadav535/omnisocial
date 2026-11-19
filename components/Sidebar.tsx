'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Home,
  Sparkles,
  Target,
  Calendar,
  Megaphone,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  BarChart2,
  Settings,
  MessageSquare,
  Share2,
  ShieldCheck,
  X,
  Lightbulb,
  PenTool
} from 'lucide-react';

export interface SidebarProps {
  unreadInboxCount?: number;
  unreadCommentsCount?: number;
  unreadDmsCount?: number;
  commentsCount?: number;
  dmsCount?: number;
  userRole?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

function SidebarContent({
  unreadInboxCount = 0,
  unreadCommentsCount = 0,
  unreadDmsCount = 0,
  commentsCount = 0,
  dmsCount = 0,
  userRole,
  mobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');

  const totalUnreadEngage = (unreadCommentsCount || 0) + (unreadDmsCount || 0) || unreadInboxCount || 0;

  // Core StudioFlow navigation items exactly matching the reference design
  const primaryNavItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: Home,
      isActive: () => pathname === '/dashboard'
    },
    {
      name: 'Studio',
      href: '/content-studio',
      icon: Sparkles,
      isActive: () =>
        pathname === '/content-studio' &&
        (!currentTab || currentTab === 'overview' || currentTab === 'pillars')
    },
    {
      name: 'Marketing Strategy',
      href: '/content-studio?tab=strategy',
      icon: Target,
      isActive: () => pathname === '/content-studio' && currentTab === 'strategy'
    },
    {
      name: 'Ideas & Inspiration',
      href: '/content-studio?tab=ideas',
      icon: Lightbulb,
      isActive: () => pathname === '/content-studio' && currentTab === 'ideas'
    },
    {
      name: 'Posts & Content',
      href: '/content-studio?tab=composer',
      icon: PenTool,
      themeColor: 'amber',
      isActive: () => pathname === '/content-studio' && currentTab === 'composer'
    },
    {
      name: 'Content Calendar',
      href: '/calendar',
      icon: Calendar,
      isActive: () => pathname === '/calendar'
    },
    {
      name: 'Campaigns',
      href: '/content-studio?tab=campaigns',
      icon: Megaphone,
      isActive: () => pathname === '/content-studio' && currentTab === 'campaigns'
    },
    {
      name: 'Media Library',
      href: '/content-studio?tab=media',
      icon: ImageIcon,
      isActive: () => pathname === '/content-studio' && currentTab === 'media'
    },
    {
      name: 'Approvals',
      href: '/content-studio?tab=approvals',
      icon: CheckCircle2,
      isActive: () => pathname === '/content-studio' && currentTab === 'approvals'
    },
    {
      name: 'Performance',
      href: '/analytics',
      icon: BarChart2,
      isActive: () => pathname === '/analytics'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* StudioFlow Sidebar Container */}
      <aside
        className={`w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 select-none z-50 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl' : 'hidden md:flex'
        }`}
      >
        {/* Top Section: StudioFlow Brand Mark & Navigation */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Header Brand Bar */}
          <div className="flex items-center justify-between px-5 py-4.5 border-b border-slate-100">
            <Link
              href="/content-studio"
              onClick={onCloseMobile}
              className="flex items-center space-x-2.5 group"
            >
              {/* Vibrant Orange Play Mark matching Reference Design */}
              <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-white translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <span className="font-extrabold text-[20px] text-slate-900 tracking-tight font-sans">
                Studio
              </span>
            </Link>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            {primaryNavItems.map((item) => {
              const active = item.isActive();
              const Icon = item.icon;
              const isAmber = (item as any).themeColor === 'amber';

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
                    active
                      ? isAmber
                        ? 'bg-[#FFEDD5] text-[#C2410C] font-bold shadow-2xs border border-orange-200/60'
                        : 'bg-[#EDE9FE] text-[#7C3AED] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? isAmber
                          ? 'text-[#EA580C]'
                          : 'text-[#7C3AED]'
                        : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Link: Settings & Platform Admin if ROOT */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {userRole === 'SUPERADMIN' && (
            <Link
              href="/superadmin"
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname === '/superadmin'
                  ? 'bg-amber-100 text-amber-900 font-bold shadow-2xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Platform Admin</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-200/80 text-amber-900">
                ROOT
              </span>
            </Link>
          )}

          <Link
            href="/settings"
            onClick={onCloseMobile}
            className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
              pathname === '/settings'
                ? 'bg-[#EDE9FE] text-[#7C3AED] font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${
                pathname === '/settings' ? 'text-[#7C3AED]' : 'text-slate-500'
              }`}
            />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-screen hidden md:block" />
      }
    >
      <SidebarContent {...props} />
    </Suspense>
  );
}
