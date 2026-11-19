'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Send,
  AlertCircle,
  Plus
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface DraftsTabProps {
  brandId: string;
  onEditDraft: (draft: any) => void;
  onNavigateTab: (tabId: string) => void;
  onRefreshOverview?: () => void;
}

export default function DraftsTab({
  brandId,
  onEditDraft,
  onNavigateTab,
  onRefreshOverview
}: DraftsTabProps) {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDrafts = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`/content?brandId=${brandId}&status=DRAFT`);
      const contents = res.contents || [];
      // Strictly filter items that are active drafts awaiting submission (not in Approvals or Scheduled)
      const draftList = contents.filter((c: any) => c.status === 'DRAFT' && c.clientApprovalStatus === 'DRAFT');
      setDrafts(draftList);
    } catch (err: any) {
      console.error('Fetch drafts error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [brandId]);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const handleSubmitForApproval = async (draftId: string) => {
    setActionLoadingId(draftId);
    setNotice(null);
    try {
      await apiRequest(`/content/${draftId}/submit-approval`, {
        method: 'POST'
      });
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      setNotice({ type: 'success', text: 'Draft submitted to Approvals Queue for client review!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to submit draft for approval.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    setActionLoadingId(draftId);
    // Optimistically remove from list immediately (no blocking confirm dialog)
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('omnisocial_composer_draft');
        localStorage.removeItem('omnisocial_platform_captions');
        sessionStorage.removeItem('omnisocial_composer_draft');
        sessionStorage.removeItem('omnisocial_platform_captions');
      } catch {}
    }
    try {
      await apiRequest(`/content/${draftId}`, {
        method: 'DELETE'
      });
      setNotice({ type: 'success', text: 'Draft deleted successfully.' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to delete draft.' });
      fetchDrafts();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Creative Workbench
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {isLoading ? '...' : `${drafts.length} ${drafts.length === 1 ? 'Draft' : 'Drafts'} Saved`}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Content Drafts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Work in progress. Drafts stay here until you explicitly submit them to the Approvals Queue or schedule them.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('composer')}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-sm flex items-center space-x-1.5 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Post in Composer</span>
        </button>
      </div>

      {/* NOTIFICATION */}
      {notice && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 border shadow-2xs ${
          notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="font-semibold">{notice.text}</span>
        </div>
      )}

      {/* DRAFTS LIST */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <span className="text-xs">Loading drafts...</span>
        </div>
      ) : drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((draft) => {
            let mediaUrl = '';
            if (Array.isArray(draft.mediaUrls) && draft.mediaUrls[0]) {
              mediaUrl = draft.mediaUrls[0];
            } else if (typeof draft.mediaUrls === 'string') {
              try {
                const parsed = JSON.parse(draft.mediaUrls);
                if (Array.isArray(parsed) && parsed[0]) mediaUrl = parsed[0];
                else if (typeof parsed === 'string') mediaUrl = parsed;
              } catch {
                if (draft.mediaUrls.startsWith('http')) mediaUrl = draft.mediaUrls;
              }
            }

            let tags: string[] = [];
            if (Array.isArray(draft.hashtags)) {
              tags = draft.hashtags;
            } else if (typeof draft.hashtags === 'string') {
              try {
                tags = JSON.parse(draft.hashtags);
              } catch {
                tags = draft.hashtags.split(/\s+/).filter(Boolean);
              }
            }

            return (
              <div
                key={draft.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Format + Updated Time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                      {draft.format || 'POST'} DRAFT
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{new Date(draft.updatedAt || draft.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Body with Media Thumbnail if present */}
                  <div className="flex items-start space-x-3.5">
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt="Draft media"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=240&h=240&fit=crop';
                        }}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 shrink-0">
                        <FileText className="w-6 h-6 mb-1" />
                        <span className="text-[9px] font-semibold text-slate-400">No media</span>
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {draft.title || 'Untitled Draft'}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 whitespace-pre-line font-sans">
                        {draft.caption || 'No caption text written yet.'}
                      </p>
                    </div>
                  </div>

                  {/* Hashtags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                      {tags.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">+{tags.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteDraft(draft.id)}
                    disabled={actionLoadingId === draft.id}
                    title="Delete Draft"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onEditDraft(draft)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit in Composer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubmitForApproval(draft.id)}
                      disabled={actionLoadingId === draft.id}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      {actionLoadingId === draft.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit for Approval</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Drafts in Progress</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Posts saved as draft without scheduling will appear here. You can refine them anytime before submitting for client approval.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('composer')}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            Create Post in Composer
          </button>
        </div>
      )}
    </div>
  );
}
