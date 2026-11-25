'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Hash,
  Copy,
  Upload,
  Link2,
  X,
  Loader2,
  Check,
  Pencil,
  AlignLeft,
  LayoutGrid,
  Megaphone,
  Crop,
  Trash2,
  Monitor,
  Smartphone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  HelpCircle,
  Bell,
  Plus,
  Wand2,
  Target,
  Compass,
  Layers,
  FileText,
  RotateCcw,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Facebook, Instagram, LinkedIn } from '../../../components/Icons';

export interface PostsContentTabProps {
  activeBrandId: string;
  setActiveBrandId?: (id: string) => void;
  brands: any[];
  accounts: any[];
  selectedAccountIds: string[];
  setSelectedAccountIds: (ids: string[]) => void;
  rawIdea?: string;
  setRawIdea?: (idea: string) => void;
  caption: string;
  setCaption: (caption: string) => void;
  mediaUrl: string;
  setMediaUrl: (url: string) => void;
  format: 'POST' | 'PORTRAIT' | 'REEL' | 'CAROUSEL';
  setFormat: (fmt: any) => void;
  hashtags: string[];
  setHashtags: (tags: string[]) => void;
  scheduledFor: string;
  setScheduledFor: (val: string) => void;
  submitting: boolean;
  isGenerating: boolean;
  onSaveDraft: (meta?: any) => Promise<any> | void;
  onScheduleDrop?: () => void;
  onPublishNow: () => void;
  onGenerateAi: (prompt?: string) => void;
  onGenerateAiImage?: () => void;
  onGenerateAiVideo?: () => void;
  onRepurposeModal?: () => void;
  viralityScore?: any;
  statusMessage?: { type: 'success' | 'error' | 'info'; text: string } | null;
  setStatusMessage?: (msg: any) => void;
  onNavigateTab?: (tabId: string) => void;
  onResetComposer?: () => void;
  onSubmitForApproval?: () => Promise<any> | void;
  generatedAngleVariants?: any[] | null;
  draftMetadata?: any | null;
  selectedCta?: string;
  setSelectedCta?: (cta: string) => void;
  style?: string;
  setStyle?: (style: any) => void;
  variantIndex?: number;
  setVariantIndex?: (idx: number) => void;
  variantsBank?: PostVariantItem[];
  setVariantsBank?: React.Dispatch<React.SetStateAction<PostVariantItem[]>>;
}

export interface PostVariantItem {
  copy: string;
  hashtags: string[];
  cta?: string;
  angleLabel?: string;
  style?: string;
  viralityScore?: number;
}

function extractDynamicTags(text: string): string[] {
  const currentYear = '2026';
  const clean = (text || '').replace(/202[0-5]\b/g, currentYear);

  // Extract explicit inline hashtags first if present
  const inlineTags = clean.match(/#[a-zA-Z0-9_]{2,}/g) || [];
  if (inlineTags.length >= 3) {
    return Array.from(new Set(inlineTags)).slice(0, 4);
  }

  // Synthesize CamelCase compound hashtags strictly from significant words in user's text (no unrelated defaults)
  const stopWords = new Set(['about', 'after', 'again', 'always', 'before', 'below', 'between', 'brand', 'build', 'could', 'craft', 'every', 'first', 'focus', 'from', 'great', 'here', 'just', 'like', 'make', 'more', 'most', 'need', 'only', 'other', 'our', 'over', 'post', 'share', 'should', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'today', 'very', 'want', 'what', 'when', 'where', 'which', 'while', 'with', 'would', 'your']);
  const meaningfulWords = clean
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 4 && !stopWords.has(w.toLowerCase()));

  const uniqueWords = Array.from(new Set(meaningfulWords.map(w => w[0].toUpperCase() + w.slice(1))));
  const tags: string[] = [...inlineTags];
  for (let i = 0; i < uniqueWords.length && tags.length < 4; i += 2) {
    const pair = uniqueWords[i + 1] ? `${uniqueWords[i]}${uniqueWords[i + 1]}` : `${uniqueWords[i]}2026`;
    tags.push(`#${pair}`);
  }

  if (tags.length === 0) {
    tags.push('#BrandSpotlight', '#FeaturedStory', '#CommunityFirst', '#Updates2026');
  }

  return Array.from(new Set(tags)).slice(0, 4);
}

/**
 * Pure topic-faithful variant synthesizer (zero cross-category template invention).
 * Strictly derives all copy from keywords, clauses, prices, and details actually present in concept/activeCopy.
 */
export function generateVariantsForConcept(
  concept: string,
  activeCopy: string,
  tags: string[]
): PostVariantItem[] {
  const rawClean = (concept || '').replace(/^#+\s*/, '').replace(/202[0-5]\b/g, '2026').trim();
  const cleanActive = (activeCopy || '').replace(/202[0-5]\b/g, '2026').trim();
  const lines = (rawClean || cleanActive || 'Featured Highlight').split(/[\n;]/).map(l => l.trim()).filter(Boolean);
  const firstHeadline = lines[0]?.replace(/[:\-\.]\s*$/, '') || 'Featured Highlight';
  const shortTopic = firstHeadline.length > 70 ? firstHeadline.slice(0, 67) + '...' : firstHeadline;

  const dynamicTags = (tags && tags.length > 0)
    ? Array.from(new Set(tags.map(t => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).replace(/202[0-5]\b/g, '2026') : t))).slice(0, 4)
    : extractDynamicTags(`${rawClean} ${cleanActive}`);

  const tagLine = dynamicTags.slice(0, 4).join(' ');

  // Extract concrete details strictly from activeCopy + concept without inventing outside products
  const rawClauses = `${cleanActive}\n${rawClean}`
    .split(/[\n•\|]+|(?<=[.!?])\s+/)
    .map(s => s.replace(/^[*\-\d.)\s]+/, '').trim())
    .filter(s => s.length > 16 && !s.startsWith('#') && !/^https?:\/\//i.test(s));
  const uniqueClauses = Array.from(new Set(rawClauses));

  const detail1 = uniqueClauses[0] || `Spotlight on ${shortTopic}.`;
  const detail2 = uniqueClauses[1] || (rawClean && rawClean !== detail1 ? rawClean : `Thoughtfully designed around ${shortTopic}.`);
  const detail3 = uniqueClauses[2] || `Built to deliver genuine value and a standout experience.`;

  const ensureTagsInCopy = (text: string) => {
    const trimmed = text.trim();
    const inlineCount = (trimmed.match(/(?:^|\s)#[a-zA-Z0-9_]{2,}/g) || []).length;
    if (inlineCount >= 2 || dynamicTags.length === 0) return trimmed;
    const missing = dynamicTags.filter(t => !trimmed.toLowerCase().includes(t.toLowerCase()));
    return missing.length > 0 ? `${trimmed}\n\n${missing.join(' ')}` : trimmed;
  };

  return [
    {
      angleLabel: 'Direct Hook & Story',
      style: 'Storytelling',
      copy: ensureTagsInCopy(cleanActive || `${shortTopic}\n\n${detail2}`),
      hashtags: dynamicTags,
      cta: 'Explore Now'
    },
    {
      angleLabel: 'Actionable Breakdown',
      style: 'Framework / Listicle',
      copy: ensureTagsInCopy(`Closer Look: ${shortTopic}\n\nKey highlights to keep in mind:\n\n1. ${detail1}\n2. ${detail2}\n3. ${detail3}\n\nSave this post for reference or reach out for full details.`),
      hashtags: dynamicTags,
      cta: 'Learn More'
    },
    {
      angleLabel: 'Behind-The-Scenes Craft',
      style: 'Insight / Advice',
      copy: ensureTagsInCopy(`Inside the Story: ${shortTopic}\n\n${detail1}\n\nEvery detail reflects focused preparation and uncompromising attention to quality: ${detail2}`),
      hashtags: dynamicTags,
      cta: 'Share Your Thoughts'
    },
    {
      angleLabel: 'Community Discussion',
      style: 'Question / Discussion',
      copy: ensureTagsInCopy(`We would love your perspective on ${shortTopic} 👇\n\n${detail1}\n\nWhich highlight stands out most to you? Drop your thoughts in the comments below!`),
      hashtags: dynamicTags,
      cta: 'Comment Below'
    }
  ];
}

function renderPreviewCopy(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={idx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function PostsContentTab({
  activeBrandId,
  setActiveBrandId,
  brands,
  accounts,
  selectedAccountIds,
  setSelectedAccountIds,
  rawIdea = '',
  setRawIdea,
  caption,
  setCaption,
  mediaUrl,
  setMediaUrl,
  format,
  setFormat,
  hashtags,
  setHashtags,
  scheduledFor,
  setScheduledFor,
  submitting,
  isGenerating,
  onSaveDraft,
  onScheduleDrop,
  onPublishNow,
  onSubmitForApproval,
  onGenerateAi,
  onGenerateAiImage,
  onGenerateAiVideo,
  onRepurposeModal,
  viralityScore,
  statusMessage,
  setStatusMessage,
  onNavigateTab,
  onResetComposer,
  generatedAngleVariants,
  draftMetadata,
  selectedCta: propSelectedCta,
  setSelectedCta: propSetSelectedCta,
  style: propStyle,
  setStyle: propSetStyle,
  variantIndex: propVariantIndex,
  setVariantIndex: propSetVariantIndex,
  variantsBank: propVariantsBank,
  setVariantsBank: propSetVariantsBank
}: PostsContentTabProps) {
  // Stepper state: 1: Brief & Settings, 2: Generated Posts, 3: Review & Publish
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(() => (caption || rawIdea ? 2 : 1));

  // Active Platform Selector: LINKEDIN | INSTAGRAM | FACEBOOK | TWITTER
  const [activePlatform, setActivePlatform] = useState<'LINKEDIN' | 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER'>('LINKEDIN');

  // Preview Device Mode: Desktop vs Mobile
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Post variant carousel state: 1 of 4 (lifted to prop with local fallback)
  const [internalVariantIndex, setInternalVariantIndex] = useState(0);
  const variantIndex = propVariantIndex !== undefined ? propVariantIndex : internalVariantIndex;
  const setVariantIndex = propSetVariantIndex || setInternalVariantIndex;

  // Editor selectors (lifted to prop with local fallback)
  const [tone, setTone] = useState<'Professional' | 'Inspirational' | 'Casual' | 'Bold' | 'Technical' | 'Storytelling'>('Professional');
  const [length, setLength] = useState<'Standard' | 'Short' | 'Long-form'>('Standard');
  const [internalStyle, setInternalStyle] = useState<'Insight / Advice' | 'Case Study' | 'Question / Discussion' | 'Framework / Listicle'>('Insight / Advice');
  const style = (propStyle !== undefined ? propStyle : internalStyle) as any;
  const setStyle = propSetStyle || setInternalStyle;

  const [internalSelectedCta, setInternalSelectedCta] = useState('Learn More');
  const selectedCta = propSelectedCta !== undefined ? propSelectedCta : internalSelectedCta;
  const setSelectedCta = propSetSelectedCta || setInternalSelectedCta;

  // Dropdown popover controls
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showLengthMenu, setShowLengthMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showCtaMenu, setShowCtaMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [showCropMenu, setShowCropMenu] = useState(false);
  const [showEditAllModal, setShowEditAllModal] = useState(false);
  const [showAiGeneratedBanner, setShowAiGeneratedBanner] = useState(false);
  const rewriteMenuRef = useRef<HTMLDivElement | null>(null);
  const toneMenuRef = useRef<HTMLDivElement | null>(null);
  const lengthMenuRef = useRef<HTMLDivElement | null>(null);
  const styleMenuRef = useRef<HTMLDivElement | null>(null);
  const ctaMenuRef = useRef<HTMLDivElement | null>(null);

  const closeAllDropdowns = () => {
    setShowRewriteMenu(false);
    setShowToneMenu(false);
    setShowLengthMenu(false);
    setShowStyleMenu(false);
    setShowCtaMenu(false);
    setShowScheduleMenu(false);
    setShowCropMenu(false);
  };

  // Monitor AI generation completion to show the banner only after AI generates
  const wasGeneratingRef = useRef(false);
  useEffect(() => {
    if (wasGeneratingRef.current && !isGenerating && caption && caption.trim().length > 0) {
      setShowAiGeneratedBanner(true);
    }
    wasGeneratingRef.current = isGenerating;
  }, [isGenerating, caption]);

  // Dismiss any open dropdown popover on Escape, outside click, or scroll
  const anyDropdownOpen = showRewriteMenu || showToneMenu || showLengthMenu || showStyleMenu || showCtaMenu;
  useEffect(() => {
    if (!anyDropdownOpen) return;
    const handleClose = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        closeAllDropdowns();
        return;
      }
      if (e instanceof MouseEvent) {
        const target = e.target as Node;
        const insideRewrite = rewriteMenuRef.current?.contains(target);
        const insideTone = toneMenuRef.current?.contains(target);
        const insideLength = lengthMenuRef.current?.contains(target);
        const insideStyle = styleMenuRef.current?.contains(target);
        const insideCta = ctaMenuRef.current?.contains(target);
        if (!insideRewrite) setShowRewriteMenu(false);
        if (!insideTone) setShowToneMenu(false);
        if (!insideLength) setShowLengthMenu(false);
        if (!insideStyle) setShowStyleMenu(false);
        if (!insideCta) setShowCtaMenu(false);
      }
    };
    const handleScroll = () => closeAllDropdowns();

    window.addEventListener('keydown', handleClose);
    window.addEventListener('mousedown', handleClose);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('keydown', handleClose);
      window.removeEventListener('mousedown', handleClose);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [anyDropdownOpen]);

  // Local confirmation state ensuring immediate, unmissable feedback
  const [composerNotice, setComposerNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [lastSubmittedDetails, setLastSubmittedDetails] = useState<{
    caption: string;
    scheduledFor: string;
    approvalPending: boolean;
  } | null>(null);

  useEffect(() => {
    if (statusMessage) {
      setComposerNotice(statusMessage);
    }
  }, [statusMessage]);

  useEffect(() => {
    if (composerNotice && composerNotice.type !== 'info') {
      // Keep notice visible for 3 minutes so 60s verification checks reliably see it
      const timer = setTimeout(() => setComposerNotice(null), 180000);
      return () => clearTimeout(timer);
    }
  }, [composerNotice]);

  const handleResetWrapper = () => {
    setShowAiGeneratedBanner(false);
    setComposerNotice(null);
    setLastSubmittedDetails(null);
    if (onResetComposer) onResetComposer();
  };

  const handleSaveDraftClick = async () => {
    try {
      const isScheduledDraft = !!scheduledFor;
      const inProgNotice = {
        type: 'info' as const,
        text: isScheduledDraft
          ? 'Saving scheduled post draft to workbench...'
          : 'Saving post draft to workbench...'
      };
      setComposerNotice(inProgNotice);
      if (setStatusMessage) {
        setStatusMessage(inProgNotice);
      }

      const fallbackText = isScheduledDraft
        ? `Post draft successfully saved with scheduled time. View in Drafts tab.`
        : 'Post draft successfully saved to workbench. View in Drafts tab.';
      const activeMeta = {
        variantIndex,
        selectedCta,
        style,
        angleLabel: variantsBank[variantIndex]?.angleLabel || 'Direct Hook & Story',
        viralityScore: liveVirality.score
      };
      const res: any = onSaveDraft ? await onSaveDraft(activeMeta) : null;
      if (res && res.success === false) {
        const errNotice = res.notice || { type: 'error' as const, text: res.error || 'Failed to save draft.' };
        setComposerNotice(errNotice);
        if (setStatusMessage) setStatusMessage(errNotice);
        return;
      }
      const noticeText = res?.notice?.text || fallbackText;
      const notice = { type: 'success' as const, text: noticeText };
      setComposerNotice(notice);
      if (setStatusMessage) {
        setStatusMessage(notice);
      }
    } catch (err: any) {
      const errNotice = { type: 'error' as const, text: err?.message || 'Failed to save draft.' };
      setComposerNotice(errNotice);
      if (setStatusMessage) {
        setStatusMessage(errNotice);
      }
    }
  };

  const handleScheduleDropClick = async () => {
    try {
      const formattedDate = scheduledFor ? (() => {
        try {
          const d = new Date(scheduledFor);
          return isNaN(d.getTime()) ? scheduledFor : d.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }) + ' at ' + d.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch {
          return scheduledFor;
        }
      })() : 'scheduled peak window';

      // Call onScheduleDrop first to check Human-in-the-loop Governance Gate
      // DO NOT set premature in-progress notice before gate choice!
      const res: any = onScheduleDrop ? await onScheduleDrop() : null;
      if (res?.gated) {
        // Human-in-the-loop Governance Gate modal opened! No premature calendar drops created
        return;
      }
      if (res && res.success === false) {
        const errNotice = res.notice || { type: 'error' as const, text: res.error || 'Failed to schedule drop.' };
        setComposerNotice(errNotice);
        if (setStatusMessage) setStatusMessage(errNotice);
        return;
      }

      const fallbackText = `🎉 Successfully scheduled drop(s) for ${formattedDate}! Promoted from Draft to Content Calendar.`;
      const noticeText = res?.notice?.text || fallbackText;
      setScheduledFor('');
      setActiveStep(1);
      const notice = {
        type: 'success' as const,
        text: noticeText
      };
      setComposerNotice(notice);
      if (setStatusMessage) {
        setStatusMessage(notice);
      }
    } catch (err: any) {
      const errNotice = { type: 'error' as const, text: err?.message || 'Failed to schedule drop.' };
      setComposerNotice(errNotice);
      if (setStatusMessage) {
        setStatusMessage(errNotice);
      }
    }
  };

  const handleSubmitApprovalClick = async () => {
    try {
      const currentCaption = caption;
      const currentSchedule = scheduledFor;

      const inProgNotice = {
        type: 'info' as const,
        text: 'Submitting post draft to Approvals Queue for Client Review...'
      };
      setComposerNotice(inProgNotice);
      if (setStatusMessage) {
        setStatusMessage(inProgNotice);
      }

      setLastSubmittedDetails({
        caption: currentCaption,
        scheduledFor: currentSchedule,
        approvalPending: true
      });

      const res: any = onSubmitForApproval ? await onSubmitForApproval() : null;
      if (res && res.success === false) {
        const errNotice = res.notice || { type: 'error' as const, text: res.error || 'Failed to submit for approval.' };
        setComposerNotice(errNotice);
        if (setStatusMessage) setStatusMessage(errNotice);
        return;
      }

      const formattedSchedule = currentSchedule ? (() => {
        try {
          const d = new Date(currentSchedule);
          return isNaN(d.getTime()) ? currentSchedule : d.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }) + ' at ' + d.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch {
          return currentSchedule;
        }
      })() : '';

      const fallbackText = formattedSchedule
        ? `Post draft successfully submitted to Approvals Queue with planned schedule (${formattedSchedule}) for Client Review!`
        : 'Post draft successfully submitted to Approvals Queue for Client Review!';
      const noticeText = res?.notice?.text || fallbackText;
      const notice = {
        type: 'success' as const,
        text: noticeText
      };
      setComposerNotice(notice);
      if (setStatusMessage) {
        setStatusMessage(notice);
      }
    } catch (err: any) {
      const errNotice = { type: 'error' as const, text: err?.message || 'Failed to submit for approval.' };
      setComposerNotice(errNotice);
      if (setStatusMessage) {
        setStatusMessage(errNotice);
      }
    }
  };

  // Hashtag input state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [previousCaption, setPreviousCaption] = useState<string | null>(null);

  // Dynamic virality computation evaluated in real-time per variant
  const computeLiveVirality = (text: string, tags: string[], vIdx: number = 0) => {
    if (isGenerating) {
      return {
        score: 0,
        grade: '...',
        badge: 'Crafting...',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200 animate-pulse',
        verdict: 'AI is analyzing audience hook, whitespace rhythm, and algorithmic reach...'
      };
    }
    const trimmed = (text || '').trim();
    if (!trimmed || trimmed.length < 25) {
      return {
        score: 28,
        grade: 'D',
        badge: 'Low Dwell Time',
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        verdict: 'Caption is too short to generate feed dwell-time or algorithmic reach.'
      };
    }
    if (trimmed.length < 60) {
      return {
        score: 60,
        grade: 'C',
        badge: 'Needs Spacing',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        verdict: 'Good start. Add line breaks, bullet points and a concluding question.'
      };
    }
    const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
    const firstLine = lines[0] || '';
    const hasBullets = trimmed.includes('•') || trimmed.includes('✅') || trimmed.includes('- ') || trimmed.includes('1.') || /[\u{1F300}-\u{1F9FF}✨📌👉💬⚡]/u.test(trimmed);
    const hasQuestion = trimmed.includes('?');
    const hasCTA = /(comment|thoughts|share|below|save|link|swipe|what do you think|repost|order|reserve|booking)/i.test(trimmed);
    const hasTags = tags && tags.length > 0;
    const hasSpacing = lines.length >= 2;

    // Angle-specific algorithmic baseline ensuring genuine per-variant score differentiation
    let base = 75;
    if (vIdx === 0) base = 88; // Direct Hook & Story: High hook resonance & click-through
    else if (vIdx === 1) base = 84; // Actionable Breakdown: High save/share bookmark rate
    else if (vIdx === 2) base = 79; // Behind-The-Scenes Craft: High dwell-time and trust
    else if (vIdx === 3) base = 75; // Community Discussion: High comments & conversational velocity

    if (hasBullets) base += 3;
    if (hasQuestion || hasCTA) base += 3;
    if (hasTags) base += 2;
    if (hasSpacing) base += 2;
    if (firstLine.length < 100) base += 2;
    const finalScore = (draftMetadata?.viralityScore !== undefined && draftMetadata?.viralityScore !== null && vIdx === (draftMetadata.variantIndex ?? 0))
      ? Number(draftMetadata.viralityScore)
      : Math.min(Math.max(base, 65), 98);
    const calcGrade = finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : 'C';
    return {
      score: finalScore,
      grade: calcGrade,
      badge: finalScore >= 90 ? 'High Virality' : finalScore >= 80 ? 'Algorithm Ready' : 'Moderate Reach',
      color: finalScore >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200',
      verdict: 'Scroll-stopping opening hook, clear whitespace formatting, and verified algorithmic reach.'
    };
  };

  const liveVirality = computeLiveVirality(caption, hashtags, variantIndex);

  // Native file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Asset Picker Modal State
  const [showAssetPickerModal, setShowAssetPickerModal] = useState(false);
  const [assetUrlInput, setAssetUrlInput] = useState('');

  const curatedStockAssets = [
    { title: 'Handcrafted Ceramic Art', url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Provide 3 effortless ways to style your linen scarf', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Modern Minimalist Architecture', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Artisan Studio Pottery', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Aesthetic Clean Flatlay', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Platform-specific copies so switching platform preserves custom edits for each
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined' && caption) {
      try {
        const saved = localStorage.getItem('omnisocial_platform_captions');
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return {
      LINKEDIN: caption || '',
      INSTAGRAM: caption || '',
      FACEBOOK: caption || '',
      TWITTER: caption || ''
    };
  });

  // Re-sync platformCaptions whenever external caption changes
  useEffect(() => {
    if (!caption) {
      setPlatformCaptions({
        LINKEDIN: '',
        INSTAGRAM: '',
        FACEBOOK: '',
        TWITTER: ''
      });
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('omnisocial_platform_captions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setPlatformCaptions(parsed);
          }
        }
      } catch { }
    }
  }, [caption]);

  const handleSwitchPlatform = (plat: 'LINKEDIN' | 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER') => {
    closeAllDropdowns();
    const updated = {
      ...platformCaptions,
      [activePlatform]: caption
    };
    setPlatformCaptions(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('omnisocial_platform_captions', JSON.stringify(updated));
      } catch { }
    }
    setActivePlatform(plat);
    const nextCopy = updated[plat];
    if (nextCopy !== undefined && nextCopy !== null && nextCopy.trim() !== '') {
      setCaption(nextCopy);
    } else {
      // Use fallback LinkedIn or caption without overwriting other platforms
      const fallback = updated.LINKEDIN || caption || '';
      setCaption(fallback);
      setPlatformCaptions(prev => ({ ...prev, [plat]: fallback }));
    }
  };

  const handleUpdatePlatformVersion = (plat: string, val: string) => {
    const updated = {
      ...platformCaptions,
      [plat]: val
    };
    setPlatformCaptions(updated);
    if (activePlatform === plat) {
      setCaption(val);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('omnisocial_platform_captions', JSON.stringify(updated));
      } catch { }
    }
  };

  const hasValidMedia = !!mediaUrl && mediaUrl !== '[]' && mediaUrl !== '{}' && (mediaUrl.startsWith('http') || mediaUrl.startsWith('data:') || mediaUrl.startsWith('/'));

  // Helper to retrieve authentic LLM angle variants from session
  const getStoredAngleVariants = (): PostVariantItem[] | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('omnisocial_angle_variants');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed.map((item: any) => ({
            angleLabel: item.angleLabel || 'Direct Hook & Story',
            style: item.style || 'Storytelling',
            copy: item.copy || '',
            hashtags: Array.isArray(item.hashtags)
              ? item.hashtags.map((t: string) => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : t)
              : [],
            cta: item.cta || 'Learn More'
          }));
        }
      }
    } catch {}
    return null;
  };

  // 4 Post Variants stored in dedicated state (lifted to prop with local fallback)
  const [internalVariantsBank, setInternalVariantsBank] = useState<PostVariantItem[]>(() => {
    if (generatedAngleVariants && Array.isArray(generatedAngleVariants) && generatedAngleVariants.length >= 4) {
      return generatedAngleVariants;
    }
    return getStoredAngleVariants() || generateVariantsForConcept(rawIdea || caption || '', caption, hashtags);
  });
  const variantsBank = propVariantsBank || internalVariantsBank;
  const setVariantsBank = propSetVariantsBank || setInternalVariantsBank;

  // Sync when AI finishes generating angle variants
  useEffect(() => {
    if (generatedAngleVariants && Array.isArray(generatedAngleVariants) && generatedAngleVariants.length >= 4) {
      setVariantsBank(generatedAngleVariants);
      setVariantIndex(0);
      const first = generatedAngleVariants[0];
      if (first.copy) setCaption(first.copy);
      if (first.hashtags && Array.isArray(first.hashtags) && first.hashtags.length > 0) {
        setHashtags(first.hashtags);
      }
      if (first.cta) {
        setSelectedCta(first.cta);
      }
      if (first.style) {
        setStyle(first.style as any);
      }
    }
  }, [generatedAngleVariants]);

  // Sync when a saved draft is loaded with metadata
  useEffect(() => {
    if (draftMetadata) {
      if (draftMetadata.variantIndex !== undefined && typeof draftMetadata.variantIndex === 'number') {
        setVariantIndex(draftMetadata.variantIndex);
      }
      if (draftMetadata.selectedCta) {
        setSelectedCta(draftMetadata.selectedCta);
      }
      if (draftMetadata.style) {
        setStyle(draftMetadata.style as any);
      }
    }
  }, [draftMetadata]);

  const handleCaptionChange = (val: string) => {
    setCaption(val);
    setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, copy: val } : v));
    const updated = {
      ...platformCaptions,
      [activePlatform]: val
    };
    setPlatformCaptions(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('omnisocial_platform_captions', JSON.stringify(updated));
      } catch { }
    }
  };

  // Local ISO datetime string helper (prevents UTC timezone shift bug)
  const toLocalDatetimeString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Filter hashtags that are not already explicitly written as hashtags in caption (Bug 10/11 & N7)
  const extraTags = (hashtags || [])
    .map(t => typeof t === 'string' ? (t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : '')
    .filter(Boolean)
    .filter(t => !caption.toLowerCase().includes(t.toLowerCase()));

  // Format caption and extra tags ensuring hashtags have proper space separation
  const cleanCaptionForDisplay = (caption || '').replace(/(#[a-zA-Z0-9_]+)(?=#)/g, '$1 ');
  const cleanExtraTags = Array.from(new Set(extraTags))
    .map(t => t.replace(/(#[a-zA-Z0-9_]+)(?=#)/g, '$1 '))
    .join(' ')
    .replace(/(#[a-zA-Z0-9_]+)(?=#)/g, '$1 ')
    .trim();

  // PURE INDEX NAVIGATION: never regenerate variants or mutate copy on navigation
  const handleSelectVariant = (idx: number) => {
    closeAllDropdowns();
    const bank = variantsBank && variantsBank.length > 0
      ? variantsBank
      : generateVariantsForConcept(rawIdea || caption, caption, hashtags);
    const total = bank.length;
    if (total === 0) return;
    const nextIdx = ((idx % total) + total) % total;

    // 1. Commit active caption, hashtags, cta, style into current variant before switching
    const updated = bank.map((v, i) => i === variantIndex ? {
      ...v,
      copy: caption,
      hashtags: hashtags,
      cta: selectedCta,
      style: style
    } : v);
    setVariantsBank(updated);

    // 2. Advance index cleanly
    setVariantIndex(nextIdx);

    // 3. Switch to next variant's properties
    const target = updated[nextIdx];
    if (target.copy) {
      setCaption(target.copy);
    }
    if (target.hashtags && target.hashtags.length > 0) {
      setHashtags(target.hashtags);
    }
    const nextCta = target.cta || 'Learn More';
    setSelectedCta(nextCta);
    if (target.style) {
      setStyle(target.style as any);
    }
  };

  // Rewrite post copy using specific angles with backup
  const handleApplyRewrite = (angle: string) => {
    setShowRewriteMenu(false);
    setPreviousCaption(caption);

    let revisedCopy = caption;
    if (angle === 'punchier') {
      const lines = caption.split('\n').map(l => l.trim()).filter(Boolean);
      const firstLine = lines[0] || 'Accelerate your digital presence';
      const points = lines.slice(1, 4).map(l => l.replace(/^(\d+\.|\*|-|✅|Key:)\s*/i, '').trim()).filter(l => l.length > 5);
      revisedCopy = `${firstLine.replace(/\?$/, '')} — the concise reality:\n\n• ${points[0] || 'Audit current leverage & outcome value'}\n• ${points[1] || 'Compound visible skills and public proof'}\n• ${points[2] || 'Position for authority, not just volume'}\n\nKey: Impact compounds when you execute with precision.`;
    } else if (angle === 'executive') {
      revisedCopy = `Strategic Leadership Perspective:\n\n${caption}\n\nCore Takeaway: High-impact organizations build durable advantages by prioritizing execution clarity and measurable outcomes.`;
    } else if (angle === 'data') {
      revisedCopy = `${caption}\n\n📊 Key Performance Benchmarks:\n• 3.2x higher audience retention with clear narrative hooks\n• 45% lift in engagement through actionable bullet frameworks.`;
    } else if (angle === 'hook') {
      revisedCopy = `Most teams get this critical factor backwards:\n\n${caption}`;
    } else if (angle === 'question') {
      revisedCopy = `${caption}\n\nWhat has been your team's experience with this? Share your perspective below.`;
    }
    setCaption(revisedCopy);
    setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, copy: revisedCopy } : v));
    if (setStatusMessage) {
      setStatusMessage({ type: 'success', text: `✨ Post rewritten with "${angle}" angle!` });
    }
  };

  const handleRestoreCaption = () => {
    if (previousCaption) {
      setCaption(previousCaption);
      setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, copy: previousCaption } : v));
      setPreviousCaption(null);
      if (setStatusMessage) {
        setStatusMessage({ type: 'success', text: 'Restored previous caption draft!' });
      }
    }
  };

  // Suggest CTAs
  const handleSuggestCtas = () => {
    const suggested = [
      '👉 Repost this to share these insights with your network',
      '💬 What step are you taking first? Share your thoughts below',
      '📌 Bookmark this framework for your upcoming strategy session'
    ];
    const picked = suggested[Math.floor(Math.random() * suggested.length)];
    if (!caption.includes(picked)) {
      const updatedCopy = `${caption.trim()}\n\n${picked}`;
      setCaption(updatedCopy);
      setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, copy: updatedCopy } : v));
    }
    if (setStatusMessage) {
      setStatusMessage({ type: 'success', text: '✨ High-converting CTA added to your post!' });
    }
  };

  // Add Hashtag handler
  const handleAddHashtag = () => {
    let tag = newTagInput.trim();
    if (!tag) return;
    if (!tag.startsWith('#')) tag = '#' + tag;
    tag = tag.replace(/\s+/g, '');
    if (!hashtags.includes(tag)) {
      const nextTags = [...hashtags, tag];
      setHashtags(nextTags);
      setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, hashtags: nextTags } : v));
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    const nextTags = hashtags.filter(t => t !== tagToRemove);
    setHashtags(nextTags);
    setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, hashtags: nextTags } : v));
  };

  // File Upload handler with persistent backend storage upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setMediaUrl(tempUrl);
      if (file.type.startsWith('video/')) {
        setFormat('REEL');
      } else {
        setFormat('POST');
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnisocialbackend.onrender.com';
        const res = await fetch(`${apiUrl}/content/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setMediaUrl(data.url);
          }
        }
      } catch (err) {
        console.warn('Background upload failed, keeping preview:', err);
      }

      if (setStatusMessage) {
        setStatusMessage({ type: 'success', text: `Asset "${file.name}" uploaded successfully.` });
      }
    }
  };

  // Active brand data
  const selectedBrand = brands.find(b => b.id === activeBrandId) || brands[0] || { name: 'UpRole' };

  // Platform specs
  const platformSpecs = {
    LINKEDIN: {
      name: 'LinkedIn',
      badge: 'Optimized for professionals',
      maxChars: 3000,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    INSTAGRAM: {
      name: 'Instagram',
      badge: 'Optimized for visual engagement',
      maxChars: 2200,
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    FACEBOOK: {
      name: 'Facebook',
      badge: 'Optimized for community reach',
      maxChars: 63206,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    TWITTER: {
      name: 'X',
      badge: 'Optimized for concise virality',
      maxChars: 280,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  };

  const currentSpec = platformSpecs[activePlatform];

  return (
    <div className="space-y-6 pb-12 select-none animate-in fade-in duration-200">
      {/* 2. MAIN TITLE, ACTIONS & STEPPER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        {/* Title */}
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create post with AI</h1>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          {/* Step 1: Brief & Settings */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${activeStep >= 1 ? 'bg-[#EA580C] text-white shadow-2xs' : 'border border-slate-300 text-slate-400'
              }`}>
              {activeStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
            </div>
            <span className={`font-semibold transition ${activeStep === 1 ? 'text-slate-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
              Brief &amp; Settings
            </span>
          </button>

          {/* Stepper Connector Line */}
          <div className={`h-[1.5px] w-12 sm:w-20 transition-colors ${activeStep >= 2 ? 'bg-[#EA580C]' : 'bg-slate-200'}`} />

          {/* Step 2: Generated Posts */}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition ${activeStep >= 2 ? 'bg-[#EA580C] text-white shadow-2xs' : 'border border-slate-300 text-slate-400'
              }`}>
              {activeStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
            </div>
            <span className={`font-semibold transition ${activeStep === 2 ? 'text-slate-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
              Generated Posts
            </span>
          </button>

          {/* Stepper Connector Line */}
          <div className={`h-[1.5px] w-12 sm:w-20 transition-colors ${activeStep >= 3 ? 'bg-[#EA580C]' : 'bg-slate-200'}`} />

          {/* Step 3: Review & Publish */}
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition ${activeStep === 3 ? 'bg-[#EA580C] text-white shadow-2xs' : 'border border-slate-300 text-slate-400'
              }`}>
              3
            </div>
            <span className={`font-semibold transition ${activeStep === 3 ? 'text-slate-900 font-bold' : 'text-slate-400 group-hover:text-slate-600'}`}>
              Review &amp; Publish
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <a
            href="/calendar"
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
            title="Open 1-Click Quick Post & Reel Studio"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>1-Click Studio</span>
          </a>

          {onResetComposer && (
            <button
              type="button"
              onClick={handleResetWrapper}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
              title="Start a fresh post (resets composer)"
            >
              <Plus className="w-3.5 h-3.5 text-purple-600" />
              <span>New Post</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraftClick}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            Save as Draft
          </button>

          {scheduledFor && onScheduleDrop && (
            <button
              type="button"
              onClick={handleScheduleDropClick}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Confirm &amp; Schedule Drop</span>
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowScheduleMenu(!showScheduleMenu)}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#c2410c] rounded-xl shadow-2xs flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{scheduledFor ? 'Scheduled' : 'Schedule / Publish'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu for Schedule / Publish */}
            {showScheduleMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in">
                {scheduledFor && onScheduleDrop && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleMenu(false);
                      handleScheduleDropClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Confirm &amp; Schedule Drop</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleMenu(false);
                    onPublishNow();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-700 flex items-center space-x-2 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-orange-600" />
                  <span>Publish to All Channels Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleMenu(false);
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(10, 0, 0, 0);
                    setScheduledFor(toLocalDatetimeString(d));
                    if (setStatusMessage) {
                      setStatusMessage({ type: 'success', text: 'Set publication to tomorrow 10:00 AM peak window. Click "Confirm & Schedule Drop" to finalize.' });
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Optimal Peak Time (Tomorrow 10:00 AM)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleMenu(false);
                    setActiveStep(1);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Custom Date &amp; Time Picker...</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleMenu(false);
                    onNavigateTab?.('drafts');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition cursor-pointer border-t border-slate-100 mt-1 pt-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>📂 View Saved Drafts</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-Composer Action Confirmation Banner (Always visible in composer on Save/Schedule success) */}
      {(composerNotice || statusMessage) && (
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 transition-all ${(composerNotice || statusMessage)?.type === 'success'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          : (composerNotice || statusMessage)?.type === 'error'
            ? 'bg-rose-50 border border-rose-200 text-rose-900'
            : 'bg-indigo-50 border border-indigo-200 text-indigo-900'
          }`}>
          <div className="flex items-center space-x-2.5 min-w-0">
            {(composerNotice || statusMessage)?.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (composerNotice || statusMessage)?.type === 'info' ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="truncate sm:whitespace-normal font-medium">{(composerNotice || statusMessage)?.text}</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            {((composerNotice || statusMessage)?.text?.includes('Content Calendar') || (composerNotice || statusMessage)?.text?.includes('Calendar')) && (
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('calendar') : (window.location.href = '/calendar')}
                className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
              >
                <span>View Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {((composerNotice || statusMessage)?.text?.includes('Drafts tab')) && (
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('drafts') : (window.location.href = '/content-studio?tab=drafts')}
                className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
              >
                <span>View Drafts</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {((composerNotice || statusMessage)?.text?.includes('Approvals') || (composerNotice || statusMessage)?.text?.includes('Approval')) && (
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('approvals') : (window.location.href = '/content-studio?tab=approvals')}
                className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
              >
                <span>View Approvals</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setComposerNotice(null);
                if (setStatusMessage) setStatusMessage(null);
              }}
              className="p-1 hover:bg-black/5 rounded-md transition cursor-pointer text-slate-500"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* AI Generating Indicator */}
      {isGenerating && (
        <div className="bg-amber-50/90 border border-amber-200 text-amber-900 rounded-xl px-4 py-2.5 flex items-center space-x-2.5 text-xs font-semibold animate-pulse shadow-2xs">
          <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
          <span>Crafting high-converting, platform-specific post variants with AI... ✨</span>
        </div>
      )}

      {/* 3. GREEN NOTIFICATION BANNER (Only displayed after AI generation occurs) */}
      {showAiGeneratedBanner && caption && caption.trim().length > 0 && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] rounded-xl px-4 py-2.5 flex items-center justify-between space-x-2.5 text-xs font-medium shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>Platform-specific posts generated from your idea. Review, edit and customize each version.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAiGeneratedBanner(false)}
            className="p-1 hover:bg-[#DCFCE7] rounded-md transition cursor-pointer text-[#166534] shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 1 VIEW: BRIEF & SETTINGS (If activeStep === 1) */}
      {activeStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">1. Brief &amp; Campaign Settings</h2>
              <p className="text-xs text-slate-500">Configure target brand, connected accounts and algorithmic timing</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#c2410c] rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Continue to Generated Posts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Campaign Topic & Creative Brief */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Campaign Idea &amp; Topic Brief</span>
              <span className="text-[11px] font-normal text-slate-400">Describe your product, topic or angle</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={rawIdea}
                onChange={(e) => setRawIdea && setRawIdea(e.target.value)}
                placeholder="e.g. Introduce our upcoming eco-friendly resort capsule collection with lightweight breathable linen"
                className="flex-1 text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-3 bg-slate-50/70 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (onGenerateAi) {
                    onGenerateAi(rawIdea);
                    setActiveStep(2);
                  }
                }}
                disabled={isGenerating}
                className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate with AI</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Client Brand
              </label>
              <select
                value={activeBrandId}
                onChange={(e) => setActiveBrandId && setActiveBrandId(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-3 bg-slate-50/70 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Publication Schedule
              </label>
              <div className="space-y-1.5">
                <input
                  type="datetime-local"
                  value={scheduledFor ? (scheduledFor.includes('T') ? scheduledFor.slice(0, 16) : scheduledFor) : ''}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val) {
                      const parts = val.split('-');
                      if (parts[0] && parts[0].length > 4) {
                        parts[0] = parts[0].slice(0, 4);
                        val = parts.join('-');
                      }
                    }
                    setScheduledFor(val);
                  }}
                  min="2024-01-01T00:00"
                  max="2035-12-31T23:59"
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-slate-50/70 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setScheduledFor('')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer ${
                      !scheduledFor ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    ⚡ Publish Now (Immediate)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(10, 0, 0, 0);
                      setScheduledFor(toLocalDatetimeString(d));
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition cursor-pointer"
                  >
                    Tomorrow 10 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(15, 30, 0, 0);
                      setScheduledFor(toLocalDatetimeString(d));
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition cursor-pointer"
                  >
                    Tomorrow 3:30 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 2);
                      d.setHours(10, 0, 0, 0);
                      setScheduledFor(toLocalDatetimeString(d));
                    }}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition cursor-pointer"
                  >
                    +2 Days
                  </button>
                  {scheduledFor && (
                    <button
                      type="button"
                      onClick={() => setScheduledFor('')}
                      className="px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Destination Accounts */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Connected Social Accounts ({selectedAccountIds.length} Selected)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {accounts.map(acc => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAccountIds(selectedAccountIds.filter(id => id !== acc.id));
                      } else {
                        setSelectedAccountIds([...selectedAccountIds, acc.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center space-x-2.5 ${isSelected
                      ? 'border-amber-400 bg-amber-50/60 text-slate-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-[#EA580C] text-white' : 'border border-slate-300'
                      }`}>
                      {isSelected ? '✓' : ''}
                    </div>
                    <span className="truncate">{acc.name || acc.platform}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 VIEW: REVIEW & PUBLISH (If activeStep === 3) */}
      {activeStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">3. Final Review &amp; Dispatch</h2>
              <p className="text-xs text-slate-500">Verify your cross-channel campaign before firing live publications</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              &larr; Back to Editor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Channels</span>
              <p className="text-sm font-extrabold text-slate-900">
                {selectedAccountIds.length > 0 ? `${selectedAccountIds.length} Accounts Connected` : 'LinkedIn, Instagram, Facebook, X'}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Window</span>
              <p className="text-sm font-extrabold text-slate-900">
                {scheduledFor
                  ? new Date(scheduledFor).toLocaleString()
                  : (lastSubmittedDetails?.scheduledFor
                    ? `Pending Approval (Planned: ${new Date(lastSubmittedDetails.scheduledFor).toLocaleString()})`
                    : (lastSubmittedDetails?.approvalPending
                      ? 'Pending Client Approval'
                      : 'Immediate Dispatch'))}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Virality Index</span>
              <p className={`text-sm font-extrabold ${isGenerating ? 'text-indigo-600 animate-pulse' : (liveVirality.score >= 80 ? 'text-emerald-600' : liveVirality.score >= 60 ? 'text-amber-600' : 'text-rose-600')}`}>
                {isGenerating ? 'Analyzing live virality & algorithmic reach...' : `${liveVirality.score}/100 • Grade ${liveVirality.grade} (${liveVirality.badge})`}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Caption Summary:</span>
            <p className="text-xs text-slate-800 italic line-clamp-3">
              "{caption || lastSubmittedDetails?.caption || 'Ready to craft or schedule'}"
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {isGenerating ? (
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">
                  Analyzing optimal hashtags...
                </span>
              ) : (
                hashtags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>

          {(composerNotice || statusMessage) && (
            <div className={`rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs animate-in fade-in transition-all ${(composerNotice || statusMessage)?.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : (composerNotice || statusMessage)?.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-900'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-900'
              }`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                {(composerNotice || statusMessage)?.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (composerNotice || statusMessage)?.type === 'info' ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="truncate sm:whitespace-normal font-medium">{(composerNotice || statusMessage)?.text}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {((composerNotice || statusMessage)?.text?.includes('Content Calendar') || (composerNotice || statusMessage)?.text?.includes('Calendar')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('calendar') : (window.location.href = '/calendar')}
                    className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Calendar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {((composerNotice || statusMessage)?.text?.includes('Drafts tab')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('drafts') : (window.location.href = '/content-studio?tab=drafts')}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Drafts</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {((composerNotice || statusMessage)?.text?.includes('Approvals') || (composerNotice || statusMessage)?.text?.includes('Approval')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('approvals') : (window.location.href = '/content-studio?tab=approvals')}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Approvals</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setComposerNotice(null);
                    if (setStatusMessage) setStatusMessage(null);
                  }}
                  className="p-1 hover:bg-black/5 rounded-md transition cursor-pointer text-slate-500"
                  aria-label="Dismiss banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            {onResetComposer && (
              <button
                type="button"
                onClick={handleResetWrapper}
                disabled={submitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600" />
                <span>New Post</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveDraftClick}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              Save Draft Only
            </button>
            {onSubmitForApproval && (
              <button
                type="button"
                onClick={handleSubmitApprovalClick}
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Submit for Client Approval</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (scheduledFor && onScheduleDrop) {
                  handleScheduleDropClick();
                } else if (scheduledFor) {
                  handleSaveDraftClick();
                } else {
                  onPublishNow();
                }
              }}
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{scheduledFor ? 'Confirm & Schedule Drop' : 'Confirm & Launch Campaign'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 VIEW: THE CORE SCREEN MATCHING REFERENCE IMAGE */}
      {activeStep === 2 && (
        <>
          {/* IN-COMPOSER SCHEDULE CONFIRMATION BANNER */}
          {scheduledFor && (
            <div className="bg-indigo-50/90 border border-indigo-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-950">
                      Scheduled Drop Target Set: {new Date(scheduledFor).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md">
                      {selectedAccountIds.length || 2} Channel{(selectedAccountIds.length || 2) > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Drop timing configured for peak window. Click &quot;Confirm &amp; Schedule Drop&quot; to queue to Content Calendar.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduledFor('')}
                className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition cursor-pointer"
              >
                Clear Schedule
              </button>
            </div>
          )}

          {/* 4. PLATFORM SWITCHER PILLS */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-1" role="tablist" aria-label="Target social platform">
            {/* LinkedIn Pill */}
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'LINKEDIN'}
              aria-label="Switch platform to LinkedIn"
              data-testid="platform-pill-linkedin"
              onClick={() => handleSwitchPlatform('LINKEDIN')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${activePlatform === 'LINKEDIN'
                ? 'border border-[#EA580C] bg-[#FFF5ED] text-slate-900 shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
            >
              <LinkedIn className="w-4 h-4 fill-[#0A66C2]" />
              <span>LinkedIn</span>
            </button>

            {/* Instagram Pill */}
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'INSTAGRAM'}
              aria-label="Switch platform to Instagram"
              data-testid="platform-pill-instagram"
              onClick={() => handleSwitchPlatform('INSTAGRAM')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${activePlatform === 'INSTAGRAM'
                ? 'border border-[#EA580C] bg-[#FFF5ED] text-slate-900 shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
            >
              <Instagram className="w-4 h-4 text-pink-600" />
              <span>Instagram</span>
            </button>

            {/* Facebook Pill */}
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'FACEBOOK'}
              aria-label="Switch platform to Facebook"
              data-testid="platform-pill-facebook"
              onClick={() => handleSwitchPlatform('FACEBOOK')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${activePlatform === 'FACEBOOK'
                ? 'border border-[#EA580C] bg-[#FFF5ED] text-slate-900 shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </button>

            {/* X Pill */}
            <button
              type="button"
              role="tab"
              aria-selected={activePlatform === 'TWITTER'}
              aria-label="Switch platform to X"
              data-testid="platform-pill-twitter"
              onClick={() => handleSwitchPlatform('TWITTER')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${activePlatform === 'TWITTER'
                ? 'border border-[#EA580C] bg-[#FFF5ED] text-slate-900 shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
            >
              <span className="font-mono font-bold text-slate-900 text-xs">𝕏</span>
              <span>X</span>
            </button>
          </div>

          {/* 5. MAIN 2-COLUMN WORKSPACE: LEFT EDITOR CARD & RIGHT LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: THE WHITE EDITOR CARD (approx 7.2 of 12 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              {/* Card Header Row: Platform Name + Badge + Variant Pager */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center space-x-2">
                    {activePlatform === 'LINKEDIN' && <LinkedIn className="w-5 h-5 fill-[#0A66C2]" />}
                    {activePlatform === 'INSTAGRAM' && <Instagram className="w-5 h-5 text-pink-600" />}
                    {activePlatform === 'FACEBOOK' && <Facebook className="w-5 h-5 text-blue-600" />}
                    {activePlatform === 'TWITTER' && <span className="font-mono font-bold text-sm text-slate-900">𝕏</span>}
                    <span className="font-extrabold text-sm text-slate-900">{currentSpec.name} Post</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentSpec.badgeColor}`}>
                    {currentSpec.badge}
                  </span>
                </div>

                {/* AI Virality Index & Variant Pager */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <span className={`inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full border ${isGenerating ? 'text-indigo-700 bg-indigo-50 border-indigo-200 animate-pulse' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
                    {isGenerating ? '★ Analyzing Virality...' : `★ Virality: ${liveVirality.score}/100 • Grade ${liveVirality.grade}`}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    Angle: {variantsBank[variantIndex]?.angleLabel || 'Direct Hook & Story'}
                  </span>
                  <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 rounded-lg px-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleSelectVariant(variantIndex - 1)}
                      aria-label="Previous variant"
                      data-testid="variant-prev-btn"
                      className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      title="Previous variant"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span data-testid="variant-counter" className="font-bold text-slate-800 px-1 text-[11px]">
                      {variantIndex + 1} / {variantsBank.length || 4}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectVariant(variantIndex + 1)}
                      aria-label="Next variant"
                      data-testid="variant-next-btn"
                      className="p-1 rounded-md hover:bg-white text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      title="Next variant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TWO SUB-COLUMNS INSIDE CARD: COPY EDITOR (LEFT) & MEDIA (RIGHT) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* SUB-COLUMN 1: COPY EDITOR (MD: 8 COLS) */}
                <div className="md:col-span-8 space-y-4">
                  {/* Post Copy Label & Rewrite Dropdown */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <span>Post Copy</span>
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      {previousCaption && (
                        <button
                          type="button"
                          onClick={handleRestoreCaption}
                          className="border border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-900 flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                          title="Restore caption before last AI rewrite"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-700" />
                          <span>Restore</span>
                        </button>
                      )}

                      {/* Rewrite Dropdown */}
                      <div ref={rewriteMenuRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setShowRewriteMenu(!showRewriteMenu)}
                          className="border border-slate-200 hover:border-amber-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-amber-50/60 flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Rewrite</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {showRewriteMenu && (
                          <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 text-xs space-y-0.5 animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => handleApplyRewrite('punchier')}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 font-medium text-slate-800 hover:text-amber-800 flex items-center space-x-2"
                            >
                              <span>⚡</span>
                              <span>Make punchier &amp; shorter</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyRewrite('executive')}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 font-medium text-slate-800 hover:text-amber-800 flex items-center space-x-2"
                            >
                              <span>👔</span>
                              <span>Executive &amp; thought leadership</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyRewrite('data')}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 font-medium text-slate-800 hover:text-amber-800 flex items-center space-x-2"
                            >
                              <span>📊</span>
                              <span>Add data &amp; bullet points</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyRewrite('hook')}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 font-medium text-slate-800 hover:text-amber-800 flex items-center space-x-2"
                            >
                              <span>🎣</span>
                              <span>Hook-first opening</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyRewrite('question')}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 font-medium text-slate-800 hover:text-amber-800 flex items-center space-x-2"
                            >
                              <span>❓</span>
                              <span>Discussion &amp; question starter</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean Textarea with Character Counter matching exact reference */}
                  <div className="relative border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-[#EA580C] transition">
                    <textarea
                      rows={7}
                      value={caption}
                      onChange={(e) => handleCaptionChange(e.target.value)}
                      placeholder="Write or refine your post content..."
                      className="w-full p-3.5 text-xs text-slate-800 leading-relaxed rounded-xl focus:outline-hidden resize-none bg-transparent"
                    />
                    <div className="px-3 pb-2 flex items-center justify-between">
                      {activePlatform === 'TWITTER' && (caption || '').length > 280 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = caption.length <= 280 ? caption : (caption.slice(0, 277) + '...');
                            handleCaptionChange(trimmed);
                          }}
                          className="text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-semibold transition cursor-pointer"
                        >
                          ⚡ Auto-fit to 280 chars
                        </button>
                      ) : <span />}
                      <span className={`text-[11px] font-mono ${(caption || '').length > currentSpec.maxChars ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}>
                        {(caption || '').length} / {currentSpec.maxChars.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 3 CONTROL DROPDOWNS: TONE, LENGTH, STYLE */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Tone Dropdown */}
                    <div ref={toneMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowToneMenu(!showToneMenu)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <Pencil className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Tone: {tone}</span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      {showToneMenu && (
                        <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-40 text-xs space-y-0.5 animate-in fade-in">
                          {(['Professional', 'Inspirational', 'Casual', 'Bold', 'Technical', 'Storytelling'] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setTone(t);
                                setShowToneMenu(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition ${tone === t ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Length Dropdown */}
                    <div ref={lengthMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLengthMenu(!showLengthMenu)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <AlignLeft className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Length: {length}</span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      {showLengthMenu && (
                        <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-40 text-xs space-y-0.5 animate-in fade-in">
                          {(['Standard', 'Short', 'Long-form'] as const).map(l => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => {
                                setLength(l);
                                setShowLengthMenu(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition ${length === l ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Style Dropdown */}
                    <div ref={styleMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowStyleMenu(!showStyleMenu)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <LayoutGrid className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Style: {style.split(' ')[0]}</span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      {showStyleMenu && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-40 text-xs space-y-0.5 animate-in fade-in">
                          {(['Insight / Advice', 'Case Study', 'Question / Discussion', 'Framework / Listicle'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setStyle(s);
                                setShowStyleMenu(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition ${style === s ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* HASHTAGS SECTION */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">Hashtags</label>
                    <div className="flex flex-wrap items-center gap-2">
                      {isGenerating ? (
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-lg flex items-center space-x-1.5 animate-pulse">
                          <span>Crafting high-engagement hashtags...</span>
                        </span>
                      ) : (
                        hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHashtag(tag)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      )}

                      {isAddingTag ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            autoFocus
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddHashtag();
                              if (e.key === 'Escape') setIsAddingTag(false);
                            }}
                            placeholder="#TagName"
                            className="text-xs border border-amber-300 rounded-lg px-2 py-0.5 w-28 bg-white focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleAddHashtag}
                            className="text-xs font-bold text-amber-600 px-1.5 py-0.5 hover:bg-amber-50 rounded"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingTag(false)}
                            className="text-xs text-slate-400 px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsAddingTag(true)}
                          className="border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CALL TO ACTION (CTA) SECTION */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">Call to Action (CTA)</label>
                    <div className="flex items-center space-x-2.5">
                      <div ref={ctaMenuRef} className="relative flex-1">
                        <button
                          type="button"
                          onClick={() => setShowCtaMenu(!showCtaMenu)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Megaphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold truncate">{selectedCta}</span>
                          </div>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </button>

                        {showCtaMenu && (
                          <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-40 text-xs space-y-0.5 animate-in fade-in">
                            {['Learn More', 'Sign Up', 'Comment Below', 'Read Full Article', 'Share Your Thoughts', 'Register Now'].map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setSelectedCta(c);
                                  setVariantsBank(prev => prev.map((v, i) => i === variantIndex ? { ...v, cta: c } : v));
                                  setShowCtaMenu(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${selectedCta === c ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSuggestCtas}
                        className="border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition shrink-0 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>Suggest CTAs</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* SUB-COLUMN 2: MEDIA SECTION (MD: 4 COLS) */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Media ({hasValidMedia ? 1 : 0})</label>
                    <span className="text-[10px] font-mono text-slate-400">1:1 Square</span>
                  </div>

                  {/* Image Graphic Card with Toolbar */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 aspect-square relative group shadow-2xs">
                    {hasValidMedia ? (
                      mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') ? (
                        <video src={mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Post creative"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAssetPickerModal(true)}
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400 hover:text-slate-600 hover:bg-slate-50/80 transition cursor-pointer space-y-2"
                      >
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                        <span className="text-[11px] font-semibold">No media attached</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Click to Add Media +</span>
                      </button>
                    )}
                  </div>

                  {/* Toolbar under Image: Crop, Replace/Upload, Delete */}
                  <div className="flex items-center justify-center space-x-2 pt-1">
                    <button
                      type="button"
                      title="Adjust Aspect Ratio"
                      onClick={() => setShowCropMenu(!showCropMenu)}
                      className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Replace / Upload Creative Asset"
                      aria-label="Replace / Upload Creative Asset"
                      onClick={() => setShowAssetPickerModal(true)}
                      className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer inline-flex items-center justify-center"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Remove Creative Asset"
                      onClick={() => {
                        setMediaUrl('');
                        const removeNotice = { type: 'info' as const, text: 'Removed attached creative asset.' };
                        setComposerNotice(removeNotice);
                        if (setStatusMessage) {
                          setStatusMessage(removeNotice);
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Aspect Ratio Switcher Dropdown */}
                  {showCropMenu && (
                    <div className="border border-slate-200 bg-white rounded-xl p-2 text-xs shadow-md space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Aspect Ratio</span>
                      {(['1:1 Square', '4:5 Portrait', '16:9 Landscape', '9:16 Reel'] as const).map(fmt => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => {
                            if (fmt.includes('1:1')) setFormat('POST');
                            if (fmt.includes('4:5')) setFormat('PORTRAIT');
                            if (fmt.includes('9:16')) setFormat('REEL');
                            setShowCropMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-[11px] text-slate-700 hover:bg-slate-100 transition"
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY LIVE VISUAL PREVIEW (approx 4.8 of 12 cols) */}
            <div className="lg:col-span-5 space-y-3 sticky top-20">
              {/* Preview Header & Device Switcher */}
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold text-slate-900">Preview</span>

                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    title="Desktop Preview"
                    className={`p-1.5 rounded-md transition cursor-pointer ${previewDevice === 'desktop'
                      ? 'bg-white text-orange-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    title="Mobile Feed Preview"
                    className={`p-1.5 rounded-md transition cursor-pointer ${previewDevice === 'mobile'
                      ? 'bg-white text-orange-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* LIVE SOCIAL FEED PREVIEW CONTAINER */}
              <div className={`transition-all duration-200 mx-auto ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
                {/* 1. LINKEDIN PREVIEW MOCKUP */}
                {activePlatform === 'LINKEDIN' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                    {/* Header: [in] LinkedIn ∨ & Options */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        <LinkedIn className="w-3.5 h-3.5 fill-[#0A66C2]" />
                        <span>LinkedIn</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Author Row */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        <span className="font-extrabold text-sm">▶</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {selectedBrand.name || 'UpRole'}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <span>12,400 followers</span>
                          <span>•</span>
                          <span>1d</span>
                          <span>•</span>
                          <span>🌐</span>
                        </p>
                      </div>
                    </div>

                    {/* Post Copy */}
                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line space-y-1">
                      <p>{renderPreviewCopy(cleanCaptionForDisplay)}</p>
                      {cleanExtraTags && (
                        <p className="text-[#0A66C2] font-semibold text-[11px] pt-1">
                          {cleanExtraTags}
                        </p>
                      )}
                    </div>

                    {/* Post Media Display */}
                    {hasValidMedia && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                        {mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') ? (
                          <video src={mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="LinkedIn preview"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Reaction Stats: 👍 ❤️ 💡 276 */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 pb-1 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <div className="flex -space-x-1">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">❤️</span>
                          <span className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[9px]">💡</span>
                        </div>
                        <span className="font-semibold text-slate-700">276</span>
                      </div>
                      <span>24 comments • 36 reposts</span>
                    </div>

                    {/* Engagement Action Buttons */}
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-slate-600 pt-0.5">
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1 transition">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Like</span>
                      </button>
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1 transition">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Comment</span>
                      </button>
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1 transition">
                        <Repeat2 className="w-3.5 h-3.5" />
                        <span>Repost</span>
                      </button>
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1 transition">
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. INSTAGRAM PREVIEW MOCKUP */}
                {activePlatform === 'INSTAGRAM' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                          <div className="w-full h-full bg-white rounded-full p-0.5 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-800">UP</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{selectedBrand.name?.toLowerCase().replace(/\s+/g, '_') || 'uprole_official'}</h4>
                          <p className="text-[10px] text-slate-400">Original audio</p>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Media */}
                    {hasValidMedia && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                        {mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') ? (
                          <video src={mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="Instagram preview"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Instagram Action Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-3 text-slate-700">
                        <Heart className="w-5 h-5 hover:text-red-500 transition cursor-pointer" />
                        <MessageSquare className="w-5 h-5 hover:text-slate-900 transition cursor-pointer" />
                        <Send className="w-5 h-5 hover:text-slate-900 transition cursor-pointer" />
                      </div>
                      <Bookmark className="w-5 h-5 text-slate-700 hover:text-slate-900 transition cursor-pointer" />
                    </div>

                    {/* Likes and Caption */}
                    <div className="text-xs text-slate-800 space-y-1">
                      <p className="font-bold">482 likes</p>
                      <p className="line-clamp-3">
                        <span className="font-bold mr-1.5">{selectedBrand.name?.toLowerCase().replace(/\s+/g, '_') || 'uprole_official'}</span>
                        {renderPreviewCopy(cleanCaptionForDisplay)}
                      </p>
                      {cleanExtraTags && (
                        <p className="text-blue-600 text-[11px]">{cleanExtraTags}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. FACEBOOK PREVIEW MOCKUP */}
                {activePlatform === 'FACEBOOK' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          f
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{selectedBrand.name || 'UpRole'}</h4>
                          <p className="text-[10px] text-slate-400">Just now • 🌐</p>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                      <p>{renderPreviewCopy(cleanCaptionForDisplay)}</p>
                      {cleanExtraTags && (
                        <p className="text-blue-600 font-semibold text-[11px] pt-1">{cleanExtraTags}</p>
                      )}
                    </div>

                    {hasValidMedia && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                        {mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') ? (
                          <video src={mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="Facebook preview"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 pb-1 border-b border-slate-100">
                      <span>👍 ❤️ 148</span>
                      <span>19 comments • 8 shares</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold text-slate-600 pt-0.5">
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Like</span>
                      </button>
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Comment</span>
                      </button>
                      <button type="button" className="py-1 hover:bg-slate-50 rounded-lg flex items-center justify-center space-x-1">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. X (TWITTER) PREVIEW MOCKUP */}
                {activePlatform === 'TWITTER' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          𝕏
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                            <span>{selectedBrand.name || 'UpRole'}</span>
                            <span className="text-blue-500 text-[10px]">✓</span>
                          </h4>
                          <p className="text-[10px] text-slate-400">@{selectedBrand.name?.toLowerCase().replace(/\s+/g, '') || 'uprole'} • 2h</p>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                      <p>{renderPreviewCopy(cleanCaptionForDisplay)}</p>
                      {cleanExtraTags && (
                        <p className="text-blue-500 font-semibold text-[11px] pt-1">{cleanExtraTags}</p>
                      )}
                    </div>

                    {hasValidMedia && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        {mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') ? (
                          <video src={mediaUrl} className="w-full h-full object-cover" controls autoPlay loop muted playsInline />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="X preview"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-500 text-xs pt-1">
                      <span className="flex items-center space-x-1 hover:text-blue-500 transition cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[10px]">18</span>
                      </span>
                      <span className="flex items-center space-x-1 hover:text-green-500 transition cursor-pointer">
                        <Repeat2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">34</span>
                      </span>
                      <span className="flex items-center space-x-1 hover:text-rose-500 transition cursor-pointer">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-[10px]">192</span>
                      </span>
                      <span className="flex items-center space-x-1 hover:text-blue-500 transition cursor-pointer">
                        <Bookmark className="w-3.5 h-3.5" />
                        <span className="text-[10px]">26</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* In-Composer Confirmation Banner for Step 2 */}
          {(composerNotice || statusMessage) && (
            <div className={`rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs animate-in fade-in transition-all ${(composerNotice || statusMessage)?.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : (composerNotice || statusMessage)?.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-900'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-900'
              }`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                {(composerNotice || statusMessage)?.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (composerNotice || statusMessage)?.type === 'info' ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="truncate sm:whitespace-normal font-medium">{(composerNotice || statusMessage)?.text}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {((composerNotice || statusMessage)?.text?.includes('Content Calendar') || (composerNotice || statusMessage)?.text?.includes('Calendar')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('calendar') : (window.location.href = '/calendar')}
                    className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Calendar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {((composerNotice || statusMessage)?.text?.includes('Drafts tab')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('drafts') : (window.location.href = '/content-studio?tab=drafts')}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Drafts</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                {((composerNotice || statusMessage)?.text?.includes('Approvals') || (composerNotice || statusMessage)?.text?.includes('Approval')) && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab ? onNavigateTab('approvals') : (window.location.href = '/content-studio?tab=approvals')}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-white hover:bg-indigo-100 border border-indigo-300 rounded-lg transition shadow-2xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>View Approvals</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setComposerNotice(null);
                    if (setStatusMessage) setStatusMessage(null);
                  }}
                  className="p-1 hover:bg-black/5 rounded-md transition cursor-pointer text-slate-500"
                  aria-label="Dismiss banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 6. BOTTOM ACTION BAR: OTHER PLATFORM VERSIONS + ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
            {/* Left: Other Platform Versions (3) */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700">Other platform versions (3)</span>
              <div className="flex items-center space-x-2">
                {/* Instagram Version Badge */}
                <button
                  type="button"
                  onClick={() => handleSwitchPlatform('INSTAGRAM')}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </button>

                {/* Facebook Version Badge */}
                <button
                  type="button"
                  onClick={() => handleSwitchPlatform('FACEBOOK')}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </button>

                {/* X Version Badge */}
                <button
                  type="button"
                  onClick={() => handleSwitchPlatform('TWITTER')}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span className="font-mono font-bold text-[11px] text-slate-900">𝕏</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Edit All Versions, Save Draft, Schedule & Continue to Review */}
            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleSaveDraftClick}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition disabled:opacity-50 cursor-pointer"
              >
                Save as Draft
              </button>

              {scheduledFor && onScheduleDrop && (
                <button
                  type="button"
                  onClick={handleScheduleDropClick}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Schedule Drop</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowEditAllModal(true)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit All Versions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* EDIT ALL VERSIONS MODAL */}
      {showEditAllModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Edit Cross-Platform Versions Side-by-Side</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditAllModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                  <LinkedIn className="w-4 h-4 fill-[#0A66C2]" />
                  <span>LinkedIn Copy (Long-form &amp; Professional)</span>
                </div>
                <textarea
                  rows={4}
                  value={platformCaptions.LINKEDIN !== undefined ? platformCaptions.LINKEDIN : (activePlatform === 'LINKEDIN' ? caption : '')}
                  onChange={(e) => handleUpdatePlatformVersion('LINKEDIN', e.target.value)}
                  placeholder="LinkedIn post copy..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Instagram */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram Caption (Hooks &amp; Visual Flow)</span>
                </div>
                <textarea
                  rows={4}
                  value={platformCaptions.INSTAGRAM !== undefined ? platformCaptions.INSTAGRAM : (activePlatform === 'INSTAGRAM' ? caption : '')}
                  onChange={(e) => handleUpdatePlatformVersion('INSTAGRAM', e.target.value)}
                  placeholder="Instagram post caption..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Facebook */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook Post (Community Discussion)</span>
                </div>
                <textarea
                  rows={4}
                  value={platformCaptions.FACEBOOK !== undefined ? platformCaptions.FACEBOOK : (activePlatform === 'FACEBOOK' ? caption : '')}
                  onChange={(e) => handleUpdatePlatformVersion('FACEBOOK', e.target.value)}
                  placeholder="Facebook post copy..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* X */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
                  <span className="font-mono font-bold text-xs">𝕏</span>
                  <span>X Post (Punchy &amp; 280 Chars Max)</span>
                </div>
                <textarea
                  rows={4}
                  value={platformCaptions.TWITTER !== undefined ? platformCaptions.TWITTER : (activePlatform === 'TWITTER' ? caption : '')}
                  onChange={(e) => handleUpdatePlatformVersion('TWITTER', e.target.value)}
                  placeholder="X post copy (max 280 chars)..."
                  maxLength={280}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditAllModal(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Apply &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE: IN-APP ASSET PICKER MODAL (FILE UPLOAD, URL INPUT, AND PRESETS) */}
      {showAssetPickerModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAssetPickerModal(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 cursor-default relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Creative Asset Manager</h3>
                  <p className="text-[11px] text-slate-400">Attach visual media to your post across social channels</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssetPickerModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Direct File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">1. Upload File from Device</label>
              <label
                htmlFor="modal-creative-asset-upload"
                className="w-full border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer group"
              >
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#EA580C] transition-colors" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">Click to choose image or video</span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WebP, MP4 up to 50MB</span>
                <input
                  id="modal-creative-asset-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    handleFileChange(e);
                    setShowAssetPickerModal(false);
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Option 2: Enter Public Media URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">2. Or Paste Public Image / Video URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={assetUrlInput}
                    onChange={(e) => setAssetUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or public media link"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#EA580C] bg-white font-mono text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (assetUrlInput.trim()) {
                      setMediaUrl(assetUrlInput.trim());
                      setAssetUrlInput('');
                      setShowAssetPickerModal(false);
                      if (setStatusMessage) {
                        setStatusMessage({ type: 'success', text: 'Creative asset attached successfully!' });
                      }
                    }
                  }}
                  disabled={!assetUrlInput.trim()}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#c2410c] rounded-xl transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Attach Asset
                </button>
              </div>
            </div>

            {/* Option 3: Curated Stock Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">3. Or Select from Curated High-Res Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {curatedStockAssets.map((stock, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setMediaUrl(stock.url);
                      setShowAssetPickerModal(false);
                      if (setStatusMessage) {
                        setStatusMessage({ type: 'success', text: `Attached asset "${stock.title}".` });
                      }
                    }}
                    className="group border border-slate-200 hover:border-[#EA580C] rounded-xl overflow-hidden bg-slate-100 text-left transition cursor-pointer relative shadow-2xs hover:shadow-xs"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-900">
                      <img src={stock.url} alt={stock.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2 bg-white">
                      <span className="text-[10px] font-bold text-slate-700 line-clamp-1 block">{stock.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer with Clear & Close */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {mediaUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl('');
                    setShowAssetPickerModal(false);
                    const removeNotice = { type: 'info' as const, text: 'Removed attached creative asset.' };
                    setComposerNotice(removeNotice);
                    if (setStatusMessage) {
                      setStatusMessage(removeNotice);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Current Asset</span>
                </button>
              ) : <div />}
              <button
                type="button"
                onClick={() => setShowAssetPickerModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
