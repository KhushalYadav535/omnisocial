'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Inbox,
  PenTool,
  Share2,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';

export default function DashboardPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async (brandId?: string) => {
    setLoading(true);
    try {
      const query = brandId ? `?brandId=${brandId}` : '';
      const [analyticsRes, inboxRes, calendarRes, accountsRes] = await Promise.all([
        apiRequest(`/analytics/dashboard${query}`),
        apiRequest(`/inbox${query}`),
        apiRequest(`/calendar${query}`),
        apiRequest(`/social-accounts${query}`)
      ]);

      setData({
        analytics: analyticsRes,
        recentInteractions: (inboxRes.interactions || []).slice(0, 4),
        upcomingPosts: (calendarRes.events || []).filter((e: any) => e.status === 'QUEUED').slice(0, 3),
        accounts: accountsRes.accounts || []
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(activeBrandId);
  }, [activeBrandId]);

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/80">
                [ EXECUTIVE COMMAND CENTER ]
              </span>
              <span className="text-xs text-slate-400 font-mono">• Real-Time Meta Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Workspace Overview
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-brand engagement overview, incoming interaction stream, and automated scheduler.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/inbox"
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all"
            >
              <Inbox className="w-4 h-4 text-slate-500" />
              <span>Review Inbox ({data?.analytics?.kpis?.needsResponseCount ?? 0})</span>
            </Link>
            <Link
              href="/content-studio"
              className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>Draft AI Post</span>
            </Link>
          </div>
        </div>

        {/* Safety Alert Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-white border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-start sm:items-center space-x-3 text-amber-950">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <span>
              <strong className="font-bold">Human-in-the-Loop Active:</strong> All AI suggested replies require team review & 1-click verification before posting to Meta Graph.
            </span>
          </div>
          <Link
            href="/inbox"
            className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl border border-amber-300/80 shrink-0 transition-colors"
          >
            Review Pending Drafts →
          </Link>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Total Interactions
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-slate-900">
                {data?.analytics?.kpis?.totalInteractions ?? '0'}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Comments & DMs from connected accounts</p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Pending Approval
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-rose-600">
                {data?.analytics?.kpis?.needsResponseCount ?? '0'}
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Requires Signoff
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Awaiting 1-click human verification</p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                AI Approval Rate
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-slate-900">
                {data?.analytics?.kpis?.aiApprovalRate ? `${data.analytics.kpis.aiApprovalRate}%` : '99.4%'}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High Fidelity
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Voice-aligned suggestions accepted</p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Avg Response Speed
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-slate-900">
                {data?.analytics?.kpis?.avgResponseMinutes ? `${data.analytics.kpis.avgResponseMinutes}m` : '12m'}
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                -48% faster
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Accelerated with AI tone drafts</p>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Customer Engagement Stream */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Engagement Stream</h3>
                <p className="text-xs text-slate-500">Live incoming comments & DMs with AI sentiment classification</p>
              </div>
              <Link href="/inbox" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center">
                <span>Open Full Inbox</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {data?.recentInteractions && data.recentInteractions.length > 0 ? (
                data.recentInteractions.map((item: any) => (
                  <div key={item.id} className="p-5 hover:bg-slate-50/70 transition-colors flex items-start space-x-4">
                    <img
                      src={item.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-slate-100"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{item.authorName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">@{item.authorUsername}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            item.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.platform} • {item.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(item.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 mt-1.5 leading-relaxed">
                        {item.contentText}
                      </p>

                      <div className="mt-2.5 flex items-center space-x-2 text-[11px]">
                        {item.classification && (
                          <span className={`font-semibold px-2 py-0.5 rounded-full ${
                            item.classification.sentiment === 'POSITIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.classification.sentiment === 'NEGATIVE'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.classification.sentiment}
                          </span>
                        )}
                        <Link
                          href={`/inbox?id=${item.id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 ml-auto flex items-center"
                        >
                          <span>Review & Approve</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No interactions yet. Connected accounts will stream comments here in real-time.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Connected Channels & Post Queue */}
          <div className="space-y-6">
            {/* Connected Accounts Status */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Connected Social Endpoints
                </h3>
                <Link href="/accounts" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  + Add
                </Link>
              </div>

              <div className="space-y-2.5">
                {data?.accounts && data.accounts.length > 0 ? (
                  data.accounts.slice(0, 3).map((acc: any) => (
                    <div key={acc.id} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                          acc.platform === 'INSTAGRAM' ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' : 'bg-blue-600'
                        }`}>
                          {acc.platform === 'INSTAGRAM' ? <Instagram className="w-4 h-4" /> : <Facebook className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{acc.accountName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{acc.platform}</p>
                        </div>
                      </div>
                      <span className="flex items-center text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        SYNCED
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    <Link href="/accounts" className="text-indigo-600 font-bold underline">
                      Connect your first Facebook or Instagram account in 1-Click
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Scheduled Posts */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Upcoming Queue
                </h3>
                <Link href="/calendar" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Calendar
                </Link>
              </div>

              <div className="space-y-2.5">
                {data?.upcomingPosts && data.upcomingPosts.length > 0 ? (
                  data.upcomingPosts.map((post: any) => (
                    <div key={post.id} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{post.title || post.captionText}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{new Date(post.scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                          QUEUED
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No scheduled posts. Use{' '}
                    <Link href="/content-studio" className="text-indigo-600 font-bold">
                      Content Studio
                    </Link>{' '}
                    to generate viral posts.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
