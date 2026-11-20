'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest, getStoredActiveBrandId, setStoredActiveBrandId } from '../../lib/api';
import {
  Settings,
  Key,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Save,
  Lock,
  Zap,
  Globe,
  Share2,
  RefreshCw,
  Trash2,
  Plus,
  BookOpen,
  MessageSquare,
  Sliders,
  Check,
  Layers,
  Users,
  X,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Store
} from 'lucide-react';
import { Facebook, Instagram, LinkedIn, TwitterX, GoogleMarketplace } from '../../components/Icons';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'channels' | 'brand' | 'general' | 'team'>('channels');

  // Multi-brand state
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  // -------------------------------------------------------------
  // TAB 1: CONNECTED CHANNELS STATE
  // -------------------------------------------------------------
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'TWITTER' | 'GOOGLE'>('TWITTER');
  const [connectAccountName, setConnectAccountName] = useState('');
  const [connectUsername, setConnectUsername] = useState('');
  const [connectAccessToken, setConnectAccessToken] = useState('');
  const [isSubmittingConnect, setIsSubmittingConnect] = useState(false);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // TAB 2: BRAND KNOWLEDGE & RESPONSE BASE STATE
  // -------------------------------------------------------------
  const [brandName, setBrandName] = useState('');
  const [brandWebsite, setBrandWebsite] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [tone, setTone] = useState('Professional, friendly, and helpful');
  const [writingStyle, setWritingStyle] = useState('Conversational yet authoritative');
  const [targetAudience, setTargetAudience] = useState('Modern consumers, professionals and community members');
  const [responseGuidelines, setResponseGuidelines] = useState('Always greet politely, address the user\'s specific question, thank them for their interest, and direct order/account queries to DM or support email.');
  const [bannedKeywords, setBannedKeywords] = useState('');
  const [keyTerminology, setKeyTerminology] = useState('');

  // Structured FAQs for Comments & DMs
  const [faqs, setFaqs] = useState<Array<{ q: string; a: string }>>([
    { q: 'What is your pricing?', a: 'Our plans start at $29/month with a 14-day free trial. You can explore all tiers on our pricing page.' },
    { q: 'How does support work?', a: 'Our team is available Monday to Friday from 9am to 6pm EST via in-app chat and support@example.com.' },
    { q: 'Where do you ship?', a: 'We offer worldwide expedited shipping with tracked deliveries.' }
  ]);
  const [savingBrand, setSavingBrand] = useState(false);

  // -------------------------------------------------------------
  // TAB 3: GENERAL & BYOK CREDENTIALS STATE
  // -------------------------------------------------------------
  const [tenantName, setTenantName] = useState('');
  const [domain, setDomain] = useState('');
  const [customMetaAppId, setCustomMetaAppId] = useState('');
  const [customMetaAppSecret, setCustomMetaAppSecret] = useState('');
  const [customAiApiKey, setCustomAiApiKey] = useState('');
  const [customAiProvider, setCustomAiProvider] = useState('GEMINI');
  const [hasSecretSet, setHasSecretSet] = useState(false);
  const [hasAiKeySet, setHasAiKeySet] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Notifications & UI feedback
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Initial read of URL query tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['channels', 'brand', 'general', 'team'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
      const savedBrand = getStoredActiveBrandId();
      if (savedBrand) setSelectedBrandId(savedBrand);
    }
  }, []);

  // Fetch Brands
  const fetchBrands = async () => {
    try {
      const res = await apiRequest('/brands');
      if (res.brands && res.brands.length > 0) {
        const uniqueBrands = res.brands.filter(
          (b: any, index: number, self: any[]) =>
            index === self.findIndex((item: any) => item.name?.trim().toLowerCase() === b.name?.trim().toLowerCase())
        );
        setBrands(uniqueBrands);
        const preferred = uniqueBrands.find((b: any) => /apex/i.test(b.name)) || uniqueBrands[0];
        if (!selectedBrandId) {
          const defaultId = preferred.id;
          setSelectedBrandId(defaultId);
          loadBrandVoice(preferred);
        } else {
          const current = uniqueBrands.find((b: any) => b.id === selectedBrandId) || preferred;
          loadBrandVoice(current);
        }
      }
    } catch (err) {
      console.error('Fetch brands error:', err);
    }
  };

  const loadBrandVoice = (brand: any) => {
    setBrandName(brand.name || '');
    setBrandWebsite(brand.website || '');
    setBrandDescription(brand.description || '');
    const vp = brand.voiceProfile;
    if (vp) {
      setTone(vp.tone || 'Professional, friendly, and helpful');
      setWritingStyle(vp.writingStyle || 'Conversational yet authoritative');
      setTargetAudience(vp.targetAudience || 'Modern consumers, professionals and community members');
      setResponseGuidelines(vp.responseGuidelines || 'Always greet politely, address the user\'s specific question, thank them for their interest, and direct order/account queries to DM or support email.');
      setBannedKeywords(vp.bannedKeywords || '');
      setKeyTerminology(vp.keyTerminology || '');
      if (vp.standardFaqs) {
        try {
          const parsed = JSON.parse(vp.standardFaqs);
          if (Array.isArray(parsed)) setFaqs(parsed);
          else if (typeof parsed === 'string') {
            setFaqs([{ q: 'Common Inquiries', a: parsed }]);
          }
        } catch {
          setFaqs([{ q: 'General Inquiries', a: vp.standardFaqs }]);
        }
      }
    }
  };

  // Fetch Accounts
  const fetchAccounts = async (brandId?: string) => {
    setIsLoadingAccounts(true);
    try {
      const bId = brandId || selectedBrandId;
      const url = bId ? `/social-accounts?brandId=${bId}` : '/social-accounts';
      const res = await apiRequest(url);
      setAccounts(res.accounts || []);
    } catch (err) {
      console.error('Fetch accounts error:', err);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Fetch General Settings
  const fetchGeneralSettings = async () => {
    try {
      const res = await apiRequest('/tenant/settings');
      if (res.tenant) {
        setTenantName(res.tenant.name || '');
        setDomain(res.tenant.domain || '');
        setCustomMetaAppId(res.tenant.customMetaAppId || '');
        setHasSecretSet(res.tenant.hasCustomMetaAppSecret);
        setHasAiKeySet(res.tenant.hasCustomAiApiKey);
        setCustomAiProvider(res.tenant.customAiProvider || 'GEMINI');
      }
    } catch (err) {
      console.error('Settings load error:', err);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchGeneralSettings();
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      fetchAccounts(selectedBrandId);
      const current = brands.find((b: any) => b.id === selectedBrandId);
      if (current) loadBrandVoice(current);
    }
  }, [selectedBrandId]);

  const handleBrandSelect = (id: string) => {
    setSelectedBrandId(id);
    setStoredActiveBrandId(id);
  };

  // -------------------------------------------------------------
  // TAB 1: CONNECT SOCIAL ACCOUNT HANDLER
  // -------------------------------------------------------------
  const handleConnectSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId) {
      setNotice({ type: 'error', text: 'Please select an active brand first.' });
      return;
    }
    setIsSubmittingConnect(true);
    setNotice(null);

    try {
      const tokenToUse = connectAccessToken.trim() || `token_${connectPlatform.toLowerCase()}_${Date.now()}`;
      const res = await apiRequest('/social-accounts/quick-connect', {
        method: 'POST',
        body: JSON.stringify({
          brandId: selectedBrandId,
          platform: connectPlatform,
          accessToken: tokenToUse,
          accountNameCustom: connectAccountName.trim() || `${connectPlatform} Account`,
          usernameCustom: connectUsername.trim() || connectAccountName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
        })
      });

      setNotice({ type: 'success', text: `Successfully connected ${connectPlatform} account "${res.account?.accountName || connectAccountName}"!` });
      setShowConnectModal(false);
      setConnectAccountName('');
      setConnectUsername('');
      setConnectAccessToken('');
      fetchAccounts(selectedBrandId);
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to connect account.' });
    } finally {
      setIsSubmittingConnect(false);
    }
  };

  const handleSyncAccount = async (id: string) => {
    setSyncingAccountId(id);
    try {
      await apiRequest(`/social-accounts/${id}/sync`, { method: 'POST' });
      setNotice({ type: 'success', text: 'Account token and data synced successfully!' });
      fetchAccounts(selectedBrandId);
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to sync account.' });
    } finally {
      setSyncingAccountId(null);
    }
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect "${name}"?`)) return;
    try {
      await apiRequest(`/social-accounts/${id}`, { method: 'DELETE' });
      setAccounts(prev => prev.filter(a => a.id !== id));
      setNotice({ type: 'success', text: `Disconnected "${name}".` });
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to disconnect account.' });
    }
  };

  // -------------------------------------------------------------
  // TAB 2: SAVE BRAND DETAILS & KNOWLEDGE BASE
  // -------------------------------------------------------------
  const handleSaveBrandKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId) return;
    setSavingBrand(true);
    setNotice(null);

    try {
      // 1. Update Core Brand Info
      await apiRequest(`/brands/${selectedBrandId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: brandName,
          website: brandWebsite,
          description: brandDescription
        })
      });

      // 2. Update Voice Profile, Directives & FAQs
      await apiRequest(`/brands/${selectedBrandId}/voice`, {
        method: 'PUT',
        body: JSON.stringify({
          tone,
          writingStyle,
          targetAudience,
          keyTerminology,
          bannedKeywords,
          standardFaqs: JSON.stringify(faqs),
          responseGuidelines
        })
      });

      setNotice({
        type: 'success',
        text: 'Brand details, Knowledge Base, and Comment/DM response directives saved successfully!'
      });
      fetchBrands();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to save brand knowledge.' });
    } finally {
      setSavingBrand(false);
    }
  };

  const addFaqItem = () => {
    setFaqs(prev => [...prev, { q: '', a: '' }]);
  };

  const removeFaqItem = (index: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateFaqItem = (index: number, field: 'q' | 'a', value: string) => {
    setFaqs(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  // -------------------------------------------------------------
  // TAB 3: SAVE GENERAL & BYOK SETTINGS
  // -------------------------------------------------------------
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    setNotice(null);

    try {
      await apiRequest('/tenant/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          name: tenantName,
          domain,
          customMetaAppId,
          customMetaAppSecret: customMetaAppSecret || undefined,
          customAiApiKey: customAiApiKey || undefined,
          customAiProvider
        })
      });

      setNotice({ type: 'success', text: 'General settings & BYOK credentials saved successfully!' });
      setCustomMetaAppSecret('');
      setCustomAiApiKey('');
      fetchGeneralSettings();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setSavingGeneral(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AppLayout activeBrandId={selectedBrandId} onBrandChange={handleBrandSelect}>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 pt-1">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span>OmniSocial</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">Settings & Channels</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1012] tracking-tight mt-1">
              Settings & Channels
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage connected social channels (Facebook, Instagram, LinkedIn, Twitter/X, Google Marketplace), Brand Knowledge Base for AI replies, and BYOK credentials.
            </p>
          </div>

          {/* Active Brand Capsule */}
          {brands.length > 0 && (
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Brand:</span>
              <select
                value={selectedBrandId}
                onChange={(e) => handleBrandSelect(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        {notice && (
          <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border shadow-2xs ${notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-semibold">{notice.text}</span>
          </div>
        )}

        {/* CADRA SEGMENTED TAB NAVIGATION */}
        <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer shrink-0 ${activeTab === 'channels' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Share2 className={`w-3.5 h-3.5 ${activeTab === 'channels' ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span>Connected Channels ({isLoadingAccounts ? '...' : accounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer shrink-0 ${activeTab === 'brand' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'brand' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Brand Knowledge & Response Base</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer shrink-0 ${activeTab === 'general' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Key className={`w-3.5 h-3.5 ${activeTab === 'general' ? 'text-purple-400' : 'text-slate-500'}`} />
            <span>General & BYOK Keys</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer shrink-0 ${activeTab === 'team' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Users className={`w-3.5 h-3.5 ${activeTab === 'team' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Team & Permissions</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: CONNECTED CHANNELS */}
        {/* ========================================================= */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            {/* PLATFORM QUICK CONNECT STRIP */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Social Media Channel</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect accounts to publish posts and monitor comments & DMs for <strong>{brands.find(b => b.id === selectedBrandId)?.name || 'Active Brand'}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                {/* 1. Facebook */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectPlatform('FACEBOOK');
                    setConnectAccountName('Facebook Page');
                    setConnectUsername('');
                    setShowConnectModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Facebook</div>
                  <span className="text-[10px] text-slate-400">Pages & Feed</span>
                </button>

                {/* 2. Instagram */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectPlatform('INSTAGRAM');
                    setConnectAccountName('Instagram Business');
                    setConnectUsername('');
                    setShowConnectModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-pink-50/60 border border-slate-200 hover:border-pink-300 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Instagram</div>
                  <span className="text-[10px] text-slate-400">Professional Profile</span>
                </button>

                {/* 3. LinkedIn */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectPlatform('LINKEDIN');
                    setConnectAccountName('LinkedIn Page');
                    setConnectUsername('');
                    setShowConnectModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center">
                      <LinkedIn className="w-4 h-4" />
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">LinkedIn</div>
                  <span className="text-[10px] text-slate-400">Company & Profile</span>
                </button>

                {/* 4. Twitter / X */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectPlatform('TWITTER');
                    setConnectAccountName('X Profile');
                    setConnectUsername('');
                    setShowConnectModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                      <TwitterX className="w-3.5 h-3.5" />
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Twitter / X</div>
                  <span className="text-[10px] text-slate-400">Posts & Replies</span>
                </button>

                {/* 5. Google Marketplace / Business */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectPlatform('GOOGLE');
                    setConnectAccountName('Google Business Profile');
                    setConnectUsername('');
                    setShowConnectModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                      <GoogleMarketplace className="w-4 h-4" />
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">Google Market</div>
                  <span className="text-[10px] text-slate-400">Reviews & Updates</span>
                </button>
              </div>
            </div>

            {/* CONNECTED ACCOUNTS LIST */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Connected Social Accounts</h3>
                </div>
                <button
                  type="button"
                  onClick={() => fetchAccounts(selectedBrandId)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                  title="Refresh Accounts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAccounts ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingAccounts ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading connected accounts...</div>
              ) : accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.map((acc) => {
                    const plat = acc.platform?.toUpperCase();
                    return (
                      <div
                        key={acc.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Avatar */}
                          <div className="relative">
                            {acc.profilePicUrl ? (
                              <img
                                src={acc.profilePicUrl}
                                alt={acc.accountName}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop';
                                }}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                                {acc.accountName?.slice(0, 2).toUpperCase() || 'SM'}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center">
                              {plat === 'TWITTER' ? (
                                <TwitterX className="w-2.5 h-2.5 text-black" />
                              ) : plat === 'GOOGLE' ? (
                                <GoogleMarketplace className="w-2.5 h-2.5" />
                              ) : plat === 'LINKEDIN' ? (
                                <LinkedIn className="w-2.5 h-2.5 text-[#0A66C2]" />
                              ) : plat === 'INSTAGRAM' ? (
                                <Instagram className="w-2.5 h-2.5 text-pink-600" />
                              ) : (
                                <Facebook className="w-2.5 h-2.5 text-[#1877F2]" />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-slate-900">{acc.accountName}</h4>
                              {acc.username && (
                                <span className="text-[11px] text-slate-500 font-mono">@{acc.username}</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-white border border-slate-200 text-slate-600">
                                {acc.platform}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>{acc.tokenStatus || 'CONNECTED'}</span>
                              </span>
                              {acc.brandName && (
                                <span className="text-[10px] text-slate-400">({acc.brandName})</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSyncAccount(acc.id)}
                            disabled={syncingAccountId === acc.id}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center space-x-1 transition"
                          >
                            <RefreshCw className={`w-3 h-3 ${syncingAccountId === acc.id ? 'animate-spin' : ''}`} />
                            <span>Sync</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(acc.id, acc.accountName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Disconnect Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-800">No Channels Connected for this Brand</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                    Click any channel icon above to connect your Facebook, Instagram, LinkedIn, Twitter/X, or Google Marketplace profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BRAND KNOWLEDGE & RESPONSE BASE (BASE FOR COMMENTS & DMS) */}
        {/* ========================================================= */}
        {activeTab === 'brand' && (
          <form onSubmit={handleSaveBrandKnowledge} className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-200 p-5 shadow-2xs">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Brand Response & Knowledge Base Engine</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    The details defined here serve as the <strong>single source of truth</strong> for the AI when drafting contextual, empathetic, and factual answers for incoming <strong>Public Comments and Private DMs</strong> in the Engage inbox.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 1: CORE BRAND & PRODUCT FACTS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">1. Core Brand Identity & Products</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Website</label>
                  <input
                    type="url"
                    value={brandWebsite}
                    onChange={(e) => setBrandWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">
                  Company Overview & Product Offerings (Injected into AI Context)
                </label>
                <textarea
                  rows={3}
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Describe what your brand does, what products or services you offer, pricing tiers, and your core mission. The AI uses this to explain your business to customer inquiries."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* SECTION 2: AI VOICE & ENGAGEMENT PERSONA */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">2. Voice Persona & Tone for Replies</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tone of Voice</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="e.g. Professional, friendly, empathetic, high-energy"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Writing Style</label>
                  <input
                    type="text"
                    value={writingStyle}
                    onChange={(e) => setWritingStyle(e.target.value)}
                    placeholder="e.g. Conversational, concise, tasteful emojis"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Target Customer / Community Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B founders, eco-conscious shoppers, tech enthusiasts"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">
                  Specific Response Directives for Comments & DMs
                </label>
                <textarea
                  rows={2}
                  value={responseGuidelines}
                  onChange={(e) => setResponseGuidelines(e.target.value)}
                  placeholder="Directives for the AI reply engine: e.g. Always greet politely, never quote discounts in public comments, tell users with billing issues to message support@brand.com."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">
                  Banned Keywords & Sensitive Topics (Comma separated)
                </label>
                <input
                  type="text"
                  value={bannedKeywords}
                  onChange={(e) => setBannedKeywords(e.target.value)}
                  placeholder="cheap, discount, competitorA, competitorB"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* SECTION 3: STRUCTURED FAQS (KNOWLEDGE BASE) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">3. Standard FAQs & Fact Base (Used in Comments & DMs)</h3>
                </div>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center space-x-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Snippet</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">FAQ #{idx + 1}</span>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaqItem(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateFaqItem(idx, 'q', e.target.value)}
                        placeholder="Customer Question (e.g. What is your refund policy?)"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => updateFaqItem(idx, 'a', e.target.value)}
                        placeholder="Approved Answer / Facts to provide to customer..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE FOOTER */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="submit"
                disabled={savingBrand || !brandName.trim()}
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-full shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingBrand ? 'Saving Knowledge Base...' : 'Save Brand Details & Response Base'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GENERAL & BYOK KEYS */}
        {/* ========================================================= */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Organization Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Organization / Tenant Name</label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Acme Agency"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="app.acme.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* BYOK CUSTOM KEYS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Key className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Bring Your Own Keys (BYOK)</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom Meta App ID</label>
                  <input
                    type="text"
                    value={customMetaAppId}
                    onChange={(e) => setCustomMetaAppId(e.target.value)}
                    placeholder="e.g. 109283746501928"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Custom Meta App Secret {hasSecretSet && <span className="text-emerald-600 font-normal">(Encrypted Secret Configured)</span>}
                  </label>
                  <input
                    type="password"
                    value={customMetaAppSecret}
                    onChange={(e) => setCustomMetaAppSecret(e.target.value)}
                    placeholder={hasSecretSet ? '••••••••••••••••••••••••' : 'Enter Meta App Secret'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Custom AI Gateway Key (OpenRouter / Gemini) {hasAiKeySet && <span className="text-emerald-600 font-normal">(Custom Key Configured)</span>}
                  </label>
                  <input
                    type="password"
                    value={customAiApiKey}
                    onChange={(e) => setCustomAiApiKey(e.target.value)}
                    placeholder={hasAiKeySet ? '••••••••••••••••••••••••' : 'sk-or-v1-...'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={savingGeneral}
                className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-full shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingGeneral ? 'Saving Settings...' : 'Save Organization & Keys'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TEAM & PERMISSIONS */}
        {/* ========================================================= */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Team Workspace & Permissions</h3>
              </div>
              <a
                href="/team"
                className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center space-x-1 transition"
              >
                <span>Manage Team Members</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Invite team members with Role-Based Access Control (RBAC): SuperAdmin, Agency Admin, Strategist, Copywriter, and Client Reviewer.
            </p>
          </div>
        )}

        {/* CONNECT CHANNEL MODAL */}
        {showConnectModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  {connectPlatform === 'TWITTER' ? (
                    <TwitterX className="w-4 h-4 text-black" />
                  ) : connectPlatform === 'GOOGLE' ? (
                    <GoogleMarketplace className="w-4 h-4" />
                  ) : connectPlatform === 'LINKEDIN' ? (
                    <LinkedIn className="w-4 h-4 text-[#0A66C2]" />
                  ) : connectPlatform === 'INSTAGRAM' ? (
                    <Instagram className="w-4 h-4 text-pink-600" />
                  ) : (
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                  )}
                  <h3 className="text-base font-bold text-slate-900">
                    Connect {connectPlatform === 'TWITTER' ? 'Twitter / X' : connectPlatform === 'GOOGLE' ? 'Google Marketplace' : connectPlatform}
                  </h3>
                </div>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConnectSocial} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {connectPlatform === 'TWITTER' ? 'Account Display Name' : connectPlatform === 'GOOGLE' ? 'Marketplace / Store Name' : 'Account Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={connectAccountName}
                    onChange={(e) => setConnectAccountName(e.target.value)}
                    placeholder={connectPlatform === 'TWITTER' ? 'e.g. OmniSocial Official' : connectPlatform === 'GOOGLE' ? 'e.g. Downtown Flagship Store' : 'e.g. Brand Page'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {connectPlatform === 'TWITTER' ? 'Handle (@username)' : connectPlatform === 'GOOGLE' ? 'Store / Location Identifier' : 'Username / Page ID'}
                  </label>
                  <input
                    type="text"
                    value={connectUsername}
                    onChange={(e) => setConnectUsername(e.target.value)}
                    placeholder={connectPlatform === 'TWITTER' ? '@omnisocial_ai' : connectPlatform === 'GOOGLE' ? 'loc_gmb_92819' : 'page_id_or_username'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Access Token / API Key (Optional for 1-Click Connect)
                  </label>
                  <input
                    type="password"
                    value={connectAccessToken}
                    onChange={(e) => setConnectAccessToken(e.target.value)}
                    placeholder="Leave blank for instant 1-click connection"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    If left blank, OmniSocial will securely generate an authorized access token.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingConnect || !connectAccountName.trim()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition"
                  >
                    {isSubmittingConnect ? 'Connecting...' : `Connect ${connectPlatform}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
