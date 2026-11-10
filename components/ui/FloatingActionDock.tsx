'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  PenTool, 
  Sparkles, 
  Layers, 
  Calendar,
  Command,
  HelpCircle,
  X
} from 'lucide-react';

export default function FloatingActionDock() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    {
      id: 'create',
      label: 'Draft AI Post',
      href: '/content-studio',
      icon: Plus,
      badge: 'Cmd+N'
    },
    {
      id: 'search',
      label: 'Omni Search',
      onClick: () => setShowSearchModal(true),
      icon: Search,
      badge: 'Cmd+K'
    },
    {
      id: 'inbox',
      label: 'Unified Inbox',
      href: '/inbox',
      icon: MessageSquare,
      badge: '3'
    },
    {
      id: 'calendar',
      label: 'Content Planner',
      href: '/calendar',
      icon: Calendar
    },
    {
      id: 'copilot',
      label: 'AI Social Copilot',
      href: '/content-studio',
      icon: Sparkles
    }
  ];

  return (
    <>
      {/* Floating Vertical Capsule Dock (Cadra Left Dock) */}
      <aside 
        aria-label="Quick Actions Dock"
        className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center bg-[#111215] text-white p-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-neutral-800/80 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center space-y-2.5">
          {quickActions.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : false;

            const buttonContent = (
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group cursor-pointer ${
                  isActive 
                    ? 'bg-white text-neutral-950 font-bold shadow-md' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/90'
                }`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />

                {/* Left Tooltip */}
                {hoveredItem === item.id && (
                  <div className="absolute left-14 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl whitespace-nowrap shadow-xl border border-neutral-700/80 pointer-events-none z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );

            if (item.href) {
              return (
                <Link key={item.id} href={item.href}>
                  {buttonContent}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                type="button"
                className="focus:outline-none"
              >
                {buttonContent}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm flex items-start justify-center pt-20 pb-10 px-4 overflow-y-auto"
          onClick={() => setShowSearchModal(false)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200/90 p-5 overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 pb-3 border-b border-neutral-100 shrink-0">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search posts, comments, scheduled drops, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
              <button 
                onClick={() => setShowSearchModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-2 text-xs overflow-y-auto pr-1">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2">
                Quick Navigation
              </p>
              <Link 
                href="/dashboard" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">Executive Dashboard</span>
                <span className="text-[11px] text-neutral-400 font-mono">Overview</span>
              </Link>
              <Link 
                href="/inbox" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">Unified Social Inbox</span>
                <span className="text-[11px] text-neutral-400 font-mono">Comments & DMs</span>
              </Link>
              <Link 
                href="/content-studio" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">AI Content Studio</span>
                <span className="text-[11px] text-neutral-400 font-mono">Creative Suite</span>
              </Link>
              <Link 
                href="/calendar" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">Content Calendar</span>
                <span className="text-[11px] text-neutral-400 font-mono">Scheduled Posts</span>
              </Link>
              <Link 
                href="/analytics" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">Analytics Telemetry</span>
                <span className="text-[11px] text-neutral-400 font-mono">Engagement & Sentiment</span>
              </Link>
              <Link 
                href="/settings" 
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
              >
                <span className="font-semibold text-neutral-800">Settings & Keys</span>
                <span className="text-[11px] text-neutral-400 font-mono">Meta & AI Setup</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

