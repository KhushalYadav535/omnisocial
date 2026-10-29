'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Check
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

  // Quick Connect Modal State (BYOK)
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
      const callbackRes = await apiRequest('/social-accounts/oauth-callback', {
        method: 'POST',
        body: JSON.stringify({ code, state })
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

      // Pre-select all discovered accounts by default
      const initialSelections: Record<string, AccountSelectionState> = {};
      callbackRes.discoveredAccounts.forEach((acc: DiscoveredAccount) => {
        initialSelections[acc.pageId] = {
          pageId: acc.pageId,
          connectFacebook: true,
          connectInstagram: acc.hasInstagram
        };
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

    // Check if user returned via full-page redirect
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

  // 1-Click Meta OAuth Initiation
  const handleOneClickOAuth = async () => {
    if (!activeBrandId) {
      alert('Please select a target brand first.');
      return;
    }

    setConnecting(true);
    setNotice(null);

    try {
      const res = await apiRequest(`/social-accounts/oauth-url?brandId=${activeBrandId}`);
      if (res.oauthUrl) {
        // Open OAuth dialog in popup window
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
          // Popup blocked - fall back to full redirect or manual code entry
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

  // Confirm and persist selected accounts
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

  // Direct Token Verification (BYOK Mode)
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Share2 className="w-6 h-6 text-indigo-600" />
              <span>Facebook Pages & Instagram Accounts</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enterprise Meta Graph API integration with AES-256-GCM token encryption, multi-page discovery, and live inbox publishing.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQuickModal(true)}
              className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <Key className="w-4 h-4 text-slate-500" />
              <span>BYOK Quick Token</span>
            </button>
            <button
              onClick={handleOneClickOAuth}
              disabled={connecting}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Facebook className="w-4 h-4" />
              <span>{connecting ? 'Connecting...' : 'Connect Facebook & Instagram'}</span>
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
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Social Accounts Connected Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connect your brand&apos;s Facebook Pages and Instagram Professional accounts using 1-Click Meta OAuth to start publishing and managing comments.
            </p>
            <button
              onClick={handleOneClickOAuth}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-xs transition"
            >
              Connect Facebook & Instagram
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={acc.profilePicUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        alt=""
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{acc.accountName}</h3>
                        <p className="text-xs text-slate-400">@{acc.username || acc.platformAccountId}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {acc.pageCategory || 'Brand Asset'}
                        </span>
                      </div>
                    </div>

                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                      acc.platform === 'INSTAGRAM' ? 'bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600' : 'bg-blue-600'
                    }`}>
                      {acc.platform === 'INSTAGRAM' ? <Instagram className="w-4 h-4" /> : <Facebook className="w-4 h-4" />}
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

        {/* Multi-Account Discovery Modal */}
        {showDiscoveryModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Select Accounts to Connect</h3>
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

              <div className="space-y-3">
                {discoveredList.map((page) => {
                  const selection = accountSelections[page.pageId] || {
                    pageId: page.pageId,
                    connectFacebook: true,
                    connectInstagram: page.hasInstagram
                  };

                  return (
                    <div key={page.pageId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
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
                      {page.hasInstagram && page.instagramAccount && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 pl-6 flex items-center justify-between bg-white/70 p-2.5 rounded-lg">
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
                            <span className="text-xs font-semibold text-slate-700">Connect IG</span>
                          </label>
                        </div>
                      )}
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
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
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
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
                    <div className="p-3 rounded-lg border bg-slate-50 space-y-1.5">
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
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
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
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
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
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5"
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
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5"
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
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Verify & Discover Accounts
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BYOK Quick Connect Modal */}
        {showQuickModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
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
                      className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 border ${
                        directPlatform === 'FACEBOOK' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      <span>Facebook Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectPlatform('INSTAGRAM')}
                      className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 border ${
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
                    className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
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
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
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
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50"
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
