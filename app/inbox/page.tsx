'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Inbox,
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Zap,
  CornerDownLeft,
  Trash2,
  Smile,
  Bot
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';
import confetti from 'canvas-confetti';

function InboxContent() {
  const searchParams = useSearchParams();
  const qType = searchParams?.get('type');

  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [interactions, setInteractions] = useState<any[]>([]);
  const [selectedInteraction, setSelectedInteraction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Dedicated Category State: COMMENT vs DIRECT_MESSAGE
  const [typeFilter, setTypeFilter] = useState<'COMMENT' | 'DIRECT_MESSAGE'>(
    qType === 'DIRECT_MESSAGE' ? 'DIRECT_MESSAGE' : 'COMMENT'
  );
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [dmsTotal, setDmsTotal] = useState(0);

  // Synchronize with URL search query parameter
  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam === 'DIRECT_MESSAGE' && typeFilter !== 'DIRECT_MESSAGE') {
      setTypeFilter('DIRECT_MESSAGE');
      setPage(1);
    } else if (typeParam === 'COMMENT' && typeFilter !== 'COMMENT') {
      setTypeFilter('COMMENT');
      setPage(1);
    }
  }, [searchParams]);

  // Filters
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // AI Reply Draft State
  const [replyText, setReplyText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sendingReply, setSendingReply] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [showReplyComposerOnSent, setShowReplyComposerOnSent] = useState(false);

  const syncWithMeta = async () => {
    setSyncing(true);
    setSuccessNotice(null);
    try {
      const res = await apiRequest('/inbox/sync', {
        method: 'POST',
        body: JSON.stringify({ brandId: activeBrandId || undefined })
      });
      if (res.newItems > 0) {
        setSuccessNotice(`Synced ${res.newItems} new item(s) directly from Meta Graph!`);
      } else if (res.totalFound > 0) {
        setSuccessNotice(`All ${res.totalFound} items are current with Meta.`);
      } else {
        setSuccessNotice('Meta synchronization completed. No new items found.');
      }
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      await fetchInteractions(1);
    } catch (err: any) {
      console.error('Meta sync failed:', err);
      setSuccessNotice(null);
      alert(`Sync error: ${err.message || 'Failed to sync with Meta'}`);
    } finally {
      setSyncing(false);
    }
  };

  const fetchInteractions = useCallback(async (targetPage?: number) => {
    setLoading(true);
    try {
      const pageNum = typeof targetPage === 'number' ? targetPage : page;
      const params = new URLSearchParams();
      if (activeBrandId) params.append('brandId', activeBrandId);
      if (platformFilter !== 'ALL') params.append('platform', platformFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', String(pageNum));
      params.append('limit', String(limit));

      const res = await apiRequest(`/inbox?${params.toString()}`);
      const items = res.items || res.interactions || [];
      setInteractions(items);
      if (res.total !== undefined) setTotalCount(res.total);
      if (res.totalPages !== undefined) setTotalPages(res.totalPages);
      if (res.page !== undefined) setPage(res.page);
      if (res.commentsCount !== undefined) setCommentsTotal(res.commentsCount);
      if (res.dmsCount !== undefined) setDmsTotal(res.dmsCount);

      // Auto-select first item if current selection is invalid or absent
      if (items.length > 0) {
        if (!selectedInteraction || !items.some((i: any) => i.id === selectedInteraction.id)) {
          loadInteractionDetail(items[0].id);
        }
      } else {
        setSelectedInteraction(null);
      }
    } catch (err) {
      console.error('Failed to fetch inbox interactions:', err);
    } finally {
      setLoading(false);
    }
  }, [activeBrandId, platformFilter, typeFilter, statusFilter, searchQuery, page, limit, selectedInteraction]);

  const loadInteractionDetail = async (id: string) => {
    try {
      const res = await apiRequest(`/inbox/${id}`);
      setSelectedInteraction(res.interaction);
      setShowReplyComposerOnSent(false);

      // Check if there is an existing draft reply
      const draft = (res.interaction.replies || []).find((r: any) => r.status === 'DRAFT');
      if (draft) {
        setReplyText(draft.finalContent || draft.aiSuggestion || '');
      } else if (res.interaction.replies && res.interaction.replies.length > 0) {
        const sent = res.interaction.replies[0];
        setReplyText(sent.finalContent || '');
      } else {
        setReplyText('');
      }

      // Auto-fetch AI suggestions if interaction needs response
      if (res.interaction.replyStatus === 'NEEDS_RESPONSE' || res.interaction.replyStatus === 'DRAFT_READY') {
        fetchAiSuggestions(id);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Failed to load interaction detail:', err);
    }
  };

  const fetchAiSuggestions = async (interactionId: string) => {
    setGeneratingAi(true);
    setAiError(null);
    try {
      const res = await apiRequest('/ai/suggest-replies', {
        method: 'POST',
        body: JSON.stringify({ interactionId })
      });
      if (res.suggestions) {
        setSuggestions(res.suggestions);
        if (!replyText && res.suggestions.length > 0) {
          setReplyText(res.suggestions[0].text);
        }
      }
    } catch (err: any) {
      console.error('AI suggestions error:', err);
      setAiError(err.message || 'AI suggestions engine is currently offline or unconfigured.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleApplyTone = (tone: string) => {
    if (!replyText.trim() && suggestions.length > 0) {
      setReplyText(suggestions[0].text);
      return;
    }
    // Quick prefix/tone modifier
    if (tone === 'friendly') {
      if (!replyText.toLowerCase().includes('hello') && !replyText.toLowerCase().includes('hi')) {
        setReplyText(`Hi ${selectedInteraction?.authorName?.split(' ')[0] || 'there'}! ✨ ${replyText}`);
      }
    } else if (tone === 'professional') {
      setReplyText(`Dear ${selectedInteraction?.authorName || 'Customer'}, thank you for contacting us. ${replyText.replace(/^(Hi|Hello|Hey)[^,]*,?\s*/i, '')}`);
    } else if (tone === 'concise') {
      const sentences = replyText.split(/[.!?]+/).filter(Boolean);
      setReplyText(sentences.slice(0, 2).join('. ') + '.');
    }
  };

  const handleApproveAndSend = async () => {
    if (!selectedInteraction || !replyText.trim()) return;
    setSendingReply(true);
    setSuccessNotice(null);

    try {
      // Step 1: Save draft
      const draftRes = await apiRequest('/replies/draft', {
        method: 'POST',
        body: JSON.stringify({
          interactionId: selectedInteraction.id,
          replyText
        })
      });

      const replyId = draftRes.reply?.id;

      // Step 2: Trigger explicit approval and transmit to Meta API (SAFE-01 & AI-06)
      await apiRequest(`/replies/${replyId}/approve-and-send`, {
        method: 'POST',
        body: JSON.stringify({ editedText: replyText })
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']
      });

      setSuccessNotice(`Approved & sent reply to ${selectedInteraction.authorName} on ${selectedInteraction.platform}!`);

      // Refresh item state
      selectedInteraction.replyStatus = 'SENT';
      if (!selectedInteraction.replies) selectedInteraction.replies = [];
      selectedInteraction.replies.unshift({
        id: replyId,
        finalContent: replyText,
        status: 'SENT',
        sentAt: new Date().toISOString()
      });
      setSelectedInteraction({ ...selectedInteraction });
      fetchInteractions();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleApproveAndSend();
    }
  };

  useEffect(() => {
    setPage(1);
    fetchInteractions(1);
    if (activeBrandId) {
      syncWithMeta();
    }
  }, [activeBrandId, platformFilter, typeFilter, statusFilter, searchQuery]);

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      {/* Outer Shell strictly calibrated to viewport height with zero window overflow */}
      <div className="h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-8rem)] lg:h-[calc(100vh-8.5rem)] flex flex-col space-y-3">
        
        {/* COMPACT UNIFIED COMMAND BAR (UX OPTIMIZATION: REPLACES 2 GIANT HEADERS) */}
        <header className="bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 shrink-0">
          {/* Left: View Mode Segmented Control + Live Meta Pulse */}
          <div className="flex items-center space-x-3">
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('COMMENT');
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  typeFilter === 'COMMENT'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  typeFilter === 'COMMENT' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {commentsTotal}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTypeFilter('DIRECT_MESSAGE');
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  typeFilter === 'DIRECT_MESSAGE'
                    ? 'bg-white text-purple-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Direct Messages</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  typeFilter === 'DIRECT_MESSAGE' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {dmsTotal}
                </span>
              </button>
            </div>

            <div className="hidden xl:flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Graph v22.0 Live</span>
            </div>
          </div>

          {/* Right: Search + Platform Filter + Status Filter + Sync Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={typeFilter === 'COMMENT' ? 'Search comments...' : 'Search messages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600/30 w-36 sm:w-48 transition-all"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50/70 hover:bg-white text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Platforms</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50/70 hover:bg-white text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="NEEDS_RESPONSE">Needs Reply</option>
              <option value="DRAFT_READY">Draft Ready</option>
              <option value="SENT">Sent</option>
            </select>

            <button
              onClick={() => syncWithMeta()}
              disabled={syncing}
              title={`Last synced: ${lastSyncedTime}`}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Meta'}</span>
            </button>
          </div>
        </header>

        {/* Global Notice Banner (Collapsible) */}
        {successNotice && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shrink-0 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-PANE WORKSPACE: LEFT CONVERSATION LIST & RIGHT DOCKED STUDIO */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
          
          {/* ============================================================== */}
          {/* PANE 1: CONVERSATION LIST (ERGONOMIC 4-5 COLS)                   */}
          {/* ============================================================== */}
          <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col min-h-0 overflow-hidden">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {typeFilter === 'COMMENT' ? 'Post Comments' : 'Direct Messages'}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.2 rounded-full">
                  {interactions.length}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {typeFilter === 'COMMENT' ? 'Public Graph' : 'Private Direct'}
              </span>
            </div>

            {/* Scrollable Conversation Items */}
            <div
              data-lenis-prevent="true"
              className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 overscroll-contain"
            >
              {loading ? (
                <div className="p-10 text-center space-y-2">
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Fetching conversation telemetry...</p>
                </div>
              ) : interactions.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    {typeFilter === 'COMMENT' ? <MessageSquare className="w-5 h-5" /> : <Inbox className="w-5 h-5" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {typeFilter === 'COMMENT'
                      ? 'No post comments match the active filters.'
                      : 'No direct messages match the active filters.'}
                  </p>
                  <button
                    onClick={() => syncWithMeta()}
                    disabled={syncing}
                    className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>Sync from Meta</span>
                  </button>
                </div>
              ) : (
                interactions.map((item) => {
                  const isSelected = selectedInteraction?.id === item.id;
                  const isDm = item.type === 'DIRECT_MESSAGE';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => loadInteractionDetail(item.id)}
                      className={`w-full text-left p-3.5 transition-all flex items-start space-x-3 cursor-pointer relative ${
                        isSelected
                          ? 'bg-indigo-50/80 border-l-4 border-indigo-600 shadow-2xs'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Avatar with Platform Micro-Badge */}
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={
                            item.authorAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.authorName || 'User'
                            )}&background=6366f1&color=fff&bold=true&size=128`
                          }
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-2xs flex items-center justify-center p-0.5">
                          {item.platform === 'INSTAGRAM' ? (
                            <Instagram className="w-3 h-3 text-pink-600" />
                          ) : (
                            <Facebook className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>

                      {/* Content Overview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 truncate">
                            {item.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(item.platformCreatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-snug">
                          {item.contentText}
                        </p>

                        {/* Ergonomic Status Micro-Pills */}
                        <div className="mt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                            item.platform === 'INSTAGRAM'
                              ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.platform.slice(0, 2)} • {isDm ? 'DM' : 'Post'}
                          </span>

                          {item.classification && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              item.classification.sentiment === 'POSITIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.classification.sentiment === 'NEGATIVE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.classification.sentiment}
                            </span>
                          )}

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto flex items-center space-x-1 ${
                            item.replyStatus === 'SENT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.replyStatus === 'DRAFT_READY'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {item.replyStatus === 'NEEDS_RESPONSE' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                            {item.replyStatus === 'SENT' && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                            <span>{item.replyStatus === 'NEEDS_RESPONSE' ? 'Needs Reply' : item.replyStatus.replace('_', ' ')}</span>
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Pagination Toolbar */}
            {totalPages > 1 && (
              <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 shrink-0">
                <span className="font-semibold text-[11px]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      const prev = Math.max(1, page - 1);
                      setPage(prev);
                      fetchInteractions(prev);
                    }}
                    disabled={page <= 1 || loading}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.min(totalPages, page + 1);
                      setPage(next);
                      fetchInteractions(next);
                    }}
                    disabled={page >= totalPages || loading}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ============================================================== */}
          {/* PANE 2: DETAIL CONVERSATION & FIXED DOCKED COMPOSER (7-8 COLS)  */}
          {/* ============================================================== */}
          <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col min-h-0 overflow-hidden">
            {selectedInteraction ? (
              <div className="flex flex-col h-full min-h-0">
                
                {/* 1. FIXED CONVERSATION HEADER & INLINE TELEMETRY (SLIM & ERGONOMIC) */}
                <div className="px-5 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-md shrink-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={
                            selectedInteraction.authorAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedInteraction.authorName || 'User'
                            )}&background=6366f1&color=fff&bold=true&size=128`
                          }
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-2xs flex items-center justify-center p-0.5">
                          {selectedInteraction.platform === 'INSTAGRAM' ? (
                            <Instagram className="w-3 h-3 text-pink-600" />
                          ) : (
                            <Facebook className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">
                            {selectedInteraction.authorName}
                          </h3>
                          {selectedInteraction.authorUsername && (
                            <span className="text-xs text-slate-400 font-mono">
                              @{selectedInteraction.authorUsername}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {selectedInteraction.brandName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Received via {selectedInteraction.accountName} on {selectedInteraction.platform} •{' '}
                          {new Date(selectedInteraction.platformCreatedAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {selectedInteraction.permalinkUrl && (
                      <a
                        href={selectedInteraction.permalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 transition-all flex items-center space-x-1.5"
                      >
                        <span>Open on Meta</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* INLINE AI CLASSIFICATION TELEMETRY RIBBON (UX FIX: REPLACES 85px GIANT BOX) */}
                  {selectedInteraction.classification && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                        AI Telemetry:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-semibold flex items-center space-x-1">
                        <span>Sentiment:</span>
                        <strong className="text-slate-900">{selectedInteraction.classification.sentiment} ({Math.round(selectedInteraction.classification.sentimentScore * 100)}%)</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-semibold flex items-center space-x-1">
                        <span>Type:</span>
                        <strong className="text-slate-900">{selectedInteraction.classification.isQuestion ? 'Inquiry / Question' : 'General'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold flex items-center space-x-1">
                        <span>Lead:</span>
                        <strong>{selectedInteraction.classification.isLeadIntent ? 'High Lead Potential' : 'Standard'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-semibold flex items-center space-x-1">
                        <span>Urgency:</span>
                        <strong className="text-slate-900">{selectedInteraction.classification.urgencyScore}/5</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. MIDDLE CHAT STREAM: INCOMING BUBBLE & OUTGOING RESPONSES (SCROLLABLE) */}
                <div
                  data-lenis-prevent="true"
                  className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/40 overscroll-contain"
                >
                  {/* Incoming Customer Message Bubble */}
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <img
                      src={
                        selectedInteraction.authorAvatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedInteraction.authorName || 'User'
                        )}&background=6366f1&color=fff&bold=true&size=128`
                      }
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      alt=""
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700">{selectedInteraction.authorName}</span>
                        <span>•</span>
                        <span>{new Date(selectedInteraction.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-slate-200/90 shadow-2xs text-slate-900 text-sm leading-relaxed">
                        <p className="font-medium whitespace-pre-wrap">{selectedInteraction.contentText}</p>
                      </div>
                    </div>
                  </div>

                  {/* Previous Sent Replies (if any) */}
                  {selectedInteraction.replies && selectedInteraction.replies.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {selectedInteraction.replies
                        .filter((r: any) => r.status === 'SENT')
                        .map((reply: any, idx: number) => (
                          <div key={reply.id || idx} className="flex flex-col items-end max-w-2xl ml-auto space-y-1">
                            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold text-emerald-800">Delivered to Meta API v22.0</span>
                              <span>•</span>
                              <span>{reply.sentAt ? new Date(reply.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sent'}</span>
                            </div>
                            <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-4 shadow-sm text-sm leading-relaxed">
                              <p className="font-medium whitespace-pre-wrap">{reply.finalContent}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Status Banner when already resolved */}
                  {selectedInteraction.replyStatus === 'SENT' && !showReplyComposerOnSent && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">This interaction has been approved and delivered to {selectedInteraction.platform}.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReplyComposerOnSent(true)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold transition-all text-[11px] cursor-pointer"
                      >
                        Send Additional Reply
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. DOCKED BOTTOM COMPOSER & AI STUDIO (ERGONOMIC FIX: NEVER PUSHED OFF-SCREEN!) */}
                {(selectedInteraction.replyStatus !== 'SENT' || showReplyComposerOnSent) && (
                  <div className="border-t border-slate-200/90 bg-white p-4 space-y-3 shrink-0 shadow-lg">
                    
                    {/* Top Row: AI Engine Controls & Tone Pills */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          AI Reply Studio
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          (Tuned to Brand Voice)
                        </span>
                      </div>

                      {/* Tone Modifier Pills */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Tone:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyTone('friendly')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
                        >
                          ✨ Friendly
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTone('professional')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
                        >
                          👔 Professional
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTone('concise')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
                        >
                          ⚡ Concise
                        </button>
                        <button
                          type="button"
                          onClick={() => fetchAiSuggestions(selectedInteraction.id)}
                          disabled={generatingAi}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 transition-all flex items-center space-x-1 cursor-pointer"
                          title="Generate fresh AI suggestions"
                        >
                          <RefreshCw className={`w-3 h-3 ${generatingAi ? 'animate-spin' : ''}`} />
                          <span className="hidden sm:inline">Regen</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Suggestions Quick Chips (1-Click Insertion) */}
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setReplyText(sug.text)}
                            className="px-2.5 py-1 rounded-xl text-left bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200/80 hover:border-indigo-300 text-[11px] text-indigo-950 font-medium transition-all max-w-full truncate cursor-pointer"
                            title={sug.text}
                          >
                            <span className="font-bold text-indigo-700 mr-1.5">{sug.title}:</span>
                            <span className="text-slate-600 truncate">{sug.text.slice(0, 50)}...</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* AI Error Alert if Any */}
                    {aiError && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{aiError}</span>
                      </div>
                    )}

                    {/* Ergonomic Composer Textarea */}
                    <div className="relative rounded-xl border border-slate-300 bg-white p-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600 transition-all shadow-2xs">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Draft reply to ${selectedInteraction.authorName} or click an AI suggestion above... (Press Ctrl + Enter to send)`}
                        className="w-full text-xs font-medium bg-transparent focus:outline-hidden text-slate-900 placeholder:text-slate-400 leading-relaxed resize-none"
                      />
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                        <span>Characters: {replyText.length}</span>
                        <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">Ctrl + Enter</kbd> to transmit</span>
                      </div>
                    </div>

                    {/* Action Bar (Optimal Ergonomic Button Hierarchy) */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                          SAFE-01 Guardrail Active
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Dest: {selectedInteraction.platform}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {replyText.trim() && (
                          <button
                            type="button"
                            onClick={() => setReplyText('')}
                            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            Clear
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleApproveAndSend}
                          disabled={sendingReply || !replyText.trim()}
                          className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Transmitting...' : 'Approve & Send to Meta'}</span>
                          <span className="text-[10px] bg-indigo-500/80 px-1.5 py-0.5 rounded text-white font-mono ml-1">
                            ↵
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-slate-700">Select an Interaction</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Choose a direct message or comment from the left directory to review AI classification and transmit replies.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default function InboxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
          <p className="text-xs text-slate-400 font-mono">Loading Sovereign Inbox...</p>
        </div>
      }
    >
      <InboxContent />
    </Suspense>
  );
}
