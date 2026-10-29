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
  Bot,
  Sparkles
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
      name: 'Executive Dashboard',
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
      name: 'Direct Messages',
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
      name: 'Brands & Voice Engine',
      href: '/brands',
      icon: Layers,
      badge: null
    },
    {
      name: 'Connected Channels',
      href: '/accounts',
      icon: Share2,
      badge: '1-Click',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
    {
      name: 'Analytics & Telemetry',
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
    <aside className="w-64 shrink-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/90 flex flex-col justify-between min-h-[calc(100vh-4rem)] select-none">
      {/* Navigation Links */}
      <div className="p-3.5 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
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
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Super Admin Section (if eligible) */}
        {userRole === 'SUPER_ADMIN' && (
          <div className="pt-4 mt-3 border-t border-slate-100">
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">
              Platform Administration
            </div>
            <Link
              href="/superadmin"
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                pathname === '/superadmin'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-800 hover:bg-amber-50/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className={`w-4 h-4 ${pathname === '/superadmin' ? 'text-white' : 'text-amber-600'}`} />
                <span>Super Admin Portal</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm ${pathname === '/superadmin' ? 'bg-white/20 text-white' : 'bg-amber-200/80 text-amber-900'}`}>
                ROOT
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Operational Card */}
      <div className="p-3.5 m-3.5 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-2xl border border-indigo-100 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>Brand Voice Guardrails</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
          AI suggestions require human approval prior to social transmission. Zero hallucinations.
        </p>
        <Link
          href="/brands"
          className="inline-flex items-center text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-2.5 group"
        >
          <span>Configure Voice Rules</span>
          <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
