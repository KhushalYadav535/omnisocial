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
  ShieldAlert
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
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-brand engagement overview, incoming interaction stream, and automated scheduler.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/inbox"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-lg shadow-2xs transition-colors"
            >
              <Inbox className="w-4 h-4 text-slate-500" />
              <span>Open Inbox</span>
            </Link>
            <Link
              href="/content-studio"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-lg shadow-2xs transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Create AI Post</span>
            </Link>
          </div>
        </div>

        {/* Safety Alert Banner (SAFE-01) */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            <span>
              <strong>Human-in-the-Loop Active:</strong> All AI-generated suggestions are saved as drafts and require explicit team approval before posting to Meta APIs.
            </span>
          </div>
          <Link href="/inbox" className="font-bold underline text-amber-800 hover:text-amber-950 shrink-0">
            Review Drafts
          </Link>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Interactions</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {data?.analytics?.kpis?.totalInteractions ?? '...'}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18% wk
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Comments & DMs from connected accounts</p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Action</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-600">
                {data?.analytics?.kpis?.needsResponseCount ?? '...'}
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-sm">
                Needs Approval
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Requires human review to send</p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Approval Rate</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {data?.analytics?.kpis?.aiApprovalRate ? `${data.analytics.kpis.aiApprovalRate}%` : '88%'}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High Precision
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Voice-aligned suggestions accepted</p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {data?.analytics?.kpis?.avgResponseMinutes ? `${data.analytics.kpis.avgResponseMinutes}m` : '14m'}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                -42% faster
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Down from 35m baseline</p>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Incoming Interactions Stream */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Engagement Stream</h3>
                <p className="text-xs text-slate-500">Live incoming comments & DMs with AI sentiment classification</p>
              </div>
              <Link href="/inbox" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {data?.recentInteractions?.map((item: any) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start space-x-3.5">
                  <img
                    src={item.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{item.authorName}</span>
                        <span className="text-[11px] text-slate-400">@{item.authorUsername}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm uppercase tracking-wider ${
                          item.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {item.platform} • {item.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                      {item.contentText}
                    </p>

                    <div className="mt-2 flex items-center space-x-2 text-[11px]">
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
                      {item.classification?.isQuestion && (
                        <span className="bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                          Question
                        </span>
                      )}
                      {item.classification?.isLeadIntent && (
                        <span className="bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                          Lead Intent
                        </span>
                      )}
                      <Link
                        href={`/inbox?id=${item.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold ml-auto flex items-center"
                      >
                        <span>Respond with AI</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scheduled Queue & Accounts */}
          <div className="space-y-6">
            {/* Upcoming Publications */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Publishing Queue</h3>
                </div>
                <Link href="/calendar" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Calendar
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {data?.upcomingPosts?.length > 0 ? (
                  data.upcomingPosts.map((post: any) => (
                    <div key={post.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        {post.platform === 'INSTAGRAM' ? 'IG' : 'FB'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{post.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(post.scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded-sm border border-indigo-200">
                          {post.accountName}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">No queued posts. Use AI Studio to schedule.</p>
                )}
              </div>
            </div>

            {/* Connected Accounts Health */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Connected Social Assets</h3>
                </div>
                <Link href="/accounts" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Manage
                </Link>
              </div>

              <div className="mt-4 space-y-2.5">
                {data?.accounts?.map((acc: any) => (
                  <div key={acc.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={acc.profilePicUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop'}
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{acc.accountName}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{acc.platform} • {acc.brandName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
