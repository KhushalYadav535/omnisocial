'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
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
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Facebook, Instagram, LinkedIn } from '../../components/Icons';

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

export default function ContentStudioPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brands, setBrands] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Studio Form State
  const [title, setTitle] = useState('');
  const [rawIdea, setRawIdea] = useState('Introduce our upcoming eco-friendly resort capsule collection with lightweight breathable linen.');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['#Resort2026', '#SustainableFashion', '#LinenStyle']);
  const [newTagInput, setNewTagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&h=1080&fit=crop');
  const [format, setFormat] = useState<'POST' | 'PORTRAIT' | 'REEL' | 'CAROUSEL'>('POST');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['FACEBOOK', 'INSTAGRAM', 'LINKEDIN']);
  const [scheduledFor, setScheduledFor] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Media Creator Hub State (AI Video & Reel, AI Image, Upload, URL)
  const [mediaMode, setMediaMode] = useState<'ai-video' | 'ai-image' | 'upload' | 'url'>('ai-video');
  const [isVideoMedia, setIsVideoMedia] = useState(false);

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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<Array<{ platform: string; url: string; postId: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
          setBrands(res.brands);
          if (!activeBrandId) setActiveBrandId(res.brands[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeBrandId) {
      apiRequest(`/social-accounts?brandId=${activeBrandId}`)
        .then(res => {
          setAccounts(res.accounts || []);
          // Auto select all eligible accounts
          setSelectedAccountIds((res.accounts || []).map((a: any) => a.id));
        })
        .catch(() => {});
    }
  }, [activeBrandId]);

  const handleGenerateAi = async (customPrompt?: string) => {
    const promptToUse = customPrompt || rawIdea;
    if (!activeBrandId || !promptToUse.trim()) return;
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

      if (res.generated) {
        setCaption(res.generated.caption);
        setHashtags(res.generated.hashtags || ['#ResortCollection', '#SustainableLuxury']);
        if (!title) setTitle(promptToUse.slice(0, 35) + '...');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'AI Generation failed' });
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

  const handleSavePost = async (immediatePublish = false) => {
    if (!caption.trim()) {
      setStatusMessage({ type: 'error', text: 'Please write or generate a post caption first.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    setPublishedUrl(null);
    setPublishedPosts([]);

    try {
      const res = await apiRequest('/content', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          title: title || caption.slice(0, 30) + '...',
          rawIdea,
          caption,
          hashtags,
          mediaUrls: mediaUrl ? [mediaUrl] : [],
          targetPlatforms,
          format: format === 'PORTRAIT' ? 'POST' : format,
          scheduledFor: immediatePublish ? undefined : (scheduledFor || undefined),
          socialAccountIds: selectedAccountIds
        })
      });

      if (immediatePublish && selectedAccountIds.length > 0) {
        // Send multi-channel publish request to publish across all selected accounts (Facebook & Instagram)
        const pubRes = await apiRequest('/publications/publish-now', {
          method: 'POST',
          body: JSON.stringify({
            contentId: res.content.id,
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
                  contentId: res.content.id,
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
      } else if (scheduledFor) {
        setStatusMessage({ type: 'success', text: `Post successfully scheduled for ${new Date(scheduledFor).toLocaleString()}!` });
        confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 } });
      } else {
        setStatusMessage({ type: 'success', text: 'Post draft successfully saved to workspace.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBrand = brands.find(b => b.id === activeBrandId);

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* CADRA SUB-HEADER WITH CLEAN BREADCRUMB & CAPSULE ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 pt-1">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span className="hover:text-neutral-700 cursor-pointer">OmniSocial</span>
              <span>›</span>
              <span className="hover:text-neutral-700 cursor-pointer">Creative</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">AI Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1012] tracking-tight mt-1">
              AI Creative Studio
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Multi-platform viral copywriting, visual staging & instant Facebook, Instagram & LinkedIn dispatch.
            </p>
          </div>

          {/* PRIMARY COMPLETION CAPSULES */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSavePost(false)}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-black/[0.07] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all disabled:opacity-50"
            >
              {scheduledFor ? 'Schedule to Calendar' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSavePost(true)}
              disabled={submitting || selectedAccountIds.length === 0}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 rounded-full shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? 'Transmitting...'
                  : selectedAccountIds.length > 1
                  ? 'Publish Now to All Channels'
                  : targetPlatforms.includes('LINKEDIN')
                  ? 'Publish Now to LinkedIn'
                  : targetPlatforms.includes('INSTAGRAM')
                  ? 'Publish Now to Instagram'
                  : 'Publish Now'}
              </span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
            statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{statusMessage.text}</span>
              {publishedPosts.length > 0 ? (
                <div className="flex items-center gap-2 shrink-0">
                  {publishedPosts.map((post, idx) => (
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
                  ))}
                </div>
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
        )}

        {/* 2-COLUMN MAIN WORKSPACE (Left Form: 7 cols | Right Sticky Preview: 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FORM & COMPOSER CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            {/* PANEL 1: TARGET BRAND & CONNECTED CHANNELS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>1. Select Brand & Destination Accounts</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedAccountIds.length} Channel(s) Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Active Client Brand
                  </label>
                  <select
                    value={activeBrandId}
                    onChange={(e) => setActiveBrandId(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200/90 rounded-xl p-3 bg-slate-50/70 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Schedule Publication (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200/90 rounded-xl p-2.5 bg-slate-50/70 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Multi-Platform Fast Selector Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Social Platforms:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = targetPlatforms.length === 3;
                      if (allSelected) {
                        setTargetPlatforms([]);
                        setSelectedAccountIds([]);
                      } else {
                        setTargetPlatforms(['FACEBOOK', 'INSTAGRAM', 'LINKEDIN']);
                        setSelectedAccountIds(accounts.map(a => a.id));
                      }
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    {targetPlatforms.length === 3 ? 'Deselect All' : 'Select All (FB + IG + LI)'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Facebook Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const exists = targetPlatforms.includes('FACEBOOK');
                      const next = exists ? targetPlatforms.filter(p => p !== 'FACEBOOK') : [...targetPlatforms, 'FACEBOOK'];
                      setTargetPlatforms(next);
                      const fbAccIds = accounts.filter(a => a.platform === 'FACEBOOK').map(a => a.id);
                      if (exists) {
                        setSelectedAccountIds(selectedAccountIds.filter(id => !fbAccIds.includes(id)));
                      } else {
                        setSelectedAccountIds(Array.from(new Set([...selectedAccountIds, ...fbAccIds])));
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      targetPlatforms.includes('FACEBOOK')
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Facebook className="w-4 h-4 fill-current shrink-0" />
                    <span>Facebook</span>
                  </button>

                  {/* Instagram Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const exists = targetPlatforms.includes('INSTAGRAM');
                      const next = exists ? targetPlatforms.filter(p => p !== 'INSTAGRAM') : [...targetPlatforms, 'INSTAGRAM'];
                      setTargetPlatforms(next);
                      const igAccIds = accounts.filter(a => a.platform === 'INSTAGRAM').map(a => a.id);
                      if (exists) {
                        setSelectedAccountIds(selectedAccountIds.filter(id => !igAccIds.includes(id)));
                      } else {
                        setSelectedAccountIds(Array.from(new Set([...selectedAccountIds, ...igAccIds])));
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      targetPlatforms.includes('INSTAGRAM')
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white border-transparent shadow-sm ring-2 ring-pink-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    <span>Instagram</span>
                  </button>

                  {/* LinkedIn Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const exists = targetPlatforms.includes('LINKEDIN');
                      const next = exists ? targetPlatforms.filter(p => p !== 'LINKEDIN') : [...targetPlatforms, 'LINKEDIN'];
                      setTargetPlatforms(next);
                      const liAccIds = accounts.filter(a => a.platform === 'LINKEDIN').map(a => a.id);
                      if (exists) {
                        setSelectedAccountIds(selectedAccountIds.filter(id => !liAccIds.includes(id)));
                      } else {
                        setSelectedAccountIds(Array.from(new Set([...selectedAccountIds, ...liAccIds])));
                      }
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      targetPlatforms.includes('LINKEDIN')
                        ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm ring-2 ring-sky-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <LinkedIn className="w-4 h-4 fill-current shrink-0" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Destination Account Pills with Avatars */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Target Social Accounts ({selectedAccountIds.length} selected):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {accounts.map(acc => {
                    const isChecked = selectedAccountIds.includes(acc.id);
                    return (
                      <button
                        type="button"
                        key={acc.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedAccountIds(selectedAccountIds.filter(id => id !== acc.id));
                          } else {
                            setSelectedAccountIds([...selectedAccountIds, acc.id]);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-300'
                            : 'border-slate-200/80 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <AccountPillAvatar
                          url={acc.profilePicUrl}
                          name={acc.accountName}
                          platform={acc.platform}
                        />
                        <div className="flex-1 truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.accountName}</p>
                          <div className="flex items-center space-x-1">
                            {acc.platform === 'LINKEDIN' ? (
                              <LinkedIn className="w-3 h-3 text-[#0A66C2] fill-current shrink-0" />
                            ) : acc.platform === 'INSTAGRAM' ? (
                              <Instagram className="w-3 h-3 text-pink-600 shrink-0" />
                            ) : (
                              <Facebook className="w-3 h-3 text-blue-600 fill-current shrink-0" />
                            )}
                            <p className="text-[10px] text-slate-400 font-mono uppercase">{acc.platform}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PANEL 2: AI PROMPT ASSISTANT (HIGH UX CHATGPT/GEMINI STYLE) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>2. AI Prompt Assistant & Angles</span>
                </span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Tone: {selectedBrand?.voiceProfile?.tone || 'Configured'}
                </span>
              </div>

              {/* Quick Preset Prompt Chips */}
              <div>
                <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick Concept Starters:</p>
                <div className="flex flex-wrap gap-2">
                  {promptPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRawIdea(preset.prompt);
                        handleGenerateAi(preset.prompt);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-300 transition-all flex items-center space-x-1"
                    >
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea with Integrated Generate Action */}
              <div className="relative rounded-2xl border border-slate-200/90 bg-slate-50/50 p-3.5 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:bg-white transition-all">
                <textarea
                  rows={2}
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  placeholder="Describe your campaign concept or topic idea here..."
                  className="w-full text-xs font-medium bg-transparent focus:outline-hidden leading-relaxed text-slate-800 placeholder:text-slate-400"
                />
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Tuned to {selectedBrand?.name || 'Brand'} voice guidelines
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGenerateAi()}
                    disabled={generating || !rawIdea.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                    <span>{generating ? 'Crafting AI Caption...' : 'Generate with AI'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL 3: FORMAT SELECTOR & CAPTION COMPOSER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <PenTool className="w-4 h-4 text-indigo-600" />
                  <span>3. Content Format & Copywriting</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {caption.length} / 2,200 chars
                </span>
              </div>

              {/* Visual Format Tabs (UX improvement over boring select) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Post Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'POST', label: 'Feed Post', sub: 'Square 1:1', icon: LayoutGrid },
                    { id: 'PORTRAIT', label: 'Portrait', sub: 'Vertical 4:5', icon: ImageIcon },
                    { id: 'REEL', label: 'Video Reel', sub: 'Story 9:16', icon: Film },
                    { id: 'CAROUSEL', label: 'Carousel', sub: 'Multi-slide', icon: LayersIcon },
                  ].map(fmt => {
                    const Icon = fmt.icon;
                    const isActive = format === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormat(fmt.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isActive
                            ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 ring-1 ring-indigo-300 font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <p className="text-xs">{fmt.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{fmt.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Post Caption Copy</span>
                  <span className={`text-[10px] font-mono font-bold ${caption.length > 2000 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {caption.length} / 2,200 (Instagram Limit)
                  </span>
                </label>
                <textarea
                  rows={6}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your post caption or click a prompt idea above to generate with AI..."
                  className="w-full text-xs font-medium border border-slate-200/90 rounded-2xl p-4 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/40 text-slate-900 leading-relaxed font-sans"
                />
              </div>

              {/* Interactive Hashtag Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hashtag Cloud
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  {hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 bg-indigo-50/90 px-3 py-1 rounded-xl border border-indigo-200/80"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-rose-600 transition-colors"
                        title="Remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Add tag input */}
                  <div className="inline-flex items-center space-x-1">
                    <span className="text-slate-400 text-xs font-bold">#</span>
                    <input
                      type="text"
                      placeholder="Add tag (Press Enter)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddHashtag}
                      className="text-xs bg-transparent border-0 focus:outline-hidden text-slate-700 placeholder:text-slate-400 w-36"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 4: ADVANCED AI MEDIA STUDIO (AI VIDEO/REELS, AI IMAGES, UPLOAD, URL) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <span>4. Visual Media & AI Production</span>
                </span>
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMediaMode('ai-video')}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                      mediaMode === 'ai-video' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>AI Reel / Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('ai-image')}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                      mediaMode === 'ai-image' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('upload')}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                      mediaMode === 'upload' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload (100MB)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('url')}
                    className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                      mediaMode === 'url' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>URL</span>
                  </button>
                </div>
              </div>

              {/* Hidden File Input for Video/Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* ACTIVE ATTACHED MEDIA PREVIEW STRIP (If mediaUrl exists) */}
              {mediaUrl && (
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    {isVideoUrl(mediaUrl) ? (
                      <div className="w-16 h-16 rounded-xl bg-black overflow-hidden relative shrink-0 flex items-center justify-center border border-slate-200">
                        <video src={mediaUrl} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                          <Play className="w-5 h-5 fill-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {uploadedFileName || (isVideoUrl(mediaUrl) ? 'Video Reel Attached' : 'Visual Asset Attached')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isVideoUrl(mediaUrl) ? 'bg-violet-100 text-violet-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {isVideoUrl(mediaUrl) ? '🎬 Video Reel' : '🖼️ Image'}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Ready for Publishing</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('');
                        setUploadedFileName(null);
                        setIsVideoMedia(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 1: AI VIDEO / REEL GENERATOR */}
              {mediaMode === 'ai-video' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-violet-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                        <span>OpenRouter Realistic Video Engine</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const idea = rawIdea || caption || 'A high-end cinematic vertical reel of our luxury product in studio lighting with elegant slow-motion movement';
                          setVideoPrompt(idea);
                        }}
                        className="text-[11px] font-bold text-violet-700 hover:text-violet-900 underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Fill from Post Idea</span>
                      </button>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        placeholder="Describe the video in realistic detail (e.g., Ultra photorealistic cinematic vertical reel of luxury modern cosmetics on wet dark slate with golden light rays and water droplets in slow motion...)"
                        className="w-full text-xs font-medium border border-violet-200/90 rounded-xl p-3 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-violet-600 leading-relaxed shadow-2xs"
                      />
                    </div>

                    {/* Model, Aspect Ratio & Duration Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          AI Video Model:
                        </label>
                        <select
                          value={videoModel}
                          onChange={(e) => setVideoModel(e.target.value)}
                          className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-violet-600"
                        >
                          <option value="google/veo-3.1-fast">Google: Veo 3.1 Fast (Best for Reels + Audio)</option>
                          <option value="google/veo-3.1">Google: Veo 3.1 Cinematic 4K</option>
                          <option value="bytedance/seedance-2.0">ByteDance: Seedance 2.0 (TikTok/Reels AI)</option>
                          <option value="kwaivgi/kling-v3.0-pro">Kling: Video v3.0 Pro</option>
                          <option value="alibaba/wan-3.0-prime">Alibaba: Wan 3.0 Prime</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Aspect Ratio:
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setVideoAspectRatio('9:16')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              videoAspectRatio === '9:16' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            9:16 Reel
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoAspectRatio('16:9')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              videoAspectRatio === '16:9' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            16:9 Wide
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoAspectRatio('1:1')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              videoAspectRatio === '1:1' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            1:1 Square
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Duration & Audio:
                        </label>
                        <div className="flex items-center space-x-2">
                          <select
                            value={videoDuration}
                            onChange={(e) => setVideoDuration(Number(e.target.value))}
                            className="flex-1 text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-violet-600"
                          >
                            <option value={4}>4 Seconds</option>
                            <option value={6}>6 Seconds</option>
                            <option value={8}>8 Seconds</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => setVideoGenerateAudio(!videoGenerateAudio)}
                            title="Generate AI Sound Effects"
                            className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              videoGenerateAudio ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Generate Button & Progress */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleGenerateAiVideo}
                        disabled={isGeneratingVideo}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{videoGenerationStage || 'Generating Realistic AI Video...'}</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            <span>Generate Photorealistic AI Video with Google Veo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: AI IMAGE GENERATOR (FLUX 3) */}
              {mediaMode === 'ai-image' && (
                <div className="space-y-4 pt-1">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>OpenRouter FLUX 3 Photorealistic Engine</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const idea = rawIdea || caption || 'A luxury studio photograph of our brand product with soft morning natural lighting and depth of field';
                          setImagePrompt(idea);
                        }}
                        className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Fill from Post Idea</span>
                      </button>
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Describe the image (e.g., Editorial architectural photography of contemporary storefront with warm ambient lighting, 8k resolution, photorealistic Hasselblad camera...)"
                        className="w-full text-xs font-medium border border-indigo-200/90 rounded-xl p-3 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 leading-relaxed shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Image Model:
                        </label>
                        <select
                          value={imageModel}
                          onChange={(e) => setImageModel(e.target.value)}
                          className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                        >
                          <option value="black-forest-labs/flux-3-image-klein">Black Forest Labs: FLUX 3 (Recommended - SOTA)</option>
                          <option value="bytedance-seed/seedream-5-0-flash">ByteDance: Seedream 5.0 Flash</option>
                          <option value="google/gemini-nano-banana-2.1">Google: Nano Banana 2.1</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Aspect Ratio:
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setImageAspectRatio('1:1')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              imageAspectRatio === '1:1' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            1:1 Square
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageAspectRatio('16:9')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              imageAspectRatio === '16:9' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            16:9 Wide
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageAspectRatio('9:16')}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              imageAspectRatio === '9:16' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            9:16 Vertical
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleGenerateAiImage}
                        disabled={isGeneratingImage}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating Ultra-Realistic Image with FLUX 3...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            <span>Generate Photorealistic AI Image with FLUX 3</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: MANUAL UPLOAD (VIDEO & IMAGE UP TO 100MB) */}
              {mediaMode === 'upload' && (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2 text-indigo-600">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-bold">Uploading file to media server...</span>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center justify-center py-6 space-y-2 text-center group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors shadow-2xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        Click to select Video (Reel) or Image from your device
                      </p>
                      <p className="text-[11px] text-slate-400">
                        MP4, MOV, WEBM, JPG, PNG up to 100MB (Auto-optimized for Instagram Reels & Facebook)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 4: DIRECT URL */}
              {mediaMode === 'url' && (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setUploadedFileName(null);
                        setIsVideoMedia(isVideoUrl(e.target.value));
                      }}
                      placeholder="https://example.com/video.mp4 or https://images.unsplash.com/..."
                      className="w-full text-xs font-mono border border-slate-200/90 rounded-2xl pl-10 pr-10 py-3 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-slate-800"
                    />
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setMediaUrl('');
                          setIsVideoMedia(false);
                        }}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY LIVE SOCIAL PREVIEW (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              {/* Platform Switcher Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Live Visual Mockup
                </span>
                <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform('INSTAGRAM')}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                      previewPlatform === 'INSTAGRAM' ? 'bg-white text-fuchsia-700 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform('FACEBOOK')}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                      previewPlatform === 'FACEBOOK' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform('LINKEDIN')}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                      previewPlatform === 'LINKEDIN' ? 'bg-white text-[#0A66C2] shadow-2xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    <LinkedIn className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Realistic Social Phone Preview Mockup */}
              {previewPlatform === 'INSTAGRAM' ? (
                <div className="border border-slate-200/90 rounded-3xl overflow-hidden bg-white shadow-sm max-w-sm mx-auto">
                  {/* Instagram Post Header */}
                  <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                        {selectedBrand?.name?.slice(0, 2).toUpperCase() || 'AW'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {selectedBrand?.slug || 'aurawear.style'}
                          </p>
                          <CheckCircle2 className="w-3 h-3 text-blue-500 inline shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400">Sponsored • 1-Click Multi-Sync</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">•••</span>
                  </div>

                  {/* Media Frame (Video Reel or Image) */}
                  <div className={`${isVideoUrl(mediaUrl) || format === 'REEL' ? 'aspect-[9/14]' : 'aspect-square'} bg-slate-100 overflow-hidden relative group`}>
                    {mediaUrl ? (
                      isVideoUrl(mediaUrl) ? (
                        <div className="w-full h-full relative bg-black">
                          <video
                            src={mediaUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <Film className="w-3 h-3 text-pink-400" />
                            <span>Reel</span>
                          </div>
                        </div>
                      ) : (
                        <img src={mediaUrl} className="w-full h-full object-cover" alt="Post preview" />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span>Upload or generate media with AI to preview</span>
                      </div>
                    )}
                  </div>

                  {/* Social Action Bar (Like, Comment, Share, Bookmark) */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-slate-700">
                        <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer" />
                        <MessageCircle className="w-5 h-5 hover:text-indigo-600 cursor-pointer" />
                        <Send className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
                      </div>
                      <Bookmark className="w-5 h-5 text-slate-700 hover:text-slate-900 cursor-pointer" />
                    </div>

                    <p className="text-xs font-bold text-slate-900">4,920 likes</p>

                    {/* Caption & Hashtags Display */}
                    <div className="text-xs text-slate-800 leading-relaxed font-sans space-y-1">
                      <p>
                        <span className="font-bold mr-1.5">{selectedBrand?.slug || 'aurawear.style'}</span>
                        {caption || 'Your generated post caption and brand voice will render live here...'}
                      </p>
                      {hashtags.length > 0 && (
                        <p className="text-indigo-600 font-semibold text-[11px]">
                          {hashtags.join(' ')}
                        </p>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 uppercase pt-1">Just now • Meta Graph API v26.0</p>
                  </div>
                </div>
              ) : previewPlatform === 'FACEBOOK' ? (
                /* Facebook Post Preview */
                <div className="border border-slate-200/90 rounded-3xl overflow-hidden bg-white shadow-sm max-w-sm mx-auto">
                  {/* FB Header */}
                  <div className="p-3.5 flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {selectedBrand?.name?.slice(0, 2).toUpperCase() || 'AW'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center">
                        {selectedBrand?.name || 'Aura Wear Lifestyle'}
                        <CheckCircle2 className="w-3 h-3 text-blue-500 ml-1 inline shrink-0" />
                      </p>
                      <p className="text-[10px] text-slate-400">Published via OmniSocial AI • Just now</p>
                    </div>
                  </div>

                  {/* FB Caption */}
                  <div className="px-3.5 pb-2.5 text-xs text-slate-900 whitespace-pre-line leading-relaxed">
                    {caption || 'Your Facebook post caption will appear here in real time...'}
                    {hashtags.length > 0 && (
                      <p className="text-blue-600 font-medium text-[11px] mt-1">
                        {hashtags.join(' ')}
                      </p>
                    )}
                  </div>

                  {/* FB Media (Video or Image) */}
                  <div className="aspect-4/3 bg-slate-100 overflow-hidden bg-black/90">
                    {mediaUrl && (
                      isVideoUrl(mediaUrl) ? (
                        <video src={mediaUrl} controls autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrl} className="w-full h-full object-cover" alt="" />
                      )
                    )}
                  </div>

                  {/* FB Action Bar */}
                  <div className="p-3 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600 font-bold">
                    <span>👍 Like</span>
                    <span>💬 Comment</span>
                    <span>↗ Share</span>
                  </div>
                </div>
              ) : (
                /* LinkedIn Post Preview */
                <div className="border border-slate-200/90 rounded-3xl overflow-hidden bg-white shadow-sm max-w-sm mx-auto">
                  {/* LinkedIn Header */}
                  <div className="p-3.5 flex items-start justify-between border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
                        {selectedBrand?.name?.slice(0, 2).toUpperCase() || 'AW'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {selectedBrand?.name || 'OmniSocial Brand'}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold">• 1st</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                          {selectedBrand?.voiceProfile?.writingStyle || 'Innovating Social Media AI'}
                        </p>
                        <p className="text-[9px] text-slate-400 flex items-center space-x-1">
                          <span>Just now</span>
                          <span>•</span>
                          <span>🌐 Public</span>
                        </p>
                      </div>
                    </div>
                    <button type="button" className="text-xs text-[#0A66C2] font-bold hover:underline px-2.5 py-1 rounded-full border border-[#0A66C2]/40 hover:bg-sky-50 cursor-pointer">
                      + Follow
                    </button>
                  </div>

                  {/* LinkedIn Caption / Commentary */}
                  <div className="px-3.5 py-3 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                    {caption || 'Your thought-leadership copy and industry insights will appear live here...'}
                    {hashtags.length > 0 && (
                      <p className="text-[#0A66C2] font-semibold text-[11px] mt-1.5">
                        {hashtags.join(' ')}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn Media Preview (Video or Image) */}
                  {mediaUrl && (
                    <div className="aspect-16/10 bg-black/90 overflow-hidden border-y border-slate-100">
                      {isVideoUrl(mediaUrl) ? (
                        <video src={mediaUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrl} className="w-full h-full object-cover" alt="LinkedIn post media" />
                      )}
                    </div>
                  )}

                  {/* LinkedIn Social Counts */}
                  <div className="px-3.5 py-2 flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-100">
                    <span className="flex items-center space-x-1">
                      <span>👍 💡 ❤️ 184</span>
                    </span>
                    <span>28 comments • 12 reposts</span>
                  </div>

                  {/* LinkedIn Action Buttons */}
                  <div className="p-2 grid grid-cols-4 text-center text-xs text-slate-600 font-semibold">
                    <span className="py-1 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-center space-x-1">
                      <span>👍</span>
                      <span className="text-[11px]">Like</span>
                    </span>
                    <span className="py-1 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-center space-x-1">
                      <span>💬</span>
                      <span className="text-[11px]">Comment</span>
                    </span>
                    <span className="py-1 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-center space-x-1">
                      <span>🔁</span>
                      <span className="text-[11px]">Repost</span>
                    </span>
                    <span className="py-1 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-center space-x-1">
                      <span>✈️</span>
                      <span className="text-[11px]">Send</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
