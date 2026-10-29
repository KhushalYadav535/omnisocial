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
  Activity
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-15 px-4 sm:px-6">
        {/* Left: Brand Identity & Tenant */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">OmniSocial</span>
              <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">AI</span>
            </div>
          </Link>

          {/* Tenant Indicator */}
          {tenant && (
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant:</span>
              <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {tenant.name}
              </span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {tenant.plan || 'Pro'}
              </span>
            </div>
          )}

          {/* Brand Switcher */}
          {brands.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBrandMenu(!showBrandMenu)}
                className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold text-slate-900">{selectedBrand?.name || 'All Brands'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showBrandMenu && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Brand
                  </div>
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (onBrandChange) onBrandChange(b.id);
                        setShowBrandMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 ${
                        selectedBrand?.id === b.id ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {selectedBrand?.id === b.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 pt-1">
                    <Link
                      href="/brands"
                      onClick={() => setShowBrandMenu(false)}
                      className="block px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
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
          <div className="hidden lg:flex items-center space-x-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Meta API & Sync Active</span>
          </div>

          {/* Super Admin Quick Link */}
          {user?.role === 'SUPER_ADMIN' && (
            <Link
              href="/superadmin"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Platform Admin</span>
            </Link>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 focus:outline-hidden p-1 rounded-md"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight">{user?.name || 'My Account'}</p>
                <p className="text-slate-500 leading-tight">
                  {user?.role === 'SUPER_ADMIN' ? 'Platform Super Admin' : user?.role === 'TENANT_ADMIN' ? 'Agency Admin' : 'Team Member'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Tenant Settings & BYOK Keys
                </Link>
                <Link
                  href="/team"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Manage Team & Roles
                </Link>
                {user?.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/superadmin"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50 font-medium border-t border-slate-100"
                  >
                    Super Platform Admin Portal
                  </Link>
                )}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center space-x-1.5"
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

