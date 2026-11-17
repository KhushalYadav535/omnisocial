'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface OutcomePromptBarProps {
  brandId: string;
  onNavigateTab: (tabId: string) => void;
  onRefreshData?: () => void;
}

export default function OutcomePromptBar({
  brandId,
  onNavigateTab,
  onRefreshData
}: OutcomePromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  const quickPrompts = [
    { label: 'Draft Marketing Strategy', prompt: 'Create a comprehensive marketing strategy with personas and positioning for our brand', tab: 'strategy' },
    { label: 'Architect Content Pillars', prompt: 'Generate 4 balanced content pillars with distribution percentages and sub-themes', tab: 'pillars' },
    { label: 'Brainstorm 5 Viral Ideas', prompt: 'Brainstorm 5 high-engagement post ideas based on our industry and trends', tab: 'ideas' },
    { label: 'LinkedIn Carousel Deck', prompt: 'Architect a 5-slide educational LinkedIn carousel deck on industry best practices', tab: 'composer' },
    { label: 'Brand Launchpad Wizard', prompt: 'Run Brand Marketing Launchpad to set up our brand foundation from zero', tab: 'launchpad' },
  ];

  const handleOrchestrate = async (customPrompt?: string) => {
    const textToRun = (customPrompt || prompt).trim();
    if (!textToRun) return;
    if (!brandId) {
      setErrorMsg('Please select an active brand first.');
      return;
    }

    setIsOrchestrating(true);
    setErrorMsg(null);
    setExecutionResult(null);

    try {
      const res = await apiRequest('/content-studio/skills/orchestrate', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          intent: textToRun
        })
      });

      setExecutionResult(res);
      if (onRefreshData) onRefreshData();

      // If the intent clearly maps to a tab, recommend switching
      if (res?.plan?.primarySkill) {
        const skill = res.plan.primarySkill;
        if (skill.includes('strategy')) setTimeout(() => onNavigateTab('strategy'), 1200);
        else if (skill.includes('pillar')) setTimeout(() => onNavigateTab('pillars'), 1200);
        else if (skill.includes('campaign')) setTimeout(() => onNavigateTab('campaigns'), 1200);
        else if (skill.includes('idea')) setTimeout(() => onNavigateTab('ideas'), 1200);
        else if (skill.includes('launchpad')) setTimeout(() => onNavigateTab('launchpad'), 1200);
      }
    } catch (err: any) {
      console.error('Orchestration error:', err);
      setErrorMsg(err.message || 'Failed to orchestrate outcome request.');
    } finally {
      setIsOrchestrating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-5 sm:p-6 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-[#111215] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="font-extrabold text-sm text-[#0F1012] tracking-tight">
            Outcome-First AI Orchestrator
          </span>
          <span className="text-[10px] font-mono font-bold bg-[#E6E8EC] text-neutral-700 px-2.5 py-0.5 rounded-full">
            v3.0 Engine
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-medium">
          State your goal in plain English — the orchestrator auto-coordinates Strategy, Pillars & Content skills.
        </p>
      </div>

      {/* Input Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleOrchestrate()}
          placeholder="e.g. Generate a 5-day Children's Day sprint campaign with posts and carousel, or Refine Q3 B2B positioning..."
          disabled={isOrchestrating}
          className="w-full bg-[#F4F5F7] hover:bg-[#ECEEF2] focus:bg-white border border-neutral-200/90 rounded-2xl py-3 pl-4 pr-36 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition shadow-inner font-normal"
        />
        <button
          type="button"
          onClick={() => handleOrchestrate()}
          disabled={isOrchestrating || !prompt.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#111215] hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
        >
          {isOrchestrating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Orchestrating...</span>
            </>
          ) : (
            <>
              <span>Orchestrate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Quick Outcome Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-semibold text-neutral-400 mr-1 flex items-center">
          <Zap className="w-3 h-3 text-amber-500 mr-1" /> Quick Outcomes:
        </span>
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(item.prompt);
              handleOrchestrate(item.prompt);
            }}
            disabled={isOrchestrating}
            className="px-3 py-1 bg-[#F4F5F7] hover:bg-[#E5E7EB] active:bg-[#D1D5DB] border border-black/[0.04] rounded-full text-xs text-neutral-700 font-medium transition-colors cursor-pointer"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl flex items-center space-x-2">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* Live Execution Plan & Output Visualizer */}
      {executionResult && (
        <div className="mt-2 p-4 bg-[#F8F9FA] border border-black/[0.06] rounded-2xl space-y-2.5 text-xs text-neutral-800 shadow-2xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-neutral-900">Orchestration Executed</span>
              <span className="text-[10px] font-mono font-bold bg-[#E6E8EC] text-neutral-700 px-2 py-0.5 rounded-md">
                Skill: {executionResult.skillId || executionResult.plan?.primarySkill || 'multi_skill'}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              ID: {executionResult.executionId?.slice(0, 8)}...
            </span>
          </div>

          {/* Steps Feedback */}
          {executionResult.plan?.steps && (
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              {executionResult.plan.steps.map((step: any, idx: number) => (
                <span
                  key={idx}
                  className="flex items-center space-x-1 px-2.5 py-0.5 bg-white border border-neutral-200 rounded-md text-[11px] text-neutral-700 font-medium shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Step {step.stepNumber}: {step.name || step.skill}</span>
                </span>
              ))}
            </div>
          )}

          {/* Output Summary Snippet */}
          {executionResult.output && (
            <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-xs font-mono text-neutral-700 max-h-36 overflow-y-auto shadow-inner">
              <pre className="whitespace-pre-wrap font-sans text-xs">
                {typeof executionResult.output === 'string'
                  ? executionResult.output
                  : JSON.stringify(executionResult.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
