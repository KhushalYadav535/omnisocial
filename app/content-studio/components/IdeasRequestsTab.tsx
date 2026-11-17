'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  Plus,
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Layers,
  Inbox,
  X,
  FileCheck2,
  Check
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';

interface IdeasRequestsTabProps {
  brandId: string;
  onTurnIntoPost?: (idea: any) => void;
  onRefreshOverview?: () => void;
}

export default function IdeasRequestsTab({
  brandId,
  onTurnIntoPost,
  onRefreshOverview
}: IdeasRequestsTabProps) {
  const [subView, setSubView] = useState<'ideas' | 'requests'>('ideas');

  // Ideas state
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  // Requests state
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [showBrainstormModal, setShowBrainstormModal] = useState(false);
  const [brainstormPillar, setBrainstormPillar] = useState('');
  const [brainstormTopic, setBrainstormTopic] = useState('');
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaHook, setIdeaHook] = useState('');
  const [ideaFormat, setIdeaFormat] = useState('POST');

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqDepartment, setReqDepartment] = useState('Marketing');
  const [reqUrgency, setReqUrgency] = useState('MEDIUM');
  const [reqTargetDate, setReqTargetDate] = useState('');

  const fetchIdeas = async () => {
    if (!brandId) return;
    setIsLoadingIdeas(true);
    try {
      const res = await apiRequest(`/content-studio/ideas?brandId=${brandId}`);
      setIdeas(res.ideas || []);
    } catch (err: any) {
      console.error('Fetch ideas error:', err);
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const fetchRequests = async () => {
    if (!brandId) return;
    setIsLoadingRequests(true);
    try {
      const res = await apiRequest(`/content-studio/requests?brandId=${brandId}`);
      setRequests(res.requests || []);
    } catch (err: any) {
      console.error('Fetch requests error:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (subView === 'ideas') fetchIdeas();
    else fetchRequests();
  }, [brandId, subView]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const handleAiBrainstorm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) return;
    setIsGeneratingIdeas(true);
    setNotification(null);
    try {
      const res = await apiRequest('/content-studio/ideas/ai-generate', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          topic: brainstormTopic.trim() || undefined,
          count: 5
        })
      });
      setIdeas(prev => [...(res.ideas || []), ...prev]);
      setShowBrainstormModal(false);
      setBrainstormTopic('');
      setNotification({ type: 'success', message: '5 high-potential ideas synthesized by AI!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      console.error('Brainstorm error:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to brainstorm ideas.' });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !ideaTitle.trim()) return;
    try {
      const res = await apiRequest('/content-studio/ideas', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          title: ideaTitle.trim(),
          hook: ideaHook.trim(),
          suggestedFormat: ideaFormat
        })
      });
      setIdeas(prev => [res.idea, ...prev]);
      setShowNewIdeaModal(false);
      setIdeaTitle('');
      setIdeaHook('');
      setNotification({ type: 'success', message: 'Idea saved to Idea Bank!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save idea.' });
    }
  };

  const handleTurnIntoPost = async (idea: any) => {
    try {
      await apiRequest(`/content-studio/ideas/${idea.id}/turn-into-post`, { method: 'POST' });
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, status: 'IN_PROGRESS' } : i));
      if (onTurnIntoPost) {
        onTurnIntoPost(idea);
      }
    } catch (err: any) {
      console.error('Turn into post error:', err);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !reqTitle.trim()) return;
    try {
      const res = await apiRequest('/content-studio/requests', {
        method: 'POST',
        body: JSON.stringify({
          brandId,
          title: reqTitle.trim(),
          description: reqDescription.trim(),
          department: reqDepartment,
          urgency: reqUrgency,
          targetDate: reqTargetDate ? new Date(reqTargetDate).toISOString() : null
        })
      });
      setRequests(prev => [res.request, ...prev]);
      setShowNewRequestModal(false);
      setReqTitle('');
      setReqDescription('');
      setNotification({ type: 'success', message: 'Content request submitted!' });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to submit request.' });
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    try {
      const res = await apiRequest(`/content-studio/requests/${requestId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
      setNotification({ type: 'success', message: `Request status updated to ${status}` });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to update request.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SEGMENT SWITCHER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Level 2: Inspiration & Intake
            </span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSubView('ideas')}
                className={`px-3 py-1 rounded-md transition ${subView === 'ideas' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Idea Bank ({ideas.length})
              </button>
              <button
                onClick={() => setSubView('requests')}
                className={`px-3 py-1 rounded-md transition ${subView === 'requests' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Content Requests ({requests.length})
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            {subView === 'ideas' ? 'Idea Bank & Trend Brainstormer' : 'Internal Content Requests'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {subView === 'ideas'
              ? 'Never run out of inspiration. Brainstorm high-retention angles and turn them into posts in 1 click.'
              : 'Collaborate with sales, product, and leadership to capture internal content needs in a unified queue.'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {subView === 'ideas' ? (
            <>
              <button
                type="button"
                onClick={() => setShowBrainstormModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full shadow-md flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Brainstorm 5 Ideas</span>
              </button>
              <button
                type="button"
                onClick={() => setShowNewIdeaModal(true)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Idea</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewRequestModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-full shadow-md flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Content Request</span>
            </button>
          )}
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

      {/* SUB-VIEW A: IDEA BANK */}
      {subView === 'ideas' && (
        <>
          {isLoadingIdeas ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
              <span className="text-xs">Loading idea bank...</span>
            </div>
          ) : ideas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md uppercase">
                        {idea.suggestedFormat || 'POST'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        idea.status === 'NEW' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {idea.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{idea.title}</h3>

                    {idea.hook && (
                      <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg text-xs text-emerald-950 font-medium">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">Hook:</span>
                        "{idea.hook}"
                      </div>
                    )}

                    {idea.pillar && (
                      <span className="inline-block px-2 py-0.5 text-[10px] bg-purple-50 text-purple-700 rounded border border-purple-200">
                        Pillar: {idea.pillar.title}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTurnIntoPost(idea)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-2xs flex items-center space-x-1 cursor-pointer transition"
                    >
                      <span>Turn into Post</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Your Idea Bank is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Use our AI Brainstormer to generate 5 high-converting angles tailored to your brand pillars.
              </p>
              <button
                type="button"
                onClick={() => setShowBrainstormModal(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Brainstorm 5 Ideas</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* SUB-VIEW B: INTERNAL CONTENT REQUESTS */}
      {subView === 'requests' && (
        <>
          {isLoadingRequests ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
              <span className="text-xs">Loading requests...</span>
            </div>
          ) : requests.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Request</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Urgency</th>
                    <th className="p-4">Target Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{req.title}</div>
                        {req.description && <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{req.description}</div>}
                      </td>
                      <td className="p-4 font-medium text-slate-700">{req.department || 'General'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          req.urgency === 'URGENT' ? 'bg-rose-100 text-rose-800' :
                          req.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {req.targetDate ? new Date(req.targetDate).toLocaleDateString() : 'Flexible'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          req.status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {req.status !== 'FULFILLED' && (
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'FULFILLED')}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition"
                          >
                            Mark Fulfilled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Content Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Internal teams can submit requests for product announcements, job openings, or PR updates.
              </p>
              <button
                type="button"
                onClick={() => setShowNewRequestModal(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-full shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit First Request</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* AI BRAINSTORM MODAL */}
      {showBrainstormModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">AI Ideas Brainstormer</h3>
              </div>
              <button onClick={() => setShowBrainstormModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAiBrainstorm} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Focus Topic or Trend (Optional)</label>
                <input
                  type="text"
                  value={brainstormTopic}
                  onChange={(e) => setBrainstormTopic(e.target.value)}
                  placeholder="e.g. AI automation myths, sustainable lifestyle, productivity hacks"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBrainstormModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingIdeas}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition"
                >
                  {isGeneratingIdeas ? 'Brainstorming...' : 'Brainstorm 5 Ideas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL NEW IDEA MODAL */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">New Content Idea</h3>
              <button onClick={() => setShowNewIdeaModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Idea Title *</label>
                <input
                  type="text"
                  required
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="e.g. 3 mistakes junior founders make when scaling"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Hook / Opening Angle</label>
                <textarea
                  value={ideaHook}
                  onChange={(e) => setIdeaHook(e.target.value)}
                  placeholder="Stop doing this if you want to grow..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Suggested Format</label>
                <select
                  value={ideaFormat}
                  onChange={(e) => setIdeaFormat(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  <option value="POST">Single Post</option>
                  <option value="CAROUSEL">Carousel Deck</option>
                  <option value="REEL">Video / Reel</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewIdeaModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!ideaTitle.trim()}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW REQUEST MODAL */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Submit Content Request</h3>
              <button onClick={() => setShowNewRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Request Topic *</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Announce New Product Feature Drop"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Details & Key Points</label>
                <textarea
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  placeholder="What must be included, link to doc or PR..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={reqDepartment}
                    onChange={(e) => setReqDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reqTitle.trim()}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
