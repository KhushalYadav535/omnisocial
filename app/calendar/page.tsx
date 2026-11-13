'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw,
  Edit2,
  GripVertical,
  X,
  AlertTriangle,
  Eye,
  Sparkles,
  Rocket,
  Target,
  Layers,
  Video,
  ArrowRight,
  HelpCircle,
  Flame,
  Check,
  Share2,
  Play,
  Lightbulb,
  Store,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Compass,
  Camera,
  Upload,
  Copy,
  Image as ImageIcon,
  Zap,
  Mic,
  Globe,
  TrendingUp,
  BarChart3,
  CalendarDays,
  User as UserIcon
} from 'lucide-react';
import { Facebook, Instagram, LinkedIn } from '../../components/Icons';

export interface FestivalEvent {
  date: string; // YYYY-MM-DD
  name: string;
  emoji: string;
  tag: string;
  category: 'FESTIVAL' | 'CULTURAL' | 'COMMERCE';
  leadTimeDays: number;
  pitchBrief: string;
}

export const INDIAN_FESTIVALS_CALENDAR: FestivalEvent[] = [
  {
    date: '2026-10-20',
    name: 'Dhanteras',
    emoji: '🪔',
    tag: 'Gold & Prosperity',
    category: 'FESTIVAL',
    leadTimeDays: 14,
    pitchBrief: 'Brand: [YourBrandName]\nDhanteras festive drop celebrating wealth, prosperity, and auspicious purchases with limited-time festive perks.'
  },
  {
    date: '2026-10-22',
    name: 'Diwali / Deepavali',
    emoji: '🪔',
    tag: 'Mega Festive Drop',
    category: 'FESTIVAL',
    leadTimeDays: 21,
    pitchBrief: 'Brand: [YourBrandName]\nGrand Diwali festival campaign with light, joy, gifting boxes, and celebratory seasonal savings.'
  },
  {
    date: '2026-10-24',
    name: 'Bhai Dooj',
    emoji: '🎁',
    tag: 'Sibling Gifting',
    category: 'FESTIVAL',
    leadTimeDays: 10,
    pitchBrief: 'Brand: [YourBrandName]\nBhai Dooj sibling celebration and heartfelt gift bundle drop.'
  },
  {
    date: '2026-10-27',
    name: 'Chhath Puja',
    emoji: '🌅',
    tag: 'Sun God Blessings',
    category: 'CULTURAL',
    leadTimeDays: 10,
    pitchBrief: 'Brand: [YourBrandName]\nChhath Puja sacred celebrations, purity, and family togetherness greetings.'
  },
  {
    date: '2026-11-14',
    name: "Children's Day",
    emoji: '🎈',
    tag: 'Kids & Family Special',
    category: 'CULTURAL',
    leadTimeDays: 7,
    pitchBrief: "Brand: [YourBrandName]\nChildren's Day celebration with fun family bundles, nostalgia, and special treats."
  },
  {
    date: '2026-11-27',
    name: 'Black Friday',
    emoji: '🛍️',
    tag: 'Annual Mega Sale',
    category: 'COMMERCE',
    leadTimeDays: 14,
    pitchBrief: 'Brand: [YourBrandName]\nBlack Friday mega sale sprint with deepest discounts of the year, countdown urgency, and VIP early access.'
  },
  {
    date: '2026-11-30',
    name: 'Cyber Monday',
    emoji: '💻',
    tag: 'Tech & Digital Flash',
    category: 'COMMERCE',
    leadTimeDays: 10,
    pitchBrief: 'Brand: [YourBrandName]\nCyber Monday final clearance rush for digital offers, online software, and instant delivery packages.'
  },
  {
    date: '2026-12-25',
    name: 'Christmas Day',
    emoji: '🎄',
    tag: 'Holiday Gifting',
    category: 'FESTIVAL',
    leadTimeDays: 14,
    pitchBrief: 'Brand: [YourBrandName]\nChristmas holiday cheer, seasonal gifting guides, and year-end customer appreciation specials.'
  },
  {
    date: '2026-12-31',
    name: "New Year's Eve",
    emoji: '🎉',
    tag: 'Year-End Countdown',
    category: 'COMMERCE',
    leadTimeDays: 10,
    pitchBrief: "Brand: [YourBrandName]\nNew Year's Eve countdown drop celebrating year-end wins, reflections, and midnight flash specials."
  },
  {
    date: '2027-01-01',
    name: 'New Year 2027',
    emoji: '✨',
    tag: 'Fresh Start / Resolutions',
    category: 'CULTURAL',
    leadTimeDays: 14,
    pitchBrief: 'Brand: [YourBrandName]\nNew Year fresh start transformation campaign focused on resolutions, fresh goals, and modern solutions.'
  },
  {
    date: '2027-01-14',
    name: 'Makar Sankranti & Pongal',
    emoji: '🪁',
    tag: 'Harvest & Hope',
    category: 'FESTIVAL',
    leadTimeDays: 10,
    pitchBrief: 'Brand: [YourBrandName]\nMakar Sankranti, Lohri, and Pongal harvest celebration honoring prosperity, tradition, and regional sweetness.'
  },
  {
    date: '2027-01-16',
    name: 'National Startup Day',
    emoji: '🚀',
    tag: 'Entrepreneurship Drop',
    category: 'CULTURAL',
    leadTimeDays: 7,
    pitchBrief: 'Brand: [YourBrandName]\nNational Startup Day honoring homegrown founders, hustle stories, and local innovation.'
  },
  {
    date: '2027-01-26',
    name: 'Republic Day',
    emoji: '🇮🇳',
    tag: 'Patriotism & Tri-Color',
    category: 'CULTURAL',
    leadTimeDays: 14,
    pitchBrief: 'Brand: [YourBrandName]\nRepublic Day celebration celebrating Indian pride, sovereign freedom, and patriotic customer drops.'
  },
  {
    date: '2027-03-08',
    name: "International Women's Day",
    emoji: '👩',
    tag: 'Empowerment Special',
    category: 'CULTURAL',
    leadTimeDays: 14,
    pitchBrief: "Brand: [YourBrandName]\nInternational Women's Day drop celebrating inspiring women leaders, special gifts, and self-care."
  },
  {
    date: '2027-03-24',
    name: 'Holi Festival of Colors',
    emoji: '🎨',
    tag: 'Colors & Joy',
    category: 'FESTIVAL',
    leadTimeDays: 21,
    pitchBrief: 'Brand: [YourBrandName]\nVibrant Holi campaign celebrating colors, organic joy, friendship, and festive product drops.'
  }
];

export const INDUSTRY_QUICK_TEMPLATES = [
  {
    id: 'saas_billing',
    category: 'SOFTWARE',
    categoryLabel: 'Software & SaaS',
    icon: '💻',
    badge: 'B2B Tech',
    title: 'AI Invoicing & Inventory Software',
    shortDesc: 'Automated WhatsApp billing & GST inventory tracking for retail shopkeepers.',
    brandPlaceholder: '[VyaparEase AI]',
    fullPrompt: 'Brand: [VyaparEase AI]\nProduct: Smart AI billing, barcode scanning, and GST inventory management software for retail shopkeepers. Generates WhatsApp invoices in 3 seconds, alerts low stock, and cuts daily accounts closing time from 2 hours to 5 minutes with zero errors.',
    businessType: 'B2B_SERVICE' as const,
    goal: 'LEADS' as const
  },
  {
    id: 'mktg_agency',
    category: 'MARKETING',
    categoryLabel: 'Marketing Agency',
    icon: '📢',
    badge: 'Agency & Ads',
    title: 'Performance Marketing & Lead Gen Agency',
    shortDesc: 'Guaranteed customer acquisition & paid ads for clinics and gyms.',
    brandPlaceholder: '[Apex Growth Media]',
    fullPrompt: 'Brand: [Apex Growth Media]\nService: High-ROI performance marketing and social media lead generation agency that guarantees 35+ qualified appointment bookings every month for local dental clinics, dermatologists, and gyms with zero upfront risk.',
    businessType: 'B2B_SERVICE' as const,
    goal: 'LEADS' as const
  },
  {
    id: 'd2c_skincare',
    category: 'ECOMMERCE',
    categoryLabel: 'E-Commerce / D2C',
    icon: '🧴',
    badge: 'Physical Product',
    title: 'Organic Ayurvedic Skincare Soap',
    shortDesc: 'Cold-pressed turmeric & sandalwood bars that cure acne & restore skin glow.',
    brandPlaceholder: '[Aura Glow Organics]',
    fullPrompt: 'Brand: [Aura Glow Organics]\nProduct: 100% handmade cold-pressed turmeric, saffron, and sandalwood soap bars that clear stubborn acne marks, reverse sun damage, and restore natural glow in 14 days without chemicals.',
    businessType: 'PHYSICAL_PRODUCT' as const,
    goal: 'SALES' as const
  },
  {
    id: 'food_cafe',
    category: 'FOOD',
    categoryLabel: 'Food & Dining',
    icon: '☕',
    badge: 'Local Restaurant',
    title: 'Boutique Cafe Italian Brunch Buffet',
    shortDesc: 'Wood-fired sourdough pizzas, specialty coffee & weekend dessert buffet.',
    brandPlaceholder: '[Caffè Bella Vista]',
    fullPrompt: 'Brand: [Caffè Bella Vista]\nOffering: Artisanal wood-fired sourdough pizzas, single-origin pour-over specialty coffee, and an unlimited weekend Italian brunch & dessert buffet in Bandra, Mumbai.',
    businessType: 'LOCAL_BUSINESS' as const,
    goal: 'SALES' as const
  },
  {
    id: 'health_dental',
    category: 'HEALTH',
    categoryLabel: 'Healthcare & Clinic',
    icon: '🦷',
    badge: 'Medical Clinic',
    title: 'Modern Cosmetic & Painless Dental Clinic',
    shortDesc: 'Invisible aligners, laser teeth whitening & painless implants.',
    brandPlaceholder: '[SmileCraft Dental Studio]',
    fullPrompt: 'Brand: [SmileCraft Dental Studio]\nService: Advanced painless dental implants, invisible teeth aligners, and 45-minute laser teeth whitening with US-FDA certified technology in a luxury spa-like clinic.',
    businessType: 'LOCAL_BUSINESS' as const,
    goal: 'LEADS' as const
  },
  {
    id: 'coach_fitness',
    category: 'COACHING',
    categoryLabel: 'Coaches & EdTech',
    icon: '🏋️',
    badge: 'Online Mentorship',
    title: 'Executive Fat Loss & Fitness Mentorship',
    shortDesc: 'Custom diet & 35-min home workouts for busy corporate leaders.',
    brandPlaceholder: '[FitExecutive 90]',
    fullPrompt: 'Brand: [FitExecutive 90]\nProgram: 1-on-1 personalized body transformation mentorship for busy founders and executives to lose 8-12 kgs of belly fat in 90 days with zero starvation and 35-minute home workouts.',
    businessType: 'CREATOR_COACH' as const,
    goal: 'LEADS' as const
  },
  {
    id: 'realestate_interiors',
    category: 'REALESTATE',
    categoryLabel: 'Real Estate & Interiors',
    icon: '🏠',
    badge: 'Architecture & Design',
    title: 'Turnkey Luxury Interior Design Studio',
    shortDesc: '3D architectural home design with guaranteed 45-day execution.',
    brandPlaceholder: '[Vogue Living Interiors]',
    fullPrompt: 'Brand: [Vogue Living Interiors]\nService: Turnkey luxury 3D architectural interior design and bespoke furnishing for 3BHK and penthouse apartments, with a strict 45-day handover guarantee and 10-year warranty.',
    businessType: 'LOCAL_BUSINESS' as const,
    goal: 'LEADS' as const
  },
  {
    id: 'consulting_tax',
    category: 'CONSULTING',
    categoryLabel: 'Professional Services',
    icon: '⚖️',
    badge: 'Tax & Legal',
    title: 'Corporate Tax, GST & Financial Advisory',
    shortDesc: 'Legal corporate tax savings up to 40% with virtual CFO audit.',
    brandPlaceholder: '[ClearTax Corporate Advisors]',
    fullPrompt: 'Brand: [ClearTax Corporate Advisors]\nService: End-to-end GST filing, corporate income tax planning, and virtual CFO consulting for SMEs that legally saves up to 40% in tax liabilities and ensures 100% compliance.',
    businessType: 'B2B_SERVICE' as const,
    goal: 'LEADS' as const
  }
];

export default function CalendarPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY' | 'LIST' | 'GRID'>('MONTH');
  const [currentDate, setCurrentDate] = useState(() => new Date('2026-10-01T00:00:00Z'));
  const [today, setToday] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Share Calendar Magic Review Link States
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareData, setShareData] = useState<{ reviewUrl: string; shareToken: string; brandName: string } | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleOpenShareModal = async () => {
    setShowShareModal(true);
    setShareLoading(true);
    setCopiedShareLink(false);
    try {
      const res = await apiRequest('/client-review/generate-token', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId || undefined,
          name: 'Executive Calendar Review Portal'
        })
      });
      if (res.success && res.reviewUrl) {
        const url = res.reviewUrl.startsWith('http')
          ? res.reviewUrl
          : `${typeof window !== 'undefined' ? window.location.origin : ''}/review/${res.shareToken}`;
        setShareData({
          reviewUrl: url,
          shareToken: res.shareToken,
          brandName: res.brandName || 'Your Brand'
        });
      } else {
        throw new Error(res.error || 'Failed to generate review link');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to generate review link' });
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.reviewUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  const handleLaunchFestiveCampaign = (fest: FestivalEvent) => {
    setArchitectProductDesc(fest.pitchBrief);
    setArchitectGoal('SALES');
    setArchitectDuration(7);
    setShowArchitectModal(true);
    setWizardStep(1);
    setNotice({
      type: 'success',
      text: `Loaded festive blueprint for "${fest.name}"! Replace brand placeholder and launch.`
    });
  };

  const getFestivalForDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return INDIAN_FESTIVALS_CALENDAR.find(f => f.date === dateStr) || null;
  };

  const getUpcomingFestival = () => {
    if (!today) return null;
    const sorted = [...INDIAN_FESTIVALS_CALENDAR]
      .map(f => {
        const festDate = new Date(f.date + 'T00:00:00');
        const diffMs = festDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { ...f, diffDays };
      })
      .filter(f => f.diffDays >= 0 && f.diffDays <= 35)
      .sort((a, b) => a.diffDays - b.diffDays);

    return sorted[0] || null;
  };

  const upcomingFest = getUpcomingFestival();

  const handleQuickScheduleOnDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setInstantScheduledDate(`${year}-${month}-${day}`);
    setShowInstantModal(true);
    setGeneratedInstantPost(null);
    setInstantTopic('');
  };

  // AI Campaign Architect Wizard States
  const [showArchitectModal, setShowArchitectModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [architectProductDesc, setArchitectProductDesc] = useState('');
  const [architectBusinessType, setArchitectBusinessType] = useState<'PHYSICAL_PRODUCT' | 'LOCAL_BUSINESS' | 'B2B_SERVICE' | 'CREATOR_COACH'>('PHYSICAL_PRODUCT');
  const [architectGoal, setArchitectGoal] = useState<'SALES' | 'LEADS' | 'AWARENESS'>('SALES');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('ALL');

  const handleApplyIndustryTemplate = (tpl: typeof INDUSTRY_QUICK_TEMPLATES[0]) => {
    setArchitectProductDesc(tpl.fullPrompt);
    setArchitectBusinessType(tpl.businessType);
    setArchitectGoal(tpl.goal);
    setNotice({
      type: 'success',
      text: `Loaded "${tpl.title}" template! Replace ${tpl.brandPlaceholder} with your brand name below.`
    });
  };
  const [architectDuration, setArchitectDuration] = useState<7 | 14 | 30>(7);
  const [architectStartDate, setArchitectStartDate] = useState('');
  const [architectPlatforms, setArchitectPlatforms] = useState<string[]>(['INSTAGRAM', 'LINKEDIN']);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<{ campaignSummary: any; posts: any[] } | null>(null);
  const [isDeployingCampaign, setIsDeployingCampaign] = useState(false);
  const [expandedPostIndex, setExpandedPostIndex] = useState<number | null>(0);
  const [deploySuccessModal, setDeploySuccessModal] = useState<any | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  // Quick 1-Click Post & Reel Studio States
  const [showInstantModal, setShowInstantModal] = useState(false);
  const [instantPostType, setInstantPostType] = useState<'REEL' | 'IMAGE' | 'CAROUSEL'>('REEL');
  const [instantPreset, setInstantPreset] = useState<string>('PROBLEM_SOLUTION');
  const [instantTopic, setInstantTopic] = useState('');
  const [instantScheduledDate, setInstantScheduledDate] = useState('');
  const [instantPlatform, setInstantPlatform] = useState('INSTAGRAM');
  const [isGeneratingInstant, setIsGeneratingInstant] = useState(false);
  const [generatedInstantPost, setGeneratedInstantPost] = useState<any | null>(null);
  const [isDeployingInstant, setIsDeployingInstant] = useState(false);
  const [instantActivePromptTab, setInstantActivePromptTab] = useState<'MIDJOURNEY' | 'RUNWAY' | 'CAPCUT' | 'CANVA'>('MIDJOURNEY');
  const [copiedPromptTab, setCopiedPromptTab] = useState<string | null>(null);

  // Active prompt tab per post card in Campaign Architect
  const [cardActivePromptTab, setCardActivePromptTab] = useState<{ [postIdx: number]: 'MIDJOURNEY' | 'RUNWAY' | 'CAPCUT' | 'CANVA' }>({});

  const handleCopyPromptWithKey = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptTab(key);
    setTimeout(() => setCopiedPromptTab(null), 2500);
  };

  const handleCopyAllPromptsForPost = (post: any, key: string) => {
    const formatted = `=== SOCIAL MEDIA ASSET PROMPTS (${post.title}) ===\n\n` +
      `[1. MIDJOURNEY / FLUX PROMPT]:\n${post.midjourneyPrompt || post.aiImagePrompt}\n\n` +
      `[2. RUNWAY GEN-3 / KLING VIDEO PROMPT]:\n${post.videoPrompt || 'Slow cinematic push-in, 9:16 vertical motion'}\n\n` +
      `[3. CAPCUT 15s TELEPROMPTER SCRIPT]:\n${post.voiceoverScript || post.hook}\n\n` +
      `[4. CANVA DESIGN BRIEF]:\n${post.canvaDesignBrief || post.title}`;
    navigator.clipboard.writeText(formatted);
    setCopiedPromptTab(key);
    setTimeout(() => setCopiedPromptTab(null), 2500);
  };

  const handleCopyPrompt = (promptText: string, idx: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2500);
  };

  const handlePhotoUploadForPost = (e: React.ChangeEvent<HTMLInputElement>, postIdx: number) => {
    const file = e.target.files?.[0];
    if (!file || !generatedRoadmap) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updatedPosts = [...generatedRoadmap.posts];
      updatedPosts[postIdx] = {
        ...updatedPosts[postIdx],
        mediaUrl: result
      };
      setGeneratedRoadmap({
        ...generatedRoadmap,
        posts: updatedPosts
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhotoForPost = (postIdx: number) => {
    if (!generatedRoadmap) return;
    const updatedPosts = [...generatedRoadmap.posts];
    const newPost = { ...updatedPosts[postIdx] };
    delete newPost.mediaUrl;
    updatedPosts[postIdx] = newPost;
    setGeneratedRoadmap({
      ...generatedRoadmap,
      posts: updatedPosts
    });
  };

  const [generatingMediaIndex, setGeneratingMediaIndex] = useState<number | null>(null);
  const [generatingAllMedia, setGeneratingAllMedia] = useState(false);

  const handleGenerateMediaForPost = async (idx: number, type?: 'IMAGE' | 'REEL') => {
    if (!generatedRoadmap) return;
    const post = generatedRoadmap.posts[idx];
    if (!post) return;

    setGeneratingMediaIndex(idx);
    setNotice(null);
    try {
      const targetType = type || (post.format === 'REEL' ? 'REEL' : 'IMAGE');
      const res = await apiRequest('/ai/generate-campaign-media', {
        method: 'POST',
        body: JSON.stringify({
          prompt: post.aiImagePrompt || post.title,
          mediaType: targetType,
          productDescription: architectProductDesc,
          businessType: architectBusinessType,
          phase: post.phase,
          dayNumber: post.dayNumber
        })
      });

      if (res.success && res.media?.mediaUrl) {
        const updatedPosts = [...generatedRoadmap.posts];
        updatedPosts[idx] = {
          ...updatedPosts[idx],
          mediaUrl: res.media.mediaUrl,
          mediaType: res.media.mediaType,
          aspectRatio: res.media.aspectRatio
        };
        setGeneratedRoadmap({
          ...generatedRoadmap,
          posts: updatedPosts
        });
        setNotice({ type: 'success', text: `Generated ${targetType} asset for Day ${idx + 1}!` });
      } else {
        throw new Error(res.message || 'Media generation failed');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to generate visual' });
    } finally {
      setGeneratingMediaIndex(null);
    }
  };

  const handleGenerateAllMedia = async () => {
    if (!generatedRoadmap || !generatedRoadmap.posts) return;
    setGeneratingAllMedia(true);
    setNotice(null);
    try {
      const updatedPosts = [...generatedRoadmap.posts];
      for (let i = 0; i < updatedPosts.length; i++) {
        const p = updatedPosts[i];
        const targetType = p.format === 'REEL' ? 'REEL' : 'IMAGE';
        const res = await apiRequest('/ai/generate-campaign-media', {
          method: 'POST',
          body: JSON.stringify({
            prompt: p.aiImagePrompt || p.title,
            mediaType: targetType,
            productDescription: architectProductDesc,
            businessType: architectBusinessType,
            phase: p.phase,
            dayNumber: p.dayNumber
          })
        });
        if (res.success && res.media?.mediaUrl) {
          updatedPosts[i] = {
            ...updatedPosts[i],
            mediaUrl: res.media.mediaUrl,
            mediaType: res.media.mediaType,
            aspectRatio: res.media.aspectRatio
          };
        }
      }
      setGeneratedRoadmap({
        ...generatedRoadmap,
        posts: updatedPosts
      });
      setNotice({ type: 'success', text: `Successfully generated visuals for all ${updatedPosts.length} days!` });
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Batch visual generation failed' });
    } finally {
      setGeneratingAllMedia(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!architectProductDesc.trim()) {
      setNotice({ type: 'error', text: 'Please describe your product or service' });
      return;
    }
    setIsGeneratingRoadmap(true);
    setNotice(null);
    try {
      const res = await apiRequest('/ai/campaign-roadmap', {
        method: 'POST',
        body: JSON.stringify({
          productDescription: architectProductDesc,
          businessType: architectBusinessType,
          campaignGoal: architectGoal,
          durationDays: architectDuration,
          startDate: new Date(architectStartDate).toISOString(),
          platforms: architectPlatforms,
          brandId: activeBrandId || undefined
        })
      });
      if (res.success && res.roadmap) {
        setGeneratedRoadmap(res.roadmap);
        setWizardStep(4);
      } else {
        throw new Error('Failed to generate roadmap');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Roadmap generation failed' });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleDeployCampaign = async () => {
    if (!generatedRoadmap || !generatedRoadmap.posts) return;
    setIsDeployingCampaign(true);
    setNotice(null);
    try {
      const res = await apiRequest('/ai/deploy-campaign', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId || undefined,
          campaignName: generatedRoadmap.campaignSummary?.name,
          posts: generatedRoadmap.posts
        })
      });

      if (res.success) {
        setDeploySuccessModal(res.result);
        setShowArchitectModal(false);
        setGeneratedRoadmap(null);
        setWizardStep(1);
        await fetchCalendar();
      } else {
        throw new Error(res.message || 'Campaign deployment failed');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Campaign deployment failed' });
    } finally {
      setIsDeployingCampaign(false);
    }
  };

  const handleGenerateInstantPost = async () => {
    if (!instantTopic.trim()) {
      setNotice({ type: 'error', text: 'Please enter a product or topic (or click a quick suggestion)' });
      return;
    }
    setIsGeneratingInstant(true);
    setNotice(null);
    try {
      const res = await apiRequest('/ai/instant-post', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId || undefined,
          productOrTopic: instantTopic,
          postType: instantPostType,
          preset: instantPreset,
          targetPlatform: instantPlatform,
          scheduledDate: instantScheduledDate ? new Date(instantScheduledDate).toISOString() : new Date().toISOString()
        })
      });
      if (res.success && res.post) {
        setGeneratedInstantPost(res.post);
        setNotice({ type: 'success', text: `✨ 1-Click ${instantPostType} generated successfully with external tool prompts!` });
      } else {
        throw new Error(res.message || 'Failed to generate instant post');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Instant post generation failed' });
    } finally {
      setIsGeneratingInstant(false);
    }
  };

  const handleDeployInstantPost = async () => {
    if (!generatedInstantPost) return;
    setIsDeployingInstant(true);
    setNotice(null);
    try {
      const res = await apiRequest('/ai/deploy-campaign', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId || undefined,
          campaignName: `Quick 1-Click: ${generatedInstantPost.title}`,
          posts: [generatedInstantPost]
        })
      });
      if (res.success) {
        setNotice({ type: 'success', text: '🚀 Post successfully scheduled into your Content Calendar!' });
        setShowInstantModal(false);
        setGeneratedInstantPost(null);
        setInstantTopic('');
        await fetchCalendar();
      } else {
        throw new Error(res.message || 'Failed to deploy post');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Deployment failed' });
    } finally {
      setIsDeployingInstant(false);
    }
  };

  const handleExpressLaunchRoadmap = async () => {
    if (!architectProductDesc.trim()) {
      setNotice({ type: 'error', text: 'Please choose an industry blueprint or describe your product first.' });
      return;
    }
    setIsGeneratingRoadmap(true);
    setNotice(null);
    try {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const res = await apiRequest('/ai/campaign-roadmap', {
        method: 'POST',
        body: JSON.stringify({
          productDescription: architectProductDesc,
          businessType: architectBusinessType || 'PHYSICAL_PRODUCT',
          campaignGoal: architectGoal || 'SALES',
          durationDays: 7,
          startDate: new Date(tomorrow).toISOString(),
          platforms: ['INSTAGRAM', 'LINKEDIN'],
          brandId: activeBrandId || undefined
        })
      });
      if (res.success && res.roadmap) {
        setGeneratedRoadmap(res.roadmap);
        setWizardStep(4);
        setNotice({ type: 'success', text: '🚀 7-Day Roadmap generated via 1-Click Express Launch!' });
      } else {
        throw new Error('Failed to generate roadmap');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Express launch failed' });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const getPhaseBadgeStyle = (title: string, defaultStatus: string) => {
    if (title.includes('Phase 1')) return 'bg-amber-50 text-amber-900 border-amber-300';
    if (title.includes('Phase 2')) return 'bg-sky-50 text-sky-900 border-sky-300';
    if (title.includes('Phase 3')) return 'bg-purple-50 text-purple-900 border-purple-300';
    if (title.includes('Phase 4')) return 'bg-emerald-50 text-emerald-900 border-emerald-300';
    if (title.includes('Phase 5')) return 'bg-rose-50 text-rose-900 border-rose-300';
    if (defaultStatus === 'PUBLISHED') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (defaultStatus === 'QUEUED') return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    if (defaultStatus === 'PUBLISHING') return 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse';
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setToday(now);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setArchitectStartDate(tomorrow.toISOString().split('T')[0]);
    setInstantScheduledDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const query = activeBrandId ? `?brandId=${activeBrandId}` : '';
      const res = await apiRequest(`/calendar${query}`);
      setEvents(res.events || []);
    } catch (err: any) {
      console.error('Failed to load calendar:', err);
      setNotice({ type: 'error', text: err.message || 'Failed to load calendar items' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [activeBrandId]);

  // Handle Drag and Drop Rescheduling
  const handleDragStart = (e: React.DragEvent, eventItem: any) => {
    if (eventItem.status === 'PUBLISHED' || eventItem.status === 'PUBLISHING') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', eventItem.id);
    setDraggedEventId(eventItem.id);
  };

  const handleDropOnDate = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain') || draggedEventId;
    if (!eventId) return;

    const eventToMove = events.find(ev => ev.id === eventId);
    if (!eventToMove) return;

    if (eventToMove.status === 'PUBLISHED' || eventToMove.status === 'PUBLISHING') {
      setNotice({ type: 'error', text: `Cannot reschedule a ${eventToMove.status} publication` });
      return;
    }

    // Preserve time of day from original schedule
    const origDate = new Date(eventToMove.scheduledFor);
    const newScheduled = new Date(targetDate);
    newScheduled.setHours(origDate.getHours(), origDate.getMinutes(), 0, 0);

    // Optimistic UI state update
    const previousEvents = [...events];
    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, scheduledFor: newScheduled.toISOString(), status: 'QUEUED' } : ev
      )
    );

    try {
      await apiRequest('/calendar/reschedule', {
        method: 'POST',
        body: JSON.stringify({
          publicationId: eventToMove.publicationId,
          newDate: newScheduled.toISOString()
        })
      });

      setNotice({
        type: 'success',
        text: `Post "${eventToMove.title}" rescheduled to ${newScheduled.toLocaleDateString()} at ${newScheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
    } catch (err: any) {
      // Revert optimistic update
      setEvents(previousEvents);
      setNotice({ type: 'error', text: err.message || 'Failed to reschedule post' });
    } finally {
      setDraggedEventId(null);
    }
  };

  const handleSaveModalReschedule = async () => {
    if (!selectedEvent || !rescheduleDate) return;
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest('/calendar/reschedule', {
        method: 'POST',
        body: JSON.stringify({
          publicationId: selectedEvent.publicationId,
          newDate: new Date(rescheduleDate).toISOString()
        })
      });

      setNotice({ type: 'success', text: 'Publication rescheduled successfully.' });
      setSelectedEvent(null);
      fetchCalendar();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Reschedule failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContentEdit = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest(`/calendar/events/${selectedEvent.publicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle,
          caption: editCaption
        })
      });

      setNotice({ type: 'success', text: 'Post content updated successfully.' });
      setIsEditing(false);
      setSelectedEvent(null);
      fetchCalendar();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Edit failed' });
    } finally {
      setSaving(false);
    }
  };

  // Date Navigation Helpers
  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'MONTH') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'WEEK') next.setDate(next.getDate() + 7);
    else if (viewMode === 'DAY') next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'MONTH') prev.setMonth(prev.getMonth() - 1);
    else if (viewMode === 'WEEK') prev.setDate(prev.getDate() - 7);
    else if (viewMode === 'DAY') prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Month View Days (35 or 42 grid cells)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDays: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    monthDays.push({ date: new Date(year, month, -i), isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  const remaining = 35 - monthDays.length;
  for (let i = 1; i <= (remaining > 0 ? remaining : 42 - monthDays.length); i++) {
    monthDays.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  // Generate Week View Days (7 days centered on currentDate)
  const weekDays: Date[] = [];
  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Filtered events based on platform and status filters
  const filteredEvents = events.filter(e => {
    if (filterPlatform !== 'ALL' && e.platform?.toUpperCase() !== filterPlatform) return false;
    if (filterStatus !== 'ALL' && e.status?.toUpperCase() !== filterStatus) return false;
    return true;
  });

  // Upcoming publications for sidebar
  const upcomingPosts = events
    .filter(e => e.status === 'QUEUED')
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    .slice(0, 5);

  const formatPostTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const PlatformMicroIcon = ({ platform }: { platform: string }) => {
    const p = platform?.toUpperCase() || 'INSTAGRAM';
    if (p === 'INSTAGRAM') {
      return (
        <span className="w-3.5 h-3.5 rounded-[4px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Instagram className="w-2 h-2 text-white" />
        </span>
      );
    }
    if (p === 'LINKEDIN') {
      return (
        <span className="w-3.5 h-3.5 rounded-[4px] bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <LinkedIn className="w-2 h-2 text-white" />
        </span>
      );
    }
    if (p === 'FACEBOOK') {
      return (
        <span className="w-3.5 h-3.5 rounded-[4px] bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Facebook className="w-2 h-2 text-white" />
        </span>
      );
    }
    return (
      <span className="w-3.5 h-3.5 rounded-[4px] bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs font-mono text-[7px] font-black">
        𝕏
      </span>
    );
  };

  const PlatformPill = ({ platform }: { platform: string }) => {
    const p = platform?.toUpperCase() || 'INSTAGRAM';
    if (p === 'INSTAGRAM') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 text-pink-700 border border-pink-200/60 font-bold text-[10px]">
          <Instagram className="w-2.5 h-2.5 text-pink-600" />
          <span>Instagram</span>
        </span>
      );
    }
    if (p === 'LINKEDIN') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#0A66C2] border border-blue-200/60 font-bold text-[10px]">
          <LinkedIn className="w-2.5 h-2.5 text-[#0A66C2]" />
          <span>LinkedIn</span>
        </span>
      );
    }
    if (p === 'FACEBOOK') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-50 text-[#1877F2] border border-sky-200/60 font-bold text-[10px]">
          <Facebook className="w-2.5 h-2.5 text-[#1877F2]" />
          <span>Facebook</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200/60 font-bold text-[10px]">
        <span className="font-mono text-[9px] font-black">𝕏</span>
        <span>Twitter</span>
      </span>
    );
  };

  const getEventCardStyle = (title: string, defaultStatus: string) => {
    if (defaultStatus === 'PUBLISHED') {
      return {
        cardBg: 'bg-emerald-50/70 hover:bg-emerald-50/90 text-emerald-950 border-emerald-200/80',
        barColor: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500'
      };
    }
    if (defaultStatus === 'PUBLISHING') {
      return {
        cardBg: 'bg-amber-50/80 hover:bg-amber-50 text-amber-950 border-amber-200/80 animate-pulse',
        barColor: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        dot: 'bg-amber-500 animate-ping'
      };
    }
    if (defaultStatus === 'FAILED') {
      return {
        cardBg: 'bg-rose-50/80 hover:bg-rose-50 text-rose-950 border-rose-200/80',
        barColor: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        dot: 'bg-rose-500'
      };
    }
    if (title.includes('Phase 1')) {
      return {
        cardBg: 'bg-amber-50/60 hover:bg-amber-50/85 text-amber-950 border-amber-200/70',
        barColor: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        dot: 'bg-amber-500'
      };
    }
    if (title.includes('Phase 2')) {
      return {
        cardBg: 'bg-sky-50/60 hover:bg-sky-50/85 text-sky-950 border-sky-200/70',
        barColor: 'bg-sky-500',
        badge: 'bg-sky-100 text-sky-900 border-sky-300',
        dot: 'bg-sky-500'
      };
    }
    if (title.includes('Phase 3')) {
      return {
        cardBg: 'bg-purple-50/60 hover:bg-purple-50/85 text-purple-950 border-purple-200/70',
        barColor: 'bg-purple-500',
        badge: 'bg-purple-100 text-purple-900 border-purple-300',
        dot: 'bg-purple-500'
      };
    }
    if (title.includes('Phase 4')) {
      return {
        cardBg: 'bg-emerald-50/60 hover:bg-emerald-50/85 text-emerald-950 border-emerald-200/70',
        barColor: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-500'
      };
    }
    if (title.includes('Phase 5')) {
      return {
        cardBg: 'bg-rose-50/60 hover:bg-rose-50/85 text-rose-950 border-rose-200/70',
        barColor: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-900 border-rose-300',
        dot: 'bg-rose-500'
      };
    }
    return {
      cardBg: 'bg-white hover:bg-slate-50/90 text-slate-900 border-slate-200/80',
      barColor: 'bg-indigo-500',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500'
    };
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 pb-14">
        {/* ===================================================================== */}
        {/* ULTRA-PREMIUM SUB-HEADER: BREADCRUMBS, TITLE & CONTROL CAPSULES      */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 pt-1 border-b border-neutral-200/60">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span className="hover:text-neutral-700 cursor-pointer">OmniSocial</span>
              <span>›</span>
              <span className="hover:text-neutral-700 cursor-pointer">Editorial</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">Content Calendar</span>
              <span className="text-neutral-300">•</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PostgreSQL Sync</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F1012] tracking-tight mt-1.5 flex items-center space-x-2.5">
              <span>Editorial &amp; Social Calendar</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Drag-and-drop visual timeline with timezone-aware background execution and 1-click AI generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher in Apple/Linear Segmented Capsule */}
            <div className="flex items-center bg-[#E5E7EB]/80 p-1 rounded-full border border-black/[0.04] text-xs font-semibold text-neutral-600 shadow-inner backdrop-blur-md">
              {(['MONTH', 'WEEK', 'DAY', 'LIST', 'GRID'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                    viewMode === mode
                      ? 'bg-white text-neutral-950 font-black shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'hover:text-neutral-900 font-medium'
                  }`}
                >
                  {mode === 'GRID' && <Instagram className="w-3 h-3 text-pink-600 shrink-0" />}
                  <span>{mode === 'GRID' ? 'Grid (IG)' : mode.charAt(0) + mode.slice(1).toLowerCase()}</span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons in Rounded Capsule */}
            <div className="flex items-center space-x-1 bg-white border border-black/[0.08] p-1 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <button
                onClick={prevPeriod}
                title="Previous Period"
                className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={jumpToToday}
                className="px-3 py-1 text-xs font-bold text-neutral-800 hover:bg-neutral-100 rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <span>Today</span>
              </button>
              <button
                onClick={nextPeriod}
                title="Next Period"
                className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Month-Year Selector Chip */}
            <span className="text-xs font-black text-neutral-900 min-w-32 text-center bg-white px-3.5 py-2 rounded-full border border-black/[0.07] shadow-xs">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>

            {/* Share Calendar Magic Review Link Button */}
            <button
              type="button"
              onClick={handleOpenShareModal}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200/90 px-3.5 py-2 rounded-full shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share Calendar</span>
            </button>

            {/* 1-Click Quick Post/Reel Studio Button */}
            <button
              onClick={() => {
                setShowInstantModal(true);
                setGeneratedInstantPost(null);
                setInstantTopic('');
              }}
              className="text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-teal-700 px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(16,185,129,0.28)] flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ 1-Click Studio</span>
              <span className="text-[9px] bg-white/25 text-white px-1.5 py-0.2 rounded-full font-mono uppercase">
                10s
              </span>
            </button>

            {/* AI Campaign Architect Button */}
            <button
              onClick={() => {
                setShowArchitectModal(true);
                setWizardStep(1);
              }}
              className="text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(99,102,241,0.28)] flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ Campaign Architect</span>
            </button>

            {/* Create Post Action Button */}
            <a
              href="/content-studio"
              className="text-xs font-semibold text-white bg-[#0F1012] hover:bg-neutral-800 px-4 py-2 rounded-full shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Drop</span>
            </a>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* FESTIVE & HOLIDAY LEAD-TIME SPRINT BANNER                             */}
        {/* ===================================================================== */}
        {upcomingFest && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                {upcomingFest.emoji}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-mono">
                    {upcomingFest.diffDays === 0 ? 'Today!' : `${upcomingFest.diffDays} Days Away`}
                  </span>
                  <span className="text-xs font-black text-neutral-900">
                    Upcoming Festival: {upcomingFest.name} ({upcomingFest.tag})
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                  Lead-time alert: Start scheduling celebratory drops, festival discounts, and reels now to capture peak holiday reach.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleLaunchFestiveCampaign(upcomingFest)}
                className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-full shadow-md transition-all flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Auto-Plan {upcomingFest.name} Drop</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SPOTLIGHT ASSISTANT BANNER (ZERO MARKETING KNOWLEDGE)                */}
        {/* ===================================================================== */}
        <div className="bg-gradient-to-r from-slate-900/[0.03] via-indigo-500/[0.04] to-emerald-500/[0.03] backdrop-blur-md border border-neutral-200/80 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-neutral-900 tracking-tight">
                  Zero Marketing Knowledge? Launch Proven Campaigns in Seconds:
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                <span className="font-bold text-indigo-700">1. Instant Creator:</span> Click <b>"⚡ 1-Click Studio"</b> for today's post or reel •{' '}
                <span className="font-bold text-purple-700">2. External AI Prompts:</span> 1-Click copy prompts for Midjourney, Runway Gen-3, Kling, or CapCut •{' '}
                <span className="font-bold text-emerald-700">3. Full Sprints:</span> Click <b>"✨ Campaign Architect"</b> for 7 to 30-day automated sequential launches.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                setShowInstantModal(true);
                setGeneratedInstantPost(null);
                setInstantTopic('');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Try 1-Click Studio</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE FILTER CAPSULES BAR (PLATFORM & STATUS)                   */}
        {/* ===================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase text-neutral-400 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-neutral-400" />
              <span>Platform:</span>
            </span>
            {[
              { id: 'ALL', label: 'All Channels', count: events.length },
              { id: 'INSTAGRAM', label: 'Instagram', count: events.filter(e => e.platform?.toUpperCase() === 'INSTAGRAM').length },
              { id: 'LINKEDIN', label: 'LinkedIn', count: events.filter(e => e.platform?.toUpperCase() === 'LINKEDIN').length },
              { id: 'FACEBOOK', label: 'Facebook', count: events.filter(e => e.platform?.toUpperCase() === 'FACEBOOK').length },
              { id: 'TWITTER', label: 'Twitter / X', count: events.filter(e => e.platform?.toUpperCase() === 'TWITTER').length }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilterPlatform(p.id)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center space-x-1.5 border ${
                  filterPlatform === p.id
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterPlatform === p.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {p.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'QUEUED', label: 'Queued', color: 'bg-indigo-500' },
              { id: 'PUBLISHED', label: 'Published', color: 'bg-emerald-500' },
              { id: 'FAILED', label: 'Failed', color: 'bg-rose-500' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilterStatus(s.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer border ${
                  filterStatus === s.id
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-500 border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 animate-in fade-in duration-200 ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MAIN CALENDAR GRID & BENTO SIDEBAR AREA                               */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid Area (3 Cols) */}
          <div className="lg:col-span-3">
            {/* MONTH VIEW */}
            {viewMode === 'MONTH' && (
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/70 text-center text-[11px] font-bold tracking-wider text-neutral-400 uppercase py-3">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-neutral-100/90 min-h-[580px]">
                  {monthDays.map((dayItem, idx) => {
                    const isToday = today ? isSameDay(dayItem.date, today) : false;
                    const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.scheduledFor), dayItem.date));
                    const cellFestival = dayItem.isCurrentMonth ? getFestivalForDate(dayItem.date) : null;

                    return (
                      <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnDate(e, dayItem.date)}
                        className={`p-2 flex flex-col justify-between transition-all min-h-[110px] relative group/cell ${
                          dayItem.isCurrentMonth
                            ? isToday
                              ? 'bg-gradient-to-b from-indigo-50/50 via-white to-white ring-1 ring-inset ring-indigo-200/70'
                              : 'bg-white hover:bg-indigo-50/25'
                            : 'bg-neutral-50/40 text-neutral-400'
                        }`}
                      >
                        {/* Day Cell Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className={`text-[11px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                isToday
                                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-black shadow-[0_2px_8px_rgba(79,70,229,0.35)] ring-2 ring-indigo-200'
                                  : 'text-neutral-700 group-hover/cell:text-indigo-600'
                              }`}>
                                {dayItem.date.getDate()}
                              </span>
                              {isToday && (
                                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider hidden sm:inline">
                                  Today
                                </span>
                              )}
                            </div>

                            {/* Quick '+' Button on Cell Hover */}
                            <button
                              type="button"
                              onClick={() => handleQuickScheduleOnDate(dayItem.date)}
                              title={`Schedule drop on ${dayItem.date.toLocaleDateString()}`}
                              className="w-5 h-5 rounded-md bg-neutral-100 hover:bg-indigo-600 hover:text-white text-neutral-500 items-center justify-center transition-all opacity-0 group-hover/cell:opacity-100 cursor-pointer shadow-2xs hidden sm:flex"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Indian/Global Festival Badge */}
                          {cellFestival && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLaunchFestiveCampaign(cellFestival);
                              }}
                              title={`${cellFestival.name} (${cellFestival.tag}) - Click to auto-generate campaign blueprint`}
                              className="w-full mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center justify-between transition-all group/fest cursor-pointer shadow-2xs text-left"
                            >
                              <span className="truncate flex items-center space-x-1">
                                <span>{cellFestival.emoji}</span>
                                <span className="truncate font-semibold">{cellFestival.name}</span>
                              </span>
                              <Sparkles className="w-2.5 h-2.5 text-amber-600 opacity-60 group-hover/fest:opacity-100 shrink-0 ml-0.5" />
                            </button>
                          )}
                        </div>

                        {/* Event Cards with Drag and Drop */}
                        <div className="space-y-1.5 my-1.5 overflow-y-auto max-h-24 pr-0.5">
                          {dayEvents.map(ev => {
                            const isDraggable = ev.status !== 'PUBLISHED' && ev.status !== 'PUBLISHING';
                            const style = getEventCardStyle(ev.title, ev.status);

                            return (
                              <div
                                key={ev.id}
                                draggable={isDraggable}
                                onDragStart={(e) => handleDragStart(e, ev)}
                                onClick={() => {
                                  setSelectedEvent(ev);
                                  setIsEditing(false);
                                  setEditTitle(ev.title);
                                  setEditCaption(ev.caption);
                                }}
                                className={`w-full text-left p-1.5 rounded-xl text-[10px] transition-all relative overflow-hidden group border ${
                                  isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5' : 'cursor-pointer'
                                } ${style.cardBg}`}
                              >
                                {/* Left colored accent bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.barColor}`} />

                                <div className="pl-1 space-y-1">
                                  {/* Top meta row */}
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center space-x-1">
                                      <PlatformMicroIcon platform={ev.platform} />
                                      <span className="font-mono text-[9px] font-semibold text-slate-500">
                                        {formatPostTime(ev.scheduledFor)}
                                      </span>
                                    </div>
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                                  </div>

                                  {/* Title & Thumbnail row */}
                                  <div className="flex items-center space-x-1.5">
                                    {ev.mediaUrls && ev.mediaUrls[0] ? (
                                      <img
                                        src={ev.mediaUrls[0]}
                                        alt=""
                                        className="w-4 h-4 rounded object-cover shrink-0 border border-black/10"
                                      />
                                    ) : (
                                      <span className="text-[10px] shrink-0 opacity-80">
                                        {ev.format === 'REEL' ? '🎬' : ev.format === 'CAROUSEL' ? '📑' : '📸'}
                                      </span>
                                    )}
                                    <p className="font-bold text-slate-900 truncate leading-tight text-[10px]">
                                      {ev.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cell Footer */}
                        <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
                          <span>{dayEvents.length > 0 ? `${dayEvents.length} drop${dayEvents.length > 1 ? 's' : ''}` : ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'WEEK' && (
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/70 text-center text-xs font-bold text-neutral-700 py-3">
                  {weekDays.map((d, i) => {
                    const isDayToday = today && isSameDay(d, today);
                    return (
                      <div key={i} className="space-y-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <div className="flex items-center justify-center">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${
                            isDayToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-900'
                          }`}>
                            {d.getDate()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-7 divide-x divide-neutral-100 min-h-[500px]">
                  {weekDays.map((d, i) => {
                    const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.scheduledFor), d));
                    return (
                      <div
                        key={i}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnDate(e, d)}
                        className="p-2 space-y-2.5 hover:bg-indigo-50/20 transition-colors"
                      >
                        {dayEvents.map(ev => {
                          const style = getEventCardStyle(ev.title, ev.status);
                          return (
                            <div
                              key={ev.id}
                              draggable={ev.status !== 'PUBLISHED' && ev.status !== 'PUBLISHING'}
                              onDragStart={(e) => handleDragStart(e, ev)}
                              onClick={() => {
                                setSelectedEvent(ev);
                                setIsEditing(false);
                                setEditTitle(ev.title);
                                setEditCaption(ev.caption);
                              }}
                              className={`p-2.5 rounded-2xl text-xs cursor-pointer border shadow-xs space-y-1.5 transition-all hover:shadow-md hover:-translate-y-0.5 ${style.cardBg}`}
                            >
                              <div className="flex items-center justify-between">
                                <PlatformPill platform={ev.platform} />
                                <span className="font-mono text-[10px] font-bold text-neutral-500">
                                  {formatPostTime(ev.scheduledFor)}
                                </span>
                              </div>
                              <p className="font-bold text-neutral-900 line-clamp-1">{ev.title}</p>
                              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-snug">{ev.caption}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {viewMode === 'DAY' && (
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 space-y-5">
                <div className="pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                      Agenda for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Review all scheduled drops and execution times for today.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full w-fit">
                    {filteredEvents.filter(e => isSameDay(new Date(e.scheduledFor), currentDate)).length} scheduled drop(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredEvents
                    .filter(e => isSameDay(new Date(e.scheduledFor), currentDate))
                    .map(ev => {
                      const style = getEventCardStyle(ev.title, ev.status);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => {
                            setSelectedEvent(ev);
                            setIsEditing(false);
                            setEditTitle(ev.title);
                            setEditCaption(ev.caption);
                          }}
                          className="p-4 rounded-2xl border border-neutral-200/90 hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-xs hover:shadow-md"
                        >
                          <div className="flex items-start space-x-3.5">
                            {ev.mediaUrls && ev.mediaUrls[0] ? (
                              <img
                                src={ev.mediaUrls[0]}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-black/10"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-lg shrink-0">
                                {ev.format === 'REEL' ? '🎬' : '📸'}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center space-x-2">
                                <PlatformPill platform={ev.platform} />
                                <span className="font-mono text-xs font-bold text-neutral-600">
                                  {formatPostTime(ev.scheduledFor)}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-neutral-900 mt-1">{ev.title}</h4>
                              <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{ev.caption}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${style.badge}`}>
                              {ev.status}
                            </span>
                            <button
                              type="button"
                              className="px-3.5 py-1 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'LIST' && (
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] divide-y divide-neutral-100 overflow-hidden">
                {filteredEvents.map(ev => {
                  const style = getEventCardStyle(ev.title, ev.status);
                  return (
                    <div key={ev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                      <div className="flex items-start space-x-3.5">
                        {ev.mediaUrls && ev.mediaUrls[0] ? (
                          <img
                            src={ev.mediaUrls[0]}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-black/10"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-base shrink-0">
                            {ev.format === 'REEL' ? '🎬' : '📸'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <PlatformPill platform={ev.platform} />
                            <span className="font-mono text-[11px] text-neutral-500">
                              {new Date(ev.scheduledFor).toLocaleDateString()} at {formatPostTime(ev.scheduledFor)}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900 mt-1">{ev.title}</h4>
                          <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{ev.caption}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                          {ev.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedEvent(ev);
                            setIsEditing(false);
                            setEditTitle(ev.title);
                            setEditCaption(ev.caption);
                          }}
                          className="text-xs text-neutral-800 hover:text-neutral-950 font-bold px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* INSTAGRAM 9-GRID PREVIEW (FEED PLANNER) */}
            {viewMode === 'GRID' && (
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden p-6 space-y-6">
                {/* Instagram Mockup Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                        <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-xl">
                            OS
                          </div>
                        </div>
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-neutral-900 tracking-tight">@omnisocial_brand</h3>
                        <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-full">Visual Planner</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">Cadra Visual Studio • Multi-Channel Visual Dropping</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span><strong className="text-neutral-900 font-black">{filteredEvents.filter(e => e.platform?.toUpperCase() === 'INSTAGRAM' || !e.platform).length}</strong> drops</span>
                        <span><strong className="text-neutral-900 font-black">14.8K</strong> followers</span>
                        <span><strong className="text-neutral-900 font-black">219</strong> following</span>
                      </div>
                    </div>
                  </div>

                  {/* Feed Aesthetic Control & Quick Action */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] uppercase font-mono font-extrabold text-neutral-400">Aesthetic Rhythm</span>
                      <p className="text-xs font-bold text-emerald-600 flex items-center space-x-1 justify-end">
                        <Check className="w-3.5 h-3.5" />
                        <span>Harmonious 3x3 Balance</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInstantModal(true);
                        setGeneratedInstantPost(null);
                        setInstantTopic('');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-90 rounded-full shadow-md flex items-center space-x-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Drop to Grid</span>
                    </button>
                  </div>
                </div>

                {/* 3x3 Visual Feed Grid */}
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>Next 9 Scheduled & Recent Posts</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">Chronological feed order (Left-to-right, Top-to-bottom)</span>
                  </div>

                  {(() => {
                    const gridPosts = filteredEvents
                      .filter(e => e.platform?.toUpperCase() === 'INSTAGRAM' || e.platform?.toUpperCase() === 'ALL' || !e.platform)
                      .slice(0, 9);
                    const emptySlotsCount = Math.max(0, 9 - gridPosts.length);

                    return (
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-neutral-50/80 rounded-2xl border border-neutral-200/60">
                        {gridPosts.map((post, pIdx) => {
                          const hasMedia = post.mediaUrls && post.mediaUrls[0];
                          const formatEmoji = post.format === 'REEL' ? '🎬 REEL' : post.format === 'CAROUSEL' ? '📑 CAROUSEL' : '📸 PHOTO';

                          return (
                            <div
                              key={post.id || pIdx}
                              onClick={() => {
                                setSelectedEvent(post);
                                setIsEditing(false);
                                setEditTitle(post.title);
                                setEditCaption(post.caption);
                              }}
                              className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-black/10 cursor-pointer shadow-xs transition-all hover:shadow-lg hover:scale-[1.01]"
                            >
                              {hasMedia ? (
                                <img
                                  src={post.mediaUrls[0]}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full p-3 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col justify-between text-white">
                                  <span className="text-xl">{post.format === 'REEL' ? '🎬' : '📸'}</span>
                                  <div>
                                    <p className="text-[11px] font-bold line-clamp-2 leading-snug">{post.title}</p>
                                    <p className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">{post.caption}</p>
                                  </div>
                                </div>
                              )}

                              {/* Corner Badges */}
                              <div className="absolute top-2 right-2">
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs font-mono">
                                  {formatEmoji}
                                </span>
                              </div>

                              <div className="absolute bottom-2 left-2">
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                                  {new Date(post.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>

                              <div className="absolute bottom-2 right-2">
                                <span className={`w-2 h-2 rounded-full inline-block ${
                                  post.status === 'PUBLISHED' ? 'bg-emerald-400' : post.status === 'QUEUED' ? 'bg-indigo-400' : 'bg-rose-400'
                                }`} />
                              </div>

                              {/* Hover Overlay with Action Pill */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center space-y-2">
                                <p className="text-xs font-bold line-clamp-2">{post.title}</p>
                                <span className="px-3 py-1 bg-white text-neutral-900 rounded-full text-[10px] font-bold shadow-md">
                                  Inspect & Reschedule
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Empty Slots */}
                        {Array.from({ length: emptySlotsCount }).map((_, eIdx) => (
                          <div
                            key={`empty-${eIdx}`}
                            onClick={() => {
                              setShowInstantModal(true);
                              setGeneratedInstantPost(null);
                              setInstantTopic('');
                            }}
                            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group/slot"
                          >
                            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover/slot:bg-indigo-100 text-neutral-400 group-hover/slot:text-indigo-600 flex items-center justify-center transition-colors">
                              <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 group-hover/slot:text-indigo-700 mt-2">
                              Slot #{gridPosts.length + eIdx + 1}
                            </span>
                            <span className="text-[9px] text-neutral-400 group-hover/slot:text-indigo-500">Plan Visual</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Aesthetic Feed Optimization Tip Footer */}
                <div className="p-3.5 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-purple-100 rounded-2xl flex items-center justify-between text-xs text-purple-900">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Cadra Feed Tip:</strong> Alternate high-contrast product photos with educational Reels or Carousels in a chessboard layout to boost profile visitor conversions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* BENTO SIDEBAR: UPCOMING PIPELINE & VELOCITY STATS                     */}
          {/* ===================================================================== */}
          <div className="space-y-4">
            {/* Bento Card 1: Upcoming Publications */}
            <div className="bg-white p-5 rounded-[28px] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Pipeline</span>
                </h3>
                <span className="text-[10px] font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-full font-mono">
                  {upcomingPosts.length} Queued
                </span>
              </div>

              {upcomingPosts.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-neutral-400">No queued publications due.</p>
                  <button
                    onClick={() => {
                      setShowInstantModal(true);
                      setGeneratedInstantPost(null);
                      setInstantTopic('');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    + Schedule a quick post now
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setSelectedEvent(post);
                        setIsEditing(false);
                        setEditTitle(post.title);
                        setEditCaption(post.caption);
                      }}
                      className="p-3 rounded-2xl border border-neutral-100 hover:border-indigo-300 bg-neutral-50/60 hover:bg-indigo-50/20 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <PlatformPill platform={post.platform} />
                        <span className="font-mono text-[10px] font-semibold text-neutral-500">
                          {formatPostTime(post.scheduledFor)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-neutral-900 truncate">{post.title}</p>
                      <p className="text-[10px] text-neutral-500 line-clamp-1">{post.caption}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bento Card 2: Editorial Velocity & Health */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-5 rounded-[28px] border border-indigo-800/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">
                  Editorial Velocity
                </span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{events.filter(e => e.status === 'QUEUED').length} Drops Scheduled</p>
                <p className="text-[11px] text-indigo-200/80 mt-0.5">
                  {events.filter(e => e.status === 'PUBLISHED').length} posts published • Consistent multi-channel presence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInstantModal(true);
                  setGeneratedInstantPost(null);
                  setInstantTopic('');
                }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ Auto-Fill With 1-Click Drop</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* EVENT DETAIL & RESCHEDULE MODAL (ULTRA-PREMIUM REDESIGN)             */}
        {/* ===================================================================== */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-2">
                  <PlatformPill platform={selectedEvent.platform} />
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedEvent.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedEvent.status === 'QUEUED'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Alert if Failed */}
              {selectedEvent.status === 'FAILED' && selectedEvent.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Publication Failed</span>
                  </div>
                  <p className="text-[11px] text-rose-700">{selectedEvent.errorMessage}</p>
                </div>
              )}

              {/* Content Preview / Edit Form */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Caption</label>
                    <textarea
                      rows={3}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvent.mediaUrls && selectedEvent.mediaUrls[0] && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900">
                      <img
                        src={selectedEvent.mediaUrls[0]}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-base font-extrabold text-neutral-900">{selectedEvent.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 whitespace-pre-wrap">
                    {selectedEvent.caption}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-400 block text-[10px] font-bold uppercase">Scheduled Time</span>
                      <span className="font-bold text-neutral-800">{new Date(selectedEvent.scheduledFor).toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-400 block text-[10px] font-bold uppercase">Published Time</span>
                      <span className="font-bold text-neutral-800">{selectedEvent.publishedAt ? new Date(selectedEvent.publishedAt).toLocaleString() : 'Not published yet'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reschedule Picker */}
              {selectedEvent.status !== 'PUBLISHED' && selectedEvent.status !== 'PUBLISHING' && (
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <label className="block text-xs font-bold text-neutral-700">Change Scheduled Date &amp; Time</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="datetime-local"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveModalReschedule}
                      disabled={saving || !rescheduleDate}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shrink-0 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                    >
                      Save Date
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                {isEditing ? (
                  <div className="flex items-center space-x-2 w-full justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveContentEdit}
                      disabled={saving}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Update Post'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {selectedEvent.status !== 'PUBLISHED' && selectedEvent.status !== 'PUBLISHING' ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Content</span>
                      </button>
                    ) : (
                      <div></div>
                    )}
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-800 bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* INSTANT 1-CLICK POST & REEL STUDIO (START FROM ZERO)                */}
        {/* ===================================================================== */}
        {showInstantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white relative">
                <button
                  onClick={() => setShowInstantModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-black tracking-tight text-white">1-Click Quick Post &amp; Reel Studio</h2>
                    </div>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Create 1 viral post or vertical reel for today in 10 seconds — complete with captions, AI visuals, and Midjourney/Runway prompts!
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {!generatedInstantPost ? (
                  /* Form View */
                  <div className="space-y-5">
                    {/* Choose Format */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        1. Select Content Format:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'REEL', icon: '🎬', label: '9:16 Vertical Reel', desc: 'Instagram Reels, TikTok & Shorts with video motion prompt' },
                          { id: 'IMAGE', icon: '📸', label: '1:1 Square Photo', desc: 'High-res product or lifestyle image with Midjourney prompt' },
                          { id: 'CAROUSEL', icon: '📑', label: 'Multi-Slide Carousel', desc: 'Swipeable educational slides with Canva layout brief' }
                        ].map(fmt => (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setInstantPostType(fmt.id as any)}
                            className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                              instantPostType === fmt.id
                                ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/20 shadow-xs'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-base">{fmt.icon}</span>
                            <p className="text-xs font-bold text-slate-900 mt-1">{fmt.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{fmt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choose Preset Angle */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        2. Choose Marketing Angle (Proven Archetype):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'PROBLEM_SOLUTION', icon: '🔥', label: 'Problem & Modern Fix' },
                          { id: 'CUSTOMER_STORY', icon: '⭐', label: 'Customer Win / Review' },
                          { id: 'BEHIND_SCENES', icon: '🛠️', label: 'Behind-The-Scenes Craft' },
                          { id: 'SPECIAL_PROMO', icon: '⏰', label: 'Limited Launch Offer' }
                        ].map(pre => (
                          <button
                            key={pre.id}
                            type="button"
                            onClick={() => setInstantPreset(pre.id)}
                            className={`p-2.5 text-left rounded-xl border transition-all text-xs cursor-pointer ${
                              instantPreset === pre.id
                                ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-sm mb-1">{pre.icon}</div>
                            <div className="font-bold text-[11px] leading-tight">{pre.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Topic or Product Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        3. What product, offer, or topic are you posting about?
                      </label>
                      <textarea
                        rows={3}
                        value={instantTopic}
                        onChange={(e) => setInstantTopic(e.target.value)}
                        placeholder="e.g., Cold-pressed sandalwood acne soap that removes dark spots... or Smart AI billing software for shopkeepers..."
                        className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-sans bg-white"
                      />

                      {/* Quick 1-Click Starter Suggestions */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500">Quick 1-click ideas:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '🧴 Organic Acne Soap', val: 'Handmade organic turmeric and sandalwood soap that clears stubborn acne and marks' },
                            { label: '💻 AI Billing Software', val: 'Smart AI WhatsApp billing & GST inventory software that cuts closing time to 5 minutes' },
                            { label: '☕ Boutique Sourdough Pizza', val: 'Artisanal Italian wood-fired sourdough pizzas & unlimited weekend brunch buffet' },
                            { label: '🦷 Painless Teeth Whitening', val: 'FDA-certified 45-minute painless laser teeth whitening and invisible aligners' }
                          ].map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => setInstantTopic(chip.val)}
                              className="px-2.5 py-1 rounded-md text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition-all cursor-pointer"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Date and Platform */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Schedule For Date:</label>
                        <input
                          type="date"
                          value={instantScheduledDate}
                          onChange={(e) => setInstantScheduledDate(e.target.value)}
                          className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Target Social Platform:</label>
                        <select
                          value={instantPlatform}
                          onChange={(e) => setInstantPlatform(e.target.value)}
                          className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                        >
                          <option value="INSTAGRAM">Instagram</option>
                          <option value="LINKEDIN">LinkedIn</option>
                          <option value="FACEBOOK">Facebook</option>
                          <option value="TWITTER">Twitter / X</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleGenerateInstantPost}
                        disabled={isGeneratingInstant || !instantTopic.trim()}
                        className="px-7 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 rounded-full shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingInstant ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Generating 1-Click Post &amp; Visuals...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-300" />
                            <span>✨ Generate Instant Post &amp; Prompts (5s)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Generated Result & Preview View */
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">✨ Instant {generatedInstantPost.format} Ready!</span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                          {generatedInstantPost.targetPlatform}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGeneratedInstantPost(null)}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                      >
                        ← Edit Inputs
                      </button>
                    </div>

                    {/* Why This Post Works Lesson */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Why This Works (Marketing Rule for Beginners)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-800">{generatedInstantPost.whyThisPostWorks}</p>
                    </div>

                    {/* Visual Media Mockup & Caption Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Visual Asset */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-slate-500">Visual Asset Preview</span>
                        {generatedInstantPost.mediaUrl ? (
                          generatedInstantPost.format === 'REEL' ? (
                            <div className="relative w-32 h-52 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-md bg-slate-900 group">
                              <img
                                src={generatedInstantPost.mediaUrl}
                                alt="Reel visual preview"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg">
                                  <Play className="w-4 h-4 ml-0.5" />
                                </div>
                              </div>
                              <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                                9:16 Reel
                              </span>
                            </div>
                          ) : (
                            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-slate-300 shadow-xs bg-slate-100 group">
                              <img
                                src={generatedInstantPost.mediaUrl}
                                alt="Image preview"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                                1:1 Photo
                              </span>
                            </div>
                          )
                        ) : (
                          <div className="p-4 text-xs text-slate-400">No image generated yet.</div>
                        )}
                        <p className="text-[10px] text-slate-500">Asset will be automatically attached when deployed.</p>
                      </div>

                      {/* Right: Caption Preview */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-slate-700 uppercase">Post Caption:</span>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans max-h-56 overflow-y-auto leading-relaxed">
                          {generatedInstantPost.caption}
                        </div>
                      </div>
                    </div>

                    {/* External AI Tools Prompt Studio */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 rounded-2xl border border-purple-200/80 text-xs space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-1.5 font-black text-slate-900">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>External AI Tools Prompt Studio (1-Click Copy)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Want to generate in Midjourney, Runway, Kling, CapCut, or Canva? 1-Click copy below:
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAllPromptsForPost(generatedInstantPost, 'instant_all')}
                          className="px-3 py-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-lg shadow-xs flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{copiedPromptTab === 'instant_all' ? '✓ Copied All 4!' : 'Copy All 4 Prompts'}</span>
                        </button>
                      </div>

                      {/* Tool Tabs */}
                      {(() => {
                        let promptText = generatedInstantPost.midjourneyPrompt || generatedInstantPost.aiImagePrompt || '';
                        let guideText = 'Paste into Midjourney Discord (/imagine) or Web for 8k photorealistic quality:';
                        if (instantActivePromptTab === 'RUNWAY') {
                          promptText = generatedInstantPost.videoPrompt || 'Slow cinematic push-in toward product, 9:16 vertical motion, 4k commercial reel.';
                          guideText = 'Paste into Runway Gen-3 or Kling AI as text/image-to-video motion prompt:';
                        } else if (instantActivePromptTab === 'CAPCUT') {
                          promptText = generatedInstantPost.voiceoverScript || `[0:00 - 0:03 HOOK]: ${generatedInstantPost.hook}\n[0:03 - 0:10 VALUE]: Modern solution breakdown.\n[0:10 - 0:15 CTA]: Comment below for instant link!`;
                          guideText = 'Paste into CapCut Teleprompter or Voiceover generator:';
                        } else if (instantActivePromptTab === 'CANVA') {
                          promptText = generatedInstantPost.canvaDesignBrief || `Cover Headline: "${generatedInstantPost.title.slice(0, 35)}" | Style: Clean modern minimalism | Primary Colors: #4F46E5 (Indigo), #0F172A (Slate)`;
                          guideText = 'Design blueprint for Canva or Photoshop layout:';
                        }

                        return (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { id: 'MIDJOURNEY', label: '📸 Midjourney v6', badge: 'Photo' },
                                { id: 'RUNWAY', label: '🎬 Runway / Kling', badge: 'Video Motion' },
                                { id: 'CAPCUT', label: '🎙️ CapCut Voiceover', badge: '15s Script' },
                                { id: 'CANVA', label: '🎨 Canva Layout', badge: 'Design' }
                              ].map(tab => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setInstantActivePromptTab(tab.id as any)}
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                                    instantActivePromptTab === tab.id
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{tab.label}</span>
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                    instantActivePromptTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {tab.badge}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">{guideText}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPromptWithKey(promptText, `instant_${instantActivePromptTab}`)}
                                  className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 flex items-center space-x-1 transition-all cursor-pointer"
                                >
                                  <Copy className="w-3 h-3 text-indigo-600" />
                                  <span>{copiedPromptTab === `instant_${instantActivePromptTab}` ? '✓ Copied!' : 'Copy Prompt'}</span>
                                </button>
                              </div>
                              <p className="text-[11px] leading-relaxed font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap select-all">
                                {promptText}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Deploy Action Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setGeneratedInstantPost(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-full cursor-pointer"
                      >
                        ← Back to Edit
                      </button>

                      <button
                        type="button"
                        onClick={handleDeployInstantPost}
                        disabled={isDeployingInstant}
                        className="px-7 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isDeployingInstant ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Scheduling into Calendar...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span>🚀 1-Click Deploy This Post to Calendar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* AI CAMPAIGN ARCHITECT MODAL (MARKETING START FROM ZERO)                */}
        {/* ===================================================================== */}
        {showArchitectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Top Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white relative">
                <button
                  onClick={() => setShowArchitectModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-black tracking-tight text-white">AI Campaign Architect</h2>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        Start From Zero
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      No marketing knowledge required. AI maps out your complete sequential campaign directly into your calendar.
                    </p>
                  </div>
                </div>

                {/* Wizard Progress Steps */}
                <div className="grid grid-cols-4 gap-2 mt-5 text-center text-xs font-semibold">
                  {[
                    { step: 1, label: '1. Product Brief' },
                    { step: 2, label: '2. Goal & Audience' },
                    { step: 3, label: '3. Sprint Cadence' },
                    { step: 4, label: '4. Roadmap Review' }
                  ].map(s => (
                    <div
                      key={s.step}
                      className={`py-1.5 px-2 rounded-full transition-all border ${
                        wizardStep === s.step
                          ? 'bg-white text-indigo-950 font-bold border-white shadow-sm'
                          : wizardStep > s.step
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* STEP 1: PRODUCT DESCRIPTION & MULTI-INDUSTRY BLUEPRINTS */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">1. What are you selling or marketing?</h3>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider">
                          Zero Marketing Knowledge Required
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Select a pre-configured industry blueprint below to fill in 1-click, or describe your own business in plain simple words.
                      </p>
                    </div>

                    {/* Category Filter Pills & Blueprints */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Choose Your Industry Blueprint:</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {INDUSTRY_QUICK_TEMPLATES.filter(t => selectedTemplateCategory === 'ALL' || t.category === selectedTemplateCategory).length} Blueprints available
                        </span>
                      </div>

                      {/* Filter Badges */}
                      <div className="flex flex-wrap gap-1.5 pb-1">
                        {[
                          { id: 'ALL', label: '🌟 All Industries' },
                          { id: 'SOFTWARE', label: '💻 Software & SaaS' },
                          { id: 'MARKETING', label: '📢 Marketing Agency' },
                          { id: 'ECOMMERCE', label: '🛍️ E-Commerce / D2C' },
                          { id: 'FOOD', label: '☕ Food & Cafe' },
                          { id: 'HEALTH', label: '🦷 Clinic & Health' },
                          { id: 'COACHING', label: '🏋️ Coaching & EdTech' },
                          { id: 'REALESTATE', label: '🏠 Real Estate & Interiors' },
                          { id: 'CONSULTING', label: '⚖️ Tax & Consulting' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedTemplateCategory(cat.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                              selectedTemplateCategory === cat.id
                                ? 'bg-indigo-600 text-white shadow-sm font-bold scale-[1.02]'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Blueprint Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
                        {INDUSTRY_QUICK_TEMPLATES
                          .filter((t) => selectedTemplateCategory === 'ALL' || t.category === selectedTemplateCategory)
                          .map((tpl) => {
                            const isCurrent = architectProductDesc.includes(tpl.brandPlaceholder) || (architectProductDesc.length > 20 && architectProductDesc === tpl.fullPrompt);
                            return (
                              <button
                                key={tpl.id}
                                type="button"
                                onClick={() => handleApplyIndustryTemplate(tpl)}
                                className={`p-3 text-left rounded-xl border transition-all relative flex flex-col justify-between ${
                                  isCurrent
                                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-400/30 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                                      <span className="text-base">{tpl.icon}</span>
                                      <span className="line-clamp-1">{tpl.title}</span>
                                    </div>
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                                      {tpl.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {tpl.shortDesc}
                                  </p>
                                </div>
                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                  <span className="text-slate-400 font-mono">Placeholder: {tpl.brandPlaceholder}</span>
                                  <span className="font-bold text-indigo-600 flex items-center space-x-0.5">
                                    <span>Apply Blueprint</span>
                                    <span>⚡</span>
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Brief Editor Box */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                          <span>Your Product / Offer Description:</span>
                          <span className="text-[11px] font-normal text-slate-500">(Edit below or customize brand name)</span>
                        </label>
                        {architectProductDesc && (
                          <button
                            type="button"
                            onClick={() => setArchitectProductDesc('')}
                            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Clear Text</span>
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <textarea
                          rows={4}
                          value={architectProductDesc}
                          onChange={(e) => setArchitectProductDesc(e.target.value)}
                          placeholder="e.g., Brand: [YourBrandName]&#10;Product: Smart AI billing software for retail shopkeepers that cuts accounts closing time from 2 hours to 5 minutes..."
                          className="w-full text-xs leading-relaxed p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-inner font-sans bg-white"
                        />
                      </div>

                      {/* Helpful Guide Notice */}
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 flex items-start space-x-2 text-[11px] text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Next Step Tip:</span>{' '}
                          {architectProductDesc.includes('[') && architectProductDesc.includes(']') ? (
                            <span>
                              Replace the bracketed brand placeholder (like <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">[Brand Name]</code>) with your actual company name before proceeding!
                            </span>
                          ) : (
                            <span>
                              You can customize your pricing, location, or guarantee. When ready, click <b>"Continue to Audience & Goal"</b>.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Footer with Express Launch */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleExpressLaunchRoadmap}
                        disabled={isGeneratingRoadmap || !architectProductDesc.trim()}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 rounded-full shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingRoadmap ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing 7-Day Sprint...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>🚀 1-Click Express Launch in 5s (Recommended)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!architectProductDesc.trim()) {
                            setNotice({ type: 'error', text: 'Please choose an industry blueprint or describe your product before proceeding.' });
                            return;
                          }
                          setWizardStep(2);
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center space-x-2 transition-all cursor-pointer"
                      >
                        <span>Customize Sprint Details</span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: BUSINESS MODEL & GOAL */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Select your business model & primary goal</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Different businesses require different storytelling styles. Choose what fits your offering.
                      </p>
                    </div>

                    {/* Business Archetypes */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Business Model</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'PHYSICAL_PRODUCT',
                            title: 'Physical Products / D2C',
                            desc: 'Clothing, gadgets, cosmetics, food drops. Emphasizes aesthetic unboxings and transformation reels.',
                            icon: ShoppingBag
                          },
                          {
                            id: 'LOCAL_BUSINESS',
                            title: 'Local Store / Clinic / Cafe',
                            desc: 'Walk-ins, local footfall, dental clinics, salons, restaurants. Emphasizes behind-the-scenes & location.',
                            icon: Store
                          },
                          {
                            id: 'B2B_SERVICE',
                            title: 'B2B Agency / Freelancer',
                            desc: 'High-ticket retainers, design, software, consulting. Emphasizes case studies & free audits.',
                            icon: Briefcase
                          },
                          {
                            id: 'CREATOR_COACH',
                            title: 'Creator / Coach / EdTech',
                            desc: 'Courses, communities, digital downloads. Emphasizes myth-busting & comment-to-DM lead magnets.',
                            icon: GraduationCap
                          }
                        ].map((model) => {
                          const IconComp = model.icon;
                          const isSelected = architectBusinessType === model.id;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => setArchitectBusinessType(model.id as any)}
                              className={`p-4 text-left rounded-2xl border transition-all flex items-start space-x-3 ${
                                isSelected
                                  ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-900">{model.title}</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{model.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary Campaign Goal */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Primary Campaign Goal</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            id: 'SALES',
                            title: 'Direct Product Sales',
                            desc: 'Drive checkout orders & immediate cashflow',
                            icon: Flame,
                            color: 'text-rose-600'
                          },
                          {
                            id: 'LEADS',
                            title: 'Lead Inquiries & Calls',
                            desc: 'Capture DM inquiries & consultation bookings',
                            icon: Target,
                            color: 'text-indigo-600'
                          },
                          {
                            id: 'AWARENESS',
                            title: 'Brand Reach & Followers',
                            desc: 'Maximize impressions, saves & viral shares',
                            icon: Sparkles,
                            color: 'text-amber-600'
                          }
                        ].map((goal) => {
                          const GoalIcon = goal.icon;
                          const isSelected = architectGoal === goal.id;
                          return (
                            <button
                              key={goal.id}
                              type="button"
                              onClick={() => setArchitectGoal(goal.id as any)}
                              className={`p-3.5 text-left rounded-2xl border transition-all ${
                                isSelected
                                  ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <GoalIcon className={`w-4 h-4 mb-1.5 ${goal.color}`} />
                              <p className="text-xs font-bold text-slate-900">{goal.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{goal.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-full"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setWizardStep(3)}
                        className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md flex items-center space-x-2 transition-all"
                      >
                        <span>Continue to Sprint Duration</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SPRINT CADENCE & SCHEDULE */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Sprint duration & channel distribution</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose your campaign length. AI will map the perfect sequential cadence across days.
                      </p>
                    </div>

                    {/* Sprint Duration Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          days: 7,
                          badge: 'Recommended for Beginners',
                          title: '7-Day Flash Launch',
                          desc: 'Fast validation, product drops, or limited-time sales. High urgency and zero audience burnout.'
                        },
                        {
                          days: 14,
                          badge: 'Highest Trust & Conversion',
                          title: '14-Day Authority Funnel',
                          desc: 'Full ramp-up for services, courses, or high-ticket offers. 1 week warm-up + 1 week closing.'
                        },
                        {
                          days: 30,
                          badge: 'Total Consistency',
                          title: '30-Day Growth Engine',
                          desc: 'Complete month-long evergreen calendar with structured rotation of Hook, Story, and Offer.'
                        }
                      ].map((sprint) => {
                        const isSelected = architectDuration === sprint.days;
                        return (
                          <button
                            key={sprint.days}
                            type="button"
                            onClick={() => setArchitectDuration(sprint.days as any)}
                            className={`p-4 text-left rounded-2xl border transition-all relative ${
                              isSelected
                                ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white mb-2 inline-block">
                              {sprint.badge}
                            </span>
                            <p className="text-sm font-bold text-slate-900">{sprint.title}</p>
                            <p className="text-xs text-indigo-600 font-extrabold mt-0.5">{sprint.days} Days Sequence</p>
                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{sprint.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Target Platforms */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Social Platforms</label>
                      <div className="flex flex-wrap gap-2">
                        {['INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TWITTER'].map(plat => {
                          const isChecked = architectPlatforms.includes(plat);
                          return (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  if (architectPlatforms.length > 1) {
                                    setArchitectPlatforms(architectPlatforms.filter(p => p !== plat));
                                  }
                                } else {
                                  setArchitectPlatforms([...architectPlatforms, plat]);
                                }
                              }}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                                isChecked
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <Check className={`w-3.5 h-3.5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                              <span>{plat}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Campaign Start Date</label>
                      <input
                        type="date"
                        value={architectStartDate}
                        onChange={(e) => setArchitectStartDate(e.target.value)}
                        className="p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
                      />
                    </div>

                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() => setWizardStep(2)}
                        className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-full"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleGenerateRoadmap}
                        disabled={isGeneratingRoadmap}
                        className="px-7 py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {isGeneratingRoadmap ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Synthesizing Campaign with Eugene Schwartz & StoryBrand Frameworks...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>⚡ Generate Marketing Roadmap</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: ROADMAP REVIEW & DEPLOY */}
                {wizardStep === 4 && generatedRoadmap && (
                  <div className="space-y-6">
                    {/* Campaign Header Overview */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black uppercase text-indigo-700">Strategy Blueprint Ready</span>
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                            {generatedRoadmap.posts.length} Posts Sequence
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {generatedRoadmap.campaignSummary?.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center space-x-1">
                          <Compass className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{generatedRoadmap.campaignSummary?.framework}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={handleGenerateAllMedia}
                          disabled={generatingAllMedia || isDeployingCampaign}
                          className="px-4 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 hover:border-indigo-400 rounded-full shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${generatingAllMedia ? 'animate-spin' : ''}`} />
                          <span>{generatingAllMedia ? 'Generating All Visuals...' : 'Generate Visuals For All Days'}</span>
                        </button>
                        <button
                          onClick={handleDeployCampaign}
                          disabled={isDeployingCampaign || generatingAllMedia}
                          className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
                        >
                          {isDeployingCampaign ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Scheduling Posts into Calendar...</span>
                            </>
                          ) : (
                            <>
                              <Rocket className="w-4 h-4" />
                              <span>🚀 1-Click Deploy to Calendar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Sequential Day-by-Day Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Sequential Content Roadmap (Day 1 to Day {generatedRoadmap.posts.length})
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Click any day to inspect shooting instructions & caption
                        </span>
                      </div>

                      {generatedRoadmap.posts.map((post: any, idx: number) => {
                        const isExpanded = expandedPostIndex === idx;
                        const phaseColorClass =
                          post.phaseBadgeColor === 'amber'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : post.phaseBadgeColor === 'blue'
                            ? 'bg-sky-100 text-sky-900 border-sky-300'
                            : post.phaseBadgeColor === 'purple'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : post.phaseBadgeColor === 'emerald'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300';

                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                              isExpanded ? 'border-indigo-400 bg-white shadow-md' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                            }`}
                          >
                            {/* Card Accordion Header */}
                            <div
                              onClick={() => setExpandedPostIndex(isExpanded ? null : idx)}
                              className="p-4 flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                  D{post.dayNumber}
                                </span>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${phaseColorClass}`}>
                                      {post.phaseLabel}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                                      [{post.format}] • {post.targetPlatform}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-900 mt-1">{post.title}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-semibold text-slate-400">
                                  {new Date(post.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-xs text-indigo-600 font-bold">{isExpanded ? 'Hide ▲' : 'View ▼'}</span>
                              </div>
                            </div>

                            {/* Card Expanded Details */}
                            {isExpanded && (
                              <div className="p-4 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
                                {/* Marketing Lesson Callout */}
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                                  <div className="font-bold flex items-center space-x-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Why This Post Works (Marketing Rule for Beginners)</span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-amber-800">{post.whyThisPostWorks}</p>
                                </div>

                                {/* Exact Photo to Shoot / Upload */}
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                                  <div className="font-bold flex items-center space-x-1.5 text-emerald-900">
                                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Exact Photo to Shoot / Upload (Smartphone Guide)</span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-emerald-800">
                                    {post.photoUploadGuide || "Snap a clean photo in bright natural lighting matching this post's theme."}
                                  </p>
                                </div>

                                {/* External AI Tools Prompt Studio */}
                                <div className="p-4 bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 rounded-2xl border border-purple-200/80 text-xs space-y-3">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div>
                                      <div className="flex items-center space-x-1.5 font-black text-slate-900">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                        <span>External AI Tools Prompt Studio (1-Click Copy)</span>
                                        <span className="text-[9px] bg-purple-200 text-purple-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                                          Ready To Paste
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        Prefer external tools like Midjourney, Runway, Kling, CapCut, or Canva? Copy tailored formulas below:
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleCopyAllPromptsForPost(post, `card_${idx}_all`)}
                                      className="px-3 py-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-lg shadow-xs flex items-center space-x-1.5 transition-all shrink-0 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>{copiedPromptTab === `card_${idx}_all` ? '✓ Copied All 4!' : 'Copy All 4 Prompts'}</span>
                                    </button>
                                  </div>

                                  {/* Tabs for External AI Tools */}
                                  {(() => {
                                    const currentTab = cardActivePromptTab[idx] || 'MIDJOURNEY';
                                    const setTab = (t: 'MIDJOURNEY' | 'RUNWAY' | 'CAPCUT' | 'CANVA') => {
                                      setCardActivePromptTab(prev => ({ ...prev, [idx]: t }));
                                    };

                                    let activePromptText = post.midjourneyPrompt || post.aiImagePrompt || '';
                                    let activeToolGuide = 'Paste directly into Midjourney Discord (/imagine) or Web for 8k photorealistic commercial quality:';
                                    if (currentTab === 'RUNWAY') {
                                      activePromptText = post.videoPrompt || `Slow cinematic push-in toward ${post.title.toLowerCase()}. Soft volumetric studio lighting, smooth micro-movements, high-end 4k commercial motion, 9:16 vertical video.`;
                                      activeToolGuide = 'Paste into Runway Gen-3, Kling AI, or Luma Dream Machine as Text-to-Video or Image-to-Video motion prompt:';
                                    } else if (currentTab === 'CAPCUT') {
                                      activePromptText = post.voiceoverScript || `[0:00 - 0:03 HOOK]: ${post.hook}\n[0:03 - 0:10 VALUE]: ${post.caption ? post.caption.slice(0, 110).replace(/\n/g, ' ') : 'Here is the step-by-step breakdown.'}...\n[0:10 - 0:15 CTA]: Comment below to get the direct link in your DMs!`;
                                      activeToolGuide = 'Paste into CapCut Teleprompter or AI Voiceover generator (word-by-word spoken 15s script):';
                                    } else if (currentTab === 'CANVA') {
                                      activePromptText = post.canvaDesignBrief || `Cover Headline: "${post.title.slice(0, 35)}" | Style: Clean modern minimalism | Primary Colors: #4F46E5 (Indigo), #0F172A (Slate), #F59E0B (Amber) | Safe Zone: Center-aligned typography.`;
                                      activeToolGuide = 'Design blueprint for Canva, Photoshop, or Figma layout (Text overlay & color scheme):';
                                    }

                                    return (
                                      <div className="space-y-2">
                                        {/* Tool Tab Buttons */}
                                        <div className="flex flex-wrap gap-1.5">
                                          {[
                                            { id: 'MIDJOURNEY', label: '📸 Midjourney v6', badge: 'Photo' },
                                            { id: 'RUNWAY', label: '🎬 Runway / Kling', badge: 'Video Motion' },
                                            { id: 'CAPCUT', label: '🎙️ CapCut Voiceover', badge: '15s Script' },
                                            { id: 'CANVA', label: '🎨 Canva Layout', badge: 'Design' }
                                          ].map(tab => (
                                            <button
                                              key={tab.id}
                                              type="button"
                                              onClick={() => setTab(tab.id as any)}
                                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1.5 ${
                                                currentTab === tab.id
                                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                              }`}
                                            >
                                              <span>{tab.label}</span>
                                              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                                currentTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                              }`}>
                                                {tab.badge}
                                              </span>
                                            </button>
                                          ))}
                                        </div>

                                        {/* Prompt Display Box */}
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-slate-500 font-medium">{activeToolGuide}</span>
                                            <button
                                              type="button"
                                              onClick={() => handleCopyPromptWithKey(activePromptText, `card_${idx}_${currentTab}`)}
                                              className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 flex items-center space-x-1 transition-all cursor-pointer"
                                            >
                                              <Copy className="w-3 h-3 text-indigo-600" />
                                              <span>{copiedPromptTab === `card_${idx}_${currentTab}` ? '✓ Copied!' : 'Copy Prompt'}</span>
                                            </button>
                                          </div>
                                          <p className="text-[11px] leading-relaxed font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap select-all">
                                            {activePromptText}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>

                                {/* 1-Click AI Media Generator Panel */}
                                <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 text-xs space-y-3">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                                    <div>
                                      <span className="font-extrabold text-indigo-950 flex items-center space-x-1.5 text-xs">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                        <span>1-Click AI Visual &amp; Reel Generator</span>
                                      </span>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        Generate the exact photorealistic product photo or vertical 9:16 reel in 1 click.
                                      </p>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                      {post.format === 'REEL' ? (
                                        <button
                                          type="button"
                                          disabled={generatingMediaIndex === idx}
                                          onClick={() => handleGenerateMediaForPost(idx, 'REEL')}
                                          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-md flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                        >
                                          {generatingMediaIndex === idx ? (
                                            <>
                                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                              <span>Generating AI Reel...</span>
                                            </>
                                          ) : (
                                            <>
                                              <Video className="w-3.5 h-3.5 text-amber-300" />
                                              <span>🎬 1-Click Generate AI Reel (9:16)</span>
                                            </>
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled={generatingMediaIndex === idx}
                                          onClick={() => handleGenerateMediaForPost(idx, 'IMAGE')}
                                          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                        >
                                          {generatingMediaIndex === idx ? (
                                            <>
                                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                              <span>Generating AI Photo...</span>
                                            </>
                                          ) : (
                                            <>
                                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                              <span>✨ 1-Click Generate AI Photo</span>
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Live Visual Preview Container */}
                                  {post.mediaUrl ? (
                                    <div className="p-3 bg-white rounded-xl border border-indigo-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                                      {post.format === 'REEL' || post.aspectRatio === '9:16' ? (
                                        <div className="relative w-28 h-44 rounded-xl overflow-hidden border-2 border-purple-500 shadow-md shrink-0 group bg-slate-900">
                                          <img
                                            src={post.mediaUrl}
                                            alt="Reel visual preview"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                          />
                                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                            <div className="w-9 h-9 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg">
                                              <Play className="w-4 h-4 ml-0.5" />
                                            </div>
                                          </div>
                                          <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                                            9:16 Reel
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-300 shadow-xs shrink-0 group bg-slate-100">
                                          <img
                                            src={post.mediaUrl}
                                            alt="Product photo preview"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                          />
                                          <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                                            1:1 Photo
                                          </span>
                                        </div>
                                      )}

                                      <div className="space-y-1.5 flex-1 text-left">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                                            <Check className="w-3 h-3 text-emerald-600" />
                                            <span>AI Visual Ready &amp; Attached</span>
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-400">
                                            {post.aspectRatio || (post.format === 'REEL' ? '9:16 Vertical' : '1:1 Square')}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                                          This AI asset is saved and will be scheduled automatically with your publication.
                                        </p>
                                        <div className="flex items-center space-x-3 pt-1">
                                          <button
                                            type="button"
                                            disabled={generatingMediaIndex === idx}
                                            onClick={() => handleGenerateMediaForPost(idx, post.format === 'REEL' ? 'REEL' : 'IMAGE')}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                                          >
                                            <RefreshCw className={`w-3 h-3 ${generatingMediaIndex === idx ? 'animate-spin' : ''}`} />
                                            <span>Regenerate Variation</span>
                                          </button>
                                          <span className="text-slate-300">•</span>
                                          <button
                                            type="button"
                                            onClick={() => handleRemovePhotoForPost(idx)}
                                            className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white/70 rounded-xl border border-dashed border-indigo-300 text-[11px] text-slate-500 gap-2">
                                      <span>No visual attached yet. Click the button above to generate with AI or upload from device:</span>
                                      <label className="px-3 py-1 text-[11px] font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer flex items-center space-x-1 transition-all shrink-0">
                                        <Upload className="w-3 h-3 text-indigo-500" />
                                        <span>Upload File</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handlePhotoUploadForPost(e, idx)}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>

                                {/* 5-Sec Phone Camera Brief */}
                                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 space-y-1">
                                  <div className="font-bold flex items-center space-x-1.5">
                                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>5-Second Phone Video / Visual Instruction</span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-indigo-800">{post.bRollGuide}</p>
                                </div>

                                {/* Full Post Caption */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-slate-700 uppercase">Post Caption</label>
                                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                                    {post.caption}
                                  </div>
                                </div>

                                {/* Comment to DM & First Comment */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                    <span className="font-bold text-slate-700 text-[10px] uppercase block">Lead Trigger:</span>
                                    <span className="font-mono text-indigo-600 font-bold">Comment &quot;{post.ctaKeyword || 'GO'}&quot; for instant DM</span>
                                  </div>
                                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                                    <span className="font-bold text-slate-700 text-[10px] uppercase block">First Comment Autopilot:</span>
                                    <span className="text-slate-600 text-[11px] truncate block">{post.firstComment || 'Hashtags & link scheduled'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setWizardStep(3)}
                        className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-full"
                      >
                        ← Modify Cadence
                      </button>
                      <button
                        onClick={handleDeployCampaign}
                        disabled={isDeployingCampaign}
                        className="px-8 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {isDeployingCampaign ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Deploying Campaign...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4" />
                            <span>🚀 1-Click Deploy to Calendar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* CAMPAIGN DEPLOY SUCCESS CELEBRATION MODAL                             */}
        {/* ===================================================================== */}
        {deploySuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Campaign Deployed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  All <strong className="text-slate-800">{deploySuccessModal.scheduledCount} posts</strong> have been populated across your editorial calendar with phase tags, ready for automated publishing.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-left">
                <p className="font-bold text-slate-800">{deploySuccessModal.campaignName}</p>
                <p className="text-slate-500">
                  Starts: {new Date(deploySuccessModal.firstPostDate).toLocaleDateString()} • Ends: {new Date(deploySuccessModal.lastPostDate).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setDeploySuccessModal(null)}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-md transition-all"
              >
                View My Scheduled Calendar
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SHARE CALENDAR / MAGIC CLIENT REVIEW LINK MODAL (PLANABLE STYLE)      */}
        {/* ===================================================================== */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                      Share Calendar Review Portal
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Zero-login review link for clients and leadership (Planable style)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {shareLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  <p className="text-xs font-bold text-neutral-600">Generating secure review link...</p>
                </div>
              ) : shareData ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-indigo-950">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Frictionless Client Feedback</span>
                    </div>
                    <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                      Anyone with this link can preview upcoming posts, click &ldquo;Approve&rdquo;, or submit one-click change requests directly without needing an account.
                    </p>
                  </div>

                  {/* Copy Link Input Bar */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">
                      Magic Public Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={shareData.reviewUrl}
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-700 font-mono select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      >
                        {copiedShareLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={shareData.reviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl border border-neutral-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/20 text-xs font-bold text-neutral-800 hover:text-indigo-900 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="w-4 h-4 text-indigo-600" />
                      <span>Preview Portal</span>
                    </a>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi! Here is the latest social media content calendar for your review: ${shareData.reviewUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 text-xs font-bold text-emerald-800 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>💬 Share WhatsApp</span>
                    </a>
                  </div>

                  {/* Security Note */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Permissions: Read & Comment only</span>
                    <span>Token: Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-neutral-500">Failed to generate review link.</p>
                  <button
                    onClick={handleOpenShareModal}
                    className="px-4 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-bold"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
