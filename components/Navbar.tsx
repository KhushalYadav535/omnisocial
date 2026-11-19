'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  getStoredUser, 
  getStoredTenant, 
  clearAuthToken, 
  apiRequest,
  getStoredActiveBrandId,
  setStoredActiveBrandId,
  getStoredActiveBrandName,
  setStoredActiveBrandName
} from '../lib/api';
import { 
  Building2, 
  Tag, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  ChevronDown, 
  Check, 
  Home,
  Menu,
  MessageSquare,
  Inbox,
  ExternalLink,
  Sparkles,
  Settings,
  Users,
  Search,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export interface NavbarProps {
  currentBrandId?: string;
  onBrandChange?: (brandId: string) => void;
  unreadCount?: number;
  unreadCommentsCount?: number;
  unreadDmsCount?: number;
  commentsCount?: number;
  dmsCount?: number;
  onOpenMobileMenu?: () => void;
  onOpenSearch?: () => void;
}

function NavbarContent({ 
  currentBrandId, 
  onBrandChange,
  unreadCount = 0,
  unreadCommentsCount = 0,
  unreadDmsCount = 0,
  commentsCount = 0,
  dmsCount = 0,
  onOpenMobileMenu,
  onOpenSearch
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');
  const currentStep = searchParams?.get('step');

  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Close menus on Escape or Outside Click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowBrandMenu(false);
        setShowBusinessMenu(false);
        setShowNotifMenu(false);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.brand-menu-container')) {
        setShowBrandMenu(false);
      }
      if (!target.closest('.business-menu-container')) {
        setShowBusinessMenu(false);
      }
      if (!target.closest('.notif-menu-container')) {
        setShowNotifMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedTenant = getStoredTenant();
    setUser(storedUser);
    setTenant(storedTenant);

    if (storedUser) {
      apiRequest('/brands')
        .then((res) => {
          if (res.brands && res.brands.length > 0) {
            // Deduplicate brands by name so duplicate options never appear
            const uniqueBrands = res.brands.filter(
              (b: any, index: number, self: any[]) =>
                index === self.findIndex((item: any) => item.name?.trim().toLowerCase() === b.name?.trim().toLowerCase())
            );
            setBrands(uniqueBrands);
            const savedBrandId = getStoredActiveBrandId();
            if (!currentBrandId && onBrandChange) {
              if (savedBrandId && uniqueBrands.some((b: any) => b.id === savedBrandId)) {
                const targetBrand = uniqueBrands.find((b: any) => b.id === savedBrandId);
                if (targetBrand) setStoredActiveBrandName(targetBrand.name);
                onBrandChange(savedBrandId);
              } else {
                // Strictly prioritize Apex Digital over dummy brands
                const apex = uniqueBrands.find((b: any) => b.name?.toLowerCase().includes('apex'));
                const defaultBrand = apex || uniqueBrands[0];
                setStoredActiveBrandId(defaultBrand.id);
                setStoredActiveBrandName(defaultBrand.name);
                onBrandChange(defaultBrand.id);
              }
            } else if (currentBrandId) {
              const currentBrand = uniqueBrands.find((b: any) => b.id === currentBrandId);
              if (currentBrand) setStoredActiveBrandName(currentBrand.name);
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

  const selectedBrand = brands.find((b) => b.id === currentBrandId) || brands[0];
  const totalUnreadEngage = (unreadCommentsCount || 0) + (unreadDmsCount || 0) || unreadCount || 0;

  // Compute dynamic breadcrumbs matching reference design:
  // e.g. 🏠 › Studio / Marketing Strategy or 🏠 › Studio / Marketing Strategy › Business & Brand Analysis
  const getBreadcrumbs = () => {
    if (pathname === '/content-studio') {
      if (currentTab === 'strategy') {
        const stepLabels: Record<string, string> = {
          '1': 'Business & Brand Analysis',
          '2': 'Market & Competitor Research',
          '3': 'Audience Strategy',
          '4': 'Marketing Objectives',
          '5': 'Positioning & Messaging',
          '6': 'Channel Strategy',
          '7': 'Marketing Roadmap',
          '8': 'Review & Approval'
        };
        const items = [
          { label: 'Studio', href: '/content-studio' },
          { label: 'Marketing Strategy', href: '/content-studio?tab=strategy', isCurrent: !currentStep }
        ];
        if (currentStep && stepLabels[currentStep]) {
          items.push({
            label: stepLabels[currentStep],
            href: `/content-studio?tab=strategy&step=${currentStep}`,
            isCurrent: true
          });
        }
        return items;
      }
      if (currentTab === 'campaigns') {
        return [
          { label: 'Studio', href: '/content-studio' },
          { label: 'Campaigns', href: '/content-studio?tab=campaigns', isCurrent: true }
        ];
      }
      if (currentTab === 'ideas') {
        return [
          { label: 'Studio', href: '/content-studio' },
          { label: 'Content Library', href: '/content-studio?tab=ideas', isCurrent: true }
        ];
      }
      if (currentTab === 'media') {
        return [
          { label: 'Studio', href: '/content-studio' },
          { label: 'Media Library', href: '/content-studio?tab=media', isCurrent: true }
        ];
      }
      if (currentTab === 'approvals') {
        return [
          { label: 'Studio', href: '/content-studio' },
          { label: 'Approvals', href: '/content-studio?tab=approvals', isCurrent: true }
        ];
      }
      return [
        { label: 'Studio', href: '/content-studio', isCurrent: true }
      ];
    }

    if (pathname === '/dashboard') {
      return [{ label: 'Overview', href: '/dashboard', isCurrent: true }];
    }
    if (pathname === '/calendar') {
      return [{ label: 'Content Calendar', href: '/calendar', isCurrent: true }];
    }
    if (pathname === '/analytics') {
      return [{ label: 'Performance', href: '/analytics', isCurrent: true }];
    }
    if (pathname === '/settings') {
      return [{ label: 'Settings', href: '/settings', isCurrent: true }];
    }
    if (pathname.startsWith('/inbox')) {
      return [{ label: 'Inbox & Engage', href: '/inbox', isCurrent: true }];
    }
    if (pathname === '/accounts') {
      return [{ label: 'Connected Channels', href: '/accounts', isCurrent: true }];
    }
    if (pathname === '/team') {
      return [{ label: 'Team & RBAC', href: '/team', isCurrent: true }];
    }
    if (pathname === '/superadmin') {
      return [{ label: 'Platform Administration', href: '/superadmin', isCurrent: true }];
    }
    return [{ label: 'Studio', href: '/content-studio', isCurrent: true }];
  };

  const breadcrumbs = getBreadcrumbs();

  // User initials (defaults to ST or user's first 2 characters)
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST';

  // EXACT MATCH TO REFERENCE DESIGN WHEN IN "POSTS & CONTENT"
  if (pathname === '/content-studio' && currentTab === 'composer') {
    return (
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 h-14 px-4 sm:px-6 flex items-center justify-between select-none">
        {/* Left: Mobile Menu Toggle & Exact Breadcrumb */}
        <div className="flex items-center space-x-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link href="/content-studio" className="hover:text-slate-900 transition">
              Studio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/content-studio?tab=composer" className="hover:text-slate-900 transition">
              Posts &amp; Content
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Create post</span>
          </nav>
        </div>

        {/* Right: Help, Notification Bell, User Avatar (ST) */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            title="Help & Documentation"
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="relative notif-menu-container">
            <button
              type="button"
              title="Notifications"
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#EA580C] absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Notifications &amp; Activity
                </div>
                <div className="py-1 text-xs">
                  <Link
                    href="/inbox"
                    onClick={() => setShowNotifMenu(false)}
                    className="px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <span className="text-slate-700 font-medium">Comments &amp; Engagement</span>
                    {unreadCommentsCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                        {unreadCommentsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/inbox?type=DIRECT_MESSAGE"
                    onClick={() => setShowNotifMenu(false)}
                    className="px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <span className="text-slate-700 font-medium">Direct Messages</span>
                    {unreadDmsCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                        {unreadDmsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative user-menu-container">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs ring-2 ring-orange-200 shadow-2xs cursor-pointer"
            >
              {userInitials}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'UpRole Admin'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@omnisocial.ai'}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Settings &amp; Preferences
                  </Link>
                  <Link
                    href="/accounts"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Connected Channels
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 h-14 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center space-x-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Dynamic StudioFlow Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-semibold text-slate-500 overflow-hidden">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-800 transition flex items-center shrink-0"
            title="Overview Home"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              <span className="text-slate-300 font-normal shrink-0">
                {idx === 1 && crumb.label === 'Marketing Strategy' ? '/' : '›'}
              </span>
              {crumb.isCurrent ? (
                <span className="text-slate-900 font-bold truncate">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-500 hover:text-slate-900 transition truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Workspace Capsules (Business, Brand, Notification Bell, User Avatar) */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-3">
        {/* Global Search Palette Trigger Button */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/90 px-2.5 sm:px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
            title="Open Command Palette (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline font-medium">Search...</span>
            <kbd className="hidden sm:inline text-[10px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.2 rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Business Selector Capsule */}
        <div className="relative business-menu-container">
          <button
            type="button"
            onClick={() => {
              setShowBusinessMenu(!showBusinessMenu);
              setShowBrandMenu(false);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="max-w-[85px] sm:max-w-[130px] truncate">
              Business: {tenant?.name || 'Sentient Digital'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {showBusinessMenu && (
            <div className="absolute right-0 sm:left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Active Organization
              </div>
              <div className="px-3.5 py-2.5">
                <p className="text-xs font-bold text-slate-900">{tenant?.name || 'Sentient Digital'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Multi-tenant Sovereign Workspace</p>
                <div className="mt-2 inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-[#7C3AED] border border-purple-100">
                  Plan: Agency Enterprise
                </div>
              </div>
              <div className="border-t border-slate-100 pt-1.5 px-1.5">
                <Link
                  href="/settings"
                  onClick={() => setShowBusinessMenu(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Organization Settings</span>
                </Link>
                <Link
                  href="/team"
                  onClick={() => setShowBusinessMenu(false)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Team & Collaborators</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Brand Selector Capsule */}
        <div className="relative brand-menu-container">
          <button
            type="button"
            onClick={() => {
              setShowBrandMenu(!showBrandMenu);
              setShowBusinessMenu(false);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="max-w-[85px] sm:max-w-[130px] truncate">
              Brand: {selectedBrand?.name || (typeof window !== 'undefined' ? (getStoredActiveBrandName() || 'Apex Digital') : 'Apex Digital')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {showBrandMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Switch Brand Workspace
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {brands.length === 0 ? (
                  <div className="px-3.5 py-2 text-xs text-slate-500 font-semibold">
                    {typeof window !== 'undefined' ? (getStoredActiveBrandName() || 'Apex Digital') : 'Apex Digital'} (Active)
                  </div>
                ) : (
                  brands.map((b) => {
                    const isSelected = selectedBrand?.id === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setStoredActiveBrandId(b.id);
                          setStoredActiveBrandName(b.name);
                          if (onBrandChange) onBrandChange(b.id);
                          setShowBrandMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                          isSelected ? 'font-bold text-[#7C3AED] bg-purple-50/60' : 'text-slate-700 font-medium'
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-slate-100 pt-1.5 px-1.5 mt-1">
                <Link
                  href="/brands"
                  onClick={() => setShowBrandMenu(false)}
                  className="block px-3 py-1.5 text-xs font-semibold text-[#7C3AED] hover:bg-purple-50 rounded-lg transition"
                >
                  + Manage Brands & Voice
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative notif-menu-container">
          <button
            type="button"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowBusinessMenu(false);
              setShowBrandMenu(false);
              setShowUserMenu(false);
            }}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 transition cursor-pointer relative shadow-2xs"
            title="Activity & Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalUnreadEngage > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Notifications</span>
                {totalUnreadEngage > 0 && (
                  <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-1.5 py-0.2 rounded-md">
                    {totalUnreadEngage} new
                  </span>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/inbox?type=COMMENT"
                  onClick={() => setShowNotifMenu(false)}
                  className="px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Post Comments</p>
                      <p className="text-[10px] text-slate-400">Replies & community threads</p>
                    </div>
                  </div>
                  {unreadCommentsCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">
                      {unreadCommentsCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/inbox?type=DIRECT_MESSAGE"
                  onClick={() => setShowNotifMenu(false)}
                  className="px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <Inbox className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Direct Messages</p>
                      <p className="text-[10px] text-slate-400">Messenger & Instagram DMs</p>
                    </div>
                  </div>
                  {unreadDmsCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">
                      {unreadDmsCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1.5 px-3.5 text-center">
                <Link
                  href="/inbox"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  View Sovereign Inbox →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Capsule (Exact Match: ST Lavender Pill) */}
        <div className="relative user-menu-container">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowBusinessMenu(false);
              setShowBrandMenu(false);
              setShowNotifMenu(false);
            }}
            className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] border border-purple-200 flex items-center justify-center font-bold text-xs transition cursor-pointer shadow-2xs"
            title={user?.name || 'User Profile'}
          >
            {userInitials}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@sentientdigital.ai'}</p>
                <span className="inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#7C3AED] border border-purple-100">
                  {user?.role || 'AGENCY_ADMIN'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Organization Settings
                </Link>
                <Link
                  href="/team"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Team & Collaborators
                </Link>
                <Link
                  href="/accounts"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Connected Channels
                </Link>
                {user?.role === 'SUPERADMIN' && (
                  <Link
                    href="/superadmin"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-xs text-amber-900 font-bold hover:bg-amber-50 transition"
                  >
                    ★ Platform Governance
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 font-semibold hover:bg-rose-50 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense
      fallback={
        <header className="h-14 bg-white/95 border-b border-slate-200/70 px-6 flex items-center justify-between" />
      }
    >
      <NavbarContent {...props} />
    </Suspense>
  );
}
