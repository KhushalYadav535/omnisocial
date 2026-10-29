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
  ExternalLink
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';

export default function ContentStudioPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [brands, setBrands] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Studio Form State
  const [title, setTitle] = useState('');
  const [rawIdea, setRawIdea] = useState('Introduce our upcoming eco-friendly resort capsule collection with lightweight breathable linen.');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&h=1080&fit=crop');
  const [format, setFormat] = useState('POST');
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

  const handleGenerateAi = async () => {
    if (!activeBrandId || !rawIdea.trim()) return;
    setGenerating(true);
    setStatusMessage(null);

    try {
      const res = await apiRequest('/ai/generate-post', {
        method: 'POST',
        body: JSON.stringify({
          brandId: activeBrandId,
          rawIdea,
          targetPlatforms,
          format
        })
      });

      if (res.generated) {
        setCaption(res.generated.caption);
        setHashtags(res.generated.hashtags || []);
        if (!title) setTitle(rawIdea.slice(0, 35) + '...');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'AI Generation failed' });
    } finally {
      setGenerating(false);
    }
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
      setStatusMessage({ type: 'error', text: 'Post caption is required' });
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
          format,
          scheduledFor: immediatePublish ? undefined : (scheduledFor || undefined),
          socialAccountIds: selectedAccountIds
        })
      });

      if (immediatePublish && selectedAccountIds.length > 0) {
        // Trigger instant publication
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
      } else if (scheduledFor) {
        setStatusMessage({ type: 'success', text: `Post successfully scheduled for ${new Date(scheduledFor).toLocaleString()}!` });
      } else {
        setStatusMessage({ type: 'success', text: 'Post saved to drafts.' });
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
                [ AI CONTENT STUDIO // OMNICHANNEL COMPOSER ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Direct Meta Publishing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center space-x-2">
              <span>Post Composer & Visual Studio</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate platform-optimized captions, hashtags, and schedule across Facebook & Instagram.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2.5 shadow-2xs ${
            statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{statusMessage.text}</span>
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

        {/* 2-Column Composer & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & AI Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
            {/* Target Brand & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Active Brand
                </label>
                <select
                  value={activeBrandId}
                  onChange={(e) => setActiveBrandId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Content Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-medium"
                >
                  <option value="POST">Feed Post (1:1 / 4:5)</option>
                  <option value="REEL">Video Reel (9:16)</option>
                  <option value="STORY">Story</option>
                  <option value="CAROUSEL">Multi-image Carousel</option>
                </select>
              </div>
            </div>

            {/* Prompt Helper & AI Generator */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Prompt Idea & Angle</span>
                </span>
                <span className="text-[11px] text-indigo-700 font-medium">Brand Voice: {selectedBrand?.voiceProfile?.tone || 'Configured'}</span>
              </div>
              <textarea
                rows={2}
                value={rawIdea}
                onChange={(e) => setRawIdea(e.target.value)}
                placeholder="What do you want to talk about? (e.g. Announce a weekend sale, share tips...)"
                className="w-full p-2.5 text-xs border border-indigo-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={generating || !rawIdea.trim()}
                className="w-full py-2 px-4 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'Crafting Brand-Aware Caption...' : 'Generate with AI'}</span>
              </button>
            </div>

            {/* Post Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campaign / Internal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Spring Summer 2026 Collection Announcement"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Main Caption */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Post Caption & Copy</span>
                <span className="text-[10px] text-slate-400 font-normal">{caption.length} characters</span>
              </label>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption or generate with AI above..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 leading-relaxed font-sans"
              />
            </div>

            {/* Featured Image / Media Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Featured Image / Asset</span>
                </label>
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setMediaMode('upload')}
                    className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
                      mediaMode === 'upload' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('url')}
                    className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
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
                <div className="border border-dashed border-slate-300 rounded-xl p-3.5 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-2 text-indigo-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs font-semibold">Uploading image to storage...</span>
                    </div>
                  ) : mediaUrl ? (
                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200">
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-md object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {uploadedFileName || 'Featured Image Selected'}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>Ready to publish</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaUrl('');
                            setUploadedFileName(null);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer flex flex-col items-center justify-center py-4 space-y-1.5 text-center group"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                        Click to upload image from your computer
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports PNG, JPG, WEBP, GIF up to 25MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        setUploadedFileName(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-8 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-mono text-[11px]"
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={() => setMediaUrl('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Paste a direct image URL from Unsplash, CDN, or any public web image.
                  </p>
                </div>
              )}
            </div>

            {/* Connected Social Destinations */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Connected Accounts
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      className={`p-2.5 rounded-lg border text-left flex items-center space-x-2.5 transition-all text-xs ${
                        isChecked ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <img src={acc.profilePicUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
                      <div className="flex-1 truncate">
                        <span className="font-bold block truncate">{acc.accountName}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{acc.platform}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule Date Time */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Schedule Future Publication
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg p-2 bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleSavePost(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {scheduledFor ? 'Schedule to Calendar' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePost(true)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
              {/* Preview Toggle Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Social Preview
                </span>
                <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setPreviewPlatform('INSTAGRAM')}
                    className={`px-2.5 py-1 rounded-md flex items-center space-x-1 ${previewPlatform === 'INSTAGRAM' ? 'bg-white text-fuchsia-700 shadow-2xs' : 'text-slate-600'}`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('FACEBOOK')}
                    className={`px-2.5 py-1 rounded-md flex items-center space-x-1 ${previewPlatform === 'FACEBOOK' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* Instagram Card Preview */}
              {previewPlatform === 'INSTAGRAM' ? (
                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-white max-w-sm mx-auto shadow-xs">
                  {/* IG Header */}
                  <div className="p-3 flex items-center space-x-2.5 border-b border-slate-100">
                    <img
                      src={selectedBrand?.logoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                      className="w-8 h-8 rounded-full object-cover"
                      alt=""
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{selectedBrand?.slug || 'aura_lifestyle'}</p>
                      <p className="text-[10px] text-slate-400">Original audio</p>
                    </div>
                  </div>

                  {/* IG Image */}
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    {mediaUrl ? (
                      <img src={mediaUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image specified
                      </div>
                    )}
                  </div>

                  {/* IG Actions */}
                  <div className="p-3 text-xs space-y-1.5">
                    <p className="text-slate-900 whitespace-pre-line leading-relaxed">
                      <span className="font-bold mr-1.5">{selectedBrand?.slug || 'aura_lifestyle'}</span>
                      {caption || 'Your brand post caption will appear here in real time...'}
                    </p>
                    {hashtags.length > 0 && (
                      <p className="text-indigo-600 font-medium text-[11px]">{hashtags.join(' ')}</p>
                    )}
                    <p className="text-[10px] text-slate-400 uppercase pt-1">Just now</p>
                  </div>
                </div>
              ) : (
                /* Facebook Card Preview */
                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-white max-w-sm mx-auto shadow-xs">
                  {/* FB Header */}
                  <div className="p-3 flex items-center space-x-2.5">
                    <img
                      src={selectedBrand?.logoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                      className="w-9 h-9 rounded-full object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{selectedBrand?.name || 'Aura Lifestyle'}</p>
                      <p className="text-[10px] text-slate-400">Sponsored / Official Page</p>
                    </div>
                  </div>

                  {/* FB Caption */}
                  <div className="px-3 pb-2 text-xs text-slate-900 whitespace-pre-line leading-relaxed">
                    {caption || 'Your Facebook post caption will appear here in real time...'}
                  </div>

                  {/* FB Image */}
                  <div className="aspect-4/3 bg-slate-100 overflow-hidden">
                    {mediaUrl && <img src={mediaUrl} className="w-full h-full object-cover" alt="" />}
                  </div>

                  {/* FB Engagement Footer */}
                  <div className="p-2.5 border-t border-slate-100 flex items-center justify-around text-xs text-slate-500 font-semibold">
                    <span>Like</span>
                    <span>Comment</span>
                    <span>Share</span>
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
