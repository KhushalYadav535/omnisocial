'use client';

import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  ShieldCheck,
  Target,
  Compass,
  Layers,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../../lib/api';

interface LaunchpadTabProps {
  brandId: string;
  onNavigateTab: (tabId: string) => void;
  onRefreshOverview?: () => void;
}

export default function LaunchpadTab({
  brandId,
  onNavigateTab,
  onRefreshOverview
}: LaunchpadTabProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Wizard Data State
  const [stage1Data, setStage1Data] = useState({
    targetAudience: 'Early-stage founders and modern growth marketers seeking automated multi-channel presence',
    industry: 'B2B SaaS / Marketing Tech',
    primaryPainPoint: 'Inconsistent posting, lack of unified brand strategy, manual copywriting burnout'
  });

  const [stage2Data, setStage2Data] = useState({
    positioning: 'For growing brands and marketing agencies, our product is the intelligent content studio that turns high-level business goals into cross-platform campaigns.',
    valueProposition: 'Automate viral copy, carousel decks, and video reels with continuous strategy alignment.',
    differentiator: 'Outcome-first skill orchestration that keeps content anchored to business outcomes.'
  });

  const [stage3Data, setStage3Data] = useState({
    pillars: [
      { title: 'Industry Insights & Thought Leadership', percentage: 40 },
      { title: 'Product Walkthroughs & Use Cases', percentage: 30 },
      { title: 'Social Proof & Customer Wins', percentage: 20 },
      { title: 'Behind the Scenes & Brand Culture', percentage: 10 }
    ],
    weeklyCadence: 4
  });

  const [stage4Data, setStage4Data] = useState({
    campaignName: 'Official Brand Launch Sprint',
    campaignGoal: 'PRODUCT_LAUNCH',
    sprintDurationDays: 7,
    deliverables: [
      'Day 1: Problem Awareness & Founder Backstory Post',
      'Day 3: LinkedIn Carousel Deck on Industry Pain Points',
      'Day 5: Product Solution Deep-Dive with Visual Demo',
      'Day 7: Launch Offer & Direct Call-to-Action'
    ]
  });

  const fetchProgress = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`/content-studio/launchpad?brandId=${brandId}`);
      if (res.progress) {
        if (res.progress.currentStage) setCurrentStage(res.progress.currentStage);
        if (res.progress.stage1Data) setStage1Data(prev => ({ ...prev, ...res.progress.stage1Data }));
        if (res.progress.stage2Data) setStage2Data(prev => ({ ...prev, ...res.progress.stage2Data }));
        if (res.progress.stage3Data) {
          const rawPillars = res.progress.stage3Data.pillars || res.progress.stage3Data.corePillars;
          setStage3Data(prev => ({
            pillars: Array.isArray(rawPillars) && rawPillars.length > 0 ? rawPillars : prev.pillars,
            weeklyCadence: res.progress.stage3Data.weeklyCadence || prev.weeklyCadence
          }));
        }
        if (res.progress.stage4Data) {
          const rawDeliv = res.progress.stage4Data.deliverables;
          setStage4Data(prev => ({
            ...prev,
            ...res.progress.stage4Data,
            deliverables: Array.isArray(rawDeliv) && rawDeliv.length > 0 ? rawDeliv : prev.deliverables
          }));
        }
      }
    } catch (err: any) {
      console.error('Fetch launchpad error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [brandId]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const handleSaveStep = async (nextStage: number) => {
    if (!brandId) return;
    setIsSavingStep(true);
    try {
      let data = {};
      if (currentStage === 1) data = stage1Data;
      else if (currentStage === 2) data = stage2Data;
      else if (currentStage === 3) data = stage3Data;
      else if (currentStage === 4) data = stage4Data;

      await apiRequest('/content-studio/launchpad/step', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          stage: currentStage,
          data
        })
      });

      setCurrentStage(nextStage);
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save stage.' });
    } finally {
      setIsSavingStep(false);
    }
  };

  const handleDeployFoundation = async () => {
    if (!brandId) return;
    setIsDeploying(true);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/launchpad/deploy', {
        method: 'POST',
        body: JSON.stringify({ brandId })
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setNotification({
        type: 'success',
        message: '🎉 Brand Foundation Successfully Deployed! Strategy approved, 4 Pillars configured, and Launch Campaign created.'
      });

      if (onRefreshOverview) onRefreshOverview();
      setTimeout(() => onNavigateTab('overview'), 2500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to deploy foundation.' });
    } finally {
      setIsDeploying(false);
    }
  };

  const stages = [
    { num: 1, title: 'Audience Core', icon: Target },
    { num: 2, title: 'Value & Positioning', icon: Compass },
    { num: 3, title: 'Pillars & Cadence', icon: Layers },
    { num: 4, title: 'Launch Sprint', icon: Calendar },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* CADRA HERO BENTO CARD */}
      <div className="bg-[#111215] text-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs">
                <Rocket className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Brand Launchpad
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Brand Marketing Launchpad
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl font-normal leading-relaxed">
              From zero to launched in 4 steps. Establish an intentional strategy, balanced content pillars, and your first 7-day sprint campaign.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-right shrink-0 min-w-[120px]">
            <span className="text-[10px] text-neutral-400 block font-mono uppercase tracking-wider">Stage Progress</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">{currentStage} / 4</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${(currentStage / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 border shadow-2xs ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* CADRA SEGMENTED STAGE STEPPER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = currentStage === st.num;
          const isDone = currentStage > st.num;
          return (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStage(st.num)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-3 ${
                isActive
                  ? 'bg-white border-black/[0.12] shadow-sm text-neutral-900'
                  : isDone
                  ? 'bg-neutral-100/90 border-black/[0.04] text-neutral-700 hover:bg-neutral-100'
                  : 'bg-white/60 border-black/[0.04] text-neutral-400 hover:bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#111215] text-white shadow-xs'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : st.num}
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider block text-neutral-400">
                  Stage {st.num}
                </span>
                <span className="text-xs font-bold text-neutral-900 truncate block mt-0.5">{st.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* STAGE FORM CARD */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        {/* STAGE 1: AUDIENCE & INDUSTRY */}
        {currentStage === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1012] tracking-tight">Stage 1: Brand &amp; Audience Core</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Define who you serve and what primary pain points your content will solve.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Industry / Niche</label>
                <input
                  type="text"
                  value={stage1Data.industry}
                  onChange={(e) => setStage1Data({ ...stage1Data, industry: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Target Customer Profile</label>
                <textarea
                  rows={3}
                  value={stage1Data.targetAudience}
                  onChange={(e) => setStage1Data({ ...stage1Data, targetAudience: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Primary Customer Pain Points</label>
                <textarea
                  rows={3}
                  value={stage1Data.primaryPainPoint}
                  onChange={(e) => setStage1Data({ ...stage1Data, primaryPainPoint: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: VALUE PROPOSITION & POSITIONING */}
        {currentStage === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1012] tracking-tight">Stage 2: Value Proposition &amp; Unique Positioning</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Anchor your brand's unique differentiation and why customers choose you over competitors.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Brand Positioning Statement</label>
                <textarea
                  rows={3}
                  value={stage2Data.positioning}
                  onChange={(e) => setStage2Data({ ...stage2Data, positioning: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Core Value Proposition</label>
                <textarea
                  rows={2}
                  value={stage2Data.valueProposition}
                  onChange={(e) => setStage2Data({ ...stage2Data, valueProposition: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Primary Differentiator</label>
                <input
                  type="text"
                  value={stage2Data.differentiator}
                  onChange={(e) => setStage2Data({ ...stage2Data, differentiator: e.target.value })}
                  className="w-full p-3 bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: CONTENT PILLARS & CADENCE */}
        {currentStage === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1012] tracking-tight">Stage 3: Content Pillars &amp; Publishing Cadence</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Balance thematic pillars (Target: 100% total) and set weekly output volume.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(stage3Data?.pillars || []).map((p, idx) => (
                  <div key={idx} className="p-4 bg-[#F4F5F7] border border-black/[0.04] rounded-2xl space-y-2">
                    <span className="font-bold text-neutral-900 text-xs block">{p.title}</span>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="5"
                        max="70"
                        step="5"
                        value={p.percentage}
                        onChange={(e) => {
                          const updated = [...stage3Data.pillars];
                          updated[idx].percentage = Number(e.target.value);
                          setStage3Data({ ...stage3Data, pillars: updated });
                        }}
                        className="flex-1 accent-neutral-900"
                      />
                      <span className="font-mono font-bold text-neutral-800 bg-white px-2 py-0.5 rounded-md border border-black/[0.05]">{p.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Target Posts Per Week</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={stage3Data.weeklyCadence}
                  onChange={(e) => setStage3Data({ ...stage3Data, weeklyCadence: Number(e.target.value) })}
                  className="w-32 p-3 bg-[#F4F5F7] border border-neutral-200/90 rounded-2xl text-neutral-900 font-bold focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: LAUNCH SPRINT */}
        {currentStage === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1012] tracking-tight">Stage 4: Initial Launch Sprint &amp; Deliverables</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Review your 7-day launch sprint. Once deployed, Omnisocial initializes your strategy, pillars, and draft posts.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1.5">Campaign Sprint Name</label>
                  <input
                    type="text"
                    value={stage4Data.campaignName}
                    onChange={(e) => setStage4Data({ ...stage4Data, campaignName: e.target.value })}
                    className="w-full p-3 bg-[#F4F5F7] border border-neutral-200/90 rounded-2xl text-neutral-900 font-bold focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    value={stage4Data.sprintDurationDays}
                    onChange={(e) => setStage4Data({ ...stage4Data, sprintDurationDays: Number(e.target.value) })}
                    className="w-full p-3 bg-[#F4F5F7] border border-neutral-200/90 rounded-2xl text-neutral-900 font-bold focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">Planned Sequential Deliverables</label>
                <div className="space-y-2">
                  {(stage4Data?.deliverables || []).map((deliv, idx) => (
                    <div key={idx} className="p-3 bg-[#F4F5F7] border border-black/[0.04] rounded-2xl text-neutral-800 flex items-center space-x-2.5 font-medium">
                      <div className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        ✓
                      </div>
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER CONTROLS */}
        <div className="pt-5 border-t border-neutral-100 flex items-center justify-between">
          {currentStage > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStage(prev => prev - 1)}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-black/[0.08] rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStage < 4 ? (
            <button
              type="button"
              onClick={() => handleSaveStep(currentStage + 1)}
              disabled={isSavingStep}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-md flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDeployFoundation}
              disabled={isDeploying}
              className="px-8 py-3 text-xs font-bold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-lg flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              <span>{isDeploying ? 'Deploying Foundation...' : 'Deploy Brand Foundation Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
