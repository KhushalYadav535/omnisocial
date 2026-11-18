'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  Layers,
  Building2,
  Search,
  Users,
  MessageSquare,
  Share2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Rocket,
  ShieldCheck,
  Check,
  Lightbulb,
  FileText,
  BarChart2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface StrategyTabProps {
  brandId: string;
  onRefreshOverview?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function StrategyTab({ brandId, onRefreshOverview, onNavigateTab }: StrategyTabProps) {
  const [strategy, setStrategy] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // activeSection: null = Hub view (Image 1), 1..8 = Section detail view (Image 2)
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeSubtab, setActiveSubtab] = useState<string>('overview');

  // FORM DATA STATE
  // Step 1: Business & Brand Analysis
  const [businessName, setBusinessName] = useState('Sentient Digital');
  const [businessType, setBusinessType] = useState('IT Services & Consulting');
  const [industrySector, setIndustrySector] = useState('Technology');
  const [businessDescription, setBusinessDescription] = useState(
    'An IT services and consulting company focused on digital transformation, AI solutions and product development for BFSI, Healthcare and Education sectors.'
  );
  const [productsServices, setProductsServices] = useState<string[]>([
    'IT Consulting & Digital Transformation',
    'Application Development & Integration',
    'AI Solutions & Automation',
    'Training & Capability Building'
  ]);
  const [differentiators, setDifferentiators] = useState<string[]>([
    'Business + Technology expertise',
    'AI and automation focus',
    'Domain experience in BFSI and Healthcare',
    'End-to-end: Consulting, Development and Training'
  ]);
  const [newProductInput, setNewProductInput] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newDiffInput, setNewDiffInput] = useState('');
  const [showAddDiff, setShowAddDiff] = useState(false);

  // Step 2: Market & Competitors
  const [marketTrends, setMarketTrends] = useState('Accelerating adoption of Generative AI, cloud modernization, and automation in high-trust enterprise sectors.');
  const [competitors, setCompetitors] = useState<string[]>([
    'Accenture Digital (Global scale, high billing rates)',
    'Persistent Systems (Strong BFSI presence, legacy focus)',
    'Boutique AI Consultancies (Niche technical depth, low operational scale)'
  ]);
  const [newCompetitorInput, setNewCompetitorInput] = useState('');

  // Step 3: Audience Strategy
  const [targetPersonas, setTargetPersonas] = useState<any[]>([
    {
      name: 'Growth-Minded Founder / CMO',
      role: 'Executive Leadership',
      pains: 'Fragmented publishing cadence, lack of data-driven hooks, and time-draining manual content cycles.',
      goals: 'Establish category authority, 3x organic impressions, and generate inbound pipeline.'
    },
    {
      name: 'Creative Director / Agency Manager',
      role: 'Brand Operations',
      pains: 'Client approval bottlenecks and inconsistency across multiple social platform formats.',
      goals: 'Streamline client reviews with magic links, maintain strict aesthetic guidelines, and cut delivery time in half.'
    }
  ]);

  // Step 4: Marketing Objectives
  const [marketingObjectives, setMarketingObjectives] = useState<any[]>([
    { objective: 'Expand Audience Footprint', target: '+50% QoQ Impressions & Organic Reach', timeline: 'Q1' },
    { objective: 'Inbound Conversation Rate', target: '2.5x increase in comment & DM leads', timeline: 'Q2' }
  ]);

  // Step 5: Positioning & Messaging
  const [positioning, setPositioning] = useState(
    'For modern, growth-oriented organizations, Sentient Digital is the premier partner delivering high-impact digital transformation, automated engineering, and verified business outcomes.'
  );
  const [valueProposition, setValueProposition] = useState(
    'Turn organic attention into predictable pipeline through systematic content pillars, algorithmic hook mastery, and effortless omni-channel publishing.'
  );
  const [coreMessaging, setCoreMessaging] = useState<any[]>([
    {
      title: 'Algorithmic Hook & Retention Mastery',
      description: 'Engineering scroll-stopping line-1 hooks and carousel formats tuned to platform algorithms.'
    },
    {
      title: 'Seamless Omni-Channel Execution',
      description: 'Adapting core creative briefs across LinkedIn, Instagram, Facebook, and Twitter effortlessly.'
    },
    {
      title: 'Verified ROI & Conversion Loops',
      description: 'Bridging the gap between brand impressions, comment-to-DM triggers, and tangible customer acquisition.'
    }
  ]);

  // Step 6: Channel Strategy
  const [channelStrategy, setChannelStrategy] = useState<any[]>([
    { platform: 'LINKEDIN', cadence: '4x weekly', focus: 'B2B Authority, Case Studies, and Framework Carousels' },
    { platform: 'INSTAGRAM', cadence: '5x weekly', focus: 'High-Aesthetic Reels, Educational Carousels, and VIP Stories' },
    { platform: 'FACEBOOK', cadence: '3x weekly', focus: 'Community Engagement, Value Teardowns, and Partner Drops' }
  ]);

  // Step 7: Marketing Roadmap
  const [channelRoadmap, setChannelRoadmap] = useState<any[]>([
    { phase: 'Sprint 1: Category Framing', theme: 'Manifesto & Authority', keyDeliverables: 'Foundational manifesto post, founder story reel, 7-slide educational carousel' },
    { phase: 'Sprint 2: Social Proof & Metrics', theme: 'Client Impact & Results', keyDeliverables: 'Customer success breakdown, before/after metric showcases, industry benchmark comparison' },
    { phase: 'Sprint 3: Conversion Sprint', theme: 'Direct Response & Offer', keyDeliverables: 'Lead magnet carousel drop, automated DM trigger sprint, VIP onboarding launch' }
  ]);

  // 8 Steps Definitions matching Reference UI
  const stepsList = [
    { number: 1, id: 'business', label: 'Business & Brand Analysis', short: 'Business & Brand', desc: 'Define your business, brand, offerings and unique value.' },
    { number: 2, id: 'market', label: 'Market & Competitor Research', short: 'Market & Competitor', desc: 'Industry, competitors, market trends.' },
    { number: 3, id: 'audience', label: 'Audience Strategy', short: 'Audience Strategy', desc: 'Customer segments, personas, needs.' },
    { number: 4, id: 'objectives', label: 'Marketing Objectives', short: 'Marketing Objectives', desc: 'Business outcomes and marketing goals.' },
    { number: 5, id: 'positioning', label: 'Positioning & Messaging', short: 'Positioning & Messaging', desc: 'Differentiators, value proposition, key messages.' },
    { number: 6, id: 'channel', label: 'Channel Strategy', short: 'Channel Strategy', desc: 'Channel priorities and platform choices.' },
    { number: 7, id: 'roadmap', label: 'Marketing Roadmap', short: 'Marketing Roadmap', desc: 'Quarterly priorities and initiatives.' },
    { number: 8, id: 'review', label: 'Review & Approval', short: 'Review & Approval', desc: 'Final review and executive strategy sign-off.' }
  ];

  // 7 Hub Cards in Image 1
  const hubCards = [
    {
      step: 1,
      title: 'Business & Brand Analysis',
      description: 'Business model, offerings, value proposition.',
      icon: Building2,
      color: {
        bg: 'bg-[#F6F3FF]',
        border: 'border-[#DDD6FE]/70',
        text: 'text-[#7C3AED]'
      },
      isCompleted: productsServices.length > 0 && differentiators.length > 0
    },
    {
      step: 2,
      title: 'Market & Competitor Research',
      description: 'Industry, competitors, market trends.',
      icon: Search,
      color: {
        bg: 'bg-[#EFF6FF]',
        border: 'border-[#BFDBFE]/70',
        text: 'text-[#2563EB]'
      },
      isCompleted: competitors.length > 0
    },
    {
      step: 3,
      title: 'Audience Strategy',
      description: 'Customer segments, personas, needs.',
      icon: Users,
      color: {
        bg: 'bg-[#F0FDF4]',
        border: 'border-[#BBF7D0]/70',
        text: 'text-[#16A34A]'
      },
      isCompleted: targetPersonas.length > 0
    },
    {
      step: 4,
      title: 'Marketing Objectives',
      description: 'Business outcomes and marketing goals.',
      icon: Target,
      color: {
        bg: 'bg-[#FFF6EE]',
        border: 'border-[#FED7AA]/70',
        text: 'text-[#EA580C]'
      },
      isCompleted: marketingObjectives.length > 0
    },
    {
      step: 5,
      title: 'Positioning & Messaging',
      description: 'Differentiators, value proposition, key messages.',
      icon: MessageSquare,
      color: {
        bg: 'bg-[#FFF1F2]',
        border: 'border-[#FECDD3]/70',
        text: 'text-[#E11D48]'
      },
      isCompleted: Boolean(positioning && valueProposition)
    },
    {
      step: 6,
      title: 'Channel Strategy',
      description: 'Channel priorities and platform choices.',
      icon: Share2,
      color: {
        bg: 'bg-[#F5F3FF]',
        border: 'border-[#DDD6FE]/70',
        text: 'text-[#9333EA]'
      },
      isCompleted: channelStrategy.length > 0
    },
    {
      step: 7,
      title: 'Marketing Roadmap',
      description: 'Quarterly priorities and initiatives.',
      icon: Calendar,
      color: {
        bg: 'bg-[#EFF6FF]',
        border: 'border-[#BFDBFE]/70',
        text: 'text-[#0284C7]'
      },
      isCompleted: channelRoadmap.length > 0
    }
  ];

  const fetchStrategy = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`/content-studio/strategy?brandId=${brandId}`);
      if (res.strategy) {
        setStrategy(res.strategy);
        const ctx = res.strategy.businessContext;
        if (ctx && typeof ctx === 'object') {
          if (ctx.businessName) setBusinessName(ctx.businessName);
          if (ctx.businessType) setBusinessType(ctx.businessType);
          if (ctx.industrySector) setIndustrySector(ctx.industrySector);
          if (ctx.description) setBusinessDescription(ctx.description);
          if (Array.isArray(ctx.productsServices) && ctx.productsServices.length > 0) {
            setProductsServices(ctx.productsServices);
          }
          if (Array.isArray(ctx.differentiators) && ctx.differentiators.length > 0) {
            setDifferentiators(ctx.differentiators);
          }
        } else if (typeof ctx === 'string' && ctx.trim()) {
          try {
            const parsed = JSON.parse(ctx);
            if (parsed.businessName) setBusinessName(parsed.businessName);
            if (parsed.businessType) setBusinessType(parsed.businessType);
            if (parsed.industrySector) setIndustrySector(parsed.industrySector);
            if (parsed.description) setBusinessDescription(parsed.description);
            if (Array.isArray(parsed.productsServices) && parsed.productsServices.length > 0) {
              setProductsServices(parsed.productsServices);
            }
            if (Array.isArray(parsed.differentiators) && parsed.differentiators.length > 0) {
              setDifferentiators(parsed.differentiators);
            }
          } catch {
            setBusinessDescription(ctx);
          }
        }

        if (Array.isArray(res.strategy.targetPersonas) && res.strategy.targetPersonas.length > 0) {
          setTargetPersonas(res.strategy.targetPersonas);
        }
        if (res.strategy.positioning) setPositioning(res.strategy.positioning);
        if (res.strategy.valueProposition) setValueProposition(res.strategy.valueProposition);
        if (Array.isArray(res.strategy.coreMessaging) && res.strategy.coreMessaging.length > 0) {
          setCoreMessaging(res.strategy.coreMessaging);
        }
        if (Array.isArray(res.strategy.marketingObjectives) && res.strategy.marketingObjectives.length > 0) {
          setMarketingObjectives(res.strategy.marketingObjectives);
        }
        if (Array.isArray(res.strategy.channelStrategy) && res.strategy.channelStrategy.length > 0) {
          setChannelStrategy(res.strategy.channelStrategy);
        }
        if (Array.isArray(res.strategy.channelRoadmap) && res.strategy.channelRoadmap.length > 0) {
          setChannelRoadmap(res.strategy.channelRoadmap);
        }
      }
    } catch (err: any) {
      console.error('Fetch strategy error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, [brandId]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const handleSaveDraft = async () => {
    if (!brandId) return;
    setIsSaving(true);
    setNotification(null);
    try {
      const businessContextObj = {
        businessName,
        businessType,
        industrySector,
        description: businessDescription,
        productsServices,
        differentiators
      };

      const res = await apiRequest('/content-studio/strategy', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          businessContext: businessContextObj,
          targetPersonas,
          positioning,
          valueProposition,
          coreMessaging,
          marketingObjectives,
          channelStrategy,
          channelRoadmap
        })
      });

      setStrategy(res.strategy);
      setNotification({ type: 'success', message: 'Strategy draft saved successfully!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Save strategy error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to save strategy.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateFullStrategy = async () => {
    if (!brandId) return;
    setIsGeneratingAi(true);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/strategy', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          prompt: `Synthesize a comprehensive marketing strategy for ${businessName} in ${industrySector}.`
        })
      });
      setStrategy(res.strategy);
      await fetchStrategy();
      setNotification({ type: 'success', message: 'Full strategy synthesized by AI Copilot!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Full strategy generation error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to generate strategy.' });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopilotAction = async (action: string) => {
    setCopilotLoading(action);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/strategy/ai-suggest', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          action,
          currentData: {
            businessName,
            businessType,
            industrySector,
            description: businessDescription
          }
        })
      });

      if (action === 'generate_overview' && res.data) {
        if (res.data.businessName) setBusinessName(res.data.businessName);
        if (res.data.businessType) setBusinessType(res.data.businessType);
        if (res.data.industrySector) setIndustrySector(res.data.industrySector);
        if (res.data.description) setBusinessDescription(res.data.description);
        if (res.data.productsServices) setProductsServices(res.data.productsServices);
        if (res.data.differentiators) setDifferentiators(res.data.differentiators);
        setNotification({ type: 'success', message: 'AI drafted business overview & differentiators!' });
      } else if (action === 'suggest_differentiators' && Array.isArray(res.data)) {
        setDifferentiators(res.data);
        setNotification({ type: 'success', message: 'Key differentiators updated with AI suggestions!' });
      } else if ((action.includes('persona') || action.includes('audience')) && Array.isArray(res.data)) {
        setTargetPersonas(res.data);
        setNotification({ type: 'success', message: 'Audience personas synthesized with AI!' });
      } else if (action === 'refine_value_prop' && res.data) {
        setValueProposition(res.data);
        setNotification({ type: 'success', message: 'Value proposition refined by AI Copilot!' });
      } else if (action === 'swot' && res.data) {
        setNotification({ type: 'success', message: 'SWOT analysis completed: Strengths & opportunities evaluated!' });
      } else {
        setNotification({ type: 'success', message: res.data?.tip || 'Section reviewed and aligned to strategic frameworks!' });
      }
    } catch (err: any) {
      console.error('Copilot action error:', err);
      setNotification({ type: 'error', message: err.message || 'AI Copilot suggestion failed.' });
    } finally {
      setCopilotLoading(null);
    }
  };

  const handleApproveStrategy = async () => {
    if (!strategy?.id) return;
    setIsSaving(true);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/strategy/approve', {
        method: 'POST',
        body: JSON.stringify({ strategyId: strategy.id })
      });
      setStrategy(res.strategy);
      setNotification({ type: 'success', message: 'Strategy has been officially APPROVED! All AI skills will now align to this foundation.' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Approve strategy error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to approve strategy.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProductInput.trim()) return;
    setProductsServices([...productsServices, newProductInput.trim()]);
    setNewProductInput('');
    setShowAddProduct(false);
  };

  const handleRemoveProduct = (index: number) => {
    setProductsServices(productsServices.filter((_, idx) => idx !== index));
  };

  const handleAddDiff = () => {
    if (!newDiffInput.trim()) return;
    setDifferentiators([...differentiators, newDiffInput.trim()]);
    setNewDiffInput('');
    setShowAddDiff(false);
  };

  const handleRemoveDiff = (index: number) => {
    setDifferentiators(differentiators.filter((_, idx) => idx !== index));
  };

  // =========================================================================
  // VIEW 1: MARKETING STRATEGY HUB (EXACT MATCH TO REFERENCE IMAGE 1)
  // =========================================================================
  if (activeSection === null) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* HERO HEADER */}
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF6EE] border border-[#FED7AA]/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Target className="w-7 h-7 text-[#EA580C]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1012] tracking-tight">
              Marketing Strategy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-0.5">
              Define your market, audience, positioning and growth direction.
            </p>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-semibold">{notification.message}</span>
          </div>
        )}

        {/* STRATEGY WORKSPACE SUB-BAR */}
        <div className="bg-white rounded-2xl border border-black/[0.06] px-5 py-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-neutral-800 font-bold text-sm">
              <Layers className="w-4 h-4 text-neutral-600" />
              <span>Strategy workspace</span>
            </div>

            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              strategy?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-[#EDE9FE] text-[#6D28D9]'
            }`}>
              {strategy?.status === 'APPROVED' ? 'Approved' : 'Draft'}
            </span>

            <span className="text-xs text-neutral-400 font-normal">
              Last updated — {strategy?.updatedAt ? new Date(strategy.updatedAt).toLocaleDateString() : 'Not started'}
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={handleGenerateFullStrategy}
              disabled={isGeneratingAi}
              className="px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGeneratingAi ? 'Synthesizing...' : 'Create strategy with AI'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection(1)}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center space-x-1 transition cursor-pointer"
            >
              <span>Start with a guided brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7 STRATEGY SECTION CARDS GRID (2 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                onClick={() => setActiveSection(card.step)}
                className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-black/[0.12] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl ${card.color.bg} ${card.color.border} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${card.color.text}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-[#0F1012] group-hover:text-black tracking-tight truncate">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-normal mt-0.5 truncate">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200/60 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                    <span>{card.isCompleted ? 'Completed' : 'Not started'}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CALLOUT: BRAND MARKETING LAUNCHPAD */}
        <div className="bg-[#FAF5FF] border border-purple-200/70 rounded-3xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Rocket className="w-6 h-6 text-[#9333EA]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-[#0F1012] tracking-tight">
                Starting from zero? Use Brand Marketing Launchpad
              </h4>
              <p className="text-xs text-neutral-500 font-normal mt-0.5">
                Set up your marketing strategy, content themes and initial plan for a new brand.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab ? onNavigateTab('launchpad') : setActiveSection(1)}
            className="text-xs font-bold text-[#7E22CE] hover:text-[#6B21A8] flex items-center space-x-1 shrink-0 transition cursor-pointer self-start sm:self-center"
          >
            <span>Open Launchpad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STEPPER / SECTION DETAIL VIEW (EXACT MATCH TO REFERENCE IMAGE 2)
  // =========================================================================
  const currentStepInfo = stepsList.find((s) => s.number === activeSection) || stepsList[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER WITH VIEW STRATEGY BUTTON */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF6EE] border border-[#FED7AA]/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Target className="w-7 h-7 text-[#EA580C]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1012] tracking-tight">
              Marketing Strategy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-0.5">
              Build a comprehensive marketing strategy for your brand.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection(null)}
          className="px-4 py-2 text-xs font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-black/[0.08] rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-center"
        >
          <Eye className="w-3.5 h-3.5 text-neutral-500" />
          <span>View Strategy</span>
        </button>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* 8-STEP STEPPER BAR */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] px-2">
          {stepsList.map((step, idx) => {
            const isActive = step.number === activeSection;
            const isCompleted = step.number < activeSection;

            return (
              <React.Fragment key={step.number}>
                <button
                  type="button"
                  onClick={() => setActiveSection(step.number)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-xs scale-110'
                      : isCompleted
                      ? 'bg-purple-100 text-[#7C3AED]'
                      : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#7C3AED] font-bold' : 'text-neutral-500 group-hover:text-neutral-800'
                  }`}>
                    {step.short}
                  </span>
                </button>

                {idx < stepsList.length - 1 && (
                  <div className="flex-1 h-[1.5px] bg-neutral-200 mx-2 -mt-4"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT 2/3 CONTENT, RIGHT 1/3 AI COPILOT & TIP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: FORM CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-2xs space-y-6">
            {/* SECTION TITLE & ICON */}
            <div className="flex items-center space-x-3.5 pb-4 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F3FF] border border-[#DDD6FE]/70 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0F1012] tracking-tight">
                  {currentStepInfo.label}
                </h2>
                <p className="text-xs text-neutral-500 font-normal mt-0.5">
                  {currentStepInfo.desc}
                </p>
              </div>
            </div>

            {/* SUB-TABS (FOR STEP 1) */}
            {activeSection === 1 && (
              <div className="flex items-center space-x-6 border-b border-neutral-100 text-xs font-semibold text-neutral-500 pb-2">
                {[
                  { id: 'overview', label: 'Business Overview' },
                  { id: 'profile', label: 'Brand Profile' },
                  { id: 'offerings', label: 'Offerings' },
                  { id: 'value_prop', label: 'Value Proposition' },
                  { id: 'swot', label: 'SWOT & Assets' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setActiveSubtab(st.id)}
                    className={`pb-2 -mb-2.5 transition-all cursor-pointer ${
                      activeSubtab === st.id
                        ? 'border-b-2 border-[#7C3AED] text-[#7C3AED] font-bold'
                        : 'hover:text-neutral-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 1: FORM FIELDS */}
            {activeSection === 1 && (
              <div className="space-y-5">
                {/* Row 1: Name, Type, Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 block">
                      Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Sentient Digital"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium text-neutral-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 block">
                      Business Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium text-neutral-900 cursor-pointer"
                    >
                      <option value="IT Services & Consulting">IT Services & Consulting</option>
                      <option value="SaaS / Software Product">SaaS / Software Product</option>
                      <option value="E-Commerce / Direct-to-Consumer">E-Commerce / Direct-to-Consumer</option>
                      <option value="Marketing & Creative Agency">Marketing & Creative Agency</option>
                      <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                      <option value="Education / EdTech">Education / EdTech</option>
                      <option value="Financial Services / Fintech">Financial Services / Fintech</option>
                      <option value="Creator / Media Brand">Creator / Media Brand</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 block">
                      Industry / Sector <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={industrySector}
                      onChange={(e) => setIndustrySector(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium text-neutral-900 cursor-pointer"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Media & Entertainment">Media & Entertainment</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-700 block">
                      Business Description <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {businessDescription.length} / 500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe what your business does, your target market, and primary service lines..."
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-normal text-neutral-800 leading-relaxed resize-none"
                  />
                </div>

                {/* Row 3: Products / Services & Key Differentiators side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Products / Services Card */}
                  <div className="bg-neutral-50/60 rounded-2xl border border-neutral-200/80 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900">
                        <span className="text-sm">📦</span>
                        <span>Products / Services</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(true)}
                        className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center space-x-0.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {showAddProduct && (
                      <div className="flex items-center space-x-2 pt-1 animate-in fade-in">
                        <input
                          type="text"
                          value={newProductInput}
                          onChange={(e) => setNewProductInput(e.target.value)}
                          placeholder="e.g. Cloud Migration"
                          className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
                        />
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="px-2.5 py-1.5 text-xs font-bold bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddProduct(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {productsServices.map((prod, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-neutral-200 px-3 py-2 flex items-center justify-between text-xs text-neutral-800 shadow-2xs group"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                            <span className="truncate">{prod}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(idx)}
                            className="text-neutral-300 hover:text-rose-600 transition p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Differentiators Card */}
                  <div className="bg-neutral-50/60 rounded-2xl border border-neutral-200/80 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900">
                        <span className="text-sm">⭐</span>
                        <span>Key Differentiators</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddDiff(true)}
                        className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center space-x-0.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {showAddDiff && (
                      <div className="flex items-center space-x-2 pt-1 animate-in fade-in">
                        <input
                          type="text"
                          value={newDiffInput}
                          onChange={(e) => setNewDiffInput(e.target.value)}
                          placeholder="e.g. 24/7 dedicated lead engineer"
                          className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddDiff()}
                        />
                        <button
                          type="button"
                          onClick={handleAddDiff}
                          className="px-2.5 py-1.5 text-xs font-bold bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddDiff(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {differentiators.map((diff, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-neutral-200 px-3 py-2 flex items-center justify-between text-xs text-neutral-800 shadow-2xs group"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                            <span className="truncate">{diff}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDiff(idx)}
                            className="text-neutral-300 hover:text-rose-600 transition p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MARKET & COMPETITOR */}
            {activeSection === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Market Trends & Environment</label>
                  <textarea
                    rows={3}
                    value={marketTrends}
                    onChange={(e) => setMarketTrends(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-neutral-800 leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 block">Top Competitors</label>
                  {competitors.map((comp, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl border border-neutral-200 px-3.5 py-2.5 flex items-center justify-between text-xs text-neutral-800">
                      <span>{comp}</span>
                      <button type="button" onClick={() => setCompetitors(competitors.filter((_, i) => i !== idx))} className="text-neutral-300 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={newCompetitorInput}
                      onChange={(e) => setNewCompetitorInput(e.target.value)}
                      placeholder="Add competitor..."
                      className="flex-1 text-xs px-3 py-2 border border-neutral-200 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newCompetitorInput.trim()) {
                          setCompetitors([...competitors, newCompetitorInput.trim()]);
                          setNewCompetitorInput('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCompetitorInput.trim()) {
                          setCompetitors([...competitors, newCompetitorInput.trim()]);
                          setNewCompetitorInput('');
                        }
                      }}
                      className="px-3 py-2 text-xs font-bold bg-[#7C3AED] text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: AUDIENCE STRATEGY */}
            {activeSection === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">Target Personas ({targetPersonas.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {targetPersonas.map((p, idx) => (
                    <div key={idx} className="bg-neutral-50/70 rounded-2xl border border-neutral-200 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-neutral-900">{p.name || `Persona ${idx + 1}`}</h4>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">{p.role}</span>
                      </div>
                      <p className="text-xs text-neutral-600"><strong className="text-neutral-800">Pain Points:</strong> {p.pains}</p>
                      <p className="text-xs text-neutral-600"><strong className="text-neutral-800">Goals:</strong> {p.goals}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: MARKETING OBJECTIVES */}
            {activeSection === 4 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-700 block">Quarterly Strategic Goals & KPIs</span>
                <div className="space-y-2.5">
                  {marketingObjectives.map((obj, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-2xl border border-neutral-200 p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-neutral-900 block">{obj.objective}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">{obj.target}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{obj.timeline}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: POSITIONING & MESSAGING */}
            {activeSection === 5 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Positioning Statement</label>
                  <textarea
                    rows={3}
                    value={positioning}
                    onChange={(e) => setPositioning(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-neutral-800 leading-relaxed resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Core Value Proposition</label>
                  <textarea
                    rows={2}
                    value={valueProposition}
                    onChange={(e) => setValueProposition(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-neutral-800 leading-relaxed resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: CHANNEL STRATEGY */}
            {activeSection === 6 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-700 block">Channel Priorities & Cadence</span>
                <div className="space-y-2.5">
                  {channelStrategy.map((ch, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-2xl border border-neutral-200 p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-neutral-900 block">{ch.platform}</span>
                        <span className="text-neutral-500">{ch.focus}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">{ch.cadence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: MARKETING ROADMAP */}
            {activeSection === 7 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-neutral-700 block">Sprint Phases & Key Deliverables</span>
                <div className="space-y-3">
                  {channelRoadmap.map((rm, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-neutral-900">{rm.phase}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">{rm.theme}</span>
                      </div>
                      <p className="text-neutral-600 mt-1">{rm.keyDeliverables}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: REVIEW & APPROVAL */}
            {activeSection === 8 && (
              <div className="space-y-5">
                <div className="bg-purple-50/60 rounded-2xl border border-purple-200 p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-900 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                    <span>Executive Strategy Sign-Off</span>
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    Approving this strategy locks the foundational brand guidelines. All content engines, calendar generators, and AI assistants will adhere strictly to these market positioning rules.
                  </p>
                  <button
                    type="button"
                    onClick={handleApproveStrategy}
                    disabled={isSaving}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{strategy?.status === 'APPROVED' ? 'Re-Approve Strategy' : 'Official Executive Approval'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI COPILOT & TIP */}
        <div className="space-y-5">
          {/* AI COPILOT CARD */}
          <div className="bg-white rounded-3xl border border-black/[0.06] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-extrabold text-[#0F1012]">AI Copilot</h3>
              </div>
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            </div>

            <p className="text-xs text-neutral-500 font-normal -mt-1">
              Get started faster with AI suggestions.
            </p>

            <div className="space-y-2">
              {[
                { id: 'generate_overview', label: 'Generate business overview', icon: FileText },
                { id: 'suggest_differentiators', label: 'Suggest key differentiators', icon: Sparkles },
                { id: 'generate_personas', label: 'Generate audience personas', icon: Users },
                { id: 'swot', label: 'Identify strengths & gaps (SWOT)', icon: BarChart2 },
                { id: 'refine_value_prop', label: 'Refine value proposition', icon: Target },
                { id: 'improve_section', label: 'Review and improve this section', icon: Compass }
              ].map((act) => {
                const ActIcon = act.icon;
                const isActLoading = copilotLoading === act.id;

                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleCopilotAction(act.id)}
                    disabled={Boolean(copilotLoading)}
                    className="w-full text-left bg-neutral-50/70 hover:bg-purple-50/80 border border-neutral-200/60 hover:border-purple-200 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold text-neutral-800 hover:text-purple-900 transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {isActLoading ? (
                        <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin shrink-0" />
                      ) : (
                        <ActIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      )}
                      <span className="truncate">{act.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* TIP CARD */}
          <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-3xl p-5 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-[#CA8A04] font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-[#CA8A04]" />
              <span>Tip</span>
            </div>
            <p className="text-xs text-[#854D0E] font-normal leading-relaxed">
              Add details about your business, offerings, strengths and what makes your brand unique. You can use AI to draft and refine the content.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-2xs flex items-center justify-between">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl shadow-2xs flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-neutral-500" />}
          <span>{isSaving ? 'Saving...' : 'Save as Draft'}</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              if (activeSection > 1) setActiveSection(activeSection - 1);
              else setActiveSection(null);
            }}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl transition cursor-pointer flex items-center space-x-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {activeSection < stepsList.length ? (
            <button
              type="button"
              onClick={() => setActiveSection(activeSection + 1)}
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
            >
              <span>Next: {stepsList[activeSection].short}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApproveStrategy}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Finish & Approve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
