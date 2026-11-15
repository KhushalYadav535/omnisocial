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
        if (res.progress.stage1Data) setStage1Data(res.progress.stage1Data);
        if (res.progress.stage2Data) setStage2Data(res.progress.stage2Data);
        if (res.progress.stage3Data) setStage3Data(res.progress.stage3Data);
        if (res.progress.stage4Data) setStage4Data(res.progress.stage4Data);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                🚀
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Dual Operating Mode
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Brand Marketing Launchpad</h2>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              From zero to launched in 4 steps. Establish an intentional strategy, balanced content pillars, and your first 7-day sprint campaign.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-purple-300 block font-medium">Stage Progress</span>
            <span className="text-2xl font-black text-amber-300">{currentStage} / 4</span>
          </div>
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

      {/* STAGE STEPPER NAV */}
      <div className="grid grid-cols-4 gap-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = currentStage === st.num;
          const isDone = currentStage > st.num;
          return (
            <button
              key={st.num}
              onClick={() => setCurrentStage(st.num)}
              className={`p-3 rounded-xl border text-left transition flex items-center space-x-2.5 ${
                isActive
                  ? 'bg-purple-50 border-purple-400 shadow-xs ring-1 ring-purple-300'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : isDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : st.num}
              </div>
              <div className="hidden sm:block truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                  Stage {st.num}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">{st.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* STAGE FORM CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        {/* STAGE 1: AUDIENCE & INDUSTRY */}
        {currentStage === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Stage 1: Brand & Audience Core</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define who you serve and what primary pain points your content will solve.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Industry / Niche</label>
                <input
                  type="text"
                  value={stage1Data.industry}
                  onChange={(e) => setStage1Data({ ...stage1Data, industry: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Customer Profile</label>
                <textarea
                  rows={3}
                  value={stage1Data.targetAudience}
                  onChange={(e) => setStage1Data({ ...stage1Data, targetAudience: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Customer Pain Points</label>
                <textarea
                  rows={3}
                  value={stage1Data.primaryPainPoint}
                  onChange={(e) => setStage1Data({ ...stage1Data, primaryPainPoint: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: VALUE PROPOSITION & POSITIONING */}
        {currentStage === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Stage 2: Value Proposition & Unique Positioning</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Anchor your brand's unique differentiation and why customers choose you over competitors.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Brand Positioning Statement</label>
                <textarea
                  rows={3}
                  value={stage2Data.positioning}
                  onChange={(e) => setStage2Data({ ...stage2Data, positioning: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Core Value Proposition</label>
                <textarea
                  rows={2}
                  value={stage2Data.valueProposition}
                  onChange={(e) => setStage2Data({ ...stage2Data, valueProposition: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Differentiator</label>
                <input
                  type="text"
                  value={stage2Data.differentiator}
                  onChange={(e) => setStage2Data({ ...stage2Data, differentiator: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: CONTENT PILLARS & CADENCE */}
        {currentStage === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Stage 3: Content Pillars & Publishing Cadence</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Balance thematic pillars (Target: 100% total) and set weekly output volume.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage3Data.pillars.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-slate-800 text-xs block">{p.title}</span>
                    <div className="flex items-center space-x-2">
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
                        className="flex-1 accent-purple-600"
                      />
                      <span className="font-mono font-bold text-slate-700">{p.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Posts Per Week</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={stage3Data.weeklyCadence}
                  onChange={(e) => setStage3Data({ ...stage3Data, weeklyCadence: Number(e.target.value) })}
                  className="w-32 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: LAUNCH SPRINT */}
        {currentStage === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Stage 4: Initial Launch Sprint & Deliverables</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your 7-day launch sprint. Once deployed, Omnisocial initializes your strategy, pillars, and draft posts.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Campaign Sprint Name</label>
                  <input
                    type="text"
                    value={stage4Data.campaignName}
                    onChange={(e) => setStage4Data({ ...stage4Data, campaignName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={stage4Data.sprintDurationDays}
                    onChange={(e) => setStage4Data({ ...stage4Data, sprintDurationDays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Planned Sequential Deliverables</label>
                <div className="space-y-2">
                  {stage4Data.deliverables.map((deliv, idx) => (
                    <div key={idx} className="p-2.5 bg-purple-50/60 border border-purple-200 rounded-lg text-slate-800 flex items-center space-x-2 font-medium">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER CONTROLS */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStage > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStage(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full flex items-center space-x-1.5 transition"
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
              className="px-6 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-md flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDeployFoundation}
              disabled={isDeploying}
              className="px-8 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-95 rounded-full shadow-xl flex items-center space-x-2 transition cursor-pointer transform hover:scale-105"
            >
              {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4 animate-bounce" />}
              <span>{isDeploying ? 'Deploying Foundation...' : 'Deploy Brand Foundation Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
