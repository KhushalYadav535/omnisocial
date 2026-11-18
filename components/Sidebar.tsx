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
              {/* Sleek Gradient Ribbon S-Mark */}
              <svg
                className="w-7 h-7 shrink-0 group-hover:scale-105 transition-transform"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 8.5C10 6.01 12.01 4 14.5 4H19C22.31 4 25 6.69 25 10C25 12.87 22.98 15.26 20.25 15.82L13 17.5C10.79 17.95 9 19.86 9 22.12C9 24.82 11.18 27 13.88 27H19C21.76 27 24 24.76 24 22"
                  stroke="url(#sf-sidebar-grad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="sf-sidebar-grad" x1="8" y1="4" x2="25" y2="27" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="0.5" stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-extrabold text-[19px] text-[#0F172A] tracking-tight font-sans">
                StudioFlow
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
