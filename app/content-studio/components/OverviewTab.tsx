'use client';

import React from 'react';
import {
  Sparkles,
  Target,
  Compass,
  Layers,
  Calendar,
  Lightbulb,
  FileCheck2,
  Rocket,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  BarChart2,
  RefreshCw
} from 'lucide-react';

interface OverviewTabProps {
  brand: any;
  strategy: any;
  stats: {
    pillarsCount: number;
    ideasCount: number;
    requestsCount: number;
    campaignsCount: number;
    postsCount: number;
    pendingApprovalsCount: number;
    launchpadStage: number;
    launchpadStatus: string;
  };
  recentExecutions: any[];
  isLoading: boolean;
  onNavigateTab: (tabId: string) => void;
  onRefresh: () => void;
}

export default function OverviewTab({
  brand,
  strategy,
  stats,
  recentExecutions,
  isLoading,
  onNavigateTab,
  onRefresh
}: OverviewTabProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">✓ Approved</span>;
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-300">⏳ In Review</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-300">📝 Draft</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-300">○ Not Started</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* BRAND & STRATEGY HEALTH HERO CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-2xs">
                {(brand?.name || 'Brand').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{brand?.name || 'Current Brand'}</h2>
                {getStatusBadge(strategy?.status)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xl">
                {strategy?.positioning || brand?.description || 'Build an intentional, automated marketing engine with connected Strategy, Content Pillars & Multi-Platform Publishing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Launchpad Status Pill */}
            <button
              onClick={() => onNavigateTab('launchpad')}
              className="px-3.5 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/90 rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-purple-600" />
              <span>Launchpad: Stage {stats.launchpadStage || 1}/4</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition cursor-pointer"
              title="Refresh studio overview"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 6 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Strategy */}
        <div
          onClick={() => onNavigateTab('strategy')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Strategy</span>
            <Target className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {strategy?.status ? strategy.status : 'None'}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Level 1 Blueprint</p>
        </div>

        {/* Content Pillars */}
        <div
          onClick={() => onNavigateTab('pillars')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pillars</span>
            <Layers className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {stats.pillarsCount} Active
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Distribution Mixer</p>
        </div>

        {/* Campaigns */}
        <div
          onClick={() => onNavigateTab('campaigns')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Campaigns</span>
            <Calendar className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {stats.campaignsCount} Sprints
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Sequential Roadmaps</p>
        </div>

        {/* Idea Bank */}
        <div
          onClick={() => onNavigateTab('ideas')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Idea Bank</span>
            <Lightbulb className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {stats.ideasCount} Ideas
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Brainstormed Bank</p>
        </div>

        {/* Requests */}
        <div
          onClick={() => onNavigateTab('ideas')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Requests</span>
            <Zap className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {stats.requestsCount} Open
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Internal Intake</p>
        </div>

        {/* Approvals */}
        <div
          onClick={() => onNavigateTab('approvals')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-400 hover:shadow-sm transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Approvals</span>
            <FileCheck2 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {stats.pendingApprovalsCount} Pending
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Governance Queue</p>
        </div>
      </div>

      {/* QUICK WORKSPACE LAUNCHERS */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5">
          Workspace Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1 */}
          <button
            onClick={() => onNavigateTab('launchpad')}
            className="p-4 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                🚀
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="text-sm font-bold text-slate-900">Brand Launchpad</div>
            <p className="text-[11px] text-slate-500 mt-0.5">4-stage onboarding from zero to active publishing.</p>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => onNavigateTab('strategy')}
            className="p-4 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                🎯
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="text-sm font-bold text-slate-900">Marketing Strategy</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Define personas, positioning and channel roadmap.</p>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => onNavigateTab('pillars')}
            className="p-4 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                🏛️
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="text-sm font-bold text-slate-900">Pillar Distribution</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Balance content pillars & target percentages.</p>
          </button>

          {/* Card 4 */}
          <button
            onClick={() => onNavigateTab('composer')}
            className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✍️
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </div>
            <div className="text-sm font-bold text-slate-900">Post & Creative Composer</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Craft viral copy, carousels, visuals & schedule.</p>
          </button>
        </div>
      </div>

      {/* RECENT SKILL EXECUTIONS AUDIT FEED */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent AI Skill Executions</h3>
          </div>
          <button
            onClick={() => onNavigateTab('skills')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>Explore All Skills</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentExecutions && recentExecutions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentExecutions.map((exec) => (
              <div key={exec.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${exec.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <span className="font-semibold text-slate-800">{exec.skill?.name || exec.skillId}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({exec.skill?.category || 'AI'})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
                  <span>{exec.latencyMs ? `${exec.latencyMs}ms` : '—'}</span>
                  <span>{exec.tokensUsed ? `${exec.tokensUsed} tokens` : '—'}</span>
                  <span>{new Date(exec.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            No skill executions recorded yet. Use the prompt bar above to run your first skill!
          </div>
        )}
      </div>
    </div>
  );
}
