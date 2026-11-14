'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  getStoredUser, 
  getStoredTenant, 
  clearAuthToken, 
  apiRequest,
  getStoredActiveBrandId,
  setStoredActiveBrandId
} from '../lib/api';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  User as UserIcon,
  Activity,
  Check,
  Circle,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentBrandId?: string;
  onBrandChange?: (brandId: string) => void;
  unreadCount?: number;
  commentsCount?: number;
  dmsCount?: number;
}

export default function Navbar({ 
  currentBrandId, 
  onBrandChange,
  unreadCount = 0,
  commentsCount = 4,
  dmsCount = 2
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedTenant = getStoredTenant();
    setUser(storedUser);
    setTenant(storedTenant);

    if (storedUser) {
      apiRequest('/brands')
        .then(res => {
          if (res.brands && res.brands.length > 0) {
            setBrands(res.brands);
            const savedBrandId = getStoredActiveBrandId();
            if (!currentBrandId && onBrandChange) {
              if (savedBrandId && res.brands.some((b: any) => b.id === savedBrandId)) {
                onBrandChange(savedBrandId);
              }
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    router.push('/login');
  };

  const selectedBrand = brands.find(b => b.id === currentBrandId) || brands[0];

  const navTabs = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Comments', href: '/inbox?type=COMMENT', count: commentsCount },
    { name: 'DMs', href: '/inbox?type=DIRECT_MESSAGE', count: dmsCount },
    { name: 'Studio', href: '/content-studio' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Funnels', href: '/automations' },
    { name: 'Channels', href: '/accounts' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Settings', href: '/settings' },
  ];

  const isTabActive = (href: string) => {
    if (href.startsWith('/inbox')) {
      return pathname === '/inbox';
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F4F5F7]/95 backdrop-blur-xl border-b border-black/[0.05] py-2 px-3 sm:px-6">
      <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Cadra Brand Mark & Context */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-2.5 group">
            {/* Minimalist Geometric Emblem */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m10 15 5-3-5-3v6Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-[#0F1012] tracking-tight text-xs sm:text-sm leading-none">
                  OmniSocial
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-neutral-400 leading-none mt-1 hidden xs:inline">
                Larkspur Engine
              </span>
            </div>
          </Link>

          {/* Active Brand Switcher Capsule */}
          {brands.length > 0 && (
            <div className="relative hidden md:block pl-1 sm:pl-2">
              <button
                onClick={() => setShowBrandMenu(!showBrandMenu)}
                className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-black/[0.06] px-2.5 py-1.5 rounded-full transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="max-w-[70px] lg:max-w-[100px] truncate">{selectedBrand?.name || 'All Brands'}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
              </button>

              {showBrandMenu && (
                <div className="absolute left-1 sm:left-2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/[0.08] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    Switch Workspace Brand
                  </div>
                  <button
                    onClick={() => {
                      setStoredActiveBrandId('');
                      if (onBrandChange) onBrandChange('');
                      setShowBrandMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer ${
                      !currentBrandId ? 'font-bold text-neutral-900 bg-neutral-100/70' : 'text-neutral-700 font-medium'
                    }`}
                  >
                    <span className="truncate">✦ All Brands (Overview)</span>
                    {!currentBrandId && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                  </button>
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setStoredActiveBrandId(b.id);
                        if (onBrandChange) onBrandChange(b.id);
                        setShowBrandMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer ${
                        selectedBrand?.id === b.id ? 'font-bold text-neutral-900 bg-neutral-100/70' : 'text-neutral-700 font-medium'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {selectedBrand?.id === b.id && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </button>
                  ))}
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <Link
                      href="/brands"
                      onClick={() => setShowBrandMenu(false)}
                      className="block px-3.5 py-1.5 text-xs text-neutral-900 hover:underline font-semibold"
                    >
                      + Manage Brands & Voice
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: The Cadra Segmented Pill Bar (Responsive & Compact) */}
        <nav className="hidden lg:flex items-center bg-[#E6E8EC] p-1 rounded-full border border-black/[0.04] shadow-xs">
          {navTabs.map((tab) => {
            const active = isTabActive(tab.href);
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-[11px] xl:text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                  active
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/40'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[9px] xl:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      active
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Live Clock, Status Bar Pill & Profile (Fits 100% On-Screen) */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Live Clock Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold text-neutral-800 font-mono tracking-tight">
              {currentTime || '3:27 PM'}
            </span>
          </div>

          {/* Status Tracker Pill - Only shown on ultra-wide 2xl screens to prevent horizontal overflow */}
          <div className="hidden 2xl:flex items-center space-x-2.5 bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-xs">
            <div className="flex items-center space-x-1.5 font-medium text-neutral-700">
              <span className="font-bold text-neutral-950">5 active</span>
              <span className="text-neutral-300">•</span>
              <span className="text-emerald-600 font-semibold">4 sync</span>
              <span className="text-neutral-300">•</span>
              <span className="text-orange-600 font-semibold">1 queue</span>
            </div>
            <div className="w-10 h-1.5 rounded-full bg-neutral-200 overflow-hidden flex">
              <div className="bg-emerald-500 w-3/4 h-full" />
              <div className="bg-orange-500 w-1/4 h-full" />
            </div>
          </div>

          {/* User Profile Capsule - Always pinned & visible on the far right */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 p-1 pl-2 bg-white hover:bg-neutral-50 rounded-full border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
            >
              <span className="text-xs font-semibold text-neutral-800 hidden sm:inline max-w-[85px] lg:max-w-[110px] truncate">
                {user?.name || 'Admin'}
              </span>
              <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OS'}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/[0.08] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                    {user?.role || 'AGENCY_ADMIN'}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Organization Settings
                  </Link>
                  <Link
                    href="/team"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Team & Collaborators
                  </Link>
                  {user?.role === 'SUPERADMIN' && (
                    <Link
                      href="/superadmin"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-xs text-amber-900 font-bold hover:bg-amber-50 transition-colors"
                    >
                      ★ Platform Governance
                    </Link>
                  )}
                </div>

                <div className="border-t border-neutral-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
