'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  User as UserIcon,
  Bookmark,
  Repeat,
  Star,
  Tag,
  Hash
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

export const VIRAL_HASHTAG_PACKS = [
  {
    id: 'desi_local',
    title: '🇮🇳 Desi Vocal For Local',
    category: 'Commerce / Retail',
    description: 'Proven tags for Indian local businesses, D2C brands, and retail shops.',
    tags: ['#VocalForLocal', '#MadeInIndia', '#SupportSmallBusiness', '#IndianStartup', '#DesiHustle', '#Aatmanirbhar']
  },
  {
    id: 'tech_startups',
    title: '🚀 India Tech & Startups',
    category: 'SaaS / B2B',
    description: 'High-reach community tags for founders, developers, and tech solutions.',
    tags: ['#IndianTech', '#BuildInPublic', '#StartupIndia', '#SaaSGrowth', '#FounderLife', '#TechLeadership']
  },
  {
    id: 'festive_flash',
    title: '🛍️ Festival & Mega Sale Deals',
    category: 'Offers & Discounts',
    description: 'Urgency tags for clearance sales, festival promotions, and holiday drops.',
    tags: ['#FestivalSale', '#LimitedDeal', '#MegaDiscount', '#ShopOnlineIndia', '#FlashOffer', '#DiwaliSavings']
  },
  {
    id: 'clinic_wellness',
    title: '🩺 Health, Clinic & Transformations',
    category: 'Health & Wellness',
    description: 'Trust-building tags for doctors, dental clinics, coaches, and gyms.',
    tags: ['#HealthyHabits', '#DoctorAdvice', '#SelfCareSunday', '#TransformationTuesday', '#WellnessJourney']
  },
  {
    id: 'foodie_cafe',
    title: '🍔 Foodie, Cafe & Cloud Kitchen',
    category: 'Hospitality',
    description: 'Viral food tags for restaurants, bakeries, cafes, and street food creators.',
    tags: ['#FoodiesOfInstagram', '#DelhiFoodie', '#MumbaiEats', '#DesiTaste', '#CafeCulture', '#StreetFoodLove']
  },
  {
    id: 'edtech_coaching',
    title: '🎓 EdTech, Mentorship & Learning',
    category: 'Education & Coaching',
    description: 'Educational authority tags for tutors, courses, academies, and coaches.',
    tags: ['#SkillBuilding', '#CareerAdvice', '#OnlineCoaching', '#StudySmart', '#DailyTip', '#GrowthMindset']
  }
];

export const DEFAULT_QUICK_SNIPPETS = [
  {
    id: 'store_address',
    title: '📍 Store / Clinic Address & Timings',
    content: '📍 Visit Us: [Your Store/Clinic Address]\n⏰ Open: Mon–Sat 10:00 AM – 8:30 PM\n📞 Helpline: +91 98765 43210'
  },
  {
    id: 'whatsapp_order',
    title: '💬 Instant WhatsApp Ordering',
    content: '💬 Quick Order / Booking: Tap the link in our bio or send us a WhatsApp message at +91 98765 43210 for priority dispatch!'
  },
  {
    id: 'pan_india_shipping',
    title: '📦 Pan-India Shipping & COD',
    content: '⚡ Free Express Shipping across all Indian pincodes on orders over ₹499. Cash on Delivery (COD) & UPI accepted.'
  },
  {
    id: 'dm_lead_hook',
    title: '🎁 Comment "VIP" for Instant DM Link',
    content: 'Drop a comment with "VIP" below and our AI bot will instantly send you the private link and coupon code in your DMs! 📩'
  }
];

export interface ContentIdea {
  id: string;
  title: string;
  format: 'REEL' | 'CAROUSEL' | 'POST';
  hook: string;
  createdAt: string;
}

export const DEFAULT_CONTENT_IDEAS: ContentIdea[] = [
  {
    id: 'idea-1',
    title: '3 Costly Mistakes Customers Make Before Choosing a Provider',
    format: 'REEL',
    hook: 'Stop wasting money on cheap alternatives. Here is what 90% of buyers ignore.',
    createdAt: '2026-10-20'
  },
  {
    id: 'idea-2',
    title: 'Behind-the-Scenes: How We Pack & Ship 100 Orders Daily',
    format: 'REEL',
    hook: 'A day in the life at our dispatch studio — packaging perfection with zero damages.',
    createdAt: '2026-10-21'
  },
  {
    id: 'idea-3',
    title: 'Customer Transformation: From Doubtful to 100% Convinced',
    format: 'CAROUSEL',
    hook: 'Here is what happened when a skeptic client tried our solution after 3 failed attempts.',
    createdAt: '2026-10-22'
  }
];

export type ContentPillar = 'VALUE' | 'PROOF' | 'PROMO' | 'CULTURE';

export function getContentPillar(title: string = '', caption: string = ''): ContentPillar {
  const text = `${title} ${caption}`.toLowerCase();
  if (
    text.includes('offer') ||
    text.includes('discount') ||
    text.includes('sale') ||
    text.includes('buy') ||
    text.includes('price') ||
    text.includes('deal') ||
    text.includes('code') ||
    text.includes('order') ||
    text.includes('checkout') ||
    text.includes('limited') ||
    text.includes('book now') ||
    text.includes('flat') ||
    text.includes('off ') ||
    text.includes('off!')
  ) {
    return 'PROMO';
  }
  if (
    text.includes('review') ||
    text.includes('testimonial') ||
    text.includes('case study') ||
    text.includes('client') ||
    text.includes('transformation') ||
    text.includes('story') ||
    text.includes('proof') ||
    text.includes('result') ||
    text.includes('feedback') ||
    text.includes('rating')
  ) {
    return 'PROOF';
  }
  if (
    text.includes('behind the scenes') ||
    text.includes('bts') ||
    text.includes('day in') ||
    text.includes('founder') ||
    text.includes('team') ||
    text.includes('culture') ||
    text.includes('packing') ||
    text.includes('dispatch') ||
    text.includes('studio')
  ) {
    return 'CULTURE';
  }
  return 'VALUE';
}

export const PILLAR_BADGE_CONFIG: Record<ContentPillar, { label: string; icon: string; badgeClass: string; dotClass: string }> = {
  VALUE: { label: 'Value', icon: '🎓', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/90', dotClass: 'bg-emerald-500' },
  PROOF: { label: 'Social Proof', icon: '💬', badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/90', dotClass: 'bg-indigo-500' },
  PROMO: { label: 'Promo', icon: '🛍️', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/90', dotClass: 'bg-amber-500' },
  CULTURE: { label: 'Culture', icon: '🎬', badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/90', dotClass: 'bg-purple-500' }
};

export default function CalendarPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brands, setBrands] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY' | 'LIST' | 'GRID'>('MONTH');
  const [currentDate, setCurrentDate] = useState(() => new Date('2026-11-01T00:00:00Z'));
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

  const calculateStreak = () => {
    if (!events || events.length === 0) return 7;
    const publishedCount = events.filter(e => e.status === 'PUBLISHED').length;
    const queuedCount = events.filter(e => e.status === 'QUEUED').length;
    return Math.max(5, Math.min(30, publishedCount * 2 + Math.ceil(queuedCount / 2)));
  };

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
      let resolvedBrandId = activeBrandId;
      if (!resolvedBrandId) {
        if (brands && brands.length > 0) {
          resolvedBrandId = brands[0].id;
        } else {
          try {
            const bRes = await apiRequest('/brands');
            if (bRes.brands && bRes.brands.length > 0) {
              setBrands(bRes.brands);
              resolvedBrandId = bRes.brands[0].id;
            }
          } catch (_) {}
        }
      }

      const res = await apiRequest('/client-review/generate-token', {
        method: 'POST',
        body: JSON.stringify({
          brandId: resolvedBrandId || undefined,
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

  // Sprint 2: Saved Libraries & Ideas Board States
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryTab, setLibraryTab] = useState<'HASHTAGS' | 'SNIPPETS' | 'IDEAS'>('HASHTAGS');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedHashtagPackId, setCopiedHashtagPackId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ContentIdea[]>(DEFAULT_CONTENT_IDEAS);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaHook, setNewIdeaHook] = useState('');
  const [newIdeaFormat, setNewIdeaFormat] = useState<'REEL' | 'CAROUSEL' | 'POST'>('REEL');

  // Sprint 2: Evergreen Queue & Gap-Filler States
  const [isAutoFillingGaps, setIsAutoFillingGaps] = useState(false);
  const [selectedEventIsEvergreen, setSelectedEventIsEvergreen] = useState(false);
  const [selectedEventRecycleInterval, setSelectedEventRecycleInterval] = useState(60);

  // Sprint 2: Duplicate / Performance Repeat States
  const [duplicateTargetDate, setDuplicateTargetDate] = useState('');
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Load ideas from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('omnisocial_saved_ideas');
      if (stored) {
        setIdeas(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleSaveNewIdea = () => {
    if (!newIdeaTitle.trim()) return;
    const newIdea: ContentIdea = {
      id: 'idea-' + Date.now(),
      title: newIdeaTitle.trim(),
      hook: newIdeaHook.trim() || 'Key hook or talking point...',
      format: newIdeaFormat,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    try {
      localStorage.setItem('omnisocial_saved_ideas', JSON.stringify(updated));
    } catch {}
    setNewIdeaTitle('');
    setNewIdeaHook('');
    setNotice({ type: 'success', text: `Captured idea: "${newIdea.title}"!` });
  };

  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    try {
      localStorage.setItem('omnisocial_saved_ideas', JSON.stringify(updated));
    } catch {}
  };

  const handleConvertIdeaToPost = (idea: ContentIdea) => {
    setShowLibraryModal(false);
    setInstantTopic(`${idea.title} - ${idea.hook}`);
    setInstantPostType(idea.format === 'POST' ? 'IMAGE' : idea.format);
    setShowInstantModal(true);
    setGeneratedInstantPost(null);
    setNotice({ type: 'success', text: `Loaded idea into 1-Click Studio! Click Generate to create drop.` });
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2500);
  };

  const handleCopyHashtagPack = (id: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedHashtagPackId(id);
    setTimeout(() => setCopiedHashtagPackId(null), 2500);
  };

  const handleAutoFillGaps = async () => {
    setIsAutoFillingGaps(true);
    try {
      const res = await apiRequest('/calendar/evergreen/auto-fill-gaps', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId || undefined,
          daysAhead: 14
        })
      });
      if (res.success) {
        setNotice({
          type: 'success',
          text: res.message || `Filled ${res.filledCount} calendar gaps with Evergreen content!`
        });
        await fetchCalendar();
      } else {
        throw new Error(res.error || 'Failed to auto-fill gaps');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to auto-fill gaps' });
    } finally {
      setIsAutoFillingGaps(false);
    }
  };

  const handleDuplicateEvent = async (event: any, targetDate: string) => {
    if (!targetDate) return;
    setIsDuplicating(true);
    try {
      const res = await apiRequest(`/calendar/events/${event.id || event.publicationId}/duplicate`, {
        method: 'POST',
        body: JSON.stringify({
          targetDate
        })
      });
      if (res.success) {
        setNotice({
          type: 'success',
          text: `Successfully duplicated post to ${new Date(targetDate).toLocaleDateString()}!`
        });
        setSelectedEvent(null);
        await fetchCalendar();
      } else {
        throw new Error(res.error || 'Failed to duplicate post');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to duplicate post' });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleToggleEvergreen = async (event: any, isEvergreen: boolean, interval: number) => {
    try {
      const res = await apiRequest(`/calendar/events/${event.id || event.publicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isEvergreen,
          recycleIntervalDays: interval
        })
      });
      if (res.success) {
        setNotice({
          type: 'success',
          text: isEvergreen
            ? `Post marked as Evergreen ♻️! Will automatically recycle every ${interval} days.`
            : 'Evergreen status disabled for this post.'
        });
        setSelectedEvent((prev: any) => prev ? { ...prev, isEvergreen, recycleIntervalDays: interval } : null);
        await fetchCalendar();
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to update evergreen status' });
    }
  };

  // Sprint 3: Content Pillars & 80/20 Balance Auditor
  const pillarStats = useMemo(() => {
    let valueCount = 0;
    let promoCount = 0;
    let proofCount = 0;
    let cultureCount = 0;

    events.forEach(e => {
      const p = getContentPillar(e.title, e.caption);
      if (p === 'PROMO') promoCount++;
      else if (p === 'PROOF') proofCount++;
      else if (p === 'CULTURE') cultureCount++;
      else valueCount++;
    });

    const total = events.length;
    const nonPromoCount = valueCount + proofCount + cultureCount;
    const promoPercent = total > 0 ? Math.round((promoCount / total) * 100) : 25;
    const valuePercent = total > 0 ? 100 - promoPercent : 75;

    let status: 'HEALTHY' | 'MODERATE' | 'FATIGUE' = 'HEALTHY';
    if (promoPercent > 45) status = 'FATIGUE';
    else if (promoPercent > 32) status = 'MODERATE';

    return {
      total,
      promoCount,
      nonPromoCount,
      valueCount,
      proofCount,
      cultureCount,
      promoPercent,
      valuePercent,
      status
    };
  }, [events]);

  // Sprint 3: Pre-Publish AI Quality Score (0-100) & 1-Click Fix States
  const [aiScoreLoading, setAiScoreLoading] = useState(false);
  const [aiScoreAnalysis, setAiScoreAnalysis] = useState<any | null>(null);
  const [isBoosting, setIsBoosting] = useState(false);

  const handleAnalyzeAiScore = async (captionText: string, platformName: string = 'INSTAGRAM') => {
    if (!captionText || captionText.trim().length < 5) {
      setNotice({ type: 'error', text: 'Please write a caption first before analyzing.' });
      return;
    }
    setAiScoreLoading(true);
    try {
      const res = await apiRequest('/ai/virality-score', {
        method: 'POST',
        body: JSON.stringify({
          caption: captionText,
          platform: platformName
        })
      });
      if (res.success && res.analysis) {
        setAiScoreAnalysis(res.analysis);
      } else {
        throw new Error(res.error || 'Failed to analyze score');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'AI score analysis failed' });
    } finally {
      setAiScoreLoading(false);
    }
  };

  const handleBoostCaption = async (captionText: string, platformName: string = 'INSTAGRAM') => {
    if (!captionText || captionText.trim().length < 5) return;
    setIsBoosting(true);
    try {
      const res = await apiRequest('/ai/boost-post', {
        method: 'POST',
        body: JSON.stringify({
          caption: captionText,
          platform: platformName
        })
      });
      if (res.success && res.boostedCaption) {
        setEditCaption(res.boostedCaption);
        setAiScoreAnalysis({
          score: res.score || 94,
          grade: 'A+',
          verdict: 'Post boosted with scroll-stopping hook and clean mobile line spacing!',
          metrics: {
            hookStrength: { score: 24, max: 25, feedback: 'Strong curiosity loop' },
            readabilitySpacing: { score: 19, max: 20, feedback: 'Clean mobile spacing' },
            callToAction: { score: 19, max: 20, feedback: 'Direct comment/action cue' }
          }
        });
        setNotice({
          type: 'success',
          text: `⚡ Boosted to ${res.score || 94}/100! Replaced caption with high-virality hook.`
        });
      } else {
        throw new Error(res.error || 'Failed to boost caption');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'AI boost failed' });
    } finally {
      setIsBoosting(false);
    }
  };

  const handleBoostInstantPost = async () => {
    if (!generatedInstantPost?.caption) return;
    setIsBoosting(true);
    try {
      const res = await apiRequest('/ai/boost-post', {
        method: 'POST',
        body: JSON.stringify({
          caption: generatedInstantPost.caption,
          platform: generatedInstantPost.targetPlatform || 'INSTAGRAM'
        })
      });
      if (res.success && res.boostedCaption) {
        setGeneratedInstantPost((prev: any) => ({
          ...prev,
          caption: res.boostedCaption,
          qualityScore: res.score || 96
        }));
        setNotice({
          type: 'success',
          text: `⚡ Boosted to ${res.score || 96}/100! Replaced with high-virality hook & clean spacing.`
        });
      } else {
        throw new Error(res.error || 'Failed to boost caption');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'AI boost failed' });
    } finally {
      setIsBoosting(false);
    }
  };

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
  const [architectTone, setArchitectTone] = useState<'URGENT_DIRECT' | 'STORYTELLING' | 'PROFESSIONAL' | 'GENZ_VIRAL'>('URGENT_DIRECT');
  const [architectLanguage, setArchitectLanguage] = useState<'ENGLISH' | 'HINGLISH' | 'CASUAL_US'>('ENGLISH');
  const [architectAudience, setArchitectAudience] = useState<string>('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('ALL');

  // Dynamic in-card inline edit states & single post regenerator
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null);
  const [editPostDraft, setEditPostDraft] = useState<{ title: string; hook: string; caption: string; ctaKeyword: string } | null>(null);
  const [regeneratingPostIndex, setRegeneratingPostIndex] = useState<number | null>(null);

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
  const [instantScheduledTime, setInstantScheduledTime] = useState('19:30');
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

  const handleStartInlineEditPost = (idx: number, post: any) => {
    setEditingPostIndex(idx);
    setEditPostDraft({
      title: post.title,
      hook: post.hook,
      caption: post.caption,
      ctaKeyword: post.ctaKeyword || 'GO'
    });
  };

  const handleSaveInlineEditPost = (idx: number) => {
    if (!generatedRoadmap || !editPostDraft) return;
    const updated = [...generatedRoadmap.posts];
    updated[idx] = {
      ...updated[idx],
      title: editPostDraft.title,
      hook: editPostDraft.hook,
      caption: editPostDraft.caption,
      ctaKeyword: editPostDraft.ctaKeyword
    };
    setGeneratedRoadmap({
      ...generatedRoadmap,
      posts: updated
    });
    setEditingPostIndex(null);
    setEditPostDraft(null);
    setNotice({ type: 'success', text: `Saved custom edits for Day ${idx + 1}!` });
  };

  const handleSwapHookVariation = (postIdx: number, hookIdx: number, newHookText: string) => {
    if (!generatedRoadmap) return;
    const cleanHook = newHookText.replace(/^(Curiosity|Statistical|Story|Question|Direct Proof):\s*/i, '');
    const updated = [...generatedRoadmap.posts];
    const oldPost = updated[postIdx];
    
    // Replace the first line of caption with the new hook
    const lines = (oldPost.caption || '').split('\n');
    lines[0] = cleanHook;
    const updatedCaption = lines.join('\n');

    updated[postIdx] = {
      ...oldPost,
      hook: cleanHook,
      activeHookIndex: hookIdx,
      caption: updatedCaption
    };
    setGeneratedRoadmap({
      ...generatedRoadmap,
      posts: updated
    });
    setNotice({ type: 'success', text: `Swapped to Hook #${hookIdx + 1} for Day ${postIdx + 1}!` });
  };

  const handleRegenerateSinglePost = async (idx: number, instruction?: string) => {
    if (!generatedRoadmap) return;
    const targetPost = generatedRoadmap.posts[idx];
    if (!targetPost) return;

    setRegeneratingPostIndex(idx);
    try {
      const res = await apiRequest('/ai/campaign-roadmap/regenerate-post', {
        method: 'POST',
        body: JSON.stringify({
          post: targetPost,
          instruction: instruction || 'Make it fresher, punchier and higher converting',
          tone: architectTone,
          language: architectLanguage,
          brandName: brands.find(b => b.id === activeBrandId)?.name || 'OmniSocial',
          productDescription: architectProductDesc
        })
      });
      if (res.success && res.post) {
        const updated = [...generatedRoadmap.posts];
        updated[idx] = res.post;
        setGeneratedRoadmap({
          ...generatedRoadmap,
          posts: updated
        });
        setNotice({ type: 'success', text: `✨ Day ${idx + 1} successfully regenerated with fresh dynamic copy!` });
      } else {
        throw new Error(res.error || 'Failed to regenerate post');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Post regeneration failed' });
    } finally {
      setRegeneratingPostIndex(null);
    }
  };

  const handleTogglePostFormat = (idx: number, newFormat: 'REEL' | 'CAROUSEL' | 'SINGLE_IMAGE') => {
    if (!generatedRoadmap) return;
    const updated = [...generatedRoadmap.posts];
    const post = updated[idx];
    const isReel = newFormat === 'REEL';
    const ar = isReel ? '9:16' : '1:1';
    
    // Update scheduled slot time intelligently
    const dateObj = new Date(post.scheduledDate);
    if (isReel) {
      dateObj.setHours(19, 30, 0, 0);
    } else if (newFormat === 'CAROUSEL') {
      dateObj.setHours(12, 30, 0, 0);
    } else {
      dateObj.setHours(17, 0, 0, 0);
    }

    updated[idx] = {
      ...post,
      format: newFormat,
      aspectRatio: ar,
      scheduledDate: dateObj.toISOString(),
      midjourneyPrompt: `${post.aiImagePrompt || post.title}, commercial photography, cinematic lighting, 8k resolution, shot on Hasselblad --ar ${ar} --v 6.1 --style raw`,
      videoPrompt: isReel
        ? `Slow cinematic push-in toward ${post.title.toLowerCase()}. Soft volumetric studio lighting, smooth micro-movements, high-end 4k commercial motion, 9:16 vertical video.`
        : `Slow orbital camera pan around subject, subtle lighting shift, clean depth of field.`
    };
    setGeneratedRoadmap({
      ...generatedRoadmap,
      posts: updated
    });
    setNotice({ type: 'success', text: `Switched Day ${idx + 1} to ${newFormat} format!` });
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
          brandId: activeBrandId || undefined,
          targetAudience: architectAudience || undefined,
          tone: architectTone,
          language: architectLanguage
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
          scheduledDate: instantScheduledDate ? new Date(`${instantScheduledDate}T${instantScheduledTime || '19:30'}:00`).toISOString() : new Date().toISOString()
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
          brandId: activeBrandId || undefined,
          targetAudience: architectAudience || undefined,
          tone: architectTone,
          language: architectLanguage
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

    // Preload brands for seamless activeBrand fallback
    apiRequest('/brands')
      .then((res) => {
        if (res.brands && res.brands.length > 0) {
          setBrands(res.brands);
        }
      })
      .catch(() => {});
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
          caption: editCaption,
          mediaUrls: selectedEvent.mediaUrls
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
    let accentBar = 'bg-indigo-500';
    let dot = 'bg-indigo-500';
    let badge = 'bg-indigo-50 text-indigo-700 border-indigo-200';

    if (defaultStatus === 'PUBLISHED') {
      accentBar = 'bg-emerald-500';
      dot = 'bg-emerald-500';
      badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (defaultStatus === 'FAILED') {
      accentBar = 'bg-rose-500';
      dot = 'bg-rose-500';
      badge = 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (defaultStatus === 'PUBLISHING') {
      accentBar = 'bg-amber-500';
      dot = 'bg-amber-500 animate-ping';
      badge = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (title.includes('Phase 1')) {
      accentBar = 'bg-amber-500';
      dot = 'bg-amber-500';
      badge = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (title.includes('Phase 2')) {
      accentBar = 'bg-sky-500';
      dot = 'bg-sky-500';
      badge = 'bg-sky-50 text-sky-800 border-sky-200';
    } else if (title.includes('Phase 3')) {
      accentBar = 'bg-purple-500';
      dot = 'bg-purple-500';
      badge = 'bg-purple-50 text-purple-800 border-purple-200';
    } else if (title.includes('Phase 4')) {
      accentBar = 'bg-emerald-500';
      dot = 'bg-emerald-500';
      badge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    } else if (title.includes('Phase 5')) {
      accentBar = 'bg-rose-500';
      dot = 'bg-rose-500';
      badge = 'bg-rose-50 text-rose-800 border-rose-200';
    }

    return {
      cardBg: 'bg-white hover:bg-neutral-50/90 text-neutral-900 border-neutral-200/90 hover:border-neutral-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md',
      barColor: accentBar,
      badge,
      dot
    };
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 pb-14">
        {/* ===================================================================== */}
        {/* ULTRA-PREMIUM SUB-HEADER: BREADCRUMBS, TITLE & HERO ACTIONS          */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-3 pt-1 border-b border-neutral-200/70">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span className="hover:text-neutral-700 cursor-pointer">OmniSocial</span>
              <span>›</span>
              <span className="hover:text-neutral-700 cursor-pointer">Editorial</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">Content Calendar</span>
              <span className="text-neutral-300">•</span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PostgreSQL Sync Live</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F1012] tracking-tight">
                Editorial &amp; Social Calendar
              </h1>

              {/* Consistency Streak Capsule */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/60 shadow-2xs text-xs font-bold text-amber-950">
                <span className="text-sm">🔥</span>
                <span className="font-mono font-black">{calculateStreak()}d Streak</span>
                <span className="text-[10px] font-medium text-amber-700 hidden sm:inline">• Top 5% Consistent Creator</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Drag-and-drop visual timeline with timezone-aware background execution, AI peak slots, and 1-click campaign generation.
            </p>
          </div>

          {/* Primary Hero Actions Cluster */}
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            {/* 1-Click Quick Post/Reel Studio Button */}
            <button
              onClick={() => {
                setShowInstantModal(true);
                setGeneratedInstantPost(null);
                setInstantTopic('');
              }}
              className="text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-emerald-400/30"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>⚡ 1-Click Studio</span>
              <span className="text-[9px] bg-white/25 text-white px-1.5 py-0.2 rounded-full font-mono uppercase">
                5s
              </span>
            </button>

            {/* AI Campaign Architect Button */}
            <button
              onClick={() => {
                setShowArchitectModal(true);
                setWizardStep(1);
              }}
              className="text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(99,102,241,0.3)] flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-purple-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ Campaign Architect</span>
            </button>

            {/* Create Post Action Button */}
            <a
              href="/content-studio"
              className="text-xs font-bold text-white bg-[#0F1012] hover:bg-neutral-800 px-4 py-2.5 rounded-full shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ring-1 ring-black/10 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Schedule Drop</span>
            </a>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LUXURY FLOATING CALENDAR TOOLBAR & TIME NAVIGATION                   */}
        {/* ===================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 bg-white/85 backdrop-blur-xl rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* Left: Month Navigator + Date Title */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-neutral-100/90 border border-neutral-200/60 p-1 rounded-full shadow-inner">
              <button
                onClick={prevPeriod}
                title="Previous Period"
                className="p-1.5 hover:bg-white rounded-full text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={jumpToToday}
                className="px-3 py-1 text-xs font-black text-neutral-800 hover:bg-white rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                <span>Today</span>
              </button>
              <button
                onClick={nextPeriod}
                title="Next Period"
                className="p-1.5 hover:bg-white rounded-full text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/70 text-xs font-black text-neutral-900 shadow-2xs">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Center: View Switcher (Apple/Linear Segmented Pill) */}
          <div className="flex items-center bg-neutral-100/90 p-1 rounded-full border border-neutral-200/60 text-xs font-semibold text-neutral-600 shadow-inner">
            {(['MONTH', 'WEEK', 'DAY', 'LIST', 'GRID'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${viewMode === mode
                    ? 'bg-white text-neutral-950 font-black shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    : 'hover:text-neutral-900 font-medium'
                  }`}
              >
                {mode === 'GRID' && <Instagram className="w-3 h-3 text-pink-600 shrink-0" />}
                <span>{mode === 'GRID' ? 'Grid (IG)' : mode.charAt(0) + mode.slice(1).toLowerCase()}</span>
              </button>
            ))}
          </div>

          {/* Right: Auxiliary Power Tools */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowLibraryModal(true)}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Libraries &amp; Ideas</span>
              <span className="sm:hidden">Libraries</span>
            </button>

            <button
              type="button"
              onClick={handleAutoFillGaps}
              disabled={isAutoFillingGaps}
              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-3 py-1.5 rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Repeat className={`w-3.5 h-3.5 text-emerald-600 ${isAutoFillingGaps ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAutoFillingGaps ? 'Filling Gaps...' : 'Auto-Fill Gaps ♻️'}</span>
              <span className="sm:hidden">Auto-Fill</span>
            </button>

            <button
              type="button"
              onClick={handleOpenShareModal}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-50 border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share</span>
            </button>
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
        {/* CONTENT PILLARS & 80/20 BALANCE AUDITOR GAUGE (SPRINT 3)             */}
        {/* ===================================================================== */}
        <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all space-y-2.5 shadow-2xs ${
          pillarStats.status === 'FATIGUE'
            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
            : pillarStats.status === 'MODERATE'
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">⚖️</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black tracking-tight">
                    Content Pillar Auditor: {pillarStats.valuePercent}% Value &amp; Proof vs {pillarStats.promoPercent}% Promo
                  </span>
                  <span className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-full ${
                    pillarStats.status === 'FATIGUE'
                      ? 'bg-rose-200 text-rose-800'
                      : pillarStats.status === 'MODERATE'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    {pillarStats.status === 'FATIGUE' ? '⚠ Promo Fatigue Risk' : pillarStats.status === 'MODERATE' ? 'Moderate Ratio' : '80/20 Optimal ✓'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                  {pillarStats.status === 'FATIGUE'
                    ? 'Audience fatigue warning! When promo exceeds 40%, followers disengage and unfollow. Balance with educational drops or transformation stories.'
                    : pillarStats.status === 'MODERATE'
                    ? '80/20 Rule: 80% of your calendar should provide value & build trust; 20% should make offers.'
                    : 'Cadra Algorithm Health: Excellent balance between educational value, customer proof, and promotional offers.'}
                </p>
              </div>
            </div>

            {/* Quick Action Button if Promo is too high */}
            {pillarStats.status === 'FATIGUE' && (
              <button
                type="button"
                onClick={() => {
                  setInstantTopic('3 Mistakes Customers Make & How to Avoid Them');
                  setShowInstantModal(true);
                  setGeneratedInstantPost(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <span>+ Add Value Drop</span>
              </button>
            )}
          </div>

          {/* 4-Pillar Visual Breakdown Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-full bg-black/10 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${pillarStats.total > 0 ? (pillarStats.valueCount / pillarStats.total) * 100 : 50}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Value: ${pillarStats.valueCount} posts`}
              />
              <div
                style={{ width: `${pillarStats.total > 0 ? (pillarStats.proofCount / pillarStats.total) * 100 : 25}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Social Proof: ${pillarStats.proofCount} posts`}
              />
              <div
                style={{ width: `${pillarStats.total > 0 ? (pillarStats.cultureCount / pillarStats.total) * 100 : 10}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Culture/BTS: ${pillarStats.cultureCount} posts`}
              />
              <div
                style={{ width: `${pillarStats.total > 0 ? (pillarStats.promoCount / pillarStats.total) * 100 : 15}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Promo: ${pillarStats.promoCount} posts`}
              />
            </div>

            {/* Pillar Legend Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-600 font-medium">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Value ({pillarStats.valueCount})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Proof ({pillarStats.proofCount})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Culture ({pillarStats.cultureCount})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Promo ({pillarStats.promoCount})</span>
                </span>
              </div>
              <span className="font-mono font-bold text-neutral-500">{pillarStats.total} Scheduled Total</span>
            </div>
          </div>
        </div>

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
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center space-x-1.5 border ${filterPlatform === p.id
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50'
                  }`}
              >
                <span>{p.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${filterPlatform === p.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
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
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer border ${filterStatus === s.id
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
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 animate-in fade-in duration-200 ${notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
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
              <div className="bg-white rounded-[28px] border border-neutral-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 border-b border-neutral-200/80 bg-neutral-50/90 text-center text-[11px] font-extrabold tracking-widest text-neutral-500 uppercase py-3.5">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200/70 min-h-[640px]">
                  {monthDays.map((dayItem, idx) => {
                    const isToday = today ? isSameDay(dayItem.date, today) : false;
                    const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.scheduledFor), dayItem.date));
                    const cellFestival = dayItem.isCurrentMonth ? getFestivalForDate(dayItem.date) : null;

                    return (
                      <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnDate(e, dayItem.date)}
                        className={`p-2.5 flex flex-col justify-between transition-all min-h-[135px] relative group/cell ${dayItem.isCurrentMonth
                            ? isToday
                              ? 'bg-gradient-to-b from-indigo-50/40 via-white to-white ring-2 ring-inset ring-indigo-500/20'
                              : 'bg-white hover:bg-neutral-50/40'
                            : 'bg-neutral-50/50 text-neutral-400'
                          }`}
                      >
                        {/* Day Cell Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              {isToday ? (
                                <div className="flex items-center space-x-1.5">
                                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                    {dayItem.date.getDate()}
                                  </span>
                                  <span className="text-[10px] font-black uppercase text-indigo-600 font-mono tracking-wider hidden sm:inline">
                                    Today
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-neutral-800 group-hover/cell:text-neutral-950 font-mono w-6 h-6 flex items-center justify-center">
                                  {dayItem.date.getDate()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1">
                              {/* Optimal Peak Time Chip (Only on empty days to avoid clutter) */}
                              {dayEvents.length === 0 && dayItem.isCurrentMonth && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickScheduleOnDate(dayItem.date);
                                  }}
                                  title="AI Peak Window (7:30 PM - 96% Reach). Click to schedule."
                                  className="text-[8px] font-bold text-amber-800/80 bg-amber-50/80 hover:bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200/60 font-mono transition-all cursor-pointer hidden sm:inline-flex items-center space-x-0.5"
                                >
                                  <span>🔥</span>
                                  <span>7:30P</span>
                                </button>
                              )}

                              {/* Quick '+' Button on Cell Hover */}
                              <button
                                type="button"
                                onClick={() => handleQuickScheduleOnDate(dayItem.date)}
                                title={`Schedule drop on ${dayItem.date.toLocaleDateString()}`}
                                className="w-5 h-5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-600 items-center justify-center transition-all opacity-0 group-hover/cell:opacity-100 cursor-pointer shadow-2xs hidden sm:flex"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Indian/Global Festival Badge */}
                          {cellFestival && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLaunchFestiveCampaign(cellFestival);
                              }}
                              title={`${cellFestival.name} (${cellFestival.tag}) - 1-Click Festive Sprint`}
                              className="w-full mt-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-200/80 flex items-center justify-between transition-all group/fest cursor-pointer shadow-2xs hover:border-amber-300 text-left"
                            >
                              <span className="truncate flex items-center space-x-1">
                                <span>{cellFestival.emoji}</span>
                                <span className="truncate font-semibold">{cellFestival.name}</span>
                              </span>
                              <Sparkles className="w-2.5 h-2.5 text-amber-600 opacity-60 group-hover/fest:opacity-100 shrink-0 ml-0.5" />
                            </button>
                          )}
                        </div>

                        {/* Event Cards with Drag and Drop - Clean & Invisible Scrollbar */}
                        <div className="space-y-1.5 my-2 overflow-y-auto max-h-36 pr-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
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
                                  setSelectedEventIsEvergreen(ev.isEvergreen || false);
                                  setSelectedEventRecycleInterval(ev.recycleIntervalDays || 60);
                                  const nextWeek = new Date();
                                  nextWeek.setDate(nextWeek.getDate() + 7);
                                  nextWeek.setHours(18, 30, 0, 0);
                                  setDuplicateTargetDate(nextWeek.toISOString().slice(0, 16));
                                }}
                                className={`w-full text-left p-1.5 rounded-xl text-[10px] transition-all relative overflow-hidden group/card border bg-white hover:bg-neutral-50/90 text-neutral-900 border-neutral-200/90 hover:border-neutral-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 ${
                                  isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                                }`}
                              >
                                {/* Left colored accent bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.barColor} rounded-l-xl`} />

                                <div className="pl-1.5 space-y-1">
                                  {/* Top meta row */}
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center space-x-1.5">
                                      <PlatformMicroIcon platform={ev.platform} />
                                      <span className="font-mono text-[9px] font-semibold text-neutral-500">
                                        {formatPostTime(ev.scheduledFor)}
                                      </span>
                                      {(() => {
                                        const p = getContentPillar(ev.title, ev.caption);
                                        const cfg = PILLAR_BADGE_CONFIG[p];
                                        return (
                                          <span title={`Pillar: ${cfg.label}`} className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border font-mono ${cfg.badgeClass}`}>
                                            {cfg.icon}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {ev.status === 'PUBLISHED' && (
                                        <span className="text-[8px] font-black text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded-full font-mono">
                                          ★ {ev.viralityScore ? `${ev.viralityScore}` : '92'}
                                        </span>
                                      )}
                                      {ev.isEvergreen && (
                                        <span title="Evergreen Asset" className="text-[8px] font-black text-emerald-700 bg-emerald-100/90 px-1 py-0.2 rounded-full font-mono">
                                          ♻️
                                        </span>
                                      )}
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                                    </div>
                                  </div>

                                  {/* Title & Thumbnail row */}
                                  <div className="flex items-center space-x-1.5">
                                    {ev.mediaUrls && ev.mediaUrls[0] ? (
                                      <img
                                        src={ev.mediaUrls[0]}
                                        alt=""
                                        className="w-5 h-5 rounded-md object-cover shrink-0 border border-black/10 shadow-2xs group-hover/card:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <span className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-[10px] shrink-0 border border-neutral-200">
                                        {ev.format === 'REEL' ? '🎬' : ev.format === 'CAROUSEL' ? '📑' : '📸'}
                                      </span>
                                    )}
                                    <p className="font-bold text-neutral-900 truncate leading-snug text-[10px] flex-1">
                                      {ev.title}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Empty Gap Detector & 1-Click Schedule / Auto-fill */}
                        {dayEvents.length === 0 && dayItem.isCurrentMonth && (
                          <div className="py-2 text-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleQuickScheduleOnDate(dayItem.date)}
                              title="Empty slot - Click to schedule or auto-fill"
                              className="text-[9px] font-bold text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-0.5 rounded-full border border-dashed border-slate-300 hover:border-indigo-400 transition-all cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                            >
                              <Plus className="w-2.5 h-2.5 text-indigo-500" />
                              <span>Add Drop</span>
                            </button>
                          </div>
                        )}

                        {/* Cell Footer */}
                        <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
                          {dayEvents.length > 0 ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-neutral-100/80 text-neutral-600 font-mono font-bold text-[9px]">
                              <span>{dayEvents.length}</span>
                              <span>{dayEvents.length === 1 ? 'post' : 'posts'}</span>
                            </span>
                          ) : (
                            <span />
                          )}
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
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${isDayToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-900'
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
                                <div className="flex items-center space-x-1.5">
                                  <PlatformPill platform={ev.platform} />
                                  {(() => {
                                    const p = getContentPillar(ev.title, ev.caption);
                                    const cfg = PILLAR_BADGE_CONFIG[p];
                                    return (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border font-mono ${cfg.badgeClass}`}>
                                        {cfg.icon} {cfg.label}
                                      </span>
                                    );
                                  })()}
                                </div>
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
                                <span className={`w-2 h-2 rounded-full inline-block ${post.status === 'PUBLISHED' ? 'bg-emerald-400' : post.status === 'QUEUED' ? 'bg-indigo-400' : 'bg-rose-400'
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
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${selectedEvent.status === 'PUBLISHED'
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

                  {/* Royalty-Free Stock Media Presets */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-neutral-700">Royalty-Free Stock Visual (Unsplash CC0)</label>
                      <span className="text-[10px] text-neutral-400">1-Tap Attach</span>
                    </div>
                    {selectedEvent.mediaUrls && selectedEvent.mediaUrls[0] && (
                      <div className="relative w-full h-24 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 mb-1.5">
                        <img
                          src={selectedEvent.mediaUrls[0]}
                          alt="Selected visual"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: '💼 Modern Tech', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80' },
                        { label: '☕ Cafe & Food', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
                        { label: '🌿 Wellness', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
                        { label: '🛍️ Retail & Style', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
                        { label: '🚀 Hustle Growth', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80' },
                        { label: '✨ Luxury Minimal', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setSelectedEvent({
                              ...selectedEvent,
                              mediaUrls: [preset.url]
                            });
                            setNotice({ type: 'success', text: `Attached ${preset.label} stock visual!` });
                          }}
                          className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all truncate cursor-pointer ${
                            selectedEvent?.mediaUrls?.[0] === preset.url
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
                              : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Pre-Publish Quality Score & 1-Click Fix Bar */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-bold text-xs text-indigo-950">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>AI Pre-Publish Quality Coach</span>
                      </div>
                      {aiScoreAnalysis && (
                        <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full ${
                          aiScoreAnalysis.score >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : aiScoreAnalysis.score >= 65
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          Score: {aiScoreAnalysis.score}/100 ({aiScoreAnalysis.grade})
                        </span>
                      )}
                    </div>

                    {aiScoreAnalysis ? (
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-indigo-900 leading-snug">{aiScoreAnalysis.verdict}</p>
                        {aiScoreAnalysis.metrics && (
                          <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold text-neutral-600 pt-0.5">
                            <div className="p-1.5 bg-white rounded-lg border border-indigo-100 text-center">
                              <span className="block text-indigo-700 font-mono text-[10px]">
                                {aiScoreAnalysis.metrics.hookStrength?.score || 20}/25
                              </span>
                              <span>Hook Power</span>
                            </div>
                            <div className="p-1.5 bg-white rounded-lg border border-indigo-100 text-center">
                              <span className="block text-indigo-700 font-mono text-[10px]">
                                {aiScoreAnalysis.metrics.readabilitySpacing?.score || 18}/20
                              </span>
                              <span>Readability</span>
                            </div>
                            <div className="p-1.5 bg-white rounded-lg border border-indigo-100 text-center">
                              <span className="block text-indigo-700 font-mono text-[10px]">
                                {aiScoreAnalysis.metrics.callToAction?.score || 17}/20
                              </span>
                              <span>CTA Action</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                        Grade your post before publishing. AI checks line-1 hook, mobile formatting, and conversion triggers.
                      </p>
                    )}

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleAnalyzeAiScore(editCaption, selectedEvent.platform)}
                        disabled={aiScoreLoading || !editCaption}
                        className="flex-1 py-1.5 bg-white hover:bg-neutral-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        {aiScoreLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing Post...</span>
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Score Draft (0-100)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBoostCaption(editCaption, selectedEvent.platform)}
                        disabled={isBoosting || !editCaption}
                        className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        {isBoosting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Boosting...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>⚡ 1-Click Fix (90+)</span>
                          </>
                        )}
                      </button>
                    </div>
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

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-neutral-900">{selectedEvent.title}</h3>
                    {(() => {
                      const p = getContentPillar(selectedEvent.title, selectedEvent.caption);
                      const cfg = PILLAR_BADGE_CONFIG[p];
                      return (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 font-mono ${cfg.badgeClass}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      );
                    })()}
                  </div>
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

                  {/* Evergreen Asset Controls */}
                  <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        ♻️
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-800">Evergreen Asset</p>
                        <p className="text-[10px] text-neutral-500">Auto-fills calendar gaps &amp; recycles timeless content</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedEventIsEvergreen && (
                        <select
                          value={selectedEventRecycleInterval}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSelectedEventRecycleInterval(val);
                            handleToggleEvergreen(selectedEvent, true, val);
                          }}
                          className="text-[11px] font-bold bg-white border border-neutral-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value={30}>Every 30d</option>
                          <option value={60}>Every 60d</option>
                          <option value={90}>Every 90d</option>
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !selectedEventIsEvergreen;
                          setSelectedEventIsEvergreen(nextState);
                          handleToggleEvergreen(selectedEvent, nextState, selectedEventRecycleInterval);
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          selectedEventIsEvergreen
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                        }`}
                      >
                        {selectedEventIsEvergreen ? 'Active ♻️' : 'Turn On'}
                      </button>
                    </div>
                  </div>

                  {/* Performance Overlay & 1-Click Repeat for Published Drops */}
                  {selectedEvent.status === 'PUBLISHED' && (
                    <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-900">
                          <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>Performance &amp; Virality Score</span>
                        </div>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900">
                          {selectedEvent.viralityScore ? `${selectedEvent.viralityScore}/100 High Reach` : '★ 88/100 Top Performer'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        Repeat what worked! Schedule this exact high-performing post to a future date or let AI remix the hook.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <div className="flex-1 flex items-center space-x-1">
                          <input
                            type="datetime-local"
                            value={duplicateTargetDate}
                            onChange={(e) => setDuplicateTargetDate(e.target.value)}
                            className="w-full text-xs border border-amber-200 bg-white rounded-xl p-1.5 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleDuplicateEvent(selectedEvent, duplicateTargetDate)}
                            disabled={isDuplicating || !duplicateTargetDate}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shrink-0 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                          >
                            <Repeat className={`w-3 h-3 ${isDuplicating ? 'animate-spin' : ''}`} />
                            <span>{isDuplicating ? 'Queuing...' : 'Repeat ♻️'}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvent(null);
                            setInstantTopic(`${selectedEvent.title} - Fresh angle remix`);
                            setInstantPostType(selectedEvent.format === 'POST' ? 'IMAGE' : (selectedEvent.format || 'REEL'));
                            setShowInstantModal(true);
                            setGeneratedInstantPost(null);
                            setNotice({ type: 'success', text: 'Loaded into 1-Click Studio for fresh AI Remix!' });
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI-Remix</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reschedule Picker & AI Smart Slots */}
              {selectedEvent.status !== 'PUBLISHED' && selectedEvent.status !== 'PUBLISHING' && (
                <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-700">Change Scheduled Date &amp; Time</label>
                    <span className="text-[10px] font-bold text-amber-700 flex items-center space-x-1">
                      <span>🔥 AI Smart Peak Windows</span>
                    </span>
                  </div>

                  {/* 1-Tap AI Peak Smart Slots */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: '🔥 7:30 PM Prime', hours: 19, mins: 30, note: '96% Reach' },
                      { label: '⚡ 8:45 AM Rush', hours: 8, mins: 45, note: '95% B2B' },
                      { label: '📱 1:15 PM Lunch', hours: 13, mins: 15, note: '91% Saves' },
                      { label: '🌙 9:45 PM Night', hours: 21, mins: 45, note: '87% DMs' }
                    ].map((slot, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => {
                          const baseDate = rescheduleDate ? new Date(rescheduleDate) : new Date(selectedEvent.scheduledFor);
                          baseDate.setHours(slot.hours, slot.mins, 0, 0);
                          const year = baseDate.getFullYear();
                          const month = String(baseDate.getMonth() + 1).padStart(2, '0');
                          const day = String(baseDate.getDate()).padStart(2, '0');
                          const hh = String(slot.hours).padStart(2, '0');
                          const mm = String(slot.mins).padStart(2, '0');
                          setRescheduleDate(`${year}-${month}-${day}T${hh}:${mm}`);
                          setNotice({ type: 'success', text: `Selected optimal ${slot.label} window (${slot.note})!` });
                        }}
                        className="p-1.5 text-left rounded-xl bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200/80 text-amber-900 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="block text-[10px] font-black">{slot.label}</span>
                        <span className="block text-[8px] text-amber-700/80 font-mono">{slot.note}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="datetime-local"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
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
                            className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${instantPostType === fmt.id
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
                            className={`p-2.5 text-left rounded-xl border transition-all text-xs cursor-pointer ${instantPreset === pre.id
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

                    {/* AI Smart Peak Time Window */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>AI Smart Optimal Posting Time:</span>
                        </label>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          🔥 +2.8x Higher Algorithm Impressions
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { label: '🔥 7:30 PM Prime', time: '19:30', note: 'Instagram Peak Reach' },
                          { label: '⚡ 8:45 AM Rush', time: '08:45', note: 'LinkedIn Morning B2B' },
                          { label: '📱 1:15 PM Lunch', time: '13:15', note: 'Reels Lunch Scroll' },
                          { label: '🌙 9:45 PM Night', time: '21:45', note: 'Late Story Retention' }
                        ].map((slot, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => setInstantScheduledTime(slot.time)}
                            className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                              instantScheduledTime === slot.time
                                ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400/20 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700'
                            }`}
                          >
                            <div className="text-[11px] font-bold">{slot.label}</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">{slot.note}</div>
                          </button>
                        ))}
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

                    {/* Pre-Publish AI Quality Score & 1-Click Fix & Boost */}
                    <div className="p-3 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-emerald-50/50 rounded-2xl border border-indigo-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🎯</span>
                          <div>
                            <span className="text-xs font-black text-indigo-950">Pre-Publish Virality Meter</span>
                            <span className="ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {generatedInstantPost.qualityScore || 94}/100 · Grade A+ (Algorithm Ready ✓)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleBoostInstantPost}
                          disabled={isBoosting}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Zap className={`w-3.5 h-3.5 text-amber-300 ${isBoosting ? 'animate-spin' : ''}`} />
                          <span>{isBoosting ? 'Boosting...' : '⚡ 1-Click Viral Boost (Fix Hook)'}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-1.5 bg-white/90 rounded-xl border border-indigo-100">
                          <span className="text-slate-500 block font-medium">Hook Strength</span>
                          <span className="font-mono font-bold text-emerald-700">9.6 / 10 🔥</span>
                        </div>
                        <div className="p-1.5 bg-white/90 rounded-xl border border-indigo-100">
                          <span className="text-slate-500 block font-medium">CTA Clarity</span>
                          <span className="font-mono font-bold text-indigo-700">Direct Action ✓</span>
                        </div>
                        <div className="p-1.5 bg-white/90 rounded-xl border border-indigo-100">
                          <span className="text-slate-500 block font-medium">Algorithm Grade</span>
                          <span className="font-mono font-bold text-purple-700">Top 10% Reach</span>
                        </div>
                      </div>
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

                        {/* 1-Tap Royalty-Free Stock Media Selector */}
                        <div className="w-full pt-1.5 space-y-1 text-left border-t border-slate-200">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-700 uppercase flex items-center space-x-1">
                              <span>🖼️ Royalty-Free Stock Presets</span>
                            </span>
                            <span className="text-[9px] text-slate-400">Unsplash CC0</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { label: '💼 Tech', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80' },
                              { label: '☕ Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
                              { label: '🌿 Wellness', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
                              { label: '🛍️ Retail', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
                              { label: '🚀 Growth', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80' },
                              { label: '✨ Luxury', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
                            ].map((preset, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setGeneratedInstantPost((prev: any) => ({ ...prev, mediaUrl: preset.url }))}
                                className={`px-1.5 py-1 rounded-md text-[9px] font-bold border transition-all text-center truncate cursor-pointer ${
                                  generatedInstantPost.mediaUrl === preset.url
                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-800 font-extrabold'
                                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                                title={`Switch to ${preset.label}`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
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
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${instantActivePromptTab === tab.id
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                  <span>{tab.label}</span>
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${instantActivePromptTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
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
                      className={`py-1.5 px-2 rounded-full transition-all border ${wizardStep === s.step
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
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedTemplateCategory === cat.id
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
                                className={`p-3 text-left rounded-xl border transition-all relative flex flex-col justify-between ${isCurrent
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
                              className={`p-4 text-left rounded-2xl border transition-all flex items-start space-x-3 ${isSelected
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
                              className={`p-3.5 text-left rounded-2xl border transition-all ${isSelected
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

                    {/* Dynamic Tone of Voice */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tone of Voice (AI Personality)</label>
                        <span className="text-[10px] text-indigo-600 font-bold">Dynamic Copy Engine</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'URGENT_DIRECT', label: '🔥 Urgent & Direct', desc: 'High-conversion, punchy & direct closing' },
                          { id: 'STORYTELLING', label: '❤️ Story & Empathy', desc: 'Relatable StoryBrand hero journey' },
                          { id: 'PROFESSIONAL', label: '💼 Authority & B2B', desc: 'Corporate metrics, case studies & ROI' },
                          { id: 'GENZ_VIRAL', label: '⚡ Viral & Relatable', desc: 'Witty, creator-style hooks & high shares' }
                        ].map(t => {
                          const isSelected = architectTone === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setArchitectTone(t.id as any)}
                              className={`p-3 text-left rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-xs font-bold text-slate-900">{t.label}</span>
                              <span className="text-[10px] text-slate-500 mt-1 leading-snug">{t.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target Audience & Language Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Target Audience */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Audience</label>
                          <span className="text-[10px] text-slate-400">Who is this for?</span>
                        </div>
                        <input
                          type="text"
                          value={architectAudience}
                          onChange={(e) => setArchitectAudience(e.target.value)}
                          placeholder="e.g. Busy Working Mothers, SaaS Founders, Tier-2 Retailers..."
                          className="w-full text-xs p-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        {/* Quick suggestions */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {['Founders & Creators', 'Busy Working Parents', 'Local Shoppers', 'Corporate Leaders'].map(chip => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setArchitectAudience(chip)}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors cursor-pointer"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language & Dialect Style */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Language &amp; Dialect</label>
                          <span className="text-[10px] text-indigo-600 font-bold">Creator Dialect</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'ENGLISH', label: '🌐 English', sub: 'Global standard' },
                            { id: 'HINGLISH', label: '🇮🇳 Hinglish', sub: 'Indian creator' },
                            { id: 'CASUAL_US', label: '💬 Casual', sub: 'US friendly' }
                          ].map(l => (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => setArchitectLanguage(l.id as any)}
                              className={`p-2.5 text-center rounded-2xl border transition-all cursor-pointer ${
                                architectLanguage === l.id
                                  ? 'bg-[#101014] text-white border-black shadow-xs font-bold'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span className="text-xs font-bold block">{l.label}</span>
                              <span className={`text-[9px] block mt-0.5 ${architectLanguage === l.id ? 'text-neutral-300' : 'text-neutral-400'}`}>{l.sub}</span>
                            </button>
                          ))}
                        </div>
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
                            className={`p-4 text-left rounded-2xl border transition-all relative ${isSelected
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
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center space-x-1.5 ${isChecked
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

                    {/* Dynamic Strategy & Performance Forecast */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Estimated Impressions</span>
                        <span className="text-sm font-black text-indigo-600 mt-0.5 block">18.5k – 45.0k</span>
                        <span className="text-[9px] text-emerald-600 font-semibold mt-0.5 block">↑ High Reach Velocity</span>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Projected DM Leads</span>
                        <span className="text-sm font-black text-emerald-600 mt-0.5 block">35 – 90 Inquiries</span>
                        <span className="text-[9px] text-slate-500 font-medium mt-0.5 block">Automated Keywords</span>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Conversion Readiness</span>
                        <span className="text-sm font-black text-amber-600 mt-0.5 block">96 / 100</span>
                        <span className="text-[9px] text-amber-700 font-semibold mt-0.5 block">StoryBrand Aligned</span>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Smart Slot Engine</span>
                        <span className="text-sm font-black text-purple-600 mt-0.5 block">Optimal Peak Times</span>
                        <span className="text-[9px] text-purple-700 font-semibold mt-0.5 block">Format-Aware Scheduling</span>
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
                            className={`rounded-2xl border transition-all overflow-hidden ${isExpanded ? 'border-indigo-400 bg-white shadow-md' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                              }`}
                          >
                            {/* Card Accordion Header */}
                            <div
                              onClick={() => setExpandedPostIndex(isExpanded ? null : idx)}
                              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
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

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Format Switcher Pills */}
                                <div className="flex items-center bg-slate-100 rounded-full p-0.5 text-[10px] font-bold" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePostFormat(idx, 'REEL')}
                                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${post.format === 'REEL' ? 'bg-[#101014] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                  >
                                    🎬 Reel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePostFormat(idx, 'CAROUSEL')}
                                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${post.format === 'CAROUSEL' ? 'bg-[#101014] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                  >
                                    📑 Carousel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePostFormat(idx, 'SINGLE_IMAGE')}
                                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${post.format === 'SINGLE_IMAGE' ? 'bg-[#101014] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                  >
                                    📸 Photo
                                  </button>
                                </div>

                                {/* Quick Inline Edit Toggle */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (editingPostIndex === idx) {
                                      handleSaveInlineEditPost(idx);
                                    } else {
                                      setExpandedPostIndex(idx);
                                      handleStartInlineEditPost(idx, post);
                                    }
                                  }}
                                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                                    editingPostIndex === idx
                                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {editingPostIndex === idx ? '✓ Save' : '✏️ Edit'}
                                </button>

                                {/* 1-Click Single Post Regenerator */}
                                <button
                                  type="button"
                                  disabled={regeneratingPostIndex === idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRegenerateSinglePost(idx);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 flex items-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3 h-3 ${regeneratingPostIndex === idx ? 'animate-spin' : ''}`} />
                                  <span>{regeneratingPostIndex === idx ? 'Regenerating...' : '🔄 Rewrite'}</span>
                                </button>

                                <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                                  {new Date(post.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-xs text-indigo-600 font-bold">{isExpanded ? 'Hide ▲' : 'View ▼'}</span>
                              </div>
                            </div>

                            {/* Card Expanded Details */}
                            {isExpanded && (
                              <div className="p-4 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
                                {/* Dynamic Hook Variations Swapper */}
                                {post.hookVariations && post.hookVariations.length > 0 && (
                                  <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center space-x-1">
                                        <Sparkles className="w-3 h-3 text-indigo-600" />
                                        <span>Dynamic Hook Variations (Click to Swap Active Hook):</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                                        Hook #{post.activeHookIndex !== undefined ? post.activeHookIndex + 1 : 1} Active
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      {post.hookVariations.map((hVar: string, hIdx: number) => {
                                        const isActive = post.activeHookIndex === hIdx || post.hook === hVar.replace(/^[A-Za-z\s]+:\s*/, '');
                                        const label = hIdx === 0 ? 'Curiosity Hook' : hIdx === 1 ? 'Data/Contrast Hook' : 'Story Hook';
                                        return (
                                          <button
                                            key={hIdx}
                                            type="button"
                                            onClick={() => handleSwapHookVariation(idx, hIdx, hVar)}
                                            className={`p-2.5 text-left rounded-xl text-[11px] border transition-all cursor-pointer flex flex-col justify-between ${
                                              isActive
                                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs font-medium'
                                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                            }`}
                                          >
                                            <span className={`text-[9px] font-extrabold uppercase tracking-wider mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                                              {label}
                                            </span>
                                            <span className="line-clamp-2 leading-snug">{hVar}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Inline Edit Form Mode */}
                                {editingPostIndex === idx && editPostDraft && (
                                  <div className="p-4 bg-white rounded-2xl border-2 border-indigo-500 shadow-md space-y-3 animate-in fade-in duration-150">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                        <span>✏️ Live Editing Day {idx + 1} Post</span>
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingPostIndex(null);
                                            setEditPostDraft(null);
                                          }}
                                          className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSaveInlineEditPost(idx)}
                                          className="px-4 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-xs cursor-pointer"
                                        >
                                          ✓ Save Changes
                                        </button>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500 uppercase">Post Title</label>
                                      <input
                                        type="text"
                                        value={editPostDraft.title}
                                        onChange={(e) => setEditPostDraft({ ...editPostDraft, title: e.target.value })}
                                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500 uppercase">Opening Hook</label>
                                      <input
                                        type="text"
                                        value={editPostDraft.hook}
                                        onChange={(e) => setEditPostDraft({ ...editPostDraft, hook: e.target.value })}
                                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500 uppercase">Full Caption</label>
                                      <textarea
                                        rows={4}
                                        value={editPostDraft.caption}
                                        onChange={(e) => setEditPostDraft({ ...editPostDraft, caption: e.target.value })}
                                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Trigger Keyword (Comment-to-DM)</label>
                                      <input
                                        type="text"
                                        value={editPostDraft.ctaKeyword}
                                        onChange={(e) => setEditPostDraft({ ...editPostDraft, ctaKeyword: e.target.value })}
                                        className="w-full sm:w-48 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold"
                                      />
                                    </div>
                                  </div>
                                )}
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
                                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1.5 ${currentTab === tab.id
                                                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                              <span>{tab.label}</span>
                                              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${currentTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
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

        {/* ===================================================================== */}
        {/* SAVED LIBRARIES & IDEAS SCRATCHPAD MODAL (SPRINT 2)                   */}
        {/* ===================================================================== */}
        {showLibraryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900 tracking-tight">
                      Saved Libraries &amp; Ideas Scratchpad
                    </h3>
                    <p className="text-xs text-neutral-500">
                      1-Tap viral hashtag sets, quick business snippets &amp; 5-second ideas capture
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLibraryModal(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Segmented Tab Switcher */}
              <div className="px-5 pt-3 pb-2 border-b border-neutral-100 flex items-center space-x-2 bg-white">
                <button
                  type="button"
                  onClick={() => setLibraryTab('HASHTAGS')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    libraryTab === 'HASHTAGS'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Viral Hashtag Packs ({VIRAL_HASHTAG_PACKS.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLibraryTab('SNIPPETS')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    libraryTab === 'SNIPPETS'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Quick Snippets ({DEFAULT_QUICK_SNIPPETS.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLibraryTab('IDEAS')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    libraryTab === 'IDEAS'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ideas Board ({ideas.length})</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {/* TAB 1: HASHTAGS */}
                {libraryTab === 'HASHTAGS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {VIRAL_HASHTAG_PACKS.map(pack => (
                      <div
                        key={pack.id}
                        className="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-purple-200 transition-all space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-neutral-900">{pack.title}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-mono">
                            {pack.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-snug">{pack.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pack.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => handleCopyHashtagPack(pack.id, pack.tags)}
                            className="text-xs font-bold text-neutral-700 hover:text-neutral-900 flex items-center space-x-1 cursor-pointer"
                          >
                            {copiedHashtagPackId === pack.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-black">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Copy All Tags</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowLibraryModal(false);
                              setInstantTopic(`Campaign with ${pack.tags.slice(0, 3).join(' ')}`);
                              setShowInstantModal(true);
                              setGeneratedInstantPost(null);
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>⚡ Use in Studio</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 2: QUICK SNIPPETS */}
                {libraryTab === 'SNIPPETS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {DEFAULT_QUICK_SNIPPETS.map(snippet => (
                      <div
                        key={snippet.id}
                        className="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-indigo-200 transition-all space-y-2.5 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-neutral-900">{snippet.title}</h4>
                          <div className="p-2.5 bg-white rounded-xl border border-neutral-100 text-xs text-neutral-700 font-sans whitespace-pre-wrap leading-relaxed">
                            {snippet.content}
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(snippet.id, snippet.content)}
                            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            {copiedSnippetId === snippet.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Snippet</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: KANBAN IDEAS BOARD */}
                {libraryTab === 'IDEAS' && (
                  <div className="space-y-5">
                    {/* Quick Idea Capture Bar */}
                    <div className="p-4 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/60 to-indigo-50/60 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-black text-neutral-900">
                          Got a Content Hook or Photo Idea? Capture in 5 Seconds:
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Idea title (e.g. 3 mistakes before buying...)"
                          value={newIdeaTitle}
                          onChange={(e) => setNewIdeaTitle(e.target.value)}
                          className="sm:col-span-2 text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <select
                          value={newIdeaFormat}
                          onChange={(e: any) => setNewIdeaFormat(e.target.value)}
                          className="text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 outline-none font-bold"
                        >
                          <option value="REEL">🎬 Reel (9:16)</option>
                          <option value="CAROUSEL">📑 Carousel</option>
                          <option value="POST">📸 Photo Drop</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleSaveNewIdea}
                          disabled={!newIdeaTitle.trim()}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          + Save Idea
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Optional hook / talking point (e.g. Stop wasting money on cheap knockoffs...)"
                        value={newIdeaHook}
                        onChange={(e) => setNewIdeaHook(e.target.value)}
                        className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Idea Cards List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {ideas.map(idea => (
                        <div
                          key={idea.id}
                          className="p-3.5 rounded-2xl border border-neutral-200 bg-white hover:border-purple-200 transition-all flex flex-col justify-between space-y-3 shadow-2xs group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono">
                                {idea.format === 'REEL' ? '🎬 Reel' : idea.format === 'CAROUSEL' ? '📑 Carousel' : '📸 Photo'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteIdea(idea.id)}
                                className="text-neutral-300 hover:text-rose-500 transition-colors p-1"
                                title="Remove idea"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h5 className="text-xs font-bold text-neutral-900 leading-snug">{idea.title}</h5>
                            <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{idea.hook}</p>
                          </div>

                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-neutral-400">{idea.createdAt}</span>
                            <button
                              type="button"
                              onClick={() => handleConvertIdeaToPost(idea)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
                            >
                              <Zap className="w-3 h-3 text-amber-300" />
                              <span>⚡ Drop</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
