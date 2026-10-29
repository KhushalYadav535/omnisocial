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
  Layers as LayersIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Facebook, Instagram } from '../../components/Icons';

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
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['FACEBOOK', 'INSTAGRAM']);
  const [scheduledFor, setScheduledFor] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Media Upload State
  const [mediaMode, setMediaMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Preview Tab
  const [previewPlatform, setPreviewPlatform] = useState<'FACEBOOK' | 'INSTAGRAM'>('INSTAGRAM');

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary local object preview
    const tempUrl = URL.createObjectURL(file);
    setMediaUrl(tempUrl);
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
        setUploadedFileName(res.originalName || file.name);
        setStatusMessage({
          type: 'success',
          text: `Image "${res.originalName || file.name}" uploaded successfully!`
        });
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Image upload failed. Please try again.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        const pubRes = await apiRequest('/publications/publish-now', {
          method: 'POST',
          body: JSON.stringify({
            contentId: res.content.id,
            socialAccountId: selectedAccountIds[0]
          })
        });

        const liveUrl = pubRes.publication?.platformPostUrl;
        setPublishedUrl(liveUrl || null);
        setStatusMessage({
          type: 'success',
          text: liveUrl
            ? `Post published live to Meta! Post ID: ${pubRes.publication?.platformPostId}`
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
        {/* TOP UX COMMAND BAR WITH STICKY ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 bg-[#fafaf9]/80 backdrop-blur-md sticky top-0 z-30 pt-1">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
                [ POST COMPOSER // OMNICHANNEL SUITE ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Direct Meta Publishing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              AI Creative Studio
            </h1>
          </div>

          {/* PRIMARY COMPLETION ACTIONS (Right at the top where UX eye tracks) */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleSavePost(false)}
              disabled={submitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs hover:shadow-xs transition-all disabled:opacity-50"
            >
              {scheduledFor ? 'Schedule to Calendar' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSavePost(true)}
              disabled={submitting || selectedAccountIds.length === 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-md hover:shadow-indigo-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting...' : 'Publish Now to Meta'}</span>
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
              {publishedUrl && (
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline flex items-center space-x-1 shrink-0 text-emerald-900 hover:text-emerald-700"
                >
                  <span>View Live on Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
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

              {/* Destination Account Pills with Avatars */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Target Social Accounts:
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
                        className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                          isChecked
                            ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-300'
                            : 'border-slate-200/80 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <img src={acc.profilePicUrl} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
                        <div className="flex-1 truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.accountName}</p>
                          <p className="text-[10px] text-slate-400 font-mono uppercase">{acc.platform}</p>
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

            {/* PANEL 4: MEDIA ASSET (IMAGE UPLOAD & URL) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>4. Featured Visual Media</span>
                </span>
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMediaMode('upload')}
                    className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                      mediaMode === 'upload' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('url')}
                    className={`px-3 py-1 rounded-lg flex items-center space-x-1 transition-all ${
                      mediaMode === 'url' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Paste URL</span>
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
              />

              {mediaMode === 'upload' ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2 text-indigo-600">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span className="text-xs font-bold">Uploading image to secure storage...</span>
                    </div>
                  ) : mediaUrl ? (
                    <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-200">
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {uploadedFileName || 'Featured Image Attached'}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Ready for Meta Publishing</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaUrl('');
                            setUploadedFileName(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center justify-center py-6 space-y-2 text-center group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors shadow-2xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                        Click to select image from your computer
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG, WEBP up to 25MB (Auto-formatted for 1080x1080 / 1080x1350)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setUploadedFileName(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs font-mono border border-slate-200/90 rounded-2xl pl-10 pr-10 py-3 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-slate-800"
                    />
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={() => setMediaUrl('')}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
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

                  {/* Media Frame */}
                  <div className="aspect-square bg-slate-100 overflow-hidden relative">
                    {mediaUrl ? (
                      <img src={mediaUrl} className="w-full h-full object-cover" alt="Post preview" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span>Upload an image or paste URL to preview</span>
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

                    <p className="text-[10px] text-slate-400 uppercase pt-1">Just now • Meta Graph API v22.0</p>
                  </div>
                </div>
              ) : (
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

                  {/* FB Image */}
                  <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                    {mediaUrl && <img src={mediaUrl} className="w-full h-full object-cover" alt="" />}
                  </div>

                  {/* FB Action Bar */}
                  <div className="p-3 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600 font-bold">
                    <span>👍 Like</span>
                    <span>💬 Comment</span>
                    <span>↗ Share</span>
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
