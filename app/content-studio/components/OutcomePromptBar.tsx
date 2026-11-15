'use client';

import React, { useState } from 'react';
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

  const quickPrompts = [
    { label: '🎯 Draft Marketing Strategy', prompt: 'Create a comprehensive marketing strategy with personas and positioning for our brand', tab: 'strategy' },
    { label: '🏛️ Architect Content Pillars', prompt: 'Generate 4 balanced content pillars with distribution percentages and sub-themes', tab: 'pillars' },
    { label: '💡 Brainstorm 5 Viral Ideas', prompt: 'Brainstorm 5 high-engagement post ideas based on our industry and trends', tab: 'ideas' },
    { label: '🚀 Launchpad Wizard', prompt: 'Run Brand Marketing Launchpad to set up our brand foundation from zero', tab: 'launchpad' },
    { label: '📑 LinkedIn Carousel Deck', prompt: 'Architect a 5-slide educational LinkedIn carousel deck on industry best practices', tab: 'composer' },
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
        if (skill.includes('strategy')) setTimeout(() => onNavigateTab('strategy'), 1500);
        else if (skill.includes('pillar')) setTimeout(() => onNavigateTab('pillars'), 1500);
        else if (skill.includes('campaign')) setTimeout(() => onNavigateTab('campaigns'), 1500);
        else if (skill.includes('idea')) setTimeout(() => onNavigateTab('ideas'), 1500);
        else if (skill.includes('launchpad')) setTimeout(() => onNavigateTab('launchpad'), 1500);
      }
    } catch (err: any) {
      console.error('Orchestration error:', err);
      setErrorMsg(err.message || 'Failed to orchestrate outcome request.');
    } finally {
      setIsOrchestrating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-amber-300">
              Outcome-First AI Orchestrator
            </span>
            <span className="text-[10px] bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 px-2 py-0.5 rounded-full font-medium">
              Specification v3.0
            </span>
          </div>
          <span className="text-[11px] text-slate-300">
            Tell the AI what you want to achieve — it coordinates skills across Strategy, Pillars & Content.
          </span>
        </div>

        {/* Input bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOrchestrate()}
            placeholder="e.g., Generate a 5-day Children's Day sprint campaign with posts and carousel, or Refine Q3 B2B positioning..."
            disabled={isOrchestrating}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-4 pr-32 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition shadow-inner"
          />
          <button
            type="button"
            onClick={() => handleOrchestrate()}
            disabled={isOrchestrating || !prompt.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            {isOrchestrating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Planning...</span>
              </>
            ) : (
              <>
                <span>Orchestrate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center">
            <Zap className="w-3 h-3 text-amber-400 mr-1" /> Quick Outcomes:
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
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 rounded-full text-[11px] text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 px-3 py-2 rounded-lg flex items-center space-x-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Live Execution Plan & Output Visualizer */}
        {executionResult && (
          <div className="mt-3 p-3.5 bg-slate-900/95 border border-indigo-500/40 rounded-xl space-y-2.5 text-xs text-slate-200 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Orchestration Completed</span>
                <span className="text-[10px] bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded font-mono">
                  Skill: {executionResult.skillId || executionResult.plan?.primarySkill || 'multi_skill'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Execution ID: <span className="font-mono text-slate-300">{executionResult.executionId?.slice(0, 8)}...</span>
              </span>
            </div>

            {/* Steps feedback */}
            {executionResult.plan?.steps && (
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                {executionResult.plan.steps.map((step: any, idx: number) => (
                  <span
                    key={idx}
                    className="flex items-center space-x-1 px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-[11px] text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Step {step.stepNumber}: {step.name || step.skill}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Output summary snippet */}
            {executionResult.output && (
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  {typeof executionResult.output === 'string'
                    ? executionResult.output
                    : JSON.stringify(executionResult.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
