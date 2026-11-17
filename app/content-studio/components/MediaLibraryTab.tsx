'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Layers,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Link2
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface MediaLibraryTabProps {
  brandId: string;
  onSelectMediaForComposer?: (mediaUrl: string, format: string) => void;
  onRefreshOverview?: () => void;
}

export default function MediaLibraryTab({
  brandId,
  onSelectMediaForComposer,
  onRefreshOverview
}: MediaLibraryTabProps) {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Media Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('IMAGE');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMedia = async () => {
    if (!brandId) return;
    setIsLoading(true);
    try {
      const urlQuery = selectedFormat !== 'ALL'
        ? `/content-studio/media?brandId=${brandId}&format=${selectedFormat}`
        : `/content-studio/media?brandId=${brandId}`;
      const res = await apiRequest(urlQuery);
      setMediaList(res.media || []);
    } catch (err: any) {
      console.error('Fetch media error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [brandId, selectedFormat]);

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !url.trim()) return;
    setIsSubmitting(true);
    try {
      const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await apiRequest('/content-studio/media', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          title: title.trim() || 'Untitled Asset',
          url: url.trim(),
          fileUrl: url.trim(),
          format,
          fileType: format,
          tags: tagsArr
        })
      });

      setMediaList(prev => [res.asset, ...prev]);
      setShowAddModal(false);
      setTitle('');
      setUrl('');
      setTags('');
      setNotification({ type: 'success', message: 'Asset added to Media Library!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to add media asset.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await apiRequest(`/content-studio/media/${mediaId}`, { method: 'DELETE' });
      setMediaList(prev => prev.filter(m => m.id !== mediaId));
      setNotification({ type: 'success', message: 'Asset deleted.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete asset.' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER CAPSULES */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Media Asset Hub
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {mediaList.length} Assets
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Brand Media Library</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of approved photos, AI renders, carousel decks, and video reels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format filter pills */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            {['ALL', 'IMAGE', 'VIDEO', 'CAROUSEL'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFormat(f)}
                className={`px-3 py-1 rounded-md transition ${selectedFormat === f ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset</span>
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

      {/* ASSET GRID */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          <span className="text-xs">Loading media assets...</span>
        </div>
      ) : mediaList.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((asset) => {
            const mediaSrc = asset.url || asset.fileUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
            const mediaFormat = asset.format || asset.fileType || 'IMAGE';
            return (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {mediaFormat === 'VIDEO' ? (
                    <video src={mediaSrc} className="w-full h-full object-cover" controls />
                  ) : (
                    <img
                      src={mediaSrc}
                      alt={asset.title}
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs rounded">
                    {mediaFormat}
                  </span>
                </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{asset.title}</h4>
                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.tags.slice(0, 2).map((t: string, idx: number) => (
                        <span key={idx} className="text-[10px] text-slate-500">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(asset.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {onSelectMediaForComposer && (
                    <button
                      type="button"
                      onClick={() => onSelectMediaForComposer(asset.url, asset.format)}
                      className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition flex items-center space-x-1"
                    >
                      <span>Use in Post</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">Media Library is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Upload images, register hosted media URLs, or generate visuals using the Post Composer.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Asset</span>
          </button>
        </div>
      )}

      {/* ADD ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Media Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMedia} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Asset Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Linen Hero Shot"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Media URL *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="CAROUSEL">Carousel Deck</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="resort, linen, summer"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !url.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition"
                >
                  {isSubmitting ? 'Adding...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
