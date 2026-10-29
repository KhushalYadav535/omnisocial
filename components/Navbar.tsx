'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getStoredUser, 
  getStoredTenant, 
  clearAuthToken, 
  apiRequest 
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
  Check
} from 'lucide-react';

interface NavbarProps {
  currentBrandId?: string;
  onBrandChange?: (brandId: string) => void;
}

export default function Navbar({ currentBrandId, onBrandChange }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedTenant = getStoredTenant();
    setUser(storedUser);
    setTenant(storedTenant);

    if (storedUser) {
      // Fetch brands for switcher
      apiRequest('/brands')
        .then(res => {
          if (res.brands) setBrands(res.brands);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    router.push('/login');
  };

  const selectedBrand = brands.find(b => b.id === currentBrandId) || brands[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Brand Identity & Tenant */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">OmniSocial</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">AI</span>
            </div>
          </Link>

          {/* Tenant Indicator */}
          {tenant && (
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200/80">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tenant:</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/70">
                {tenant.name}
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/80">
                {tenant.plan || 'Agency Pro'}
              </span>
            </div>
          )}

          {/* Brand Switcher */}
          {brands.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBrandMenu(!showBrandMenu)}
                className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-900">{selectedBrand?.name || 'All Brands'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showBrandMenu && (
                <div className="absolute left-0 mt-2 w-60 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Brand
                  </div>
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (onBrandChange) onBrandChange(b.id);
                        setShowBrandMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedBrand?.id === b.id ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700 font-medium'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {selectedBrand?.id === b.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/brands"
                      onClick={() => setShowBrandMenu(false)}
                      className="block px-3.5 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                    >
                      + Manage Brands & Voice
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Operational Status, Notifications & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Operational Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meta Graph v22.0 Connected</span>
          </div>

          {/* Quick Notification Bell */}
          <Link
            href="/inbox"
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors"
            title="Unified Inbox Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OS'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-none font-mono">{user?.role || 'AGENCY_ADMIN'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {user?.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Workspace Settings & BYOK
                  </Link>
                  <Link
                    href="/team"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Team Members & Roles
                  </Link>
                  {user?.role === 'SUPER_ADMIN' && (
                    <Link
                      href="/superadmin"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      Super Admin Portal
                    </Link>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
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
