'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  Plus,
  Key,
  Lock,
  ArrowUpRight,
  TrendingUp,
  History,
  RefreshCw,
  Server,
  Cpu,
  Radio
} from 'lucide-react';

export default function SuperAdminPage() {
  const [overview, setOverview] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemMonitoring, setSystemMonitoring] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSuperAdminData = async () => {
    try {
      const [overviewRes, tenantsRes, plansRes, logsRes, monRes] = await Promise.all([
        apiRequest('/superadmin/overview'),
        apiRequest('/superadmin/tenants'),
        apiRequest('/superadmin/plans'),
        apiRequest('/superadmin/audit-logs'),
        apiRequest('/monitoring/system').catch(() => null)
      ]);

      setOverview(overviewRes);
      setTenants(tenantsRes.tenants || []);
      setPlans(plansRes.plans || []);
      setAuditLogs(logsRes.auditEvents || []);
      setSystemMonitoring(monRes);
    } catch (err: any) {
      console.error('Superadmin data load error:', err);
      setNotice({ type: 'error', text: err.message || 'Failed to load platform data' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSuperAdminData();
  };

  const handleToggleTenantStatus = async (tenantId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await apiRequest(`/superadmin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setNotice({ type: 'success', text: `Tenant status updated to ${newStatus}.` });
      fetchSuperAdminData();
    } catch (err: any) {
      setNotice({ type: 'error', text: `Update failed: ${err.message}` });
    }
  };

  const handleChangeTenantPlan = async (tenantId: string, newPlanId: string) => {
    try {
      await apiRequest(`/superadmin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ subscriptionPlanId: newPlanId })
      });
      setNotice({ type: 'success', text: `Tenant subscription plan updated.` });
      fetchSuperAdminData();
    } catch (err: any) {
      setNotice({ type: 'error', text: `Plan change failed: ${err.message}` });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
        {/* Cadra Breadcrumb & Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-400">
              <span>Platform Root</span>
              <span>•</span>
              <span>Governance</span>
              <span>•</span>
              <span className="text-slate-800 font-semibold">Super Admin</span>
            </div>
            <div className="flex items-center space-x-3 mt-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                <ShieldCheck className="w-7 h-7 text-amber-500" />
                <span>Global Governance</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Root Authority
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-tenant agency control plane, SaaS billing tiers, platform API throughput, and infrastructure telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 border border-black/[0.08] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh Telemetry'}</span>
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#0A0D12] text-white shadow-xs">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Gateway Live</span>
            </div>
          </div>
        </div>

        {notice && (
          <div className={`p-4 rounded-[20px] border text-xs flex items-center justify-between shadow-2xs transition-all ${
            notice.type === 'success' 
              ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900' 
              : 'bg-rose-50/80 border-rose-200/90 text-rose-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{notice.text}</span>
            </div>
            <button 
              onClick={() => setNotice(null)}
              className="text-slate-400 hover:text-slate-600 font-bold px-2 py-0.5"
            >
              ×
            </button>
          </div>
        )}

        {/* 4 Cadra-Style Bento Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Jet Black Hero Card - ARR / MRR */}
          <div className="bg-[#0A0D12] text-white p-5 rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide">Platform MRR</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +14.2%
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight mt-3">
                ${overview?.metrics?.estimatedMrr ? overview.metrics.estimatedMrr.toLocaleString() : '128'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From {overview?.metrics?.activeTenants || 2} active agency subscriptions
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-indigo-500/0 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Card 2: Ice Blue Accent Card - Total Agencies */}
          <div className="bg-[#EBF2FE] text-slate-900 p-5 rounded-[28px] border border-blue-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">Total Agencies</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
                {overview?.metrics?.totalTenants || 2}
              </div>
              <p className="text-[11px] text-blue-700/80 font-medium mt-1">
                {overview?.metrics?.activeTenants || 2} Active in good standing
              </p>
            </div>
          </div>

          {/* Card 3: White Luxury Bento Card - Managed Brands */}
          <div className="bg-white p-5 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Managed Brands</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {overview?.metrics?.totalAccounts || 3} Accounts
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
                {overview?.metrics?.totalBrands || 2}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Connected across multi-brand agency workspaces
              </p>
            </div>
          </div>

          {/* Card 4: White Luxury Bento Card - Infrastructure Health */}
          <div className="bg-white p-5 rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">System Gateway</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {overview?.systemHealth?.uptime || '99.98%'} SLA
              </span>
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 mt-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{overview?.systemHealth?.apiGateway || 'OPERATIONAL'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Meta Graph API & BullMQ Background Scheduler
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Organizations Directory Table */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-black/[0.05] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Agency Organizations Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Isolated multi-tenant boundaries with sovereign BYOK keys and team access</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {tenants.length} Agencies Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] border-b border-black/[0.05] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Agency / Workspace</th>
                  <th className="py-3.5 px-6">SaaS Plan</th>
                  <th className="py-3.5 px-6">Scale (Users / Brands / Accounts)</th>
                  <th className="py-3.5 px-6">Security & BYOK</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {tenants.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#0A0D12] text-white flex items-center justify-center font-black text-xs">
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-[13px]">{t.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={t.plan?.id || plans[0]?.id}
                        onChange={(e) => handleChangeTenantPlan(t.id, e.target.value)}
                        className="text-xs font-bold border border-black/[0.08] rounded-xl px-3 py-1.5 bg-white text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-black/10 cursor-pointer"
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (${p.priceMonthly}/mo)</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{t.userCount}</span> users
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-900">{t.brandCount}</span> brands
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-900">{t.accountCount}</span> channels
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.hasCustomMetaApp 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.hasCustomMetaApp ? 'Custom Meta App' : 'Platform OAuth'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.hasCustomAiKey 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.hasCustomAiKey ? 'BYOK AI' : 'Default AI'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                        t.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleTenantStatus(t.id, t.status)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                          t.status === 'ACTIVE'
                            ? 'text-rose-700 border-rose-200 bg-rose-50/50 hover:bg-rose-100'
                            : 'text-emerald-700 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100'
                        }`}
                      >
                        {t.status === 'ACTIVE' ? 'Suspend Agency' : 'Reactivate Agency'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Reliability & Scheduler Telemetry */}
        {systemMonitoring && (
          <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Platform Operational Reliability & Scheduler Telemetry</h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {systemMonitoring.systemStatus || 'ALL SYSTEMS OPTIMAL'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FAFBFD] rounded-[20px] border border-black/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Database Engine</span>
                <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                  {systemMonitoring.database?.status} ({systemMonitoring.database?.engine || 'PostgreSQL'})
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Prisma Connection Pool & Auto-reconnect</p>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-[20px] border border-black/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Background Scheduler</span>
                <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                  {systemMonitoring.scheduler?.status} ({systemMonitoring.scheduler?.intervalSeconds || 30}s tick)
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Atomic row lock & crash recovery daemon</p>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-[20px] border border-black/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Publication Queue</span>
                <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                  {systemMonitoring.platformTotals?.publications?.published || 0} Pub / {systemMonitoring.platformTotals?.publications?.failed || 0} Fail
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {systemMonitoring.platformTotals?.publications?.queued || 0} Queued, {systemMonitoring.platformTotals?.publications?.stale || 0} Stale
                </p>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-[20px] border border-black/[0.04]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Central OpenRouter AI</span>
                <span className="font-extrabold text-indigo-700 text-sm mt-1 block">
                  {systemMonitoring.aiGatewayTelemetry?.totalTokens || 0} Tokens (~${systemMonitoring.aiGatewayTelemetry?.totalEstimatedCost || '0.00'})
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{systemMonitoring.aiGatewayTelemetry?.totalRequests || 0} LLM copilot requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Global Security Audit Trail */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <div className="flex items-center space-x-2.5">
              <History className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Platform System Audit Trail</h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Immutable Compliance & Security Stream</span>
          </div>

          <div className="divide-y divide-black/[0.04] max-h-80 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No audit events recorded yet.</div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="font-extrabold text-slate-900 font-mono text-[11px]">{log.action}</span>
                    <span className="text-slate-500">Entity: {log.entityType} ({log.entityId || 'Platform'})</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
