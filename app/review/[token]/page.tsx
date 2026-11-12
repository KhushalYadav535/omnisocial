'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  RotateCcw,
  Sparkles,
  Layers,
  Film,
  Calendar,
  Send,
  Loader2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function ClientReviewContent() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [canApprove, setCanApprove] = useState(true);

  // Active Feedback Modal / Input State
  const [activeFeedbackPostId, setActiveFeedbackPostId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingActionId, setSubmittingActionId] = useState<string | null>(null);

  const fetchPortalData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/client-review/public/${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load review portal');
      }

      setBrand(data.brand);
      setCanApprove(data.canApprove !== false);
      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Review link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, [token]);

  const handleAction = async (contentId: string, action: 'APPROVE' | 'REQUEST_CHANGES', feedback?: string) => {
    try {
      setSubmittingActionId(contentId);
      const res = await fetch(`${API_BASE}/client-review/public/${token}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          action,
          feedback: feedback || undefined
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update review action');
      }

      // Optimistically update post list
      setPosts(prev => prev.map(p => {
        if (p.id === contentId) {
          return {
            ...p,
            clientApprovalStatus: data.approvalStatus,
            clientFeedback: data.clientFeedback
          };
        }
        return p;
      }));

      setActiveFeedbackPostId(null);
      setFeedbackText('');

      if (action === 'APPROVE') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#6366f1']
        });
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setSubmittingActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading Client Approval Portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500">{error}</p>
          <p className="text-[11px] text-slate-400">Please contact your social media agency manager for a refreshed link.</p>
        </div>
      </div>
    );
  }

  const approvedCount = posts.filter(p => p.clientApprovalStatus === 'APPROVED').length;
  const pendingCount = posts.filter(p => p.clientApprovalStatus === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pb-20">
      {/* Top Client Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
              {brand?.name?.slice(0, 2).toUpperCase() || 'AW'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-extrabold text-slate-900 truncate">{brand?.name}</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Client Review Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">1-Click Content Approval • Powered by OmniSocial</p>
            </div>
          </div>

          {/* Review Counters */}
          <div className="flex items-center space-x-2 shrink-0 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{pendingCount} Pending</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-700 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{approvedCount} Approved</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-indigo-950 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Review Upcoming Campaigns for Your Brand</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Review captions, visual assets, and timing. Click <strong>"Approve Post"</strong> to lock in publishing, or leave notes for edits.
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-bold text-slate-700">No campaigns queued for review right now.</p>
            <p className="text-xs text-slate-400">Check back soon when your marketing team prepares the next batch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const isApproved = post.clientApprovalStatus === 'APPROVED';
              const isChangesRequested = post.clientApprovalStatus === 'CHANGES_REQUESTED';
              const isSubmitting = submittingActionId === post.id;
              const mediaUrl = post.mediaUrls?.[0];

              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-3xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
                    isApproved
                      ? 'border-emerald-300 ring-2 ring-emerald-100'
                      : isChangesRequested
                      ? 'border-rose-300 ring-2 ring-rose-100'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {post.format || 'POST'}
                        </span>
                        {post.scheduledFor && (
                          <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{new Date(post.scheduledFor).toLocaleDateString()} {new Date(post.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isChangesRequested
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-3 h-3" /> : isChangesRequested ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isApproved ? 'Approved' : isChangesRequested ? 'Revision Requested' : 'Awaiting Review'}</span>
                      </span>
                    </div>

                    {/* Media Preview (If any) */}
                    {mediaUrl && (
                      <div className="aspect-16/10 bg-slate-900 overflow-hidden relative group">
                        {mediaUrl.endsWith('.pdf') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-tr from-sky-800 to-indigo-900 p-6 text-center">
                            <Layers className="w-8 h-8 text-sky-400 mb-2" />
                            <p className="text-xs font-bold">{post.title || 'PDF Carousel Presentation'}</p>
                            <a
                              href={mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 text-[10px] text-sky-300 underline font-bold"
                            >
                              Open Document in New Tab ↗
                            </a>
                          </div>
                        ) : /\.(mp4|mov|webm)$/i.test(mediaUrl) ? (
                          <video src={mediaUrl} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={mediaUrl} alt="Post preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}

                    {/* Post Copy */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-xs font-bold text-slate-900">{post.title}</h3>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans line-clamp-6">
                        {post.caption}
                      </p>
                      {post.hashtags && post.hashtags.length > 0 && (
                        <p className="text-[11px] font-semibold text-indigo-600">
                          {post.hashtags.join(' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Feedback Notes Display (If exists) */}
                  {post.clientFeedback && (
                    <div className="mx-4 mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800 flex items-center space-x-1 mb-1">
                        <MessageSquare className="w-3 h-3 text-indigo-600" />
                        <span>Client Note:</span>
                      </span>
                      <p className="text-slate-600 text-[11px]">{post.clientFeedback}</p>
                    </div>
                  )}

                  {/* Feedback Input Drawer (When requesting changes) */}
                  {activeFeedbackPostId === post.id && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">
                        What changes would you like the agency to make?
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="e.g. Please update the discount percentage or adjust the hook..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveFeedbackPostId(null);
                            setFeedbackText('');
                          }}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(post.id, 'REQUEST_CHANGES', feedbackText)}
                          disabled={!feedbackText.trim() || isSubmitting}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
                        >
                          Submit Change Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFeedbackPostId(post.id);
                        setFeedbackText(post.clientFeedback || '');
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isChangesRequested ? 'Update Notes' : 'Request Changes'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction(post.id, 'APPROVE')}
                      disabled={isSubmitting || isApproved}
                      className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 text-white cursor-default opacity-90'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Approved ✓' : 'Approve Post'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ClientReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading Client Approval Portal...</p>
      </div>
    }>
      <ClientReviewContent />
    </Suspense>
  );
}
