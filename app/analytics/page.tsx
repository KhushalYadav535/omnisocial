'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest, API_BASE, getAuthToken } from '../../lib/api';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  Share2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  Info,
  ExternalLink,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';

export default function AnalyticsPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'FACEBOOK' | 'INSTAGRAM'>('ALL');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const days = Number(dateRange);
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const end = new Date().toISOString();

      let query = `?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
      if (activeBrandId) query += `&brandId=${activeBrandId}`;
      if (platformFilter !== 'ALL') query += `&platform=${platformFilter}`;

      const res = await apiRequest(`/analytics/dashboard${query}`);
      setData(res);
    } catch (err: any) {
      console.error('Analytics load error:', err);
      setNotice({ type: 'error', text: err.message || 'Failed to load analytics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeBrandId, dateRange, platformFilter]);

  const handleExportCSV = async () => {
    setExporting(true);
    setNotice(null);
    try {
      const token = getAuthToken() || '';
      const days = Number(dateRange);
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const end = new Date().toISOString();

      let query = `?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`;
      if (activeBrandId) query += `&brandId=${activeBrandId}`;
      if (platformFilter !== 'ALL') query += `&platform=${platformFilter}`;

      const res = await fetch(`${API_BASE}/analytics/export${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'CSV export failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setNotice({ type: 'success', text: 'CSV report downloaded successfully.' });
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Export failed' });
    } finally {
      setExporting(false);
    }
  };

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDownloadClientReportPdf = async () => {
    if (!activeBrandId) {
      setNotice({ type: 'error', text: 'Please select an active brand first.' });
      return;
    }
    setGeneratingPdf(true);
    setNotice(null);
    try {
      const res = await apiRequest(`/analytics/client-report-pdf?brandId=${activeBrandId}&period=month`);
      if (res.report?.pdfUrl) {
        window.open(res.report.pdfUrl, '_blank');
        setNotice({ type: 'success', text: 'Executive Client Report PDF generated and opened!' });
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Failed to generate Client Report PDF' });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6 pb-12">
        {/* CADRA SUB-HEADER: BREADCRUMBS, TITLE & FILTER CAPSULES */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 pt-1">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
              <span className="hover:text-neutral-700 cursor-pointer">OmniSocial</span>
              <span>›</span>
              <span className="hover:text-neutral-700 cursor-pointer">Intelligence</span>
              <span>›</span>
              <span className="text-neutral-900 font-semibold">Telemetry & Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F1012] tracking-tight mt-1 flex items-center space-x-2">
              <span>Performance Analytics & Reports</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live multi-channel telemetry computed genuinely from database records and verified Meta Graph API endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Capsule Selector */}
            <div className="flex items-center bg-[#E5E7EB] p-1 rounded-full border border-black/[0.04] text-xs font-semibold text-neutral-600">
              <button
                onClick={() => setDateRange('7')}
                className={`px-3.5 py-1 rounded-full transition-all ${dateRange === '7' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'}`}
              >
                Last 7D
              </button>
              <button
                onClick={() => setDateRange('30')}
                className={`px-3.5 py-1 rounded-full transition-all ${dateRange === '30' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'}`}
              >
                Last 30D
              </button>
              <button
                onClick={() => setDateRange('90')}
                className={`px-3.5 py-1 rounded-full transition-all ${dateRange === '90' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'}`}
              >
                Last 90D
              </button>
            </div>

            {/* Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-black/[0.07] rounded-full px-4 py-2 text-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <option value="ALL">All Platforms</option>
              <option value="FACEBOOK">Facebook Only</option>
              <option value="INSTAGRAM">Instagram Only</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={exporting || loading}
              className="text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-black/[0.07] px-4 py-2 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            {/* Feature 3B: Executive Client Report PDF */}
            <button
              onClick={handleDownloadClientReportPdf}
              disabled={generatingPdf || !activeBrandId}
              className="text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:opacity-95 px-4 py-2 rounded-full shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generatingPdf ? 'animate-spin' : ''}`} />
              <span>{generatingPdf ? 'Compiling AI Report...' : 'Client Report (PDF)'}</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center space-x-2 ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Top Metric Cards in Cadra Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Published Posts */}
          <div className="bg-white p-6 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Published</span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{data?.kpis?.totalPublishedPosts || 0}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Confirmed successful Meta publications</p>
          </div>

          {/* Publishing Queue & Failures */}
          <div className="bg-white p-6 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Queue & Failures</span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{data?.kpis?.totalQueuedPosts || 0}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                (data?.kpis?.totalFailedPosts || 0) > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {data?.kpis?.totalFailedPosts || 0} Failed
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Scheduled for background pickup</p>
          </div>

          {/* Total Volume */}
          <div className="bg-white p-6 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Interactions</span>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{data?.kpis?.totalInteractions || 0}</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                {data?.kpis?.needsResponseCount || 0} Pending
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Comments and Direct Messages</p>
          </div>

          {/* Engagement Rate */}
          <div className="bg-white p-6 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Engagement Rate</span>
              <span title={data?.kpis?.engagementRateFormula || 'Interactions / Published'} className="cursor-help text-neutral-400 hover:text-neutral-600">
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="my-2 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">{data?.kpis?.engagementRate || 0}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Per Post
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1 truncate">{data?.kpis?.engagementRateFormula}</p>
          </div>
        </div>

        {/* Meta Graph API Live Insights Status Card */}
        <div className="p-5 rounded-[28px] border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              data?.metaInsights?.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-neutral-900">Meta Graph API Insights Status</h4>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  data?.metaInsights?.status === 'AVAILABLE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {data?.metaInsights?.status || 'UNAVAILABLE'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {data?.metaInsights?.status === 'AVAILABLE'
                  ? `External Reach: ${data?.metaInsights?.reach || 0} | Impressions: ${data?.metaInsights?.impressions || 0}`
                  : (data?.metaInsights?.reason || 'Live reach & impression telemetry requires Meta App Review approval for read_insights.')}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 shrink-0">
            Graph Version: <span className="font-bold text-neutral-900">v26.0</span>
          </div>
        </div>

        {/* 2-Column Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Sentiment Breakdown */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Brand Sentiment Health</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                AI Classified
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="w-full h-4 rounded-full bg-neutral-100 flex overflow-hidden">
                <div style={{ width: `${data?.sentimentStats?.positive || 0}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${data?.sentimentStats?.neutral || 0}%` }} className="bg-neutral-400 h-full"></div>
                <div style={{ width: `${data?.sentimentStats?.negative || 0}%` }} className="bg-rose-500 h-full"></div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-emerald-800">Positive</span>
                  <p className="text-2xl font-extrabold text-emerald-950 mt-1">{data?.sentimentStats?.positive || 0}%</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">Praise & high intent</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <span className="text-xs font-semibold text-neutral-700">Neutral</span>
                  <p className="text-2xl font-extrabold text-neutral-900 mt-1">{data?.sentimentStats?.neutral || 0}%</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Inquiries & sizing</p>
                </div>
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100">
                  <span className="text-xs font-semibold text-rose-800">Critical</span>
                  <p className="text-2xl font-extrabold text-rose-950 mt-1">{data?.sentimentStats?.negative || 0}%</p>
                  <p className="text-[10px] text-rose-700 mt-0.5">Escalations & queries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Trends Bar Chart (Real PostgreSQL Aggregation) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Daily Inflow & Publishing Trends</h3>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5"></span> Interactions</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Published</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-end justify-between h-36 pt-6 border-b border-slate-100">
                {(data?.dailyTrends || []).map((t: any, idx: number) => {
                  const dayName = new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1 px-1">
                      <div className="w-full flex items-end justify-center space-x-1 h-24">
                        <div
                          title={`${t.interactions} interactions`}
                          style={{ height: `${Math.max(4, Math.min(90, t.interactions * 8))}px` }}
                          className="w-3 bg-indigo-500 hover:bg-indigo-600 rounded-t-xs transition-all"
                        ></div>
                        <div
                          title={`${t.publications} publications`}
                          style={{ height: `${Math.max(4, Math.min(90, t.publications * 15))}px` }}
                          className="w-3 bg-emerald-500 hover:bg-emerald-600 rounded-t-xs transition-all"
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{dayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Best Performing Content Table */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent & Top Published Content</h3>
              <p className="text-xs text-slate-500">Live verified posts published to Meta channels.</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Showing {(data?.bestPerformingPosts || []).length} post(s)
            </span>
          </div>

          {(data?.bestPerformingPosts || []).length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">No published content found for this date range.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.bestPerformingPosts || []).map((post: any) => (
                <div key={post.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      post.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {post.platform === 'INSTAGRAM' ? <Instagram className="w-4 h-4" /> : <Facebook className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{post.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{post.caption}</p>
                      <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                        <span>Published: {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'N/A'}</span>
                        <span>• {post.accountName}</span>
                      </div>
                    </div>
                  </div>

                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
