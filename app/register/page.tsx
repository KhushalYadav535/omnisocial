'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Building2, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { apiRequest, setAuthToken, setStoredUser, setStoredTenant } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planCode, setPlanCode] = useState('AGENCY_PRO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiRequest('/auth/register-tenant', {
        method: 'POST',
        body: JSON.stringify({
          tenantName,
          adminName,
          email,
          password,
          planCode,
        }),
      });

      if (res.token) {
        setAuthToken(res.token);
        setStoredUser(res.user);
        if (res.tenant) setStoredTenant(res.tenant);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Soft Ambient Light Aura */}
      <div
        className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[450px] pointer-events-none select-none opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 30%, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.10), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-black text-2xl tracking-tight text-slate-900">OmniSocial</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">AI</span>
          </div>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Create Agency / Creator Workspace
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Setup your dedicated multi-brand environment with 14 days of Agency Pro included.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-white/90 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-slate-200/90 rounded-3xl">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Plan Selector Radio Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Subscription Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlanCode('CREATOR')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    planCode === 'CREATOR'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Starter Creator</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Up to 5 Brands • 10 Accounts</p>
                  <p className="text-xs font-black text-slate-900 mt-2 font-mono">$29/mo</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanCode('AGENCY_PRO')}
                  className={`p-3.5 rounded-xl border text-left relative transition-all ${
                    planCode === 'AGENCY_PRO'
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-300'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                  <p className="text-xs font-bold text-slate-900">Agency Pro</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">25 Brands • 50 Accounts • BYOK</p>
                  <p className="text-xs font-black text-slate-900 mt-2 font-mono">$99/mo</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Organization / Agency Name
                </label>
                <div className="mt-1 relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    required
                    placeholder="e.g. Apex Digital Media"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Full Name
                </label>
                <div className="mt-1 relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="mt-1 relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@agency.com"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Security Password
                </label>
                <div className="mt-1 relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Creating Workspace...' : 'Launch Free Agency Trial'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an active workspace?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
              Sign In Here
            </Link>
          </div>
        </div>

        {/* Free trial guarantees */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
            14-Day Free Trial
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
            Zero Credit Card Required
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
            Instant Meta OAuth Activation
          </span>
        </div>
      </div>
    </div>
  );
}
