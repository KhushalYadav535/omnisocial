'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2, Key } from 'lucide-react';
import { apiRequest, setAuthToken, setStoredUser, setStoredTenant } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (res.token) {
        setAuthToken(res.token);
        setStoredUser(res.user);
        if (res.tenant) setStoredTenant(res.tenant);

        if (res.user.role === 'SUPER_ADMIN') {
          router.push('/superadmin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Password123!');
    handleLogin(undefined, userEmail, 'Password123!');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Soft Static Aura */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none select-none opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.10), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-black text-2xl tracking-tight text-slate-900">OmniSocial</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">AI</span>
          </div>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign in to your Workspace
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Enter organization credentials or launch instant demo access.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/90 backdrop-blur-2xl py-8 px-5 sm:px-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-slate-200/90 rounded-3xl">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Pills */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                [ 1-CLICK DEMO PERSONAS ]
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Seeded
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('superadmin@socialcore.io')}
                className="w-full text-left p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-amber-950 group-hover:text-amber-900">
                    Super Platform Admin
                  </p>
                  <p className="text-[11px] text-amber-700/80 font-mono">superadmin@socialcore.io</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900">
                  ROOT
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('admin@apexdigital.com')}
                className="w-full text-left p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-indigo-950 group-hover:text-indigo-900">
                    Agency Admin (Apex Digital)
                  </p>
                  <p className="text-[11px] text-indigo-700/80 font-mono">admin@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-200/80 text-indigo-900">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('sarah@apexdigital.com')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Content Creator / Reviewer
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">sarah@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  CREATOR
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Work Email
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
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
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
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-slate-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need a new workspace?{' '}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>

        {/* Security Proof */}
        <div className="mt-8 flex items-center justify-center space-x-6 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            AES-256 Encrypted
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
            Official Meta Partner
          </span>
        </div>
      </div>
    </div>
  );
}
