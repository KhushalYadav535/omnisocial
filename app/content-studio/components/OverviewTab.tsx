'use client';

import React from 'react';
import {
  Sparkles,
  Target,
  Lightbulb,
  FilePlus2,
  CalendarCheck2,
  Megaphone,
  Image as ImageIcon,
  Film,
  Layers,
  ChevronRight,
  Rocket,
  RefreshCw,
  CheckCircle2,
  Cpu,
  ArrowRight
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
  // 8 High-Impact Bento Action Cards matching the requested luxury Studio UI
  const studioCards = [
    {
      id: 'strategy',
      title: 'Marketing Strategy',
      description: 'Create or refine marketing strategy.',
      icon: Target,
      tab: 'strategy',
      badge: strategy?.status ? `${strategy.status}` : null,
      color: {
        bg: 'bg-[#FFF6EE]',
        border: 'border-[#FED7AA]/70',
        iconColor: 'text-[#EA580C]',
        arrowBg: 'bg-[#FFF6EE]',
        arrowHover: 'group-hover:bg-[#FFEDD5]',
        arrowBorder: 'border-[#FED7AA]/60'
      }
    },
    {
      id: 'ideas',
      title: 'Ideas & Inspiration',
      description: 'Explore and develop content ideas.',
      icon: Lightbulb,
      tab: 'ideas',
      badge: stats.ideasCount > 0 ? `${stats.ideasCount} Ideas` : null,
      color: {
        bg: 'bg-[#F6F3FF]',
        border: 'border-[#DDD6FE]/70',
        iconColor: 'text-[#7C3AED]',
        arrowBg: 'bg-[#F6F3FF]',
        arrowHover: 'group-hover:bg-[#EDE9FE]',
        arrowBorder: 'border-[#DDD6FE]/60'
      }
    },
    {
      id: 'requests',
      title: 'Content Requests',
      description: 'Create and manage content requests.',
      icon: FilePlus2,
      tab: 'ideas',
      badge: stats.requestsCount > 0 ? `${stats.requestsCount} Requests` : null,
      color: {
        bg: 'bg-[#F0F8FF]',
        border: 'border-[#BAE6FD]/70',
        iconColor: 'text-[#0284C7]',
        arrowBg: 'bg-[#F0F8FF]',
        arrowHover: 'group-hover:bg-[#E0F2FE]',
        arrowBorder: 'border-[#BAE6FD]/60'
      }
    },
    {
      id: 'planning',
      title: 'Content Planning',
      description: 'Create content pillars and calendars.',
      icon: CalendarCheck2,
      tab: 'pillars',
      badge: stats.pillarsCount > 0 ? `${stats.pillarsCount} Pillars` : null,
      color: {
        bg: 'bg-[#F0FDF4]',
        border: 'border-[#BBF7D0]/70',
        iconColor: 'text-[#16A34A]',
        arrowBg: 'bg-[#F0FDF4]',
        arrowHover: 'group-hover:bg-[#DCFCE7]',
        arrowBorder: 'border-[#BBF7D0]/60'
      }
    },
    {
      id: 'campaigns',
      title: 'Campaigns',
      description: 'Plan and manage marketing campaigns.',
      icon: Megaphone,
      tab: 'campaigns',
      badge: stats.campaignsCount > 0 ? `${stats.campaignsCount} Active` : null,
      color: {
        bg: 'bg-[#FFF1F2]',
        border: 'border-[#FECDD3]/70',
        iconColor: 'text-[#E11D48]',
        arrowBg: 'bg-[#FFF1F2]',
        arrowHover: 'group-hover:bg-[#FFE4E6]',
        arrowBorder: 'border-[#FECDD3]/60'
      }
    },
    {
      id: 'composer',
      title: 'Posts & Content',
      description: 'Create posts, carousels, reels and other content.',
      icon: ImageIcon,
      tab: 'composer',
      badge: stats.postsCount > 0 ? `${stats.postsCount} Posts` : null,
      color: {
        bg: 'bg-[#EFF6FF]',
        border: 'border-[#BFDBFE]/70',
        iconColor: 'text-[#2563EB]',
        arrowBg: 'bg-[#EFF6FF]',
        arrowHover: 'group-hover:bg-[#DBEAFE]',
        arrowBorder: 'border-[#BFDBFE]/60'
      }
    },
    {
      id: 'media',
      title: 'Media Library',
      description: 'Manage images, videos and creative assets.',
      icon: Film,
      tab: 'media',
      badge: null,
      color: {
        bg: 'bg-[#F5F3FF]',
        border: 'border-[#DDD6FE]/70',
        iconColor: 'text-[#9333EA]',
        arrowBg: 'bg-[#F5F3FF]',
        arrowHover: 'group-hover:bg-[#EDE9FE]',
        arrowBorder: 'border-[#DDD6FE]/60'
      }
    },
    {
      id: 'skills',
      title: 'Skill Library',
      description: 'Explore and manage AI skills.',
      icon: Layers,
      tab: 'skills',
      badge: '10 Registered',
      color: {
        bg: 'bg-[#FEFCE8]',
        border: 'border-[#FEF08A]/70',
        iconColor: 'text-[#CA8A04]',
        arrowBg: 'bg-[#FEFCE8]',
        arrowHover: 'group-hover:bg-[#FEF9C3]',
        arrowBorder: 'border-[#FEF08A]/60'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* 8 BENTO ACTION CARDS GRID (2 COLUMNS x 4 ROWS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {studioCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab(card.tab)}
              className="bg-white rounded-2xl sm:rounded-3xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/[0.12] transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
                {/* Colorful Soft Tinted Icon Container */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${card.color.bg} ${card.color.border} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${card.color.iconColor}`} />
                </div>

                {/* Text: Big Bold Title + Short Description */}
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F1012] group-hover:text-black tracking-tight truncate">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-0.5 leading-snug line-clamp-1">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Circular Action Arrow */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${card.color.arrowBg} ${card.color.arrowBorder} border ${card.color.iconColor} ${card.color.arrowHover} flex items-center justify-center shrink-0 ml-3 transition-all duration-200 group-hover:translate-x-1 shadow-2xs`}>
                <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK BRAND TELEMETRY & STRATEGY CONTEXT FOOTER */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
            {(brand?.name || 'OmniSocial').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-[#0F1012] tracking-tight truncate">
                {brand?.name || 'OmniSocial Workspace'}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-lg">
              {strategy?.positioning || 'Sovereign AI Social Management Suite with end-to-end multi-channel orchestration.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('launchpad')}
            className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/90 rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-purple-600" />
            <span>Launchpad Stage {stats.launchpadStage || 1}/4</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-neutral-500 hover:text-neutral-800 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200 transition cursor-pointer"
            title="Refresh studio overview"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
