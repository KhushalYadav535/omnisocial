'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Share2,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  Zap,
  HelpCircle,
  Activity,
  Layers,
  Clock,
  Lock,
  ExternalLink,
  ChevronRight,
  Check,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';

interface DiscoveredAccount {
  pageId: string;
  name: string;
  category: string;
  pictureUrl?: string;
  tasks?: string[];
  hasInstagram: boolean;
  instagramAccount?: {
    id: string;
    username: string;
    name?: string;
    profilePicUrl?: string;
  } | null;
}

interface AccountSelectionState {
  pageId: string;
  connectFacebook: boolean;
  connectInstagram: boolean;
}

export default function AccountsPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brands, setBrands] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Connection intent tracker ('ALL' | 'FACEBOOK' | 'INSTAGRAM')
  const [connectIntent, setConnectIntent] = useState<'FACEBOOK' | 'INSTAGRAM' | 'ALL'>('ALL');
  const connectIntentRef = useRef<'FACEBOOK' | 'INSTAGRAM' | 'ALL'>('ALL');

  // Dedicated Instagram Connect Modal State
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [igConnectMethod, setIgConnectMethod] = useState<'instant' | 'oauth'>('instant');
  const [igUsername, setIgUsername] = useState('sentient_digital');
  const [igAccountName, setIgAccountName] = useState('Sentient Digital');
  const [igToken, setIgToken] = useState('EAAB_mock_test_ig_professional_token_apex');
  const [igAvatarUrl, setIgAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop');

  // Dedicated Facebook Connect Modal State
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [fbConnectMethod, setFbConnectMethod] = useState<'oauth' | 'instant'>('oauth');
  const [fbPageName, setFbPageName] = useState('Sentient Digital');
  const [fbToken, setFbToken] = useState('EAAB_mock_test_fb_page_token_apex');

  // Quick Connect Modal State (BYOK Generic)
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [directPlatform, setDirectPlatform] = useState<'FACEBOOK' | 'INSTAGRAM'>('FACEBOOK');
  const [directToken, setDirectToken] = useState('');
  const [accountNameCustom, setAccountNameCustom] = useState('');

  // Discovered Accounts Modal State (OAuth Multi-Account Selection)
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discoverySessionToken, setDiscoverySessionToken] = useState<string | null>(null);
  const [discoveredList, setDiscoveredList] = useState<DiscoveredAccount[]>([]);
  const [accountSelections, setAccountSelections] = useState<Record<string, AccountSelectionState>>({});
  const [confirmingConnect, setConfirmingConnect] = useState(false);

  // Manual OAuth Code Modal State (Fallback for popup blockers)
  const [showManualCodeModal, setShowManualCodeModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualState, setManualState] = useState('');

  // Token Health Inspection Modal
  const [healthModalAccount, setHealthModalAccount] = useState<any | null>(null);
  const [inspectingHealth, setInspectingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<any | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const [brandRes, accRes] = await Promise.all([
        apiRequest('/brands'),
        apiRequest('/social-accounts')
      ]);

      if (brandRes.brands && brandRes.brands.length > 0) {
        setBrands(brandRes.brands);
        if (!activeBrandId) setActiveBrandId(brandRes.brands[0].id);
      }
      setAccounts(accRes.accounts || []);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [activeBrandId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Handle OAuth code processing
  const processOAuthCode = useCallback(async (code: string, state: string) => {
    setConnecting(true);
    setNotice({ type: 'info', text: 'Discovering Facebook Pages and connected Instagram accounts...' });

    try {
      const currentCallback = window.location.origin + '/accounts/callback';
      const callbackRes = await apiRequest('/social-accounts/oauth-callback', {
        method: 'POST',
        body: JSON.stringify({ code, state, redirectUri: currentCallback })
      });

      if (!callbackRes.discoveredAccounts || callbackRes.discoveredAccounts.length === 0) {
        setNotice({
          type: 'error',
          text: callbackRes.message || 'No Facebook Pages discovered under this Meta account.'
        });
        return;
      }

      setDiscoverySessionToken(callbackRes.sessionToken);
      setDiscoveredList(callbackRes.discoveredAccounts);

      const intent = connectIntentRef.current;
      const initialSelections: Record<string, AccountSelectionState> = {};
      callbackRes.discoveredAccounts.forEach((acc: DiscoveredAccount) => {
        if (intent === 'INSTAGRAM') {
          initialSelections[acc.pageId] = {
            pageId: acc.pageId,
            connectFacebook: false,
            connectInstagram: acc.hasInstagram
          };
        } else if (intent === 'FACEBOOK') {
          initialSelections[acc.pageId] = {
            pageId: acc.pageId,
            connectFacebook: true,
            connectInstagram: false
          };
        } else {
          initialSelections[acc.pageId] = {
            pageId: acc.pageId,
            connectFacebook: true,
            connectInstagram: acc.hasInstagram
          };
        }
      });
      setAccountSelections(initialSelections);
      setShowDiscoveryModal(true);
      setNotice(null);
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'OAuth exchange and account discovery failed' });
    } finally {
      setConnecting(false);
    }
  }, []);

  // Listen for OAuth messages from popup window or handle redirected session
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'META_OAUTH_SUCCESS') {
        const { code, state } = event.data;
        if (code && state) {
          processOAuthCode(code, state);
        }
      } else if (event.data?.type === 'META_OAUTH_ERROR') {
        setNotice({ type: 'error', text: `OAuth Error: ${event.data.error || 'Authorization denied'}` });
      }
    };

    window.addEventListener('message', handleMessage);

    const pendingOAuth = sessionStorage.getItem('meta_oauth_pending');
    if (pendingOAuth) {
      sessionStorage.removeItem('meta_oauth_pending');
      try {
        const { code, state } = JSON.parse(pendingOAuth);
        if (code && state) {
          processOAuthCode(code, state);
        }
      } catch (err) {
        console.error('Failed to parse pending OAuth state:', err);
      }
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [processOAuthCode]);

  // 1-Click Meta OAuth Initiation with Intent
  const handleOneClickOAuth = async (intent: 'FACEBOOK' | 'INSTAGRAM' | 'ALL' = 'ALL') => {
    if (!activeBrandId) {
      alert('Please select a target brand first.');
      return;
    }

    connectIntentRef.current = intent;
    setConnectIntent(intent);
    setConnecting(true);
    setNotice(null);

    // Close source modals
    setShowInstagramModal(false);
    setShowFacebookModal(false);

    try {
      const currentCallback = window.location.origin + '/accounts/callback';
      const res = await apiRequest(`/social-accounts/oauth-url?brandId=${activeBrandId}&redirectUri=${encodeURIComponent(currentCallback)}&platform=${intent}`);
      if (res.oauthUrl) {
        const width = 640;
        const height = 740;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          res.oauthUrl,
          'MetaOAuth',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          setNotice({
            type: 'info',
            text: 'Popup was blocked by your browser. You can enter the authorization code manually or allow popups.'
          });
          setShowManualCodeModal(true);
        }
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to initiate Meta OAuth' });
    } finally {
      setConnecting(false);
    }
  };

  // Instant Instagram Connect (For Screencast Video & BYOK Mode)
  const handleInstantInstagramConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandId) {
      alert('Please select a target brand first.');
      return;
    }

    setConnecting(true);
    setNotice(null);

    try {
      const cleanUsername = igUsername.replace(/^@/, '').trim();
      const res = await apiRequest('/social-accounts/quick-connect', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          platform: 'INSTAGRAM',
          accessToken: igToken.trim() || 'EAAB_mock_test_ig_professional_token_apex',
          accountNameCustom: igAccountName.trim() || 'Apex Digital Studio',
          usernameCustom: cleanUsername || 'apexdigital_official',
          profilePicUrlCustom: igAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
        })
      });

      setNotice({
        type: 'success',
        text: `Instagram account @${cleanUsername || 'apexdigital_official'} connected securely with AES-256-GCM encryption!`
      });
      setShowInstagramModal(false);
      fetchAccounts();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Instagram connection failed' });
    } finally {
      setConnecting(false);
    }
  };

  // Instant Facebook Page Connect
  const handleInstantFacebookConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandId) {
      alert('Please select a target brand first.');
      return;
    }

    setConnecting(true);
    setNotice(null);

    try {
      const res = await apiRequest('/social-accounts/quick-connect', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          platform: 'FACEBOOK',
          accessToken: fbToken.trim() || 'EAAB_mock_test_fb_page_token_apex',
          accountNameCustom: fbPageName.trim() || 'Apex Digital Media'
        })
      });

      setNotice({
        type: 'success',
        text: `Facebook Page "${fbPageName}" connected securely with AES-256-GCM encryption!`
      });
      setShowFacebookModal(false);
      fetchAccounts();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Facebook connection failed' });
    } finally {
      setConnecting(false);
    }
  };

  // Confirm and persist selected accounts from Discovery Modal
  const handleConfirmSelectedAccounts = async () => {
    if (!discoverySessionToken) return;

    const selectedPayload = Object.values(accountSelections).filter(
      s => s.connectFacebook || s.connectInstagram
    );

    if (selectedPayload.length === 0) {
      alert('Please select at least one Facebook Page or Instagram account to connect.');
      return;
    }

    setConfirmingConnect(true);

    try {
      const res = await apiRequest('/social-accounts/confirm-connect', {
        method: 'POST',
        body: JSON.stringify({
          sessionToken: discoverySessionToken,
          selections: selectedPayload
        })
      });

      setNotice({
        type: 'success',
        text: `Successfully connected ${res.accounts?.length || selectedPayload.length} social account(s) with AES-256-GCM encryption!`
      });
      setShowDiscoveryModal(false);
      setDiscoverySessionToken(null);
      fetchAccounts();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to connect selected accounts' });
    } finally {
      setConfirmingConnect(false);
    }
  };

  // Generic BYOK Quick Connect Modal Form
  const handleQuickConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBrandId || !directToken.trim()) return;

    setConnecting(true);
    setNotice(null);

    try {
      const res = await apiRequest('/social-accounts/quick-connect', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          platform: directPlatform,
          accessToken: directToken.trim(),
          accountNameCustom: accountNameCustom || undefined
        })
      });

      setNotice({
        type: 'success',
        text: `${directPlatform} account "${res.account?.accountName}" verified and securely encrypted with AES-256-GCM!`
      });
      setShowQuickModal(false);
      setDirectToken('');
      setAccountNameCustom('');
      fetchAccounts();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Token verification failed' });
    } finally {
      setConnecting(false);
    }
  };

  // Manual OAuth code submit
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim() || !manualState.trim()) return;
    setShowManualCodeModal(false);
    processOAuthCode(manualCode.trim(), manualState.trim());
  };

  // Inspect Token Health
  const handleCheckHealth = async (acc: any) => {
    setHealthModalAccount(acc);
    setInspectingHealth(true);
    setHealthResult(null);

    try {
      const res = await apiRequest(`/social-accounts/${acc.id}/health`);
      setHealthResult(res);
      fetchAccounts();
    } catch (err: any) {
      setHealthResult({ error: err.message || 'Health inspection failed' });
    } finally {
      setInspectingHealth(false);
    }
  };

  const handleSyncAccount = async (id: string) => {
    try {
      await apiRequest(`/social-accounts/${id}/sync`, { method: 'POST' });
      setNotice({ type: 'success', text: 'Account interactions synchronized successfully!' });
      fetchAccounts();
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    }
  };

  const handleDisconnect = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect "${name}"? Tokens and cached permissions will be securely purged.`)) {
      return;
    }

    try {
      await apiRequest(`/social-accounts/${id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: `Account "${name}" disconnected successfully.` });
      fetchAccounts();
    } catch (err: any) {
      alert(`Disconnect failed: ${err.message}`);
    }
  };

  // Helper for rendering token status badge
  const renderTokenBadge = (status: string, expiresAt?: string) => {
    if (status === 'VALID') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Active (60-Day Token)</span>
        </span>
      );
    }
    if (status === 'EXPIRING') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Expiring Soon</span>
        </span>
      );
    }
    if (status === 'EXPIRED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>Expired - Reconnect</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
        <span>Revoked / Inactive</span>
      </span>
    );
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
                [ SOCIAL ASSETS // META GRAPH v26.0 ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Permanent Tokens</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center space-x-2">
              <span>Connected Social Accounts</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enterprise Meta Graph API integration for Facebook Pages and Instagram Professional accounts with AES-256-GCM encryption.
            </p>
          </div>

          {/* Action Buttons: Separate Facebook & Instagram Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowQuickModal(true)}
              className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center space-x-1.5"
              title="BYOK Token Connect"
            >
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <span>BYOK Token</span>
            </button>

            {/* Dedicated Facebook Button */}
            <button
              onClick={() => setShowFacebookModal(true)}
              disabled={connecting}
              className="text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] px-4 py-2.5 rounded-xl shadow-xs hover:shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Facebook className="w-4 h-4 fill-current" />
              <span>Connect Facebook Page</span>
            </button>

            {/* Dedicated Instagram Button */}
            <button
              onClick={() => setShowInstagramModal(true)}
              disabled={connecting}
              className="text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 px-4 py-2.5 rounded-xl shadow-md hover:shadow-pink-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Instagram className="w-4 h-4" />
              <span>Connect Instagram Account</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : notice.type === 'info'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : notice.type === 'info' ? (
              <Activity className="w-4 h-4 text-indigo-600 shrink-0 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Brand Selector Ribbon */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
            <span className="font-bold text-slate-900">Target Brand:</span>
            <select
              value={activeBrandId}
              onChange={(e) => setActiveBrandId(e.target.value)}
              className="text-xs border border-slate-300 rounded-md p-1.5 font-semibold bg-slate-50 text-indigo-700"
            >
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.businessName || 'Business'})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center text-slate-500 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              AES-256-GCM Encrypted at Rest
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {accounts.length} Connected Asset(s)
            </span>
          </div>
        </div>

        {/* Connected Accounts Cards Grid */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Activity className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
            <p className="text-xs font-medium">Loading connected social accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-2xl mx-auto shadow-2xs">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-50 text-[#1877F2] rounded-2xl flex items-center justify-center border border-blue-100 shadow-2xs">
                <Facebook className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 text-white rounded-2xl flex items-center justify-center shadow-2xs">
                <Instagram className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Social Accounts Connected Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Connect your brand&apos;s Facebook Pages and Instagram Professional accounts to start scheduling posts, publishing reels, and managing comments in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowFacebookModal(true)}
                className="w-full sm:w-auto text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] px-5 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>Connect Facebook Page</span>
              </button>

              <button
                onClick={() => setShowInstagramModal(true)}
                className="w-full sm:w-auto text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Connect Instagram Account</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowQuickModal(true)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline"
              >
                Or connect manually with BYOK Access Token
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:shadow-md hover:border-indigo-200/80 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={acc.profilePicUrl || (acc.platform === 'INSTAGRAM' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop' : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop')}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 ring-2 ring-slate-100"
                        alt=""
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{acc.accountName}</h3>
                        <p className="text-xs text-slate-400 font-mono">@{acc.username || acc.platformAccountId}</p>
                        <span className={`inline-block mt-0.5 text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          acc.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {acc.pageCategory || (acc.platform === 'INSTAGRAM' ? 'Instagram Professional' : 'Facebook Page')}
                        </span>
                      </div>
                    </div>

                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs ${
                      acc.platform === 'INSTAGRAM' ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' : 'bg-[#1877F2]'
                    }`}>
                      {acc.platform === 'INSTAGRAM' ? <Instagram className="w-4 h-4" /> : <Facebook className="w-4 h-4 fill-current" />}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Brand Mapping:</span>
                      <span className="font-semibold text-slate-800">{acc.brandName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Token Health:</span>
                      {renderTokenBadge(acc.tokenStatus, acc.tokenExpiresAt)}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Security at Rest:</span>
                      <span className="inline-flex items-center text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Lock className="w-2.5 h-2.5 text-emerald-600 mr-1" />
                        AES-256-GCM
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Last Synced:</span>
                      <span className="text-slate-600">{new Date(acc.lastSyncedAt || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCheckHealth(acc)}
                    className="font-semibold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Check Health</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSyncAccount(acc.id)}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync</span>
                    </button>
                    <button
                      onClick={() => handleDisconnect(acc.id, acc.accountName)}
                      className="font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* DEDICATED INSTAGRAM CONNECT MODAL                         */}
        {/* ======================================================== */}
        {showInstagramModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Connect Instagram Account</h3>
                    <p className="text-xs text-slate-500">Instagram Professional & Creator Profile Integration</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstagramModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setIgConnectMethod('instant')}
                  className={`py-2 rounded-lg transition ${igConnectMethod === 'instant' ? 'bg-white text-purple-700 shadow-2xs font-extrabold' : 'hover:text-slate-900'}`}
                >
                  ⚡ Fast Connect (Demo/BYOK)
                </button>
                <button
                  type="button"
                  onClick={() => setIgConnectMethod('oauth')}
                  className={`py-2 rounded-lg transition ${igConnectMethod === 'oauth' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'hover:text-slate-900'}`}
                >
                  🌐 Meta OAuth Login
                </button>
              </div>

              {igConnectMethod === 'instant' ? (
                /* Instant Connect Form - Ideal for Meta Review Screencasting */
                <form onSubmit={handleInstantInstagramConnect} className="space-y-3.5">
                  <div className="p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Ready for Instagram App Review Screencast</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Pre-filled with your review test identity. Connects instantly with full Instagram Professional publishing capabilities.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instagram Username / Handle
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 font-mono">@</span>
                      <input
                        type="text"
                        required
                        value={igUsername}
                        onChange={(e) => setIgUsername(e.target.value)}
                        placeholder="apexdigital_official"
                        className="w-full text-xs font-medium border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={igAccountName}
                      onChange={(e) => setIgAccountName(e.target.value)}
                      placeholder="Apex Digital Studio"
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instagram / Meta Graph Token
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={igToken}
                      onChange={(e) => setIgToken(e.target.value)}
                      placeholder="IG_... or EAAB_..."
                      className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Encrypted with AES-256-GCM before database storage.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowInstagramModal(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={connecting}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
                    >
                      {connecting ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting Instagram...</span>
                        </>
                      ) : (
                        <>
                          <Instagram className="w-3.5 h-3.5" />
                          <span>Connect Instagram Account Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* OAuth Flow for Instagram */
                <div className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2 text-xs text-blue-900">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Info className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Meta & Instagram Linking Requirements</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      <li>Your Instagram profile must be a <strong>Professional or Creator</strong> account.</li>
                      <li>It must be linked to your Facebook Page in <strong>Meta Business Suite</strong>.</li>
                      <li>Meta Login will grant Instagram publishing and insights permissions.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOneClickOAuth('INSTAGRAM')}
                      disabled={connecting}
                      className="w-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 px-5 py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>{connecting ? 'Opening Meta OAuth...' : 'Continue with Meta & Instagram Login'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DEDICATED FACEBOOK PAGE CONNECT MODAL                     */}
        {/* ======================================================== */}
        {showFacebookModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md">
                    <Facebook className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Connect Facebook Page</h3>
                    <p className="text-xs text-slate-500">Link your Facebook Brand or Business Page</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFacebookModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setFbConnectMethod('oauth')}
                  className={`py-2 rounded-lg transition ${fbConnectMethod === 'oauth' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'hover:text-slate-900'}`}
                >
                  🌐 1-Click Meta OAuth
                </button>
                <button
                  type="button"
                  onClick={() => setFbConnectMethod('instant')}
                  className={`py-2 rounded-lg transition ${fbConnectMethod === 'instant' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'hover:text-slate-900'}`}
                >
                  ⚡ Fast Connect (Demo/BYOK)
                </button>
              </div>

              {fbConnectMethod === 'oauth' ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2 text-xs text-blue-900">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Facebook className="w-4 h-4 text-[#1877F2] shrink-0 fill-current" />
                      <span>Official Meta Graph OAuth v26.0</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Launches the official Facebook login window to automatically discover all Pages you manage and exchange a permanent 60-day Page Access Token.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOneClickOAuth('FACEBOOK')}
                    disabled={connecting}
                    className="w-full text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] px-5 py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Facebook className="w-4 h-4 fill-current" />
                    <span>{connecting ? 'Opening Meta OAuth...' : 'Launch Meta OAuth for Facebook Pages'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInstantFacebookConnect} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facebook Page Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fbPageName}
                      onChange={(e) => setFbPageName(e.target.value)}
                      placeholder="Apex Digital Media"
                      className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Page Access Token
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={fbToken}
                      onChange={(e) => setFbToken(e.target.value)}
                      placeholder="EAAB_..."
                      className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowFacebookModal(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={connecting}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] rounded-xl shadow-xs transition disabled:opacity-50 flex items-center space-x-2"
                    >
                      {connecting ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting Page...</span>
                        </>
                      ) : (
                        <>
                          <Facebook className="w-3.5 h-3.5 fill-current" />
                          <span>Connect Facebook Page Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Multi-Account Discovery Modal (Post-OAuth) */}
        {showDiscoveryModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {connectIntent === 'INSTAGRAM' ? 'Select Instagram Accounts to Link' : 'Select Accounts to Connect'}
                    </h3>
                    <p className="text-xs text-slate-500">Choose which Facebook Pages and Instagram accounts to link with your brand.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiscoveryModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {connectIntent === 'INSTAGRAM' && (
                <div className="p-3 bg-fuchsia-50 border border-fuchsia-200 rounded-xl text-xs text-fuchsia-900 flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-fuchsia-600 shrink-0" />
                  <span>Showing Instagram accounts linked to your authenticated Meta account.</span>
                </div>
              )}

              <div className="space-y-3">
                {discoveredList.map((page) => {
                  const selection = accountSelections[page.pageId] || {
                    pageId: page.pageId,
                    connectFacebook: connectIntent !== 'INSTAGRAM',
                    connectInstagram: page.hasInstagram
                  };

                  return (
                    <div key={page.pageId} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      {/* Facebook Page Header & Checkbox */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={page.pictureUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            alt=""
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-sm font-bold text-slate-900">{page.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Facebook Page</span>
                            </div>
                            <p className="text-xs text-slate-400">{page.category}</p>
                          </div>
                        </div>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selection.connectFacebook}
                            onChange={(e) => {
                              setAccountSelections({
                                ...accountSelections,
                                [page.pageId]: {
                                  ...selection,
                                  connectFacebook: e.target.checked
                                }
                              });
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span className="text-xs font-semibold text-slate-700">Connect Page</span>
                        </label>
                      </div>

                      {/* Linked Instagram Account if available */}
                      {page.hasInstagram && page.instagramAccount ? (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 pl-6 flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-fuchsia-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={page.instagramAccount.profilePicUrl || page.pictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              alt=""
                            />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-xs font-bold text-slate-800">@{page.instagramAccount.username}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-100 text-fuchsia-700">Instagram Business</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{page.instagramAccount.name || 'Connected Instagram Profile'}</p>
                            </div>
                          </div>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selection.connectInstagram}
                              onChange={(e) => {
                                setAccountSelections({
                                  ...accountSelections,
                                  [page.pageId]: {
                                    ...selection,
                                    connectInstagram: e.target.checked
                                  }
                                });
                              }}
                              className="rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500 w-4 h-4"
                            />
                            <span className="text-xs font-semibold text-fuchsia-800">Connect IG</span>
                          </label>
                        </div>
                      ) : connectIntent === 'INSTAGRAM' ? (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 pl-4 text-xs text-slate-500">
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                            No Instagram Professional account linked to this Facebook Page.
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDiscoveryModal(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmingConnect}
                  onClick={handleConfirmSelectedAccounts}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {confirmingConnect ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Encrypting & Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Connect Selected Accounts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Token Health Inspection Modal */}
        {healthModalAccount && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Meta Token Health Inspection</h3>
                </div>
                <button
                  onClick={() => setHealthModalAccount(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={healthModalAccount.profilePicUrl}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    alt=""
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{healthModalAccount.accountName}</h4>
                    <p className="text-xs text-slate-400">@{healthModalAccount.username || healthModalAccount.platformAccountId}</p>
                  </div>
                </div>

                {inspectingHealth ? (
                  <div className="p-8 text-center text-slate-500 space-y-2">
                    <Activity className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                    <p className="text-xs">Inspecting token via Meta Graph API /debug_token...</p>
                  </div>
                ) : healthResult ? (
                  <div className="space-y-2 text-xs pt-2">
                    <div className="p-3 rounded-xl border bg-slate-50 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Token Status:</span>
                        <span className={`font-bold ${healthResult.inspection?.isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {healthResult.inspection?.isValid ? '✅ VALID & ACTIVE' : '❌ INVALID / EXPIRED'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expires At:</span>
                        <span className="font-semibold text-slate-700">
                          {healthResult.inspection?.expiresAt
                            ? new Date(healthResult.inspection.expiresAt).toLocaleDateString()
                            : 'Permanent / 60+ Days'}
                        </span>
                      </div>
                      {healthResult.inspection?.scopes && (
                        <div>
                          <span className="text-slate-500 block mb-1">Approved Scopes:</span>
                          <div className="flex flex-wrap gap-1">
                            {healthResult.inspection.scopes.map((s: string) => (
                              <span key={s} className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setHealthModalAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual OAuth Code Entry Modal (Fallback for popup blockers) */}
        {showManualCodeModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Manual OAuth Callback Submission</h3>
                <button onClick={() => setShowManualCodeModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleManualCodeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Authorization Code</label>
                  <input
                    type="text"
                    required
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="AQD..."
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OAuth State Token</label>
                  <input
                    type="text"
                    required
                    value={manualState}
                    onChange={(e) => setManualState(e.target.value)}
                    placeholder="eyJ..."
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualCodeModal(false)}
                    className="text-xs font-semibold text-slate-600 px-3 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    Verify & Discover Accounts
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BYOK Quick Connect Modal (Generic) */}
        {showQuickModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Direct Page Access Token Connect</h3>
                </div>
                <button onClick={() => setShowQuickModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleQuickConnect} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Platform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirectPlatform('FACEBOOK')}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border ${
                        directPlatform === 'FACEBOOK' ? 'border-[#1877F2] bg-blue-50 text-[#1877F2]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Facebook className="w-3.5 h-3.5 fill-current" />
                      <span>Facebook Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectPlatform('INSTAGRAM')}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border ${
                        directPlatform === 'INSTAGRAM' ? 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Meta Graph Access Token
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={directToken}
                    onChange={(e) => setDirectToken(e.target.value)}
                    placeholder="EAAB... (Paste User or Page Access Token)"
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tokens are verified via Meta /debug_token and encrypted at rest with AES-256-GCM.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Account Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={accountNameCustom}
                    onChange={(e) => setAccountNameCustom(e.target.value)}
                    placeholder="e.g. Main Brand Page"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowQuickModal(false)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connecting || !directToken.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {connecting ? 'Verifying...' : 'Verify & Encrypt Connect'}
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
