'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Inbox,
  PenTool,
  Calendar,
  Layers,
  Share2,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  ExternalLink,
  Bot
} from 'lucide-react';

interface SidebarProps {
  unreadInboxCount?: number;
  commentsCount?: number;
  dmsCount?: number;
  userRole?: string;
}

export default function Sidebar({ unreadInboxCount = 0, commentsCount, dmsCount, userRole }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams?.get('type') || 'COMMENT';

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Post Comments',
      href: '/inbox?type=COMMENT',
      icon: MessageSquare,
      badge: commentsCount && commentsCount > 0 ? commentsCount : null,
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    },
    {
      name: 'Direct Messages (DMs)',
      href: '/inbox?type=DIRECT_MESSAGE',
      icon: Inbox,
      badge: dmsCount && dmsCount > 0 ? dmsCount : null,
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    {
      name: 'AI Content Studio',
      href: '/content-studio',
      icon: PenTool,
      badge: 'AI',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    },
    {
      name: 'Content Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: null
    },
    {
      name: 'Businesses & Brands',
      href: '/brands',
      icon: Layers,
      badge: null
    },
    {
      name: 'Social Accounts',
      href: '/accounts',
      icon: Share2,
      badge: '1-Click',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      name: 'Analytics & Reports',
      href: '/analytics',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Team & RBAC',
      href: '/team',
      icon: Users,
      badge: null
    },
    {
      name: 'Settings & BYOK',
      href: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between min-h-[calc(100vh-3.75rem)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const isInboxLink = item.href.startsWith('/inbox');
          const isActive = isInboxLink
            ? pathname === '/inbox' && item.href.includes(`type=${currentType}`)
            : pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Super Admin Section (if eligible) */}
        {userRole === 'SUPER_ADMIN' && (
          <div className="pt-4 mt-3 border-t border-slate-100">
            <div className="px-3 py-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Platform Administration
            </div>
            <Link
              href="/superadmin"
              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/superadmin'
                  ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                  : 'text-amber-800 hover:bg-amber-50/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                <span>Super Admin Portal</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-200/80 text-amber-900">
                ROOT
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Operational Card */}
      <div className="p-3 m-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>Brand Voice Guardrails</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          AI suggestions require human approval prior to social transmission. Zero hallucination guarantee.
        </p>
        <Link
          href="/brands"
          className="inline-flex items-center text-[11px] font-medium text-indigo-600 hover:text-indigo-700 mt-2"
        >
          <span>Configure Voice Rules</span>
          <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </aside>
  );
}

