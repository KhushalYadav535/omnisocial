'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface OutcomePromptBarProps {
  brandId: string;
  onNavigateTab: (tabId: string) => void;
  onRefreshData?: () => void;
  onLoadIntoComposer?: (data: { caption: string; title?: string; hashtags?: string[]; format?: string; angleVariants?: any[] }) => void;
}

export default function OutcomePromptBar({
  brandId,
  onNavigateTab,
  onRefreshData,
  onLoadIntoComposer
}: OutcomePromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Restore previous orchestration result from session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('omnisocial_orchestrator_result');
        if (cached) {
          setExecutionResult(JSON.parse(cached));
        }
      } catch {}
    }
  }, []);

  // Universal target workspace resolver for execution results
  const getDestinationTab = () => {
    if (!executionResult) return 'overview';
    const skill = (executionResult.skillId || executionResult.plan?.primarySkill || '').toLowerCase();
    if (skill.includes('strategy')) return 'strategy';
    if (skill.includes('pillar')) return 'pillars';
    if (skill.includes('campaign')) return 'campaigns';
    if (skill.includes('idea')) return 'ideas';
    if (skill.includes('carousel') || skill.includes('post') || skill.includes('copy')) return 'composer';
    if (skill.includes('launchpad')) return 'launchpad';
    if (executionResult.output?.positioning) return 'strategy';
    if (Array.isArray(executionResult.output?.pillars)) return 'pillars';
    if (Array.isArray(executionResult.output?.ideas)) return 'ideas';
    if (executionResult.output?.caption) return 'composer';
    return 'overview';
  };

  const getWorkspaceLabel = () => {
    const tab = getDestinationTab();
    switch (tab) {
      case 'strategy': return 'Strategy Workspace';
      case 'pillars': return 'Pillars Workspace';
      case 'campaigns': return 'Campaigns Workspace';
      case 'ideas': return 'Ideas Workspace';
      case 'composer': return 'Post Composer';
      case 'launchpad': return 'Launchpad Wizard';
      default: return 'Workspace';
    }
  };

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
    { label: 'Generate Social Post', prompt: 'Craft a high-converting multi-platform social post with viral hook, caption, and hashtags', tab: 'composer' },
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
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('omnisocial_orchestrator_result', JSON.stringify(res));
        } catch {}
      }
      if (onRefreshData) onRefreshData();
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
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                ID: {executionResult.executionId?.slice(0, 8)}...
              </span>
              <button
                type="button"
                onClick={() => {
                  const dest = getDestinationTab();
                  if (dest === 'composer' && onLoadIntoComposer && (executionResult.output?.caption || executionResult.output?.hook)) {
                    const rawTags = Array.isArray(executionResult.output.hashtags) ? executionResult.output.hashtags : [];
                    const normalizedTags = rawTags.map((t: string) => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : t);
                    onLoadIntoComposer({
                      caption: executionResult.output.caption || executionResult.output.hook,
                      title: executionResult.output.title || 'AI Generated Post',
                      hashtags: normalizedTags,
                      angleVariants: Array.isArray(executionResult.output.angleVariants) ? executionResult.output.angleVariants : undefined
                    });
                  } else {
                    onNavigateTab(dest);
                  }
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition flex items-center space-x-1 shadow-2xs cursor-pointer"
              >
                <span>Open in {getWorkspaceLabel()}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setExecutionResult(null);
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('omnisocial_orchestrator_result');
                  }
                }}
                className="text-[11px] text-neutral-400 hover:text-neutral-700 px-1.5 py-0.5 rounded-md hover:bg-black/5 transition cursor-pointer"
                title="Dismiss output"
              >
                Clear
              </button>
            </div>
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

          {/* Formatted Output Visualizer (No Raw JSON) */}
          {executionResult.output && (
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/90 text-xs text-neutral-800 space-y-3 shadow-2xs">
              {/* Case A: Strategy Deliverable */}
              {executionResult.output.positioning || executionResult.output.valueProposition ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs flex items-center space-x-1.5">
                      <Target className="w-3.5 h-3.5 text-purple-600" />
                      <span>Synthesized Marketing Strategy</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('strategy')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Open in Strategy Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {executionResult.output.positioning && (
                    <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                      <p className="font-bold text-[10px] uppercase tracking-wider text-purple-800 mb-0.5">Core Positioning</p>
                      <p className="text-xs text-neutral-800 leading-relaxed">{executionResult.output.positioning}</p>
                    </div>
                  )}

                  {executionResult.output.valueProposition && (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-600 mb-0.5">Value Proposition</p>
                      <p className="text-xs text-neutral-800 leading-relaxed">{executionResult.output.valueProposition}</p>
                    </div>
                  )}

                  {Array.isArray(executionResult.output.personas) && executionResult.output.personas.length > 0 && (
                    <div>
                      <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Target Personas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {executionResult.output.personas.map((p: any, pIdx: number) => (
                          <span key={pIdx} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium">
                            {typeof p === 'string' ? p : p.name || p.title || `Persona ${pIdx + 1}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : Array.isArray(executionResult.output.pillars) ? (
                /* Case B: Content Pillars Deliverable */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs">Architected Content Pillars</span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('pillars')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View in Pillars Tab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {executionResult.output.pillars.map((pil: any, pilIdx: number) => (
                      <div key={pilIdx} className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-1">
                        <div className="flex items-center justify-between font-bold text-neutral-900">
                          <span>{pil.name}</span>
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">{pil.targetPercentage || pil.percentage || 25}%</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 line-clamp-2">{pil.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : Array.isArray(executionResult.output.ideas) ? (
                /* Case C: Brainstorm Ideas Deliverable */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs">Generated Viral Ideas</span>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('ideas')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Open in Ideas Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {executionResult.output.ideas.slice(0, 5).map((idea: any, iIdx: number) => (
                      <div key={iIdx} className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-800 truncate">{idea.title || idea.hook}</span>
                        <span className="text-[10px] font-mono text-neutral-500 bg-white px-2 py-0.5 rounded-md border shrink-0 ml-2">
                          {idea.format || 'POST'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : Array.isArray(executionResult.output.slides) || Array.isArray(executionResult.output.deck) ? (
                /* Case D: LinkedIn Carousel Deck Deliverable */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs flex items-center space-x-1.5">
                      <span>🎨 5-Slide Carousel Deck</span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-mono">
                        {(executionResult.output.slides || executionResult.output.deck).length} Slides
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const slides = executionResult.output.slides || executionResult.output.deck || [];
                        const slideText = slides
                          .map((s: any, idx: number) => `Slide ${s.slideNumber || idx + 1}: ${s.title || s.header || ''}\n${s.body || s.content || s.text || ''}`)
                          .join('\n\n');
                        const hook = executionResult.output.hook || '';
                        const fullCaption = hook ? `${hook}\n\n${slideText}` : slideText;
                        if (onLoadIntoComposer) {
                          onLoadIntoComposer({
                            caption: fullCaption,
                            title: slides[0]?.title ? `LinkedIn Carousel: ${slides[0].title}` : '5-Slide Educational Carousel',
                            hashtags: executionResult.output.hashtags || ['#Marketing', '#Strategy', '#Leadership'],
                            format: 'CAROUSEL'
                          });
                        } else {
                          onNavigateTab('composer');
                        }
                      }}
                      className="px-3 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-1 cursor-pointer transition shadow-2xs"
                    >
                      <span>Open in Post Composer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(executionResult.output.slides || executionResult.output.deck).map((s: any, sIdx: number) => (
                      <div key={sIdx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/90 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100/60 px-1.5 py-0.2 rounded">
                          Slide {s.slideNumber || sIdx + 1}
                        </span>
                        <p className="font-bold text-xs text-neutral-900 mt-1">{s.title || s.header || `Slide ${sIdx + 1}`}</p>
                        <p className="text-[11px] text-neutral-600 leading-snug line-clamp-3">{s.body || s.content || s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : executionResult.output.caption || executionResult.output.hook ? (
                /* Case E: Social Post Copywriter Deliverable */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs">Generated Social Post</span>
                    <button
                      type="button"
                      onClick={() => {
                        const cap = executionResult.output.caption || executionResult.output.hook || '';
                        const hook = executionResult.output.hook;
                        const rawTags = Array.isArray(executionResult.output.hashtags) ? executionResult.output.hashtags : [];
                        const hashtags = rawTags.map((t: string) => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : t);
                        if (onLoadIntoComposer) {
                          onLoadIntoComposer({
                            caption: cap,
                            title: hook ? (hook.slice(0, 30) + '...') : 'AI Generated Social Post',
                            hashtags,
                            format: 'POST'
                          });
                        } else {
                          onNavigateTab('composer');
                        }
                      }}
                      className="px-3 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-1 cursor-pointer transition shadow-2xs"
                    >
                      <span>Load into Composer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {executionResult.output.hook && (
                    <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block mb-0.5">Hook</span>
                      <p className="text-xs text-neutral-800 font-semibold">{executionResult.output.hook}</p>
                    </div>
                  )}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                    <p className="text-xs text-neutral-800 whitespace-pre-line leading-relaxed font-sans">
                      {executionResult.output.caption}
                    </p>
                    {Array.isArray(executionResult.output.hashtags) && executionResult.output.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {executionResult.output.hashtags.map((tag: string, tIdx: number) => (
                          <span key={tIdx} className="text-[11px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Case F: Formatted Narrative Summary */
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                    <span className="font-bold text-neutral-900 text-xs">Deliverable Summary</span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Ready in Workspace
                    </span>
                  </div>
                  <div className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line font-sans p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    {typeof executionResult.output === 'string'
                      ? executionResult.output
                      : executionResult.output.summary || executionResult.output.message || executionResult.output.rawOutput || JSON.stringify(executionResult.output, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
