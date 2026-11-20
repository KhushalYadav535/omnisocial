'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Target,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Tag,
  Layers,
  Trash2
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface CampaignsTabProps {
  brandId: string;
  onNavigateTab?: (tabId: string) => void;
  onLoadComposerData?: (data: { caption: string; title?: string; hashtags?: string[]; format?: string }) => void;
  onRefreshOverview?: () => void;
}

export default function CampaignsTab({ brandId, onNavigateTab, onLoadComposerData, onRefreshOverview }: CampaignsTabProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Campaign Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('PRODUCT_LAUNCH');
  const [targetAudience, setTargetAudience] = useState('');
  const [coreMessage, setCoreMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Brief generator modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiProductBrief, setAiProductBrief] = useState('');

  const fetchCampaigns = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`/content-studio/campaigns?brandId=${brandId}`);
      setCampaigns(res.campaigns || []);
    } catch (err: any) {
      console.error('Fetch campaigns error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [brandId]);

  const handleAiGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !aiProductBrief.trim()) return;
    setIsGenerating(true);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/campaigns/ai-generate-brief', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          productBrief: aiProductBrief.trim(),
          goal
        })
      });

      setCampaigns(prev => [res.campaign, ...prev]);
      setShowAiModal(false);
      setAiProductBrief('');
      setNotification({ type: 'success', message: 'Campaign sprint synthesized and planned by AI!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('AI campaign brief error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to synthesize campaign brief.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !name.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest('/content-studio/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          name: name.trim(),
          description: description.trim(),
          goal,
          targetAudience,
          coreMessage,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null
        })
      });

      setCampaigns(prev => [res.campaign, ...prev]);
      setShowAddModal(false);
      setName('');
      setDescription('');
      setTargetAudience('');
      setCoreMessage('');
      setStartDate('');
      setEndDate('');
      setNotification({ type: 'success', message: 'Campaign created!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Create campaign error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to create campaign.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await apiRequest(`/content-studio/campaigns/${campaignId}`, { method: 'DELETE' });
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      setNotification({ type: 'success', message: 'Campaign deleted successfully.' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Delete campaign error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to delete campaign.' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Level 2: Campaigns
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {isLoading ? 'Loading campaigns...' : `${campaigns.length} Total Campaigns`}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Campaign Sprints & Roadmaps</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate multi-week sprints, product drops, and thematic campaigns with structured deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full shadow-md flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Synthesize Campaign</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border shadow-2xs ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* CAMPAIGNS GRID */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <span className="text-xs">Loading campaigns...</span>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                    {(camp.goal || 'CAMPAIGN').replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {camp.status || 'DRAFT'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                    {(camp.name || 'Campaign').replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {camp.description ? camp.description.replace(/_/g, ' ') : 'Campaign sprint deliverables and key messaging.'}
                  </p>
                </div>

                {camp.coreMessage && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Core Message:</span>
                    <span className="text-slate-600 italic">"{camp.coreMessage.replace(/_/g, ' ')}"</span>
                  </div>
                )}

                {/* Sprint dates */}
                {(camp.startDate || camp.endDate) && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {camp.startDate ? new Date(camp.startDate).toLocaleDateString() : 'Now'} —{' '}
                      {camp.endDate ? new Date(camp.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  </div>
                )}

                {/* Deliverables snippet */}
                {camp.deliverables && Array.isArray(camp.deliverables) && camp.deliverables.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Deliverables ({camp.deliverables.length})
                    </span>
                    <div className="space-y-1">
                      {camp.deliverables.slice(0, 3).map((d: any, dIdx: number) => (
                        <div key={dIdx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{typeof d === 'string' ? d : d.title || d.day || 'Post'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {camp.contents?.length || 0} Connected Posts
                </span>
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {(onNavigateTab || onLoadComposerData) && (
                    <button
                      onClick={() => {
                        const cleanCampName = (camp.name || 'Campaign').replace(/_/g, ' ').trim();
                        const cleanAudience = camp.targetAudience
                          ? (camp.targetAudience.toLowerCase().startsWith('target')
                              ? camp.targetAudience
                              : `Targeting ${camp.targetAudience}`)
                          : 'Brand growth';

                        if (onLoadComposerData) {
                          onLoadComposerData({
                            title: `[${cleanCampName}] Campaign Drop`,
                            caption: `🚀 ${cleanCampName}: ${camp.coreMessage || camp.description || 'Campaign update'}\n\nKey Focus: ${cleanAudience}\n\n#${cleanCampName.replace(/[^a-zA-Z0-9]/g, '')} #CampaignLaunch`,
                            format: 'POST'
                          });
                        } else if (onNavigateTab) {
                          onNavigateTab('composer');
                        }
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Create Post</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Campaigns Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Campaigns organize multi-day product launches, promotional pushes, and event marketing sprints.
          </p>
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-full shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Synthesize Campaign Brief</span>
          </button>
        </div>
      )}

      {/* AI CAMPAIGN SYNTHESIZER MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">AI Campaign Brief Synthesizer</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAiGenerateBrief} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product / Campaign Brief *</label>
                <textarea
                  required
                  rows={4}
                  value={aiProductBrief}
                  onChange={(e) => setAiProductBrief(e.target.value)}
                  placeholder="e.g. Launching our new zero-sugar organic sparkling matcha can. Want a 7-day sprint covering teaser, hook, problem awareness, social proof, and launch offer."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campaign Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  <option value="PRODUCT_LAUNCH">Product Launch</option>
                  <option value="LEAD_GENERATION">Lead Generation</option>
                  <option value="BRAND_AWARENESS">Brand Awareness</option>
                  <option value="HOLIDAY_PROMOTION">Holiday / Seasonal Event</option>
                  <option value="COMMUNITY_GROWTH">Community Growth</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !aiProductBrief.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition"
                >
                  {isGenerating ? 'Synthesizing Roadmap...' : 'Synthesize Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ADD CAMPAIGN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">New Campaign Sprint</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Resort Drop 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Core Key Message</label>
                <input
                  type="text"
                  value={coreMessage}
                  onChange={(e) => setCoreMessage(e.target.value)}
                  placeholder="e.g. Breathe easy with sustainable luxury linen."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition"
                >
                  {isSubmitting ? 'Saving...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
