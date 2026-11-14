'use client';

import React, { useEffect, useState, Suspense, useCallback, useMemo } from 'react';
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
  Bot,
  Layers,
  CheckCheck
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';
import confetti from 'canvas-confetti';

function InboxContent() {
  const searchParams = useSearchParams();
  const qType = searchParams?.get('type');

  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [activeBrandName, setActiveBrandName] = useState<string>('');
  const [interactions, setInteractions] = useState<any[]>([]);
  const [selectedInteraction, setSelectedInteraction] = useState<any | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dedicated Category State: COMMENT vs DIRECT_MESSAGE
  const [typeFilter, setTypeFilter] = useState<'COMMENT' | 'DIRECT_MESSAGE'>(
    qType === 'DIRECT_MESSAGE' ? 'DIRECT_MESSAGE' : 'COMMENT'
  );
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [dmsTotal, setDmsTotal] = useState(0);
  const [unreadCommentsTotal, setUnreadCommentsTotal] = useState(0);
  const [unreadDmsTotal, setUnreadDmsTotal] = useState(0);

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
  const [limit] = useState(50);
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

  // Fetch Brand Name
  useEffect(() => {
    if (activeBrandId) {
      apiRequest('/brands')
        .then(res => {
          const found = (res.brands || []).find((b: any) => b.id === activeBrandId);
          if (found) setActiveBrandName(found.name);
          else setActiveBrandName('Active Brand');
        })
        .catch(() => {});
    } else {
      setActiveBrandName('All Brands');
    }
  }, [activeBrandId]);

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
      if (res.unreadCommentsCount !== undefined) setUnreadCommentsTotal(res.unreadCommentsCount);
      if (res.unreadDmsCount !== undefined) setUnreadDmsTotal(res.unreadDmsCount);

      // Auto-select first item if current selection is invalid or absent
      if (items.length > 0) {
        if (!selectedInteraction || !items.some((i: any) => i.id === selectedInteraction.id)) {
          loadInteractionDetail(items[0].id);
        }
      } else {
        setSelectedInteraction(null);
        setThreadMessages([]);
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
      setThreadMessages(res.thread && res.thread.length > 0 ? res.thread : [res.interaction]);
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

      // Refresh item and thread state immediately
      const newReplyObj = {
        id: replyId,
        finalContent: replyText,
        status: 'SENT',
        sentAt: new Date().toISOString()
      };

      selectedInteraction.replyStatus = 'SENT';
      if (!selectedInteraction.replies) selectedInteraction.replies = [];
      selectedInteraction.replies.unshift(newReplyObj);
      setSelectedInteraction({ ...selectedInteraction });

      setThreadMessages(prev => {
        return prev.map(m => {
          if (m.id === selectedInteraction.id) {
            return {
              ...m,
              replyStatus: 'SENT',
              replies: [newReplyObj, ...(m.replies || [])]
            };
          }
          return m;
        });
      });

      setReplyText('');
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

  // Group interactions into Conversation Threads (for DMs by parentPlatformId/authorId, for Comments by postId)
  const conversationThreads = useMemo(() => {
    const threadMap = new Map<string, any>();

    for (const item of interactions) {
      let key = item.parentPlatformId;
      if (typeFilter === 'DIRECT_MESSAGE') {
        key = item.parentPlatformId || item.authorId || item.id;
      } else {
        key = item.parentPlatformId || item.id;
      }

      if (!threadMap.has(key)) {
        threadMap.set(key, {
          threadId: key,
          platform: item.platform,
          type: item.type,
          authorName: item.authorName,
          authorUsername: item.authorUsername,
          authorAvatarUrl: item.authorAvatarUrl,
          accountName: item.accountName,
          brandName: item.brandName,
          latestMessage: item,
          unreadCount: item.isRead ? 0 : 1,
          replyStatus: item.replyStatus,
          messages: [item],
          replies: [...(item.replies || [])]
        });
      } else {
        const existing = threadMap.get(key);
        existing.messages.push(item);
        if (!item.isRead) existing.unreadCount += 1;
        // Keep latest message preview
        if (new Date(item.platformCreatedAt).getTime() > new Date(existing.latestMessage.platformCreatedAt).getTime()) {
          existing.latestMessage = item;
          existing.replyStatus = item.replyStatus;
        }
        if (item.replies) {
          existing.replies.push(...item.replies);
        }
      }
    }

    const threadList = Array.from(threadMap.values());
    threadList.sort((a, b) => 
      new Date(b.latestMessage.platformCreatedAt).getTime() - new Date(a.latestMessage.platformCreatedAt).getTime()
    );
    return threadList;
  }, [interactions, typeFilter]);

  // Merge incoming thread messages and outgoing replies into a single chronological timeline
  const chronologicalTimeline = useMemo(() => {
    const list: Array<{
      id: string;
      isSenderCustomer: boolean;
      authorName: string;
      authorAvatarUrl?: string;
      text: string;
      createdAt: string;
      platformReplyId?: string;
      status?: string;
    }> = [];

    const messagesToRender = (threadMessages && threadMessages.length > 0) 
      ? threadMessages 
      : (selectedInteraction ? [selectedInteraction] : []);

    for (const msg of messagesToRender) {
      // 1. Incoming customer message
      list.push({
        id: msg.id,
        isSenderCustomer: true,
        authorName: msg.authorName,
        authorAvatarUrl: msg.authorAvatarUrl,
        text: msg.contentText,
        createdAt: msg.platformCreatedAt
      });

      // 2. Outgoing replies for this message
      if (msg.replies && msg.replies.length > 0) {
        for (const rep of msg.replies) {
          if (rep.status === 'SENT' || rep.status === 'APPROVED') {
            list.push({
              id: rep.id,
              isSenderCustomer: false,
              authorName: 'OmniSocial Engine',
              text: rep.finalContent,
              createdAt: rep.sentAt || rep.createdAt,
              platformReplyId: rep.platformReplyId,
              status: rep.status
            });
          }
        }
      }
    }

    // Sort chronologically from earliest to latest
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return list;
  }, [threadMessages, selectedInteraction]);

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      {/* Outer Shell with responsive height and bottom space for Windows Explorer status bar */}
      <div className="w-full flex flex-col space-y-4 pb-20">
        
        {/* COMPACT UNIFIED CADRA COMMAND BAR */}
        <header className="bg-white px-5 py-3 rounded-[24px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-3 shrink-0">
          {/* Left: View Mode Segmented Control + Live Meta Pulse */}
          <div className="flex items-center space-x-3">
            <div className="inline-flex p-1 rounded-full bg-[#EAEBED] border border-black/[0.04]">
              <button
                type="button"
                onClick={() => {
                  setTypeFilter('COMMENT');
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  typeFilter === 'COMMENT'
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments</span>
                {unreadCommentsTotal > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                    {unreadCommentsTotal}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTypeFilter('DIRECT_MESSAGE');
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  typeFilter === 'DIRECT_MESSAGE'
                    ? 'bg-[#111215] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Direct Messages</span>
                {unreadDmsTotal > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                    {unreadDmsTotal}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Graph v26.0 Live</span>
            </div>
          </div>

          {/* Right: Search + Platform Filter + Status Filter + Sync Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={typeFilter === 'COMMENT' ? 'Search comments...' : 'Search messages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200/80 rounded-full focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 w-36 sm:w-48 transition-all"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="text-xs border border-neutral-200/80 rounded-full px-3 py-1.5 bg-neutral-50 hover:bg-white text-neutral-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Platforms</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-neutral-200/80 rounded-full px-3 py-1.5 bg-neutral-50 hover:bg-white text-neutral-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="NEEDS_RESPONSE">Needs Reply</option>
              <option value="DRAFT_READY">Draft Ready</option>
              <option value="SENT">Sent</option>
            </select>

            <button
              onClick={() => syncWithMeta()}
              disabled={syncing}
              title={`Auto-sync every 45s • Last: ${lastSyncedTime}`}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-800 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-neutral-900' : 'text-neutral-500'}`} />
              <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Meta'}</span>
            </button>
          </div>
        </header>

        {/* Global Notice Banner (Collapsible) */}
        {successNotice && (
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center justify-between shrink-0 animate-in fade-in">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* ============================================================== */}
          {/* PANE 1: CONVERSATION THREAD DIRECTORY (CADRA 4-5 COLS)           */}
          {/* ============================================================== */}
          <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
            {/* List Header */}
            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  {typeFilter === 'COMMENT' ? 'Post Discussion Threads' : 'Conversation Threads'}
                </span>
                <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-200/70 px-2.5 py-0.2 rounded-full">
                  {conversationThreads.length}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {typeFilter === 'COMMENT' ? 'Public Threads' : 'Private Threads'}
              </span>
            </div>

            {/* Scrollable Conversation Threads */}
            <div className="overflow-y-auto max-h-[720px] min-h-[380px] divide-y divide-neutral-100">
              {loading ? (
                <div className="p-10 text-center space-y-2">
                  <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Fetching conversation threads...</p>
                </div>
              ) : conversationThreads.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    {typeFilter === 'COMMENT' ? <MessageSquare className="w-5 h-5" /> : <Inbox className="w-5 h-5" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {typeFilter === 'COMMENT'
                      ? 'No comment threads match the active filters.'
                      : 'No direct message threads match the active filters.'}
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
                conversationThreads.map((thread) => {
                  const isSelected = selectedInteraction && (
                    selectedInteraction.parentPlatformId === thread.threadId ||
                    selectedInteraction.authorId === thread.threadId ||
                    selectedInteraction.id === thread.latestMessage.id
                  );
                  const isDm = thread.type === 'DIRECT_MESSAGE';
                  const msgCount = thread.messages.length;

                  return (
                    <button
                      key={thread.threadId}
                      type="button"
                      onClick={() => loadInteractionDetail(thread.latestMessage.id)}
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
                            thread.authorAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              thread.authorName || 'User'
                            )}&background=6366f1&color=fff&bold=true&size=128`
                          }
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-2xs flex items-center justify-center p-0.5">
                          {thread.platform === 'INSTAGRAM' ? (
                            <Instagram className="w-3 h-3 text-pink-600" />
                          ) : (
                            <Facebook className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>

                      {/* Content Overview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 truncate max-w-[130px]">
                            {thread.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(thread.latestMessage.platformCreatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-snug">
                          {thread.latestMessage.contentText}
                        </p>

                        {/* Ergonomic Status Micro-Pills */}
                        <div className="mt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                            thread.platform === 'INSTAGRAM'
                              ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {thread.platform.slice(0, 2)} • {isDm ? 'DM' : 'Post'}
                          </span>

                          {/* Thread count badge */}
                          {msgCount > 1 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5 text-neutral-500" />
                              <span>{msgCount} msgs</span>
                            </span>
                          )}

                          {thread.latestMessage.classification && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              thread.latestMessage.classification.sentiment === 'POSITIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : thread.latestMessage.classification.sentiment === 'NEGATIVE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {thread.latestMessage.classification.sentiment}
                            </span>
                          )}

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto flex items-center space-x-1 ${
                            thread.replyStatus === 'SENT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : thread.replyStatus === 'DRAFT_READY'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {thread.replyStatus === 'NEEDS_RESPONSE' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                            {thread.replyStatus === 'SENT' && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                            <span>{thread.replyStatus === 'NEEDS_RESPONSE' ? 'Needs Reply' : thread.replyStatus.replace('_', ' ')}</span>
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
          {/* PANE 2: THREAD CONVERSATION STREAM & DOCKED AI COMPOSER (7-8)  */}
          {/* ============================================================== */}
          <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
            {selectedInteraction ? (
              <div className="flex flex-col">
                
                {/* 1. THREAD HEADER WITH CUSTOMER INFO & TELEMETRY BADGES */}
                <div className="px-5 py-3.5 border-b border-black/[0.05] bg-white shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left: Customer Info */}
                    <div className="flex items-center space-x-3">
                      <div className="relative shrink-0">
                        <img
                          src={
                            selectedInteraction.authorAvatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedInteraction.authorName || 'User'
                            )}&background=111215&color=fff&bold=true&size=128`
                          }
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-black/[0.05]"
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
                          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                            {selectedInteraction.authorName}
                          </h2>
                          {selectedInteraction.authorUsername && (
                            <span className="text-xs text-slate-400 font-mono">
                              @{selectedInteraction.authorUsername}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {selectedInteraction.brandName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Channel: {selectedInteraction.accountName} on {selectedInteraction.platform} •{' '}
                          {chronologicalTimeline.length} message(s) in thread
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions & Telemetry Badges */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {selectedInteraction.classification && (
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            selectedInteraction.classification.sentiment === 'POSITIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : selectedInteraction.classification.sentiment === 'NEGATIVE'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {selectedInteraction.classification.sentiment} ({Math.round(selectedInteraction.classification.sentimentScore * 100)}%)
                          </span>
                          <span className="hidden md:inline-flex text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Urgency: {selectedInteraction.classification.urgencyScore}/5
                          </span>
                        </div>
                      )}

                      {selectedInteraction.permalinkUrl && (
                        <a
                          href={selectedInteraction.permalinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-700 hover:text-black px-3 py-1.5 rounded-full border border-black/[0.08] bg-white hover:bg-slate-50 transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                        >
                          <span>Open on Meta</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. CHRONOLOGICAL CONVERSATIONAL CHAT STREAM */}
                <div className="p-4 sm:p-5 space-y-4 bg-[#F8F9FA]/80 max-h-[520px] overflow-y-auto">
                  
                  {/* Clean Thread Divider */}
                  <div className="flex items-center justify-center my-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-black/[0.04] shadow-2xs">
                      {selectedInteraction.type === 'DIRECT_MESSAGE' ? 'Conversational DM Thread' : 'Post Discussion Stream'}
                    </span>
                  </div>

                  {/* Render All Sequential Chronological Messages in Thread */}
                  {chronologicalTimeline.map((item, idx) => {
                    if (item.isSenderCustomer) {
                      // Left-aligned Customer Speech Bubble
                      return (
                        <div key={item.id || idx} className="flex items-start space-x-3 max-w-2xl">
                          <img
                            src={
                              item.authorAvatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.authorName || 'User'
                              )}&background=111215&color=fff&bold=true&size=128`
                            }
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-black/[0.06] shrink-0 mt-1"
                            alt=""
                          />
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{item.authorName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-black/[0.06] shadow-2xs text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                              {item.text}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Right-aligned Sent Reply Speech Bubble
                      return (
                        <div key={item.id || idx} className="flex flex-col items-end max-w-2xl ml-auto space-y-1">
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-semibold text-emerald-800">Delivered to Meta API v26.0</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">
                              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="bg-[#111215] text-white rounded-2xl rounded-tr-xs p-4 shadow-xs text-sm leading-relaxed border border-black/10 whitespace-pre-wrap">
                            {item.text}
                          </div>
                        </div>
                      );
                    }
                  })}

                  {/* Status Banner when already resolved */}
                  {selectedInteraction.replyStatus === 'SENT' && !showReplyComposerOnSent && (
                    <div className="p-4 rounded-[20px] bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 mt-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">Latest message replied & delivered to {selectedInteraction.platform}.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReplyComposerOnSent(true)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold transition-all text-xs cursor-pointer shadow-2xs"
                      >
                        Send Additional Reply
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. DOCKED BOTTOM COMPOSER & COMPACT AI STUDIO */}
                {(selectedInteraction.replyStatus !== 'SENT' || showReplyComposerOnSent) && (
                  <div className="border-t border-black/[0.06] bg-white p-4 sm:p-5 space-y-3 shadow-xs">
                    
                    {/* Top Row: AI Reply Studio Controls & Tone Pills */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          AI Reply Studio
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                          (Tuned to Brand Voice)
                        </span>
                      </div>

                      {/* Tone Modifier Pills */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyTone('friendly')}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-neutral-200 text-slate-700 transition-all cursor-pointer"
                        >
                          ✨ Friendly
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTone('professional')}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-neutral-200 text-slate-700 transition-all cursor-pointer"
                        >
                          👔 Professional
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTone('concise')}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-neutral-200 text-slate-700 transition-all cursor-pointer"
                        >
                          ⚡ Concise
                        </button>
                        <button
                          type="button"
                          onClick={() => fetchAiSuggestions(selectedInteraction.id)}
                          disabled={generatingAi}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all flex items-center space-x-1 cursor-pointer"
                          title="Generate fresh AI suggestions"
                        >
                          <RefreshCw className={`w-3 h-3 ${generatingAi ? 'animate-spin' : ''}`} />
                          <span>Regen</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Suggestions Quick Chips */}
                    {suggestions.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                          AI Options:
                        </span>
                        {suggestions.map((sug, idx) => {
                          const isSelected = replyText === sug.text;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setReplyText(sug.text)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#111215] text-white border-neutral-900 shadow-xs' 
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-black/[0.08]'
                              }`}
                              title={sug.text}
                            >
                              <span>{sug.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Meta 24-Hour Messaging Policy Warning for DMs (if needed) */}
                    {selectedInteraction.type === 'DIRECT_MESSAGE' && 
                     (Date.now() - new Date(selectedInteraction.platformCreatedAt).getTime() > 24 * 60 * 60 * 1000) && (
                      <div className="p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed">
                          <strong className="font-bold">Meta 24-Hour Policy Window:</strong> This message was received more than 24 hours ago. For live DM transmission, send a fresh test message to the Page.
                        </div>
                      </div>
                    )}

                    {/* AI Error Alert if Any */}
                    {aiError && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{aiError}</span>
                      </div>
                    )}

                    {/* Compact Ergonomic Composer Textarea */}
                    <div className="relative rounded-[20px] border border-black/[0.08] bg-white p-3 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-black transition-all shadow-2xs">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Draft reply to ${selectedInteraction.authorName} or click an AI Option above... (Ctrl + Enter to send)`}
                        className="w-full text-xs sm:text-[13px] font-medium bg-transparent focus:outline-hidden text-slate-900 placeholder:text-slate-400 leading-relaxed resize-none"
                      />
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                        <span>Characters: {replyText.length}</span>
                        <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">Ctrl + Enter</kbd> to transmit</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          SAFE-01 Guardrail Active
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Channel: {selectedInteraction.platform}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {replyText.trim() && (
                          <button
                            type="button"
                            onClick={() => setReplyText('')}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
                          >
                            Clear
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleApproveAndSend}
                          disabled={sendingReply || !replyText.trim()}
                          className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#111215] hover:bg-neutral-800 shadow-sm active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Transmitting...' : 'Approve & Send to Meta'}</span>
                          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded text-white font-mono ml-1">
                            ↵
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 text-slate-400 min-h-[420px]">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-slate-700">Select a Conversation Thread</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Choose a thread from the directory to view the complete chronological conversation and draft replies.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ============================================================== */}
        {/* WINDOWS EXPLORER-STYLE BOTTOM STATUS BAR (FULL WIDTH FIXED)    */}
        {/* ============================================================== */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] font-mono">
          {/* Left: Total Counts Summary */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 font-bold text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>Total: {totalCount} items</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-neutral-800">Comments:</span>
              <span className="font-bold">{commentsTotal}</span>
              {unreadCommentsTotal > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 font-bold text-[10px] ml-0.5">
                  {unreadCommentsTotal} new
                </span>
              )}
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-neutral-800">DMs:</span>
              <span className="font-bold">{dmsTotal}</span>
              {unreadDmsTotal > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 font-bold text-[10px] ml-0.5">
                  {unreadDmsTotal} new
                </span>
              )}
            </div>
          </div>

          {/* Center: Active Selection Telemetry */}
          <div className="hidden lg:flex items-center space-x-2 truncate max-w-md">
            <span className="text-neutral-400">Selected:</span>
            {selectedInteraction ? (
              <span className="font-semibold text-neutral-900 truncate">
                {selectedInteraction.authorName} ({selectedInteraction.platform} • {chronologicalTimeline.length} messages in thread)
              </span>
            ) : (
              <span className="text-neutral-400 italic">No thread selected</span>
            )}
          </div>

          {/* Right: Brand, Sync Interval & Engine Status */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-neutral-700 font-semibold">{activeBrandName}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">Auto-sync: 45s</span>
            <span className="text-neutral-300">•</span>
            <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Graph Live</span>
            </span>
          </div>
        </footer>

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
