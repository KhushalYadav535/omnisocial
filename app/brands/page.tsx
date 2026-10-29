'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Layers,
  Building2,
  Plus,
  Bot,
  CheckCircle2,
  AlertCircle,
  Save,
  BookOpen,
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function BrandsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);

  // Brand Voice Form
  const [tone, setTone] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyTerminology, setKeyTerminology] = useState('');
  const [bannedKeywords, setBannedKeywords] = useState('');
  const [standardFaqs, setStandardFaqs] = useState('');
  const [responseGuidelines, setResponseGuidelines] = useState('');

  // New Business & Brand Modals
  const [showNewBizModal, setShowNewBizModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizIndustry, setNewBizIndustry] = useState('');

  const [showNewBrandModal, setShowNewBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandBizId, setNewBrandBizId] = useState('');

  const [savingVoice, setSavingVoice] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [bizRes, brandRes] = await Promise.all([
        apiRequest('/businesses'),
        apiRequest('/brands')
      ]);

      setBusinesses(bizRes.businesses || []);
      setBrands(brandRes.brands || []);

      if (brandRes.brands && brandRes.brands.length > 0) {
        if (!selectedBrand) {
          selectBrandItem(brandRes.brands[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
    }
  };

  const selectBrandItem = (brand: any) => {
    setSelectedBrand(brand);
    const vp = brand.voiceProfile;
    setTone(vp?.tone || '');
    setWritingStyle(vp?.writingStyle || '');
    setTargetAudience(vp?.targetAudience || '');
    setKeyTerminology(vp?.keyTerminology || '');
    setBannedKeywords(vp?.bannedKeywords || '');
    setStandardFaqs(vp?.standardFaqs || '');
    setResponseGuidelines(vp?.responseGuidelines || '');
    setNotice(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveVoice = async () => {
    if (!selectedBrand) return;
    setSavingVoice(true);
    setNotice(null);

    try {
      await apiRequest(`/brands/${selectedBrand.id}/voice`, {
        method: 'PUT',
        body: JSON.stringify({
          tone,
          writingStyle,
          targetAudience,
          keyTerminology,
          bannedKeywords,
          standardFaqs,
          responseGuidelines
        })
      });

      setNotice({ type: 'success', text: `Brand Voice Profile for "${selectedBrand.name}" updated successfully!` });
      fetchData();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to update voice profile' });
    } finally {
      setSavingVoice(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/businesses', {
        method: 'POST',
        body: JSON.stringify({ name: newBizName, industry: newBizIndustry })
      });
      setShowNewBizModal(false);
      setNewBizName('');
      setNewBizIndustry('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/brands', {
        method: 'POST',
        body: JSON.stringify({ businessId: newBrandBizId, name: newBrandName })
      });
      setShowNewBrandModal(false);
      setNewBrandName('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AppLayout activeBrandId={selectedBrand?.id} onBrandChange={(id) => {
      const b = brands.find(item => item.id === id);
      if (b) selectBrandItem(b);
    }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
                [ BRAND VOICE SENTINEL // ZERO HALLUCINATIONS ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Persona Rulebook</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center space-x-2">
              <span>Brand Guidelines & Voice Master</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize multiple client enterprises, define AI persona guardrails, tone, FAQs, and banned words.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowNewBizModal(true)}
              className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>+ New Business</span>
            </button>
            <button
              onClick={() => {
                if (businesses.length > 0) setNewBrandBizId(businesses[0].id);
                setShowNewBrandModal(true);
              }}
              className="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Brand</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* 2-Pane: Brands List (4 cols) & Brand Voice Engine (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Businesses & Brands (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Client Brands Catalog ({brands.length})
              </h3>
              <div className="space-y-2">
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => selectBrandItem(b)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center space-x-3 ${
                      selectedBrand?.id === b.id
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={b.logoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{b.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{b.businessName}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.2 rounded-sm border border-indigo-100">
                        {b.accountsCount || 0} Accounts Connected
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Voice & Persona Profile Editor (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
            {selectedBrand ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        AI Persona & Voice Profile: {selectedBrand.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        These instructions govern all AI suggestions generated in the Unified Inbox and Content Studio.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveVoice}
                    disabled={savingVoice}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingVoice ? 'Saving...' : 'Save Voice Profile'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tone of Voice
                    </label>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="e.g. Trendy, energetic, warm, polite, and aspirational"
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Writing Style & Emojis
                    </label>
                    <input
                      type="text"
                      value={writingStyle}
                      onChange={(e) => setWritingStyle(e.target.value)}
                      placeholder="e.g. Conversational with friendly emojis (✨, 🌿, 💛)"
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Audience Persona
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Fashion-conscious young adults aged 22-38 looking for resort comfort"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Banned Words / Safety Guardrails (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={bannedKeywords}
                    onChange={(e) => setBannedKeywords(e.target.value)}
                    placeholder="cheap, bargain, substandard, fake, impossible"
                    className="w-full text-xs border border-rose-200 bg-rose-50/30 rounded-lg p-2.5 text-rose-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    The AI Reply Assistant will strictly avoid these keywords in suggestions.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Standard FAQs & Company Knowledge (Markdown)
                  </label>
                  <textarea
                    rows={4}
                    value={standardFaqs}
                    onChange={(e) => setStandardFaqs(e.target.value)}
                    placeholder="Q: What is the return policy?&#10;A: 7-day hassle-free exchange on unwashed items with tags."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specific Response Guidelines for Human Agents
                  </label>
                  <textarea
                    rows={3}
                    value={responseGuidelines}
                    onChange={(e) => setResponseGuidelines(e.target.value)}
                    placeholder="Always greet warmly by name. In sizing or exchange issues, invite customer to DM their Order ID."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">Select a brand to configure voice rules.</div>
            )}
          </div>
        </div>

        {/* Modal: New Business */}
        {showNewBizModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Business</h3>
              <form onSubmit={handleCreateBusiness} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="Acme Global Retail"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={newBizIndustry}
                    onChange={(e) => setNewBizIndustry(e.target.value)}
                    placeholder="E-Commerce & Apparel"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowNewBizModal(false)} className="text-xs font-semibold text-slate-600 px-3 py-2">Cancel</button>
                  <button type="submit" className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg">Create Business</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Brand */}
        {showNewBrandModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Brand</h3>
              <form onSubmit={handleCreateBrand} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Business</label>
                  <select
                    value={newBrandBizId}
                    onChange={(e) => setNewBrandBizId(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white"
                  >
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Aura Eco Wear"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowNewBrandModal(false)} className="text-xs font-semibold text-slate-600 px-3 py-2">Cancel</button>
                  <button type="submit" className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg">Create Brand</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

