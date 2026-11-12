'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Zap,
  Plus,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Play,
  Sparkles,
  Link2,
  Copy,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Check,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AutomationsPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brands, setBrands] = useState<any[]>([]);
  const [funnels, setFunnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Funnel Modal
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('2026 AI Growth Blueprint Funnel');
  const [triggerKeyword, setTriggerKeyword] = useState('GROWTH');
  const [matchType, setMatchType] = useState<'CONTAINS' | 'EXACT'>('CONTAINS');
  const [publicReply, setPublicReply] = useState('Sent straight to your inbox {name}! Check your DMs 🚀');
  const [dmMessage, setDmMessage] = useState('Hey {name}! Here is your complete 2026 AI Growth Blueprint Guide as promised.');
  const [assetUrl, setAssetUrl] = useState('https://omnisocial.ai/downloads/ai-growth-2026.pdf');

  // Simulator Drawer
  const [simulatorFunnel, setSimulatorFunnel] = useState<any | null>(null);
  const [simComment, setSimComment] = useState('Commented: Please send me the GROWTH blueprint!');
  const [simName, setSimName] = useState('Alex Morgan');
  const [simResult, setSimResult] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    apiRequest('/brands')
      .then(res => {
        if (res.brands && res.brands.length > 0) {
          setBrands(res.brands);
          setActiveBrandId(res.brands[0].id);
        }
      })
      .catch(() => { });
  }, []);

  const loadFunnels = async (brandIdToUse?: string) => {
    const bId = brandIdToUse || activeBrandId;
    if (!bId) return;
    try {
      setLoading(true);
      const res = await apiRequest(`/lead-funnels?brandId=${bId}`);
      setFunnels(res.funnels || []);
    } catch (err: any) {
      console.warn('Failed to load lead funnels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeBrandId) {
      loadFunnels(activeBrandId);
    }
  }, [activeBrandId]);

  const handleCreateFunnel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !triggerKeyword.trim() || !publicReply.trim() || !dmMessage.trim()) return;

    setCreating(true);
    try {
      const res = await apiRequest('/lead-funnels', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          name,
          triggerKeyword,
          matchType,
          publicReply,
          dmMessage,
          assetUrl
        })
      });

      if (res.funnel) {
        setFunnels([res.funnel, ...funnels]);
        setShowModal(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create lead funnel');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (funnelId: string, currentActive: boolean) => {
    try {
      const res = await apiRequest(`/lead-funnels/${funnelId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentActive })
      });
      if (res.funnel) {
        setFunnels(prev => prev.map(f => f.id === funnelId ? res.funnel : f));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteFunnel = async (funnelId: string) => {
    if (!confirm('Are you sure you want to delete this lead funnel rule?')) return;
    try {
      await apiRequest(`/lead-funnels/${funnelId}`, { method: 'DELETE' });
      setFunnels(prev => prev.filter(f => f.id !== funnelId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete funnel');
    }
  };

  const handleRunSimulator = async () => {
    if (!simulatorFunnel) return;
    setSimulating(true);
    setSimResult(null);

    try {
      const res = await apiRequest('/lead-funnels/test-trigger', {
        method: 'POST',
        body: JSON.stringify({
          funnelId: simulatorFunnel.id,
          commenterName: simName,
          simulatedComment: simComment
        })
      });
      setSimResult(res);
      if (res.matched) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      }
    } catch (err: any) {
      alert(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 pt-1">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span>OmniSocial</span>
              <span>›</span>
              <span>Growth</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">Lead Magnet Funnels</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0F1012] tracking-tight mt-1 flex items-center space-x-2.5">
              <span>Comment-to-DM Lead Funnels</span>
              <span className="text-xs font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                ManyChat Style
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Automatically detect keywords on your posts, post an algorithmic public reply, and instant-deliver DM lead magnets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-md flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Lead Funnel</span>
          </button>
        </div>

        {/* Funnels List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading Automation Rules...</p>
          </div>
        ) : funnels.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
              <Bot className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">No Lead Funnels Created Yet</h3>
              <p className="text-xs text-slate-500">
                Create your first rule: when someone comments "GROWTH" or "AI", the bot will automatically reply and deliver your PDF guide directly into their DMs!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xs inline-flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Rule</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funnels.map(funnel => (
              <div
                key={funnel.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-xs font-extrabold text-slate-900">{funnel.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Keyword: "{funnel.triggerKeyword}"
                    </span>
                  </div>

                  {/* Public Reply Template */}
                  <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-blue-600" />
                      <span>Instant Public Reply</span>
                    </span>
                    <p className="text-xs text-slate-800 font-medium">{funnel.publicReply}</p>
                  </div>

                  {/* DM Payload */}
                  <div className="bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                      <Send className="w-3 h-3 text-indigo-600" />
                      <span>Direct Message (DM) Delivery</span>
                    </span>
                    <p className="text-xs text-slate-800 font-medium">{funnel.dmMessage}</p>
                    {funnel.assetUrl && (
                      <p className="text-[11px] text-indigo-600 underline truncate mt-1">
                        {funnel.assetUrl}
                      </p>
                    )}
                  </div>

                  {/* Stats Counter */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Triggers Dispatched: <strong className="text-slate-800">{funnel.triggersCount} leads</strong></span>
                    <span>Created: {new Date(funnel.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatorFunnel(funnel);
                      setSimResult(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
                    <span>Test Simulator</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(funnel.id, funnel.isActive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${funnel.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {funnel.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFunnel(funnel.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Funnel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SIMULATOR MODAL / DRAWER */}
        {simulatorFunnel && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Lead Magnet Funnel Simulator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulatorFunnel(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Simulated Follower Name:
                  </label>
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Simulated Comment on Post:
                  </label>
                  <input
                    type="text"
                    value={simComment}
                    onChange={(e) => setSimComment(e.target.value)}
                    placeholder={`e.g. Please send me the ${simulatorFunnel.triggerKeyword}!`}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunSimulator}
                  disabled={simulating}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>Simulate Real-Time Trigger</span>
                </button>

                {/* Simulation Output */}
                {simResult && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-3 ${simResult.matched ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'
                    }`}>
                    <div className="flex items-center space-x-2">
                      {simResult.matched ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-emerald-900">Keyword "{simResult.keywordDetected}" Matched! Bot triggered.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span className="font-bold text-rose-900">{simResult.message}</span>
                        </>
                      )}
                    </div>

                    {simResult.matched && (
                      <div className="space-y-2 pt-1">
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">1. Public Comment Reply:</span>
                          <p className="text-xs font-bold text-slate-800 mt-0.5">{simResult.publicReply}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">2. DM Inbound Lead Payload:</span>
                          <p className="text-xs font-medium text-slate-800 whitespace-pre-line mt-0.5">{simResult.directMessageDelivery}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CREATE MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Create New Comment-to-DM Funnel</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFunnel} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Funnel Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Trigger Keyword:
                    </label>
                    <input
                      type="text"
                      value={triggerKeyword}
                      onChange={(e) => setTriggerKeyword(e.target.value.toUpperCase())}
                      placeholder="e.g. AI or GROWTH"
                      required
                      className="w-full text-xs font-mono font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Match Rule:
                    </label>
                    <select
                      value={matchType}
                      onChange={(e) => setMatchType(e.target.value as any)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                    >
                      <option value="CONTAINS">Contains Keyword anywhere</option>
                      <option value="EXACT">Exact Word Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Public Comment Auto-Reply:
                  </label>
                  <input
                    type="text"
                    value={publicReply}
                    onChange={(e) => setPublicReply(e.target.value)}
                    required
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Use {"{name}"} to automatically insert commenter's name.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Direct Message (DM) Content:
                  </label>
                  <textarea
                    rows={2}
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    required
                    className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Download Lead Magnet URL (Optional):
                  </label>
                  <input
                    type="url"
                    value={assetUrl}
                    onChange={(e) => setAssetUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs font-mono border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Activate Lead Funnel</span>
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

