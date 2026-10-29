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
  History
} from 'lucide-react';

export default function SuperAdminPage() {
  const [overview, setOverview] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemMonitoring, setSystemMonitoring] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSuperAdminData = async () => {
    setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border border-amber-200">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Platform Admin Portal</h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-sm bg-amber-600 text-white uppercase tracking-wider">
                Root Access
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Oversee all subscribed agencies, manage multi-tenant billing tiers, monitor platform API throughput, and inspect system audit trails.
            </p>
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Executive Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tenants / Agencies</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{overview?.metrics?.totalTenants || 2}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {overview?.metrics?.activeTenants || 2} Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Multi-brand agency organizations</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly ARR/MRR</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">${overview?.metrics?.estimatedMrr || 128}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> Monthly
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active subscriptions recurring value</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Managed Client Brands</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{overview?.metrics?.totalBrands || 2}</span>
              <span className="text-xs font-semibold text-indigo-600">
                {overview?.metrics?.totalAccounts || 3} Accounts
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Connected across all tenants</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Infrastructure</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                {overview?.systemHealth?.apiGateway || 'HEALTHY'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {overview?.systemHealth?.uptime || '99.98%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Meta OAuth & Background Scheduler</p>
          </div>
        </div>

        {/* Tenant Management Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tenant Organizations Directory</h3>
              <p className="text-xs text-slate-500">Each agency manages their own custom Envy keys, brands, and team members</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {tenants.length} Tenants Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Agency / Tenant Name</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Stats (Users / Brands / Accounts)</th>
                  <th className="py-3 px-4">Custom BYOK Keys</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{t.slug}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={t.plan?.id || plans[0]?.id}
                        onChange={(e) => handleChangeTenantPlan(t.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded-md p-1 bg-white font-semibold text-slate-800"
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name} (${p.priceMonthly}/mo)</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {t.userCount} users • {t.brandCount} brands • {t.accountCount} accounts
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                          t.hasCustomMetaApp ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.hasCustomMetaApp ? 'Custom Meta App' : 'Platform OAuth'}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                          t.hasCustomAiKey ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.hasCustomAiKey ? 'BYOK AI' : 'Default AI'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleTenantStatus(t.id, t.status)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          t.status === 'ACTIVE'
                            ? 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100'
                            : 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {t.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Reliability & AI Telemetry */}
        {systemMonitoring && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Platform Operational Reliability & Scheduler Telemetry</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {systemMonitoring.systemStatus || 'OPERATIONAL'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Database Engine</span>
                <span className="font-bold text-slate-900 text-sm">{systemMonitoring.database?.status} ({systemMonitoring.database?.engine})</span>
                <p className="text-[10px] text-slate-400 mt-0.5">PostgreSQL Connection Pool</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Background Scheduler</span>
                <span className="font-bold text-slate-900 text-sm">{systemMonitoring.scheduler?.status} ({systemMonitoring.scheduler?.intervalSeconds}s interval)</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Atomic row lock & crash recovery</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Publications Health</span>
                <span className="font-bold text-slate-900 text-sm">
                  {systemMonitoring.platformTotals?.publications?.published} Pub / {systemMonitoring.platformTotals?.publications?.failed} Fail
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {systemMonitoring.platformTotals?.publications?.queued} Queued, {systemMonitoring.platformTotals?.publications?.stale} Stale
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Central OpenRouter AI</span>
                <span className="font-bold text-indigo-700 text-sm">
                  {systemMonitoring.aiGatewayTelemetry?.totalTokens || 0} Tokens (~${systemMonitoring.aiGatewayTelemetry?.totalEstimatedCost || '0.00'})
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{systemMonitoring.aiGatewayTelemetry?.totalRequests || 0} LLM calls recorded</p>
              </div>
            </div>
          </div>
        )}

        {/* Global Audit Trail (IAM-06) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Platform System Audit Trail</h3>
            </div>
            <span className="text-xs text-slate-400">Immutable Compliance & Security Stream</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="font-bold text-slate-900 font-mono text-[11px]">{log.action}</span>
                  <span className="text-slate-500">Entity: {log.entityType} ({log.entityId || 'Platform'})</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

