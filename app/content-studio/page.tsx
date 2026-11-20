'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '../../components/AppLayout';
import { apiRequest, getStoredActiveBrandId, setStoredActiveBrandId } from '../../lib/api';
import {
  PenTool,
  Sparkles,
  Share2,
  Calendar,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Hash,
  RefreshCw,
  Copy,
  Clock,
  Upload,
  Link2,
  X,
  Loader2,
  ExternalLink,
  Plus,
  Heart,
  MessageCircle,
  Bookmark,
  ChevronRight,
  Flame,
  LayoutGrid,
  Film,
  Layers as LayersIcon,
  Video,
  Play,
  Volume2,
  Wand2,
  Music,
  ChevronLeft,
  Download,
  FileText,
  Zap,
  Check,
  Mic,
  MicOff,
  Globe,
  Gauge,
  Repeat,
  ArrowRight,
  Target,
  Lightbulb,
  FileCheck2,
  Rocket,
  Cpu,
  FileEdit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Facebook, Instagram, LinkedIn } from '../../components/Icons';
import OutcomePromptBar from './components/OutcomePromptBar';
import OverviewTab from './components/OverviewTab';
import StrategyTab from './components/StrategyTab';
import PillarsTab from './components/PillarsTab';
import CampaignsTab from './components/CampaignsTab';
import IdeasRequestsTab from './components/IdeasRequestsTab';
import MediaLibraryTab from './components/MediaLibraryTab';
import ApprovalsTab from './components/ApprovalsTab';
import LaunchpadTab from './components/LaunchpadTab';
import SkillLibraryTab from './components/SkillLibraryTab';
import PostsContentTab from './components/PostsContentTab';
import DraftsTab from './components/DraftsTab';

function AccountPillAvatar({
  url,
  name,
  platform
}: {
  url?: string | null;
  name: string;
  platform: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || 'Social')
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SO';

  const platformBg =
    platform === 'LINKEDIN'
      ? 'bg-gradient-to-tr from-[#004182] to-[#0A66C2]'
      : platform === 'INSTAGRAM'
        ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
        : 'bg-gradient-to-tr from-[#1877F2] to-[#0d5ec9]';

  if (!url || imgError) {
    return (
      <div
        className={`w-8 h-8 rounded-full ${platformBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      onError={() => setImgError(true)}
      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200/80"
    />
  );
}

function ContentStudioContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const [activeBrandId, setActiveBrandId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getStoredActiveBrandId() || '';
    }
    return '';
  });

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
    setStoredActiveBrandId(brandId);
  };

  // Content Creation & Marketing Management v3.0 Workspace State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'strategy' | 'pillars' | 'campaigns' | 'ideas' | 'composer' | 'drafts' | 'media' | 'approvals' | 'launchpad' | 'skills'
  >('overview');

  const handleTabChange = (tabId: 'overview' | 'strategy' | 'pillars' | 'campaigns' | 'ideas' | 'composer' | 'drafts' | 'media' | 'approvals' | 'launchpad' | 'skills') => {
    setActiveTab(tabId);
    setStatusMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tabId === 'overview') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tabId);
      }
      window.history.replaceState({}, '', url.toString());
      window.dispatchEvent(new CustomEvent('omnisocial_tab_changed', { detail: tabId }));
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // Synchronize activeTab whenever searchParams or URL changes
  useEffect(() => {
    if (
      tabParam &&
      ['overview', 'strategy', 'pillars', 'campaigns', 'ideas', 'composer', 'drafts', 'media', 'approvals', 'launchpad', 'skills'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam as any);
    } else if (!tabParam) {
      setActiveTab('overview');
    }
  }, [tabParam]);

  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  const fetchOverview = async () => {
    if (!activeBrandId) return;
    setIsLoadingOverview(true);
    try {
      const res = await apiRequest(`/content-studio/overview?brandId=${activeBrandId}`);
      setOverviewData(res);
    } catch (err: any) {
      console.error('Fetch overview error:', err);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (activeBrandId) {
      fetchOverview();
    }
  }, [activeBrandId]);

  const [brands, setBrands] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Helper to load session draft across internal route navigation (e.g. Content Studio <-> Calendar)
  const getSessionDraft = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem('omnisocial_composer_session_draft') || localStorage.getItem('omnisocial_composer_draft');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  // Studio Form State (Fresh-start blank by default; populated via Edit Draft, Idea Bank, or Orchestrator)
  const [title, setTitle] = useState(() => getSessionDraft()?.title || '');
  const [rawIdea, setRawIdea] = useState(() => getSessionDraft()?.rawIdea || '');
  const [caption, setCaption] = useState<string>(() => getSessionDraft()?.caption || '');
  const [hashtags, setHashtags] = useState<string[]>(() => getSessionDraft()?.hashtags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState(() => getSessionDraft()?.mediaUrl || '');
  const [format, setFormat] = useState<'POST' | 'PORTRAIT' | 'REEL' | 'CAROUSEL'>(() => getSessionDraft()?.format || 'POST');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['FACEBOOK', 'INSTAGRAM', 'LINKEDIN']);
  const [scheduledFor, setScheduledFor] = useState(() => getSessionDraft()?.scheduledFor || '');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(() => getSessionDraft()?.activeDraftId || null);
  const [showUnapprovedPublishModal, setShowUnapprovedPublishModal] = useState(false);
  const [isPublishGateConfirmed, setIsPublishGateConfirmed] = useState(false);

function cleanMediaUrl(raw: any): string {
  if (!raw) return '';
  if (Array.isArray(raw)) {
    const first = raw[0];
    return typeof first === 'string' && (first.startsWith('http') || first.startsWith('data:') || first.startsWith('/')) ? first : '';
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed === '[]' || trimmed === '{}' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'none') {
      return '';
    }
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return cleanMediaUrl(parsed);
      } catch {
        return '';
      }
    }
    if (trimmed.startsWith('http') || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return '';
  }
  return '';
}

  const handleEditDraft = (draft: any) => {
    setActiveDraftId(draft.id);
    if (draft.title) setTitle(draft.title);
    if (draft.caption) setCaption(draft.caption);
    if (draft.rawIdea) setRawIdea(draft.rawIdea);
    if (draft.format) setFormat(draft.format);
    let tags: string[] = [];
    if (Array.isArray(draft.hashtags)) tags = draft.hashtags;
    else if (typeof draft.hashtags === 'string') {
      try { tags = JSON.parse(draft.hashtags); } catch { tags = draft.hashtags.split(/\s+/).filter(Boolean); }
    }
    if (tags.length > 0) setHashtags(tags);
    const img = cleanMediaUrl(draft.mediaUrls);
    setMediaUrl(img);
    const draftSched = draft.scheduledFor || (draft.publications && draft.publications[0]?.scheduledFor);
    if (draftSched) {
      try {
        const d = new Date(draftSched);
        if (!isNaN(d.getTime())) {
          const pad = (n: number) => n.toString().padStart(2, '0');
          setScheduledFor(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
        } else {
          setScheduledFor('');
        }
      } catch {
        setScheduledFor('');
      }
    } else {
      setScheduledFor('');
    }
    if (draft.platformCaptions) {
      try {
        const pc = typeof draft.platformCaptions === 'string' ? JSON.parse(draft.platformCaptions) : draft.platformCaptions;
        localStorage.setItem('omnisocial_platform_captions', JSON.stringify(pc));
      } catch {}
    } else if (draft.caption) {
      const pc = {
        LINKEDIN: draft.caption,
        INSTAGRAM: draft.caption,
        FACEBOOK: draft.caption,
        TWITTER: draft.caption
      };
      try {
        localStorage.setItem('omnisocial_platform_captions', JSON.stringify(pc));
      } catch {}
    }
    handleTabChange('composer');
    setStatusMessage({ type: 'success', text: `Loaded draft "${draft.title || 'Untitled'}" into composer.` });
  };

  // Escape key listener for unapproved publish governance modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUnapprovedPublishModal) {
        setShowUnapprovedPublishModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUnapprovedPublishModal]);

  // Composer Draft Auto-Persistence across tabs and internal routes (Bug 4)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (caption || rawIdea || mediaUrl) {
        try {
          const draftPayload = JSON.stringify({
            activeDraftId,
            caption,
            rawIdea,
            hashtags,
            mediaUrl,
            format,
            title,
            scheduledFor
          });
          sessionStorage.setItem('omnisocial_composer_session_draft', draftPayload);
          localStorage.setItem('omnisocial_composer_draft', draftPayload);
        } catch {}
      } else {
        try {
          sessionStorage.removeItem('omnisocial_composer_session_draft');
          localStorage.removeItem('omnisocial_composer_draft');
          localStorage.removeItem('omnisocial_platform_captions');
        } catch {}
      }
    }
  }, [activeDraftId, caption, rawIdea, hashtags, mediaUrl, format, title, scheduledFor]);

  const handleResetComposer = () => {
    setTitle('');
    setRawIdea('');
    setCaption('');
    setHashtags([]);
    setMediaUrl('');
    setScheduledFor('');
    setActiveDraftId(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('omnisocial_composer_session_draft');
        localStorage.removeItem('omnisocial_composer_draft');
        localStorage.removeItem('omnisocial_platform_captions');
      } catch {}
    }
    setStatusMessage({ type: 'success', text: 'Composer reset. Ready to author a new post.' });
  };

  const handleLoadIntoComposer = (data: { caption: string; title?: string; hashtags?: string[]; format?: string }) => {
    if (data.title) setTitle(data.title);
    if (data.caption) setCaption(data.caption);
    if (data.hashtags && Array.isArray(data.hashtags) && data.hashtags.length > 0) setHashtags(data.hashtags);
    if (data.format) setFormat(data.format as any);
    handleTabChange('composer');
  };

  // Media Creator Hub State (AI Video & Reel, AI Image, AI Carousel, Upload, URL)
  const [mediaMode, setMediaMode] = useState<'ai-video' | 'ai-image' | 'carousel' | 'upload' | 'url'>('ai-video');
  const [isVideoMedia, setIsVideoMedia] = useState(false);

  // AI Optimal Timing State (Feature 3)
  const [optimalSlots, setOptimalSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // LinkedIn Carousel Deck State (Feature 2)
  const [carouselTopic, setCarouselTopic] = useState('');
  const [carouselTheme, setCarouselTheme] = useState<'midnight' | 'royal' | 'minimal' | 'sunset'>('midnight');
  const [carouselSlideCount, setCarouselSlideCount] = useState<number>(5);
  const [isGeneratingCarousel, setIsGeneratingCarousel] = useState(false);
  const [carouselData, setCarouselData] = useState<{
    title: string;
    subtitle: string;
    theme: 'midnight' | 'royal' | 'minimal' | 'sunset';
    slides: Array<{
      slideNumber: number;
      type: 'intro' | 'content' | 'outro';
      tagline: string;
      heading: string;
      bullets?: string[];
      body?: string;
      highlight?: string;
    }>;
    pdfUrl?: string;
    filename?: string;
  } | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // OpenRouter Video / Reel Generation State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoModel, setVideoModel] = useState('google/veo-3.1-fast');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [videoDuration, setVideoDuration] = useState<number>(4);
  const [videoGenerateAudio, setVideoGenerateAudio] = useState(true);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationStage, setVideoGenerationStage] = useState<string>('');

  // OpenRouter Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageModel, setImageModel] = useState('black-forest-labs/flux-3-image-klein');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Feature 1B: First-Comment Autopilot State
  const [enableFirstComment, setEnableFirstComment] = useState(false);
  const [firstComment, setFirstComment] = useState('');

  // Feature 1C: Virality Score Meter State
  const [viralityAnalysis, setViralityAnalysis] = useState<any | null>(null);
  const [isAnalyzingVirality, setIsAnalyzingVirality] = useState(false);

  // Feature 4A: Evergreen Recycler State
  const [isEvergreen, setIsEvergreen] = useState(false);
  const [recycleIntervalDays, setRecycleIntervalDays] = useState(60);

  // Feature 4B: Voice-to-Post Audio Dictation State
  const [isListening, setIsListening] = useState(false);

  // Feature 1A: 1-Click URL/Blog to Campaign Repurposing State
  const [showRepurposeModal, setShowRepurposeModal] = useState(false);
  const [repurposeUrlInput, setRepurposeUrlInput] = useState('');
  const [repurposeTextInput, setRepurposeTextInput] = useState('');
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [repurposedCampaign, setRepurposedCampaign] = useState<any | null>(null);
  const [activeRepurposeTab, setActiveRepurposeTab] = useState<'linkedin' | 'instagram' | 'twitter' | 'facebook'>('linkedin');

  // Feature 3A: Agency Client Review Magic Link State
  const [clientReviewLink, setClientReviewLink] = useState<string | null>(null);
  const [isGeneratingReviewLink, setIsGeneratingReviewLink] = useState(false);
  const [copiedReviewLink, setCopiedReviewLink] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReplaceConfirmModal, setShowReplaceConfirmModal] = useState(false);
  const [pendingPromptToRun, setPendingPromptToRun] = useState<string>('');
  const [previousCaption, setPreviousCaption] = useState<string>('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<Array<{ platform: string; url: string; postId: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (statusMessage && statusMessage.type !== 'info') {
      const timer = setTimeout(() => setStatusMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Active Preview Tab
  const [previewPlatform, setPreviewPlatform] = useState<'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN'>('INSTAGRAM');

  // Quick Prompt Presets for high UX productivity
  const promptPresets = [
    { label: '🌿 Resort Launch', prompt: 'Announce the Spring Summer 2026 resort collection with a relaxed luxury aesthetic and sustainable European flax linen.' },
    { label: '⚡ Flash Sale Drop', prompt: 'Create urgency for a private 24-hour flash archive drop with 30% off for VIP subscribers.' },
    { label: '🪡 Artisan Craft', prompt: 'Share a behind-the-scenes story on our atelier artisans and precision tailoring details.' },
    { label: '✨ Styling Tips', prompt: 'Provide 3 effortless ways to style our neutral linen blazer from morning brunch to evening soirees.' },
  ];

  useEffect(() => {
    apiRequest('/brands')
      .then(res => {
        if (res.brands && res.brands.length > 0) {
          const uniqueBrands = res.brands.filter(
            (b: any, index: number, self: any[]) =>
              index === self.findIndex((item: any) => item.name?.trim().toLowerCase() === b.name?.trim().toLowerCase())
          );
          setBrands(uniqueBrands);
          setActiveBrandId((prev) => {
            if (prev && uniqueBrands.some((b: any) => b.id === prev)) {
              return prev;
            }
            const saved = getStoredActiveBrandId();
            if (saved && uniqueBrands.some((b: any) => b.id === saved)) {
              return saved;
            }
            const preferred = uniqueBrands.find((b: any) => /apex/i.test(b.name)) || uniqueBrands[0];
            const fallback = preferred.id;
            setStoredActiveBrandId(fallback);
            return fallback;
          });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (activeBrandId) {
      apiRequest(`/social-accounts?brandId=${activeBrandId}`)
        .then(res => {
          setAccounts(res.accounts || []);
          // Auto select all eligible accounts
          setSelectedAccountIds((res.accounts || []).map((a: any) => a.id));
        })
        .catch(() => { });
    }
  }, [activeBrandId]);

  // Fetch data-backed AI Best Time to Post slots whenever target platforms change
  useEffect(() => {
    const primaryPlatform = targetPlatforms.length === 1
      ? targetPlatforms[0]
      : targetPlatforms.includes('LINKEDIN')
        ? 'LINKEDIN'
        : 'ALL';
    setIsLoadingSlots(true);
    apiRequest(`/ai/optimal-timing?platform=${primaryPlatform}`)
      .then(res => {
        if (res.slots && Array.isArray(res.slots)) {
          setOptimalSlots(res.slots);
        }
      })
      .catch(err => {
        console.warn('Optimal timing fetch warning:', err);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [targetPlatforms]);

  const handleGenerateAi = async (customPrompt?: string, skipConfirm = false) => {
    const promptToUse = customPrompt || pendingPromptToRun || rawIdea;
    if (!activeBrandId || !promptToUse.trim()) return;

    if (!skipConfirm && caption.trim().length > 15) {
      setPendingPromptToRun(promptToUse);
      setShowReplaceConfirmModal(true);
      return;
    }

    setShowReplaceConfirmModal(false);
    setGenerating(true);
    setStatusMessage(null);

    try {
      const res = await apiRequest('/ai/generate-post', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          rawIdea: promptToUse,
          targetPlatforms,
          format: format === 'PORTRAIT' ? 'POST' : format,
        })
      });

      if (res.generated && res.generated.caption) {
        if (caption.trim().length > 0) {
          setPreviousCaption(caption);
        }
        setCaption(res.generated.caption);
        setMediaUrl(''); // Clear mediaUrl so prior post's image is never carried over!
        setActiveDraftId(null);
        const newTags = res.generated.hashtags || [];
        setHashtags(newTags);
        const newTitle = promptToUse.slice(0, 35) + '...';
        setTitle(newTitle);

        // Populate platformCaptions across ALL 4 platforms so other tabs never retain stale copy
        const formatTwitterCopy = (text: string): string => {
          if (!text) return '';
          if (text.length <= 280) return text;
          const firstBlock = text.split('\n\n')[0] || text;
          if (firstBlock.length <= 280) return firstBlock;
          return firstBlock.slice(0, 277) + '...';
        };

        const variants = res.generated.variants || {};
        const newPlatformCaptions: Record<string, string> = {
          LINKEDIN: variants.linkedin || res.generated.caption,
          INSTAGRAM: variants.instagram || res.generated.caption,
          FACEBOOK: variants.facebook || res.generated.caption,
          TWITTER: formatTwitterCopy(variants.twitter || variants.linkedin || res.generated.caption)
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('omnisocial_platform_captions', JSON.stringify(newPlatformCaptions));
            localStorage.setItem('omnisocial_composer_draft', JSON.stringify({
              caption: res.generated.caption,
              rawIdea: promptToUse,
              hashtags: newTags,
              mediaUrl: '',
              format,
              title: newTitle,
              platformCaptions: newPlatformCaptions
            }));
          } catch {}
        }

        setViralityAnalysis(null);
        setStatusMessage({ type: 'success', text: 'AI copy crafted successfully across all platforms. Updating virality score...' });
        handleAnalyzeVirality(res.generated.caption, newTags);
      }
    } catch (err: any) {
      const msg = err.message || '';
      const friendlyError = msg.includes('JSON') || msg.includes('parse') || msg.includes('Unexpected')
        ? 'AI formatting took too long. Please try again with a concise idea.'
        : msg || 'AI Generation failed. Please try again.';
      setStatusMessage({ type: 'error', text: friendlyError });
    } finally {
      setGenerating(false);
    }
  };

  const handleAddHashtag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = newTagInput.trim().replace(/^#/, '');
      if (tag && !hashtags.includes('#' + tag)) {
        setHashtags([...hashtags, '#' + tag]);
        setNewTagInput('');
      }
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const isVideoUrl = (url?: string | null) => {
    if (!url) return false;
    return /\.(mp4|mov|webm|m4v|avi)(\?.*)?$/i.test(url) || url.includes('reel_ai') || url.includes('/videos/');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|avi)$/i.test(file.name);
    const tempUrl = URL.createObjectURL(file);
    setMediaUrl(tempUrl);
    setIsVideoMedia(isVid);
    if (isVid) setFormat('REEL');
    setUploadedFileName(file.name);
    setIsUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiRequest('/content/upload', {
        method: 'POST',
        body: formData
      });

      if (res.url) {
        setMediaUrl(res.url);
        const vidDetected = res.isVideo || isVid;
        setIsVideoMedia(vidDetected);
        setUploadedFileName(res.originalName || file.name);
        setStatusMessage({
          type: 'success',
          text: `${vidDetected ? 'Video / Reel' : 'Image'} "${res.originalName || file.name}" uploaded successfully!`
        });
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Media upload failed. Please try again.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Generate Photorealistic AI Video / Reel using OpenRouter
  const handleGenerateAiVideo = async () => {
    const promptToUse = videoPrompt.trim() || rawIdea || caption;
    if (!promptToUse) {
      alert('Please enter a video prompt or provide a post concept.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoGenerationStage('Submitting request to OpenRouter (Google Veo)...');
    setStatusMessage(null);

    try {
      const submitRes = await apiRequest('/ai/generate-video', {
        method: 'POST',
        body: JSON.stringify({
          prompt: promptToUse,
          model: videoModel,
          aspectRatio: videoAspectRatio,
          duration: videoDuration,
          resolution: '720p',
          generateAudio: videoGenerateAudio
        })
      });

      if (!submitRes.jobId) {
        throw new Error(submitRes.error || 'Failed to initialize video generation job');
      }

      setVideoGenerationStage('Generating photorealistic video frames & synchronized audio...');

      const jobId = submitRes.jobId;
      let attempts = 0;
      const maxAttempts = 60; // up to ~4 minutes

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await apiRequest(`/ai/video-status/${jobId}`);
          if (pollRes.status === 'completed' && pollRes.videoUrl) {
            clearInterval(pollInterval);
            setMediaUrl(pollRes.videoUrl);
            setIsVideoMedia(true);
            setFormat('REEL');
            const modelLabel = videoModel.includes('veo') ? 'Google Veo 3.1' : videoModel.includes('seedance') ? 'ByteDance Seedance' : 'AI Reel';
            setUploadedFileName(`${modelLabel} Video (${videoAspectRatio})`);
            setIsGeneratingVideo(false);
            setVideoGenerationStage('');
            setStatusMessage({
              type: 'success',
              text: `Realistic AI Video successfully generated with ${modelLabel} and attached to your post!`
            });
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          } else if (pollRes.status === 'failed') {
            clearInterval(pollInterval);
            setIsGeneratingVideo(false);
            setVideoGenerationStage('');
            setStatusMessage({
              type: 'error',
              text: pollRes.error || 'Video generation failed at provider.'
            });
          } else {
            setVideoGenerationStage(`Rendering realistic motion & audio with ${videoModel.split('/')[1] || 'Veo'}... (${attempts * 4}s)`);
          }
        } catch (pollErr: any) {
          console.warn('Polling error:', pollErr.message);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsGeneratingVideo(false);
          setVideoGenerationStage('');
          setStatusMessage({
            type: 'error',
            text: 'Video generation is still processing. Please check back in a few seconds.'
          });
        }
      }, 4000);
    } catch (err: any) {
      setIsGeneratingVideo(false);
      setVideoGenerationStage('');
      setStatusMessage({
        type: 'error',
        text: err.message || 'Video generation failed'
      });
    }
  };

  // Generate Photorealistic AI Image using OpenRouter (FLUX 3)
  const handleGenerateAiImage = async () => {
    const promptToUse = imagePrompt.trim() || rawIdea || caption;
    if (!promptToUse) {
      alert('Please enter an image prompt or provide a post concept.');
      return;
    }

    setIsGeneratingImage(true);
    setStatusMessage(null);

    try {
      const res = await apiRequest('/ai/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt: promptToUse,
          model: imageModel,
          aspectRatio: imageAspectRatio
        })
      });

      if (res.imageUrl) {
        setMediaUrl(res.imageUrl);
        setIsVideoMedia(false);
        const modelLabel = imageModel.includes('flux') ? 'FLUX 3' : 'AI Photo';
        setUploadedFileName(`${modelLabel} Realistic Image (${imageAspectRatio})`);
        setStatusMessage({
          type: 'success',
          text: `Photorealistic AI Image successfully generated with ${modelLabel} and attached!`
        });
        confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
      } else {
        throw new Error(res.error || 'Failed to generate image');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Image generation failed'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Generate High-Converting LinkedIn AI Carousel / Slide-Deck Presentation & PDF (Feature 2)
  const handleGenerateCarousel = async () => {
    const promptToUse = carouselTopic.trim() || rawIdea.trim() || caption.trim() || 'Top 5 AI Strategies to Scale Organic B2B Reach in 2026';
    setIsGeneratingCarousel(true);
    setStatusMessage(null);

    try {
      const res = await apiRequest('/ai/generate-carousel', {
        method: 'POST',
        body: JSON.stringify({
          topic: promptToUse,
          theme: carouselTheme,
          slideCount: carouselSlideCount,
          brandId: activeBrandId || undefined
        })
      });

      if (res.carousel) {
        setCarouselData(res.carousel);
        setActiveSlideIndex(0);
        if (res.carousel.pdfUrl) {
          setMediaUrl(res.carousel.pdfUrl);
          setUploadedFileName(res.carousel.filename || `${res.carousel.title.slice(0, 25)}.pdf`);
          setIsVideoMedia(false);
        }
        setFormat('CAROUSEL');
        if (!caption || caption.length < 20) {
          setCaption(`📌 ${res.carousel.title}\n\n${res.carousel.subtitle}\n\nSwipe through the multi-slide carousel deck below for the full actionable breakdown ➡️\n\nSave this for your next strategy session! Which slide resonates most with you?`);
        }
        if (targetPlatforms.includes('LINKEDIN')) {
          setPreviewPlatform('LINKEDIN');
        }
        setStatusMessage({
          type: 'success',
          text: `🎉 AI Carousel "${res.carousel.title}" (${res.carousel.slides?.length || 5} slides) and high-res PDF generated successfully!`
        });
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0A66C2', '#38BDF8', '#6366F1', '#10B981']
        });
      } else {
        throw new Error(res.error || 'Failed to generate carousel deck');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Carousel generation failed'
      });
    } finally {
      setIsGeneratingCarousel(false);
    }
  };

  // Feature 1A: 1-Click URL/Blog to Multi-Platform Campaign Repurposer
  const handleRepurposeContent = async () => {
    if (!repurposeUrlInput.trim() && !repurposeTextInput.trim()) {
      alert('Please enter a website/article URL or paste article text.');
      return;
    }
    setIsRepurposing(true);
    setStatusMessage(null);
    try {
      const res = await apiRequest('/ai/repurpose-url', {
        method: 'POST',
        body: JSON.stringify({
          url: repurposeUrlInput.trim() || undefined,
          rawText: repurposeTextInput.trim() || undefined,
          brandId: activeBrandId || undefined
        })
      });

      if (res.campaign) {
        setRepurposedCampaign(res.campaign);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error('Failed to repurpose content');
      }
    } catch (err: any) {
      alert(err.message || 'Repurposing failed');
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleApplyRepurposed = (type: 'linkedin' | 'instagram' | 'twitter' | 'facebook') => {
    if (!repurposedCampaign) return;

    if (type === 'linkedin') {
      const li = repurposedCampaign.linkedinCarousel;
      setTitle(li.title);
      setCaption(`📌 ${li.title}\n\n${repurposedCampaign.summary}\n\nSwipe through the multi-slide carousel below for the complete actionable framework 👇`);
      setCarouselTopic(li.title);
      setFormat('CAROUSEL');
      setMediaMode('carousel');
      setTargetPlatforms(['LINKEDIN']);
      setPreviewPlatform('LINKEDIN');
    } else if (type === 'instagram') {
      const ig = repurposedCampaign.instagramReel;
      setTitle(`Reel: ${ig.hookText}`);
      setCaption(`🎬 ${ig.hookText}\n\n${ig.caption}`);
      setHashtags(ig.hashtags || ['#ReelsViral', '#Growth']);
      setVideoPrompt(`${ig.visualDirection}. Audio mood: ${ig.suggestedAudioStyle}. Voiceover: ${ig.voiceoverScript}`);
      setFormat('REEL');
      setMediaMode('ai-video');
      setTargetPlatforms(['INSTAGRAM']);
      setPreviewPlatform('INSTAGRAM');
    } else if (type === 'twitter') {
      const tw = repurposedCampaign.twitterThread;
      const combined = tw.map((t: any) => t.text).join('\n\n---\n\n');
      setTitle(`Thread: ${repurposedCampaign.title}`);
      setCaption(combined);
      setFormat('POST');
    } else if (type === 'facebook') {
      const fb = repurposedCampaign.facebookPost;
      setTitle(fb.headline);
      setCaption(`🔥 ${fb.headline}\n\n${fb.body}\n\n👉 ${fb.questionPrompt}`);
      setHashtags(fb.hashtags || ['#Community']);
      setFormat('POST');
      setTargetPlatforms(['FACEBOOK']);
      setPreviewPlatform('FACEBOOK');
    }

    setShowRepurposeModal(false);
    setStatusMessage({
      type: 'success',
      text: `Loaded repurposed ${type.toUpperCase()} campaign into the studio!`
    });
  };

  // Feature 1C: AI Virality Score Meter
  const handleAnalyzeVirality = async (captionOverride?: string, hashtagsOverride?: string[]) => {
    const textToAnalyze = captionOverride || caption;
    if (!textToAnalyze.trim()) {
      return;
    }
    const tagsToAnalyze = hashtagsOverride || hashtags;
    setIsAnalyzingVirality(true);
    try {
      const res = await apiRequest('/ai/virality-score', {
        method: 'POST',
        body: JSON.stringify({
          caption: textToAnalyze,
          platform: previewPlatform,
          hashtags: tagsToAnalyze,
          hasMedia: Boolean(mediaUrl),
          mediaType: isVideoUrl(mediaUrl) ? 'VIDEO' : format === 'CAROUSEL' ? 'CAROUSEL_PDF' : 'IMAGE'
        })
      });

      if (res.analysis) {
        setViralityAnalysis(res.analysis);
      }
    } catch (err: any) {
      console.warn('Virality analysis error:', err);
    } finally {
      setIsAnalyzingVirality(false);
    }
  };

  const handleReplaceHook = (newHookText: string) => {
    const lines = caption.split('\n');
    lines[0] = newHookText;
    setCaption(lines.join('\n'));
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  // Feature 4B: Voice-to-Post Audio Dictation
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setRawIdea(transcript);
          handleGenerateAi(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Feature 3A: Agency Client Review Magic Link Generator
  const handleGenerateClientReviewLink = async () => {
    if (!activeBrandId) return;
    setIsGeneratingReviewLink(true);
    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://omnisocial-l5uq.vercel.app';
      const res = await apiRequest('/client-review/generate-token', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          origin: currentOrigin
        })
      });

      const token = res.shareToken || (res.reviewUrl ? res.reviewUrl.split('/review/').pop() : '');
      const finalUrl = `${currentOrigin.replace(/\/$/, '')}/review/${token}`;

      setClientReviewLink(finalUrl);
      setShowReviewModal(true);
      try {
        await navigator.clipboard.writeText(finalUrl);
        setCopiedReviewLink(true);
        setTimeout(() => setCopiedReviewLink(false), 3000);
      } catch {
        // Safe if headless browser denies clipboard
      }
      setStatusMessage({ type: 'success', text: 'Client Review Link generated successfully!' });
    } catch (err: any) {
      console.error('Review link generation error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to generate review link' });
    } finally {
      setIsGeneratingReviewLink(false);
    }
  };

  const handleSavePost = async (
    immediatePublish = false,
    bypassGate = false,
    approvalStatusOverride?: 'PENDING' | 'DRAFT' | 'APPROVED',
    isDraftOnly = false,
    isExplicitSchedule = false
  ) => {
    if (!caption.trim()) {
      setStatusMessage({ type: 'error', text: 'Please write or generate a post caption first.' });
      return;
    }

    // Safety Gate 1: Check media for live Meta publish (Bug 5)
    if (immediatePublish) {
      if (mediaUrl && (mediaUrl.endsWith('.svg') || (!mediaUrl.startsWith('http') && !mediaUrl.startsWith('https')))) {
        setStatusMessage({
          type: 'error',
          text: '⚠️ Meta Instagram & Facebook require a public JPG/PNG image or MP4 video URL. SVG or local assets cannot be published to Meta. Please attach a valid creative asset from Media Library or AI image generator before publishing.'
        });
        return;
      }

      // Safety Gate 2: Human-in-the-loop Governance confirmation if unapproved
      if (!bypassGate && !isPublishGateConfirmed) {
        setShowUnapprovedPublishModal(true);
        return { gated: true };
      }
    }

    // Safety Gate 2B: Human-in-the-loop Governance for scheduled drops
    if (isExplicitSchedule && !isDraftOnly && approvalStatusOverride !== 'PENDING') {
      if (!bypassGate && !isPublishGateConfirmed) {
        setShowUnapprovedPublishModal(true);
        return { gated: true };
      }
    }

    setSubmitting(true);
    setPublishedUrl(null);
    setPublishedPosts([]);

    const isScheduledDraft = isDraftOnly && !!scheduledFor;
    const formattedScheduleDate = scheduledFor ? (() => {
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

    const inProgressNotice = isDraftOnly
      ? {
          type: 'info' as const,
          text: isScheduledDraft
            ? 'Saving scheduled post draft to workbench...'
            : 'Saving post draft to workbench...'
        }
      : (approvalStatusOverride === 'PENDING'
        ? { type: 'info' as const, text: 'Submitting post draft to Approvals Queue for Client Review...' }
        : (isExplicitSchedule || scheduledFor
          ? { type: 'info' as const, text: `Scheduling drop(s) for ${formattedScheduleDate} to Content Calendar...` }
          : { type: 'info' as const, text: 'Publishing post to connected social channels...' }));
    setStatusMessage(inProgressNotice);

    try {
      // Append non-duplicate hashtag chips to caption (Bug 11)
      const tagsToAppend = (hashtags || []).filter(t => !caption.toLowerCase().includes(t.toLowerCase()));
      const finalCaption = tagsToAppend.length > 0 ? `${caption.trim()}\n\n${tagsToAppend.join(' ')}` : caption.trim();

      let platformCaptions: any = undefined;
      if (typeof window !== 'undefined') {
        try {
          const pc = localStorage.getItem('omnisocial_platform_captions');
          if (pc) platformCaptions = JSON.parse(pc);
        } catch {}
      }

      const finalApprovalStatus = isDraftOnly ? 'DRAFT' : (approvalStatusOverride || (isExplicitSchedule || scheduledFor ? 'APPROVED' : 'DRAFT'));
      const finalContentStatus = isDraftOnly ? 'DRAFT' : ((finalApprovalStatus === 'PENDING' || finalApprovalStatus === 'APPROVED' || isExplicitSchedule || scheduledFor) ? 'SCHEDULED' : 'DRAFT');

      const scheduledIso = scheduledFor ? new Date(scheduledFor).toISOString() : undefined;
      let targetContentId: string;

      if (activeDraftId && !immediatePublish) {
        // Update existing draft directly so we don't spawn duplicate records (Bug 3)
        await apiRequest(`/content/${activeDraftId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: title || caption.slice(0, 30) + '...',
            caption: finalCaption,
            hashtags,
            mediaUrls: mediaUrl ? [mediaUrl] : [],
            format: format === 'PORTRAIT' ? 'POST' : format,
            status: finalContentStatus,
            clientApprovalStatus: finalApprovalStatus,
            scheduledFor: scheduledIso,
            socialAccountIds: selectedAccountIds,
            targetPlatforms,
            platformCaptions
          })
        });
        targetContentId = activeDraftId;
      } else {
        const res = await apiRequest('/content', {
          method: 'POST',
          body: JSON.stringify({
            brandId: activeBrandId,
            activeDraftId: isDraftOnly ? activeDraftId : undefined,
            title: title || caption.slice(0, 30) + '...',
            rawIdea,
            caption: finalCaption,
            hashtags,
            mediaUrls: mediaUrl ? [mediaUrl] : [],
            targetPlatforms,
            format: format === 'PORTRAIT' ? 'POST' : format,
            status: finalContentStatus,
            clientApprovalStatus: finalApprovalStatus,
            scheduledFor: immediatePublish ? undefined : scheduledIso,
            socialAccountIds: selectedAccountIds,
            firstComment: enableFirstComment && firstComment.trim() ? firstComment.trim() : undefined,
            viralityScore: viralityAnalysis?.score || undefined,
            isEvergreen,
            recycleIntervalDays,
            platformCaptions
          })
        });
        targetContentId = res.content.id;
        if (!immediatePublish && isDraftOnly) {
          setActiveDraftId(targetContentId);
        }
      }

      if (approvalStatusOverride === 'PENDING') {
        const targetDate = scheduledFor ? (() => {
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
        })() : '';

        const successMsg = {
          type: 'success' as const,
          text: targetDate
            ? `Post draft successfully submitted to Approvals Queue with planned schedule (${targetDate}) for Client Review!`
            : 'Post draft successfully submitted to Approvals Queue for Client Review!'
        };
        setStatusMessage(successMsg);
        setActiveDraftId(null);
        setIsPublishGateConfirmed(false);
        setTitle('');
        setCaption('');
        setRawIdea('');
        setHashtags([]);
        setMediaUrl('');
        setScheduledFor('');
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('omnisocial_composer_session_draft');
            localStorage.removeItem('omnisocial_composer_draft');
            localStorage.removeItem('omnisocial_platform_captions');
          } catch {}
        }
        fetchOverview();
        return { success: true, mode: 'PENDING', notice: successMsg };
      }

      if (immediatePublish && selectedAccountIds.length > 0) {
        // Send multi-channel publish request to publish across all selected accounts (Facebook & Instagram)
        const pubRes = await apiRequest('/publications/publish-now', {
          method: 'POST',
          body: JSON.stringify({
            contentId: targetContentId,
            socialAccountId: selectedAccountIds[0],
            socialAccountIds: selectedAccountIds
          })
        });

        let publications = pubRes.publications || (pubRes.publication ? [pubRes.publication] : []);

        // Resilience fallback: if older backend instance only processed the first account, broadcast remaining
        if (publications.length < selectedAccountIds.length) {
          const processedIds = new Set(publications.map((p: any) => p.socialAccountId));
          const remainingIds = selectedAccountIds.filter(id => !processedIds.has(id));
          for (const remId of remainingIds) {
            try {
              const remRes = await apiRequest('/publications/publish-now', {
                method: 'POST',
                body: JSON.stringify({
                  contentId: targetContentId,
                  socialAccountId: remId
                })
              });
              if (remRes.publication) {
                publications.push(remRes.publication);
              }
            } catch (remErr) {
              console.warn('Publishing to remaining channel failed:', remId, remErr);
            }
          }
        }

        const liveList = publications
          .filter((p: any) => p.status === 'PUBLISHED')
          .map((p: any) => ({
            platform: p.platform || (p.platformPostUrl?.includes('linkedin') ? 'LINKEDIN' : p.platformPostUrl?.includes('instagram') ? 'INSTAGRAM' : 'FACEBOOK'),
            url: p.platformPostUrl,
            postId: p.platformPostId
          }));

        setPublishedPosts(liveList);
        if (liveList.length > 0) {
          setPublishedUrl(liveList[0].url || null);
        }

        const platformLabels = liveList.map((p: { platform: string }) => p.platform === 'LINKEDIN' ? 'LinkedIn' : p.platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook');
        const uniqueLabels = Array.from(new Set(platformLabels)).join(', ');

        setStatusMessage({
          type: 'success',
          text: liveList.length > 0
            ? `Successfully published live to ${uniqueLabels}! (${liveList.length} channel${liveList.length > 1 ? 's' : ''})`
            : 'Post published immediately to connected social channels!'
        });

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
        });
        setActiveDraftId(null);
        setIsPublishGateConfirmed(false);
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('omnisocial_composer_draft');
          } catch {}
        }
      } else if (!isDraftOnly && (isExplicitSchedule || scheduledFor)) {
        const channelCount = selectedAccountIds.length || 2;
        const targetDate = scheduledFor ? new Date(scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'scheduled peak window';
        const successMsg = {
          type: 'success' as const,
          text: `🎉 Successfully scheduled ${channelCount} drop${channelCount > 1 ? 's' : ''} for ${targetDate}! Promoted from Draft to Content Calendar.`
        };
        setStatusMessage(successMsg);
        try {
          confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 } });
        } catch {}

        // Reset composer state completely on successful drop schedule
        setTitle('');
        setCaption('');
        setRawIdea('');
        setHashtags([]);
        setMediaUrl('');
        setScheduledFor('');
        setActiveDraftId(null);
        setIsPublishGateConfirmed(false);

        // Clear all cached/persisted drafts so composer stays fresh
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('omnisocial_composer_session_draft');
            localStorage.removeItem('omnisocial_composer_draft');
            localStorage.removeItem('omnisocial_platform_captions');
          } catch {}
        }

        fetchOverview();
        return { success: true, mode: 'SCHEDULED', notice: successMsg };
      } else {
        const isScheduledDraft = !!scheduledFor;
        const targetDate = isScheduledDraft ? new Date(scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        const successMsg = {
          type: 'success' as const,
          text: isScheduledDraft
            ? `Post draft successfully saved with scheduled time (${targetDate}). View in Drafts tab.`
            : (activeDraftId
              ? 'Post draft successfully updated in workbench. View in Drafts tab.'
              : 'Post draft successfully saved to workbench. View in Drafts tab.')
        };
        setStatusMessage(successMsg);
        fetchOverview();
        if (typeof window !== 'undefined') {
          try {
            const draftPayload = JSON.stringify({
              activeDraftId: targetContentId,
              caption,
              rawIdea,
              hashtags,
              mediaUrl,
              format,
              title,
              scheduledFor
            });
            sessionStorage.setItem('omnisocial_composer_session_draft', draftPayload);
            localStorage.setItem('omnisocial_composer_draft', draftPayload);
          } catch {}
        }
        return { success: true, mode: 'DRAFT', targetContentId, notice: successMsg };
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Operation failed' });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBrand = brands.find(b => b.id === activeBrandId);

  const themeCardStyles: Record<string, {
    bg: string;
    card: string;
    tag: string;
    title: string;
    body: string;
    bullet: string;
    highlightBg: string;
    highlightText: string;
    accent: string;
    border: string;
  }> = {
    midnight: {
      bg: 'bg-[#0F172A]',
      card: 'bg-[#1E293B]',
      tag: 'text-sky-400',
      title: 'text-white',
      body: 'text-slate-300',
      bullet: 'text-sky-400',
      highlightBg: 'bg-[#0369A1]/30 border border-sky-500/40',
      highlightText: 'text-sky-200',
      accent: 'bg-sky-400',
      border: 'border-slate-800'
    },
    royal: {
      bg: 'bg-[#0A66C2]',
      card: 'bg-[#004182]',
      tag: 'text-sky-200',
      title: 'text-white',
      body: 'text-sky-100',
      bullet: 'text-sky-200',
      highlightBg: 'bg-[#0284C7] border border-sky-300/40',
      highlightText: 'text-white',
      accent: 'bg-white',
      border: 'border-blue-700'
    },
    minimal: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      tag: 'text-indigo-600',
      title: 'text-slate-900',
      body: 'text-slate-600',
      bullet: 'text-indigo-600',
      highlightBg: 'bg-indigo-50/80 border border-indigo-200',
      highlightText: 'text-indigo-900',
      accent: 'bg-indigo-600',
      border: 'border-slate-200'
    },
    sunset: {
      bg: 'bg-[#180B26]',
      card: 'bg-[#2D124D]',
      tag: 'text-rose-400',
      title: 'text-rose-50',
      body: 'text-rose-200',
      bullet: 'text-rose-400',
      highlightBg: 'bg-[#881337]/40 border border-rose-500/40',
      highlightText: 'text-rose-100',
      accent: 'bg-rose-400',
      border: 'border-purple-900'
    }
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={handleBrandChange}>
      <div className="space-y-6 max-w-[1500px] mx-auto pb-16 px-1 sm:px-2">
        {/* STUDIO HERO (ONLY ON STUDIO HUB / OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="relative bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Elegant Organic Flowing Wave in Top Right (Exact match to reference) */}
            <svg
              className="absolute right-0 top-0 h-full w-[340px] sm:w-[500px] pointer-events-none select-none opacity-90"
              viewBox="0 0 500 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGold" x1="500" y1="0" x2="200" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B" stopOpacity="0.45" />
                  <stop offset="0.5" stopColor="#FBBF24" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#FEF3C7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="wavePeach" x1="500" y1="20" x2="260" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FB7185" stopOpacity="0.32" />
                  <stop offset="0.6" stopColor="#FDA4AF" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="wavePurple" x1="500" y1="60" x2="300" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C084FC" stopOpacity="0.35" />
                  <stop offset="0.7" stopColor="#E9D5FF" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M500 0 C380 40 300 30 180 90 C120 130 90 170 50 200 L500 200 Z" fill="url(#waveGold)" />
              <path d="M500 20 C400 70 330 70 230 130 C160 180 130 200 90 200 L500 200 Z" fill="url(#wavePeach)" />
              <path d="M500 50 C430 100 360 110 280 160 C210 200 170 200 130 200 L500 200 Z" fill="url(#wavePurple)" />
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F3FF] border border-[#DDD6FE]/80 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-6 h-6 text-[#7C3AED] fill-[#7C3AED]" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1012] tracking-tight">
                    Studio
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
                    Plan, create and manage your marketing and content activities.
                  </p>
                </div>
              </div>

              {/* Action Buttons on Right */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange('launchpad')}
                  className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-white/90 hover:bg-white border border-black/[0.08] rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Rocket className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Launchpad Wizard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRepurposeModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-white/90 hover:bg-white border border-black/[0.08] rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Repurpose URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateClientReviewLink}
                  disabled={isGeneratingReviewLink || !activeBrandId}
                  className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-white/90 hover:bg-white border border-black/[0.08] rounded-full shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 backdrop-blur-xs"
                >
                  {copiedReviewLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-neutral-500" />}
                  <span>{copiedReviewLink ? 'Link Copied!' : isGeneratingReviewLink ? 'Generating...' : 'Client Review Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('composer')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-md flex items-center space-x-2 transition-all cursor-pointer group"
                >
                  <PenTool className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                  <span>Open Post Composer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Feedback Banner (Displayed across all studio sub-tabs) */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'info'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'info' ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{statusMessage.text}</span>
              <div className="flex items-center gap-2 shrink-0">
                {(statusMessage.text?.includes('Content Calendar') || statusMessage.text?.includes('Calendar')) && (
                  <a
                    href="/calendar"
                    className="font-bold flex items-center space-x-1 shrink-0 text-emerald-900 hover:text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 text-xs shadow-2xs cursor-pointer"
                  >
                    <span>View Calendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {statusMessage.text?.includes('Drafts tab') && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('drafts')}
                    className="font-bold flex items-center space-x-1 shrink-0 text-indigo-900 hover:text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-300 text-xs shadow-2xs cursor-pointer"
                  >
                    <span>View Drafts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {(statusMessage.text?.includes('Approvals') || statusMessage.text?.includes('Approval')) && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('approvals')}
                    className="font-bold flex items-center space-x-1 shrink-0 text-indigo-900 hover:text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-300 text-xs shadow-2xs cursor-pointer"
                  >
                    <span>View Approvals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {publishedPosts.length > 0 ? (
                  publishedPosts.map((post, idx) => (
                    <a
                      key={idx}
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline flex items-center space-x-1 shrink-0 text-emerald-900 hover:text-emerald-700 bg-white/70 px-2.5 py-1 rounded-lg border border-emerald-300 text-xs shadow-2xs"
                    >
                      <span>View Live on {post.platform === 'LINKEDIN' ? 'LinkedIn' : post.platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))
                ) : publishedUrl ? (
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline flex items-center space-x-1 shrink-0 text-emerald-900 hover:text-emerald-700"
                  >
                    <span>View Live Post</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:bg-black/5 rounded-md transition cursor-pointer text-slate-500 shrink-0"
              aria-label="Dismiss feedback banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW (STUDIO HUB 8 BENTO CARDS MATCHING REFERENCE UI) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <OverviewTab
              brand={overviewData?.brand}
              strategy={overviewData?.strategy}
              stats={overviewData?.stats || {
                pillarsCount: 0,
                ideasCount: 0,
                requestsCount: 0,
                campaignsCount: 0,
                postsCount: 0,
                pendingApprovalsCount: 0,
                launchpadStage: 1,
                launchpadStatus: 'NOT_STARTED'
              }}
              recentExecutions={overviewData?.recentExecutions || []}
              isLoading={isLoadingOverview}
              onNavigateTab={(t) => handleTabChange(t as any)}
              onRefresh={fetchOverview}
            />

            {/* Sovereign Outcome-First AI Content Prompt Bar at Bottom */}
            <div className="pt-2">
              <OutcomePromptBar
                brandId={activeBrandId}
                onNavigateTab={(tabId) => handleTabChange(tabId as any)}
                onRefreshData={fetchOverview}
                onLoadIntoComposer={handleLoadIntoComposer}
              />
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGY (LEVEL 1) */}
        {activeTab === 'strategy' && (
          <StrategyTab
            brandId={activeBrandId}
            brand={overviewData?.brand || brands.find(b => b.id === activeBrandId)}
            onRefreshOverview={fetchOverview}
            onNavigateTab={(t) => handleTabChange(t as any)}
          />
        )}

        {/* TAB 3: CONTENT PILLARS (LEVEL 2) */}
        {activeTab === 'pillars' && (
          <PillarsTab brandId={activeBrandId} onRefreshOverview={fetchOverview} />
        )}

        {/* TAB 4: CAMPAIGNS (LEVEL 2) */}
        {activeTab === 'campaigns' && (
          <CampaignsTab
            brandId={activeBrandId}
            onNavigateTab={(t) => handleTabChange(t as any)}
            onLoadComposerData={handleLoadIntoComposer}
            onRefreshOverview={fetchOverview}
          />
        )}

        {/* TAB 5: IDEAS & INTAKE (LEVEL 2) */}
        {activeTab === 'ideas' && (
          <IdeasRequestsTab
            brandId={activeBrandId}
            onTurnIntoPost={(idea) => {
              const ideaTitle = (idea.title || idea.hook || '').trim();
              const ideaDesc = (idea.description || '').trim();
              const combinedBrief = ideaTitle && ideaDesc && !ideaDesc.includes(ideaTitle)
                ? `${ideaTitle}: ${ideaDesc}`
                : (ideaTitle || ideaDesc);

              setTitle(ideaTitle || 'New Post from Idea Bank');
              setRawIdea(combinedBrief);
              setCaption('');
              setMediaUrl('');
              setActiveDraftId(null);
              if (idea.tags && Array.isArray(idea.tags)) {
                setHashtags(idea.tags);
              }
              handleTabChange('composer');
              setStatusMessage({ type: 'success', text: `✨ Idea "${ideaTitle || 'Idea'}" loaded into composer! Ready to craft post with AI.` });
            }}
            onRefreshOverview={fetchOverview}
          />
        )}

        {/* TAB 6: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <MediaLibraryTab
            brandId={activeBrandId}
            onSelectMediaForComposer={(url, fmt) => {
              setMediaUrl(url);
              if (fmt === 'CAROUSEL') setFormat('CAROUSEL');
              else if (fmt === 'VIDEO') {
                setFormat('PORTRAIT');
                setIsVideoMedia(true);
              } else {
                setFormat('POST');
                setIsVideoMedia(false);
              }
              handleTabChange('composer');
            }}
            onRefreshOverview={fetchOverview}
          />
        )}

        {/* TAB 7: APPROVALS & GOVERNANCE */}
        {activeTab === 'approvals' && (
          <ApprovalsTab brandId={activeBrandId} onRefreshOverview={fetchOverview} />
        )}

        {/* TAB 8: BRAND LAUNCHPAD */}
        {activeTab === 'launchpad' && (
          <LaunchpadTab
            brandId={activeBrandId}
            onNavigateTab={(t) => handleTabChange(t as any)}
            onRefreshOverview={fetchOverview}
          />
        )}

        {/* TAB 9: SKILL LIBRARY */}
        {activeTab === 'skills' && (
          <SkillLibraryTab brandId={activeBrandId} />
        )}

        {/* TAB 10: POSTS & CONTENT (EXACT MATCH TO REFERENCE DESIGN) */}
        {activeTab === 'composer' && (
          <PostsContentTab
            activeBrandId={activeBrandId}
            setActiveBrandId={setActiveBrandId}
            brands={brands}
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}
            setSelectedAccountIds={setSelectedAccountIds}
            rawIdea={rawIdea}
            setRawIdea={setRawIdea}
            caption={caption}
            setCaption={setCaption}
            mediaUrl={mediaUrl}
            setMediaUrl={setMediaUrl}
            format={format}
            setFormat={setFormat}
            hashtags={hashtags}
            setHashtags={setHashtags}
            scheduledFor={scheduledFor}
            setScheduledFor={setScheduledFor}
            submitting={submitting}
            isGenerating={generating}
            onSaveDraft={async () => {
              return await handleSavePost(false, false, 'DRAFT', true);
            }}
            onScheduleDrop={async () => {
              return await handleSavePost(false, false, 'APPROVED', false, true);
            }}
            onSubmitForApproval={async () => {
              return await handleSavePost(false, false, 'PENDING');
            }}
            onPublishNow={async () => {
              return await handleSavePost(true);
            }}
            onGenerateAi={handleGenerateAi}
            onGenerateAiImage={handleGenerateAiImage}
            onGenerateAiVideo={handleGenerateAiVideo}
            onRepurposeModal={() => setShowRepurposeModal(true)}
            viralityScore={viralityAnalysis}
            statusMessage={statusMessage}
            setStatusMessage={setStatusMessage}
            onNavigateTab={(tabId) => handleTabChange(tabId as any)}
            onResetComposer={handleResetComposer}
          />
        )}

        {/* TAB 11: ISOLATED DRAFTS TAB */}
        {activeTab === 'drafts' && (
          <DraftsTab
            brandId={activeBrandId}
            onEditDraft={handleEditDraft}
            onDeleteDraft={(deletedId) => {
              if (activeDraftId === deletedId) {
                handleResetComposer();
              }
            }}
            onResetComposer={handleResetComposer}
            onNavigateTab={(t) => handleTabChange(t as any)}
            onRefreshOverview={fetchOverview}
          />
        )}

        {/* UNAPPROVED PUBLISH GOVERNANCE MODAL */}
        {showUnapprovedPublishModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowUnapprovedPublishModal(false);
            }}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-amber-200 animate-in fade-in zoom-in-95 cursor-default relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowUnapprovedPublishModal(false)}
                aria-label="Close modal"
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3 text-amber-600">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Governance Gate Notice</h3>
                  <p className="text-xs text-slate-500">Unapproved Content Safety Protocol</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed space-y-2">
                <p className="font-semibold">
                  This post has not yet received client or internal stakeholder sign-off in the Approvals queue.
                </p>
                <p className="text-amber-800 text-[11px]">
                  {scheduledFor
                    ? 'Scheduling or deploying unapproved content bypasses client audit controls.'
                    : 'Publishing unapproved content directly to live social channels bypasses client audit controls.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setShowUnapprovedPublishModal(false);
                    await handleSavePost(false, false, 'PENDING');
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Submit for Client Approval First
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setShowUnapprovedPublishModal(false);
                    setIsPublishGateConfirmed(true);
                    if (scheduledFor) {
                      await handleSavePost(false, true, 'APPROVED', false, true);
                    } else {
                      await handleSavePost(true, true);
                    }
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {scheduledFor ? 'Bypass Gate & Schedule Drop' : 'Bypass Gate & Publish Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 1A: 1-CLICK URL/BLOG REPURPOSING MODAL */}
        {showRepurposeModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      1-Click "URL / Blog to Multi-Platform Campaign"
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Transform any blog, news article or article text into LinkedIn Carousel, Reel, Twitter Thread & Facebook post
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRepurposeModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {!repurposedCampaign ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Enter Blog Post or Website URL:
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={repurposeUrlInput}
                        onChange={(e) => setRepurposeUrlInput(e.target.value)}
                        placeholder="https://example.com/blog/scaling-b2b-growth"
                        className="w-full text-xs border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-mono"
                      />
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Or paste raw article text</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div>
                    <textarea
                      rows={4}
                      value={repurposeTextInput}
                      onChange={(e) => setRepurposeTextInput(e.target.value)}
                      placeholder="Paste text from a newsletter, article or rough notes here..."
                      className="w-full text-xs border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRepurposeContent}
                    disabled={isRepurposing || (!repurposeUrlInput.trim() && !repurposeTextInput.trim())}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isRepurposing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scraping & Synthesizing 4-Channel Campaign...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Synthesize Omni-Channel Campaign (1-Click)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Campaign Summary */}
                  <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100">
                    <h4 className="text-xs font-extrabold text-indigo-950">{repurposedCampaign.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{repurposedCampaign.summary}</p>
                  </div>

                  {/* Channel Tabs */}
                  <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveRepurposeTab('linkedin')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${activeRepurposeTab === 'linkedin' ? 'bg-[#0A66C2] text-white shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                    >
                      👔 LinkedIn Carousel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRepurposeTab('instagram')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${activeRepurposeTab === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                    >
                      🎬 Instagram Reel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRepurposeTab('twitter')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${activeRepurposeTab === 'twitter' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                    >
                      🧵 Twitter Thread
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRepurposeTab('facebook')}
                      className={`flex-1 py-1.5 rounded-xl transition-all ${activeRepurposeTab === 'facebook' ? 'bg-blue-600 text-white shadow-2xs font-bold' : 'text-slate-600'
                        }`}
                    >
                      💬 Facebook Post
                    </button>
                  </div>

                  {/* Tab Content Display */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    {activeRepurposeTab === 'linkedin' && (
                      <div className="space-y-2">
                        <p className="font-bold text-slate-900">{repurposedCampaign.linkedinCarousel?.title}</p>
                        <p className="text-slate-600">{repurposedCampaign.linkedinCarousel?.hook}</p>
                        <div className="space-y-1 pt-1">
                          {repurposedCampaign.linkedinCarousel?.slides?.map((s: any, idx: number) => (
                            <div key={idx} className="bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                              <span className="font-bold text-[#0A66C2]">Slide {s.slideNumber}:</span> {s.heading}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeRepurposeTab === 'instagram' && (
                      <div className="space-y-2">
                        <p className="font-bold text-pink-700">Hook: {repurposedCampaign.instagramReel?.hookText}</p>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-500 uppercase">Visual Direction:</span>
                          <p className="text-slate-700">{repurposedCampaign.instagramReel?.visualDirection}</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-500 uppercase">Voiceover Script:</span>
                          <p className="text-slate-700 italic">"{repurposedCampaign.instagramReel?.voiceoverScript}"</p>
                        </div>
                      </div>
                    )}

                    {activeRepurposeTab === 'twitter' && (
                      <div className="space-y-2">
                        {repurposedCampaign.twitterThread?.map((t: any, idx: number) => (
                          <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                            {t.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeRepurposeTab === 'facebook' && (
                      <div className="space-y-2">
                        <p className="font-bold text-blue-700">{repurposedCampaign.facebookPost?.headline}</p>
                        <p className="text-slate-700 whitespace-pre-line">{repurposedCampaign.facebookPost?.body}</p>
                        <p className="text-blue-600 font-semibold">{repurposedCampaign.facebookPost?.questionPrompt}</p>
                      </div>
                    )}
                  </div>

                  {/* Modal Action Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setRepurposedCampaign(null)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                    >
                      ← Repurpose Another Link
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyRepurposed(activeRepurposeTab)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Load into Studio Composer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEATURE 3A: CLIENT REVIEW LINK MODAL */}
        {showReviewModal && clientReviewLink && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200/90 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Client Review Magic Link</h3>
                    <p className="text-[10px] text-neutral-500">Live passwordless review portal for stakeholders</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Send this link to your client or team. They can preview upcoming posts, provide line-item comments, and submit approvals without having an OmniSocial account.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Review Link URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={clientReviewLink}
                    className="w-full text-xs font-mono p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(clientReviewLink);
                        setCopiedReviewLink(true);
                        setTimeout(() => setCopiedReviewLink(false), 3000);
                      } catch { }
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedReviewLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReviewLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                <a
                  href={clientReviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-full transition cursor-pointer"
                >
                  Open Portal ↗
                </a>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRE-REPLACE CONFIRMATION MODAL (B20 UX) */}
        {showReplaceConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Replace Existing Draft?</h3>
                  <p className="text-xs text-slate-500">You already have text in the caption field.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-24 overflow-y-auto">
                <p className="font-semibold text-slate-500 text-[10px] uppercase mb-1">Current Caption:</p>
                <p className="line-clamp-3 italic">"{caption}"</p>
              </div>

              <p className="text-xs text-slate-600">
                Generating will replace this caption with a new AI draft. Your current text will be backed up and can be restored using the <b>Restore</b> button.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceConfirmModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateAi(pendingPromptToRun, true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate & Replace</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Floating Toast Notification across all Content Studio sub-tabs */}
        {statusMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] max-w-md pointer-events-auto">
            <div className={`rounded-2xl p-4 shadow-2xl flex items-center space-x-3 text-xs font-semibold border backdrop-blur-md transition-all duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-slate-900/95 text-white border-slate-700 shadow-slate-900/40'
                : statusMessage.type === 'info'
                ? 'bg-indigo-950/95 text-indigo-100 border-indigo-700 shadow-indigo-950/40'
                : 'bg-rose-950/95 text-rose-100 border-rose-800 shadow-rose-950/40'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : statusMessage.type === 'info' ? (
                <Loader2 className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="flex-1 leading-snug">{statusMessage.text}</span>
              {(statusMessage.text?.includes('Content Calendar') || statusMessage.text?.includes('Calendar')) && (
                <a
                  href="/calendar"
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shrink-0 ml-1 shadow-xs inline-flex items-center space-x-1 cursor-pointer"
                >
                  <span>View Calendar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {statusMessage.text?.includes('Drafts tab') && (
                <button
                  type="button"
                  onClick={() => {
                    handleTabChange('drafts');
                    setStatusMessage(null);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shrink-0 ml-1 shadow-xs cursor-pointer"
                >
                  View Drafts
                </button>
              )}
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="p-1 hover:bg-white/10 rounded-md transition cursor-pointer text-slate-400 hover:text-white shrink-0 ml-1"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function ContentStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <ContentStudioContent />
    </Suspense>
  );
}
