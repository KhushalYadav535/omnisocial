'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Share2,
  Check,
  Copy,
  X,
  MessageSquare,
  ArrowRight,
  Loader2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface ApprovalsTabProps {
  brandId: string;
  onRefreshOverview?: () => void;
}

export default function ApprovalsTab({ brandId, onRefreshOverview }: ApprovalsTabProps) {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Magic review link
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Review Feedback modal
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchApprovals = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`/content-studio/approvals?brandId=${brandId}&status=${statusFilter}`);
      setApprovals(res.approvals || []);
    } catch (err: any) {
      console.error('Fetch approvals error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [brandId, statusFilter]);

  const handleReviewAction = async (postId: string, status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED', feedback?: string) => {
    setIsSubmittingReview(true);
    setNotification(null);
    try {
      await apiRequest(`/content-studio/approvals/${postId}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, feedback })
      });

      setApprovals(prev => prev.filter(p => p.id !== postId));
      setSelectedPost(null);
      setFeedbackNote('');
      setNotification({ type: 'success', message: `Post has been marked as ${status}!` });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to update approval status.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleGenerateMagicLink = async () => {
    if (!brandId) return;
    setIsGeneratingLink(true);
    try {
      const res = await apiRequest('/client-review/generate-token', {
        method: 'POST',
        body: JSON.stringify({ brandId, expiresInDays: 7 })
      });

      const token = res.shareToken || res.token || res.reviewToken || (res.reviewUrl ? res.reviewUrl.split('/review/').pop() : '');
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://omnisocial-l5uq.vercel.app';
      const magicLink = res.reviewUrl || `${origin}/review/${token}`;

      setGeneratedLink(magicLink);
      setShowShareModal(true);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 4000);
      try {
        await navigator.clipboard.writeText(magicLink);
      } catch {}
      setNotification({ type: 'success', message: `Client review link ready: ${magicLink}` });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to generate review link.' });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="space-y-6">
      {/* HEADER & CLIENT REVIEW MAGIC LINK */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Governance & Compliance
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {isLoading ? '...' : `${approvals.length} ${approvals.length === 1 ? 'Post' : 'Posts'} in Queue`}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Content Approval Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict human-in-the-loop governance. No post publishes without explicit sign-off from agency lead or client.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            {['PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition ${statusFilter === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerateMagicLink}
            disabled={isGeneratingLink}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : isGeneratingLink ? 'Generating...' : 'Client Review Link'}</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border shadow-2xs ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* APPROVALS LIST */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
          <span className="text-xs">Loading approval queue...</span>
        </div>
      ) : approvals.length > 0 ? (
        <div className="space-y-4">
          {approvals.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start justify-between"
            >
              <div className="flex items-start space-x-4 flex-1">
                {(() => {
                  let imgUrl = '';
                  if (Array.isArray(post.mediaUrls) && post.mediaUrls[0]) {
                    imgUrl = post.mediaUrls[0];
                  } else if (typeof post.mediaUrls === 'string') {
                    try {
                      const parsed = JSON.parse(post.mediaUrls);
                      if (Array.isArray(parsed) && parsed[0]) imgUrl = parsed[0];
                      else if (typeof parsed === 'string') imgUrl = parsed;
                    } catch {
                      if (post.mediaUrls.startsWith('http')) imgUrl = post.mediaUrls;
                    }
                  } else if (post.mediaUrl) {
                    imgUrl = post.mediaUrl;
                  }
                  if (!imgUrl) return null;
                  return (
                    <img
                      src={imgUrl}
                      alt="Preview"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=240&h=240&fit=crop';
                      }}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  );
                })()}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                      {post.type || 'POST'}
                    </span>
                    {post.platforms && (
                      <div className="flex items-center gap-1">
                        {(Array.isArray(post.platforms) ? post.platforms : [post.platforms]).map((pl: string, pIdx: number) => (
                          <span key={pIdx} className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {pl}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.scheduledFor ? (
                      <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Scheduled: {new Date(post.scheduledFor).toLocaleString()}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'} • Dispatched on client approval</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{post.title || 'Untitled Post'}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100 font-sans">
                    {post.caption || post.content || 'No caption text provided.'}
                  </p>

                  {post.clientApprovalNotes && (
                    <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-800">
                      <strong>Client Feedback:</strong> {post.clientApprovalNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons or Badges (Bug 7) */}
              {statusFilter === 'APPROVED' || post.clientApprovalStatus === 'APPROVED' ? (
                <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto">
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await apiRequest(`/content-studio/approvals/${post.id}`, { method: 'DELETE' });
                        fetchApprovals();
                      } catch (err) {
                        console.error('Delete approved card error:', err);
                      }
                    }}
                    className="py-1.5 px-3 text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition cursor-pointer"
                  >
                    Delete / Dismiss
                  </button>
                </div>
              ) : statusFilter === 'REJECTED' || post.clientApprovalStatus === 'REJECTED' ? (
                <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto">
                  <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Rejected</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await apiRequest(`/content-studio/approvals/${post.id}`, { method: 'DELETE' });
                        fetchApprovals();
                      } catch (err) {
                        console.error('Delete rejected approval error:', err);
                      }
                    }}
                    className="py-1.5 px-3 text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition cursor-pointer"
                  >
                    Delete / Dismiss
                  </button>
                </div>
              ) : (
                <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => handleReviewAction(post.id, 'APPROVED')}
                    disabled={isSubmittingReview}
                    className="flex-1 md:w-36 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Post</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(post);
                      setFeedbackNote('');
                    }}
                    disabled={isSubmittingReview}
                    className="flex-1 md:w-36 py-2 px-3 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg shadow-2xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReviewAction(post.id, 'REJECTED')}
                    disabled={isSubmittingReview}
                    className="flex-1 md:w-36 py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-2xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Posts in this Queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Posts requiring review will appear here before being published to connected social networks.
          </p>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Request Changes from Creator</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify what edits are required (e.g. adjust hook, tweak image, change CTA).
            </p>

            <textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="e.g. Please replace the first sentence with a punchier hook and add hashtag #ResortLife..."
              rows={4}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-1 focus:ring-amber-500"
            />

            <div className="pt-4 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReviewAction(selectedPost.id, 'CHANGES_REQUESTED', feedbackNote)}
                disabled={isSubmittingReview || !feedbackNote.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg shadow-md transition"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT REVIEW MAGIC LINK MODAL */}
      {showShareModal && generatedLink && (
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
                onClick={() => setShowShareModal(false)}
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
                  value={generatedLink}
                  className="w-full text-xs font-mono p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 select-all"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(generatedLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    } catch { }
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-full transition cursor-pointer"
              >
                Open Portal ↗
              </a>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition cursor-pointer"
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
