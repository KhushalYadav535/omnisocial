'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { apiRequest } from '../lib/api';
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
  ShieldCheck,
  X,
  Lightbulb,
  PenTool,
  FileEdit,
  LayoutGrid,
  Rocket,
  Cpu
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

interface NavItem {
  name: string;
  href: string;
  icon: any;
  isActive: () => boolean;
  themeColor?: string;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
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

  // Handle immediate internal tab change sync
  const [overrideTab, setOverrideTab] = React.useState<string | null>(null);
  const currentTab = overrideTab ?? searchParams?.get('tab');

  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setOverrideTab(e.detail);
      } else {
        const sp = new URLSearchParams(window.location.search);
        setOverrideTab(sp.get('tab'));
      }
    };
    window.addEventListener('popstate', handler);
    window.addEventListener('omnisocial_tab_changed', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('omnisocial_tab_changed', handler);
    };
  }, []);

  React.useEffect(() => {
    setOverrideTab(null);
  }, [pathname, searchParams]);

  const [draftCount, setDraftCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const fetchDraftCount = () => {
      apiRequest('/content?status=DRAFT')
        .then(res => {
          if (!mounted) return;
          const count = res.items?.length ?? res.contents?.length ?? 0;
          setDraftCount(count);
        })
        .catch(() => {});
    };
    fetchDraftCount();
    const interval = setInterval(fetchDraftCount, 30000);

    const handleCustomDraftCount = (e: any) => {
      if (typeof e.detail === 'number') {
        setDraftCount(e.detail);
      } else {
        fetchDraftCount();
      }
    };
    window.addEventListener('omnisocial_draft_count_changed', handleCustomDraftCount);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener('omnisocial_draft_count_changed', handleCustomDraftCount);
    };
  }, [pathname, searchParams]);

  const totalUnreadEngage = (unreadCommentsCount || 0) + (unreadDmsCount || 0) || unreadInboxCount || 0;

  // Complete navigation structure bringing all Studio destinations into the sidebar
  const navSections: NavSection[] = [
    {
      title: 'PLATFORM',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: Home,
          isActive: () => pathname === '/dashboard'
        },
        {
          name: 'Content Calendar',
          href: '/calendar',
          icon: Calendar,
          isActive: () => pathname === '/calendar'
        },
        {
          name: 'Inbox & Engage',
          href: '/inbox',
          icon: MessageSquare,
          badge: totalUnreadEngage > 0 ? (totalUnreadEngage > 99 ? '99+' : totalUnreadEngage) : undefined,
          isActive: () => pathname === '/inbox'
        },
        {
          name: 'Performance',
          href: '/analytics',
          icon: BarChart2,
          isActive: () => pathname === '/analytics'
        }
      ]
    },
    {
      title: 'CONTENT STUDIO',
      items: [
        {
          name: 'Studio Hub',
          href: '/content-studio',
          icon: LayoutGrid,
          isActive: () =>
            pathname === '/content-studio' &&
            (!currentTab || currentTab === 'overview')
        },
        {
          name: 'Marketing Strategy',
          href: '/content-studio?tab=strategy',
          icon: Target,
          isActive: () => pathname === '/content-studio' && currentTab === 'strategy'
        },
        {
          name: 'Content Pillars',
          href: '/content-studio?tab=pillars',
          icon: Layers,
          isActive: () => pathname === '/content-studio' && currentTab === 'pillars'
        },
        {
          name: 'Campaigns',
          href: '/content-studio?tab=campaigns',
          icon: Megaphone,
          isActive: () => pathname === '/content-studio' && currentTab === 'campaigns'
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
          name: 'Drafts',
          href: '/content-studio?tab=drafts',
          icon: FileEdit,
          badge: draftCount > 0 ? draftCount : undefined,
          isActive: () => pathname === '/content-studio' && currentTab === 'drafts'
        },
        {
          name: 'Media Library',
          href: '/content-studio?tab=media',
          icon: ImageIcon,
          isActive: () => pathname === '/content-studio' && currentTab === 'media'
        },
        {
          name: 'Approvals Queue',
          href: '/content-studio?tab=approvals',
          icon: CheckCircle2,
          isActive: () => pathname === '/content-studio' && currentTab === 'approvals'
        },
        {
          name: 'Brand Launchpad',
          href: '/content-studio?tab=launchpad',
          icon: Rocket,
          isActive: () => pathname === '/content-studio' && currentTab === 'launchpad'
        },
        {
          name: 'Skill Library',
          href: '/content-studio?tab=skills',
          icon: Cpu,
          isActive: () => pathname === '/content-studio' && currentTab === 'skills'
        }
      ]
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
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

          {/* Primary Navigation Links Organized by Sections */}
          <nav className="p-3 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 select-none">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const active = item.isActive();
                  const Icon = item.icon;
                  const isAmber = (item as any).themeColor === 'amber';

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                        active
                          ? isAmber
                            ? 'bg-[#FFEDD5] text-[#C2410C] font-bold shadow-2xs border border-orange-200/60'
                            : 'bg-[#EDE9FE] text-[#7C3AED] font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
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
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
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
