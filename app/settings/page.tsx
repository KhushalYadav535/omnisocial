'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
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
  Globe
} from 'lucide-react';

export default function SettingsPage() {
  const [tenantName, setTenantName] = useState('');
  const [domain, setDomain] = useState('');
  const [customMetaAppId, setCustomMetaAppId] = useState('');
  const [customMetaAppSecret, setCustomMetaAppSecret] = useState('');
  const [customAiApiKey, setCustomAiApiKey] = useState('');
  const [customAiProvider, setCustomAiProvider] = useState('GEMINI');

  const [hasSecretSet, setHasSecretSet] = useState(false);
  const [hasAiKeySet, setHasAiKeySet] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

      setNotice({ type: 'success', text: 'Tenant settings and BYOK credentials saved successfully!' });
      setCustomMetaAppSecret('');
      setCustomAiApiKey('');
      fetchSettings();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-200/80">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
              [ TENANT GOVERNANCE // BYOK CREDENTIAL VAULT ]
            </span>
            <span className="text-xs text-slate-400 font-mono">• AES-256 Encrypted</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center space-x-2">
            <span>Workspace Settings & BYOK Keys</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure agency details, Bring-Your-Own-Key (BYOK) Meta credentials, and platform webhook endpoints.
          </p>
        </div>

        {notice && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Workspace Profile */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Agency / Organization Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tenant Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Domain / Subdomain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="agency.omnisocial.io"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* BYOK: Meta Custom App Credentials */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Custom Meta Developer App (BYOK)</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
                Optional: Whitelabel OAuth
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              If left blank, your tenant automatically uses the platform's default Meta OAuth application. 
              If you provide your own Meta App ID and Secret, the Facebook Login consent screen will show your custom agency brand name.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Meta App ID
                </label>
                <input
                  type="text"
                  value={customMetaAppId}
                  onChange={(e) => setCustomMetaAppId(e.target.value)}
                  placeholder="e.g. 109284910294819"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Custom Meta App Secret</span>
                  {hasSecretSet && (
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Secret Saved on Server</span>
                  )}
                </label>
                <input
                  type="password"
                  value={customMetaAppSecret}
                  onChange={(e) => setCustomMetaAppSecret(e.target.value)}
                  placeholder={hasSecretSet ? '•••••••••••••••• (Leave blank to keep current)' : 'Enter App Secret'}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>
          </div>

          {/* BYOK: AI Model Engine */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Custom AI Provider & Key (BYOK)</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  AI Model Provider
                </label>
                <select
                  value={customAiProvider}
                  onChange={(e) => setCustomAiProvider(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                >
                  <option value="GEMINI">Google Gemini 1.5 / 2.0 Pro</option>
                  <option value="OPENAI">OpenAI GPT-4o</option>
                  <option value="ANTHROPIC">Anthropic Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>AI API Key</span>
                  {hasAiKeySet && (
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Key Configured</span>
                  )}
                </label>
                <input
                  type="password"
                  value={customAiApiKey}
                  onChange={(e) => setCustomAiApiKey(e.target.value)}
                  placeholder={hasAiKeySet ? '•••••••••••••••• (Leave blank to keep current)' : 'AIzaSy... / sk-...'}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Webhook Configuration for Meta Developer Portal */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Meta Webhook Endpoints</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Use these values in your Meta Developer App under <strong>Webhooks &gt; Page &gt; Edit Subscription</strong> for real-time comment and DM notifications:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase">Callback URL</span>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value="http://localhost:5000/api/webhooks/meta"
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard('http://localhost:5000/api/webhooks/meta', 'url')}
                    className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase">Verify Token</span>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value="social_media_secure_verify_token_2026"
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard('social_media_secure_verify_token_2026', 'token')}
                    className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save Tenant Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

