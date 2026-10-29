'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Inbox,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  HelpCircle,
  Tag,
  ShieldAlert,
  Edit3,
  Check,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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

  const syncWithMeta = async () => {
    setSyncing(true);
    setSuccessNotice(null);
    try {
      const res = await apiRequest('/inbox/sync', {
        method: 'POST',
        body: JSON.stringify({ brandId: activeBrandId || undefined })
      });
      if (res.newItems > 0) {
        setSuccessNotice(`Synced ${res.newItems} new comment(s) directly from Meta!`);
      } else if (res.totalFound > 0) {
        setSuccessNotice(`All ${res.totalFound} comments are up-to-date with Meta.`);
      } else {
        setSuccessNotice('Meta synchronization completed. No new comments found.');
      }
      await fetchInteractions(1);
    } catch (err: any) {
      console.error('Meta sync failed:', err);
      setSuccessNotice(null);
      alert(`Sync error: ${err.message || 'Failed to sync with Meta'}`);
    } finally {
      setSyncing(false);
    }
  };

  const fetchInteractions = async (targetPage?: number) => {
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

      // If no selected interaction, or selected one is not in new list, pick the first
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
  };

  const loadInteractionDetail = async (id: string) => {
    try {
      const res = await apiRequest(`/inbox/${id}`);
      setSelectedInteraction(res.interaction);

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
        // If reply text is currently empty, pre-fill with recommended first suggestion
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

  const handleApproveAndSend = async () => {
    if (!selectedInteraction || !replyText.trim()) return;
    setSendingReply(true);
    setSuccessNotice(null);

    try {
      // Step 1: Save draft if not created yet
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']
      });

      setSuccessNotice(`Approved and sent reply to ${selectedInteraction.authorName} on ${selectedInteraction.platform}!`);

      // Refresh item state
      selectedInteraction.replyStatus = 'SENT';
      setSelectedInteraction({ ...selectedInteraction });
      fetchInteractions();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setSendingReply(false);
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
      <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
        {/* Top Category Switcher: Post Comments vs Direct Messages (Separate Views) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => {
              setTypeFilter('COMMENT');
              setPage(1);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2.5 transition-all cursor-pointer ${
              typeFilter === 'COMMENT'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Post Comments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              typeFilter === 'COMMENT' ? 'bg-indigo-500/90 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {commentsTotal}
            </span>
          </button>

          <button
            onClick={() => {
              setTypeFilter('DIRECT_MESSAGE');
              setPage(1);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2.5 transition-all cursor-pointer ${
              typeFilter === 'DIRECT_MESSAGE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Direct Messages / DMs</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              typeFilter === 'DIRECT_MESSAGE' ? 'bg-purple-500/90 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {dmsTotal}
            </span>
          </button>
        </div>

        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/80">
                [ REAL-TIME ENGAGEMENT STREAM ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Multi-Channel Sync</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2 mt-1">
              {typeFilter === 'COMMENT' ? (
                <>
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Post Comments & Public Discussions</span>
                </>
              ) : (
                <>
                  <Inbox className="w-5 h-5 text-purple-600" />
                  <span>Direct Messages (DMs) & Messenger</span>
                </>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {typeFilter === 'COMMENT'
                ? 'Manage customer comments, questions, and replies across published Facebook & Instagram posts.'
                : 'Process private 1-on-1 customer conversations from Facebook Page Messenger and Instagram Direct.'}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={typeFilter === 'COMMENT' ? 'Search comments...' : 'Search messages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-600 w-44 sm:w-56"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="ALL">All Platforms</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="NEEDS_RESPONSE">Needs Response</option>
              <option value="DRAFT_READY">Draft Ready</option>
              <option value="SENT">Sent</option>
            </select>
          </div>
        </div>

        {/* Global Success / Sync Notice */}
        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Pane Inbox View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
          {/* Left Pane: Interactions List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {typeFilter === 'COMMENT' ? 'Comments' : 'Direct Messages'} ({interactions.length})
              </span>
              <button
                onClick={() => syncWithMeta()}
                disabled={syncing}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-50/70 hover:bg-indigo-100 transition-colors"
                title={`Sync ${typeFilter === 'COMMENT' ? 'comments' : 'messages'} directly from Meta`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{syncing ? 'Syncing...' : typeFilter === 'COMMENT' ? 'Sync Post Comments' : 'Sync Direct Messages'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading interactions...</div>
              ) : interactions.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    {typeFilter === 'COMMENT' ? <MessageSquare className="w-5 h-5" /> : <Inbox className="w-5 h-5" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {typeFilter === 'COMMENT'
                      ? 'No post comments match the selected filters.'
                      : 'No direct messages match the selected filters.'}
                  </p>
                  <button
                    onClick={() => syncWithMeta()}
                    disabled={syncing}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg inline-flex items-center space-x-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>
                      {syncing
                        ? 'Checking Meta...'
                        : typeFilter === 'COMMENT'
                        ? 'Fetch Comments from Facebook'
                        : 'Fetch Messages from Messenger'}
                    </span>
                  </button>
                </div>
              ) : (
                interactions.map((item) => {
                  const isSelected = selectedInteraction?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => loadInteractionDetail(item.id)}
                      className={`w-full text-left p-3.5 transition-colors flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={item.authorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.authorName || 'User')}&background=6366f1&color=fff&bold=true&size=128`}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 line-clamp-2 mt-0.5">
                          {item.contentText}
                        </p>

                        <div className="mt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm uppercase tracking-wider ${
                            item.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.platform} • {item.type === 'COMMENT' ? 'Comment' : 'DM'}
                          </span>

                          {item.classification && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${
                              item.classification.sentiment === 'POSITIVE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : item.classification.sentiment === 'NEGATIVE'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.classification.sentiment}
                            </span>
                          )}

                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ml-auto ${
                            item.replyStatus === 'SENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.replyStatus === 'DRAFT_READY'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.replyStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span className="font-medium text-[11px]">
                  Page {page} of {totalPages} ({totalCount} total)
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      const prev = Math.max(1, page - 1);
                      setPage(prev);
                      fetchInteractions(prev);
                    }}
                    disabled={page <= 1 || loading}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                    title="Previous page"
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
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Pane: Conversation & AI Assistant (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
            {selectedInteraction ? (
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Interaction Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedInteraction.authorAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedInteraction.authorName || 'User')}&background=6366f1&color=fff&bold=true&size=128`}
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{selectedInteraction.authorName}</h3>
                        <span className="text-xs text-slate-400">@{selectedInteraction.authorUsername}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                          {selectedInteraction.brandName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Received on {selectedInteraction.platform} via {selectedInteraction.accountName} •{' '}
                        {new Date(selectedInteraction.platformCreatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedInteraction.permalinkUrl && (
                    <a
                      href={selectedInteraction.permalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
                    >
                      <span>Platform Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Success alert */}
                {successNotice && (
                  <div className="m-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{successNotice}</span>
                  </div>
                )}

                {/* Content Thread Body */}
                <div className="p-5 space-y-4">
                  {/* Incoming Customer Message Bubble */}
                  <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-900 text-sm leading-relaxed">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Customer Message:
                    </p>
                    <p className="font-medium">{selectedInteraction.contentText}</p>
                  </div>

                  {/* AI Classification Insights Card */}
                  {selectedInteraction.classification && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Sentiment</span>
                        <p className="font-bold text-slate-800">
                          {selectedInteraction.classification.sentiment} (
                          {Math.round(selectedInteraction.classification.sentimentScore * 100)}%)
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Inquiry Type</span>
                        <p className="font-bold text-slate-800">
                          {selectedInteraction.classification.isQuestion ? 'Question' : 'General'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Lead Intent</span>
                        <p className="font-bold text-slate-800">
                          {selectedInteraction.classification.isLeadIntent ? 'High Lead Potential' : 'Standard'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Urgency Score</span>
                        <p className="font-bold text-slate-800">
                          {selectedInteraction.classification.urgencyScore} / 5
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Brand Voice Reply Assistant */}
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                          AI Suggestions Engine (Brand Voice Guided)
                        </h4>
                      </div>
                      <button
                        onClick={() => fetchAiSuggestions(selectedInteraction.id)}
                        disabled={generatingAi}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${generatingAi ? 'animate-spin' : ''}`} />
                        <span>Regenerate</span>
                      </button>
                    </div>

                    {/* AI Configuration / Error Notice */}
                    {aiError && (
                      <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">AI Gateway Notice</p>
                          <p className="text-amber-700 mt-0.5 text-[11px]">{aiError}</p>
                        </div>
                      </div>
                    )}

                    {/* Suggestions options pills */}
                    {suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-500 font-medium">Click any option to insert into response:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              onClick={() => setReplyText(sug.text)}
                              className="w-full text-left p-2.5 rounded-lg border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-2xs transition-all text-xs"
                            >
                              <span className="font-bold text-indigo-900 block">{sug.title}</span>
                              <span className="text-slate-600 line-clamp-2 mt-0.5">{sug.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Composer & Approval Workflow */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Final Response (Mandatory Human Approval)</span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-sm">
                          SAFE-01 Enforced
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply or pick an AI suggestion above..."
                        className="w-full p-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-sans"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-500 flex items-center">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                        Destination: {selectedInteraction.platform} ({selectedInteraction.accountName})
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleApproveAndSend}
                          disabled={sendingReply || !replyText.trim()}
                          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center space-x-1.5 disabled:opacity-50 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Transmitting...' : 'Approve & Send to Social API'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select an interaction from the list to review and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-xs text-slate-400">Loading Inbox...</p></div>}>
      <InboxContent />
    </Suspense>
  );
}

