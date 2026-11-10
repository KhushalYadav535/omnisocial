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
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Soft Static Ambient Aura */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none select-none opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#111215] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m10 15 5-3-5-3v6Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-extrabold text-2xl tracking-tight text-[#0F1012]">OmniSocial</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">CADRA</span>
          </div>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#0F1012] tracking-tight">
          Sign in to your Workspace
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500">
          Enter organization credentials or launch instant demo access.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] border border-black/[0.06] rounded-[32px]">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-rose-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Pills */}
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                [ 1-CLICK DEMO PERSONAS ]
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Seeded
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('superadmin@socialcore.io')}
                className="w-full text-left p-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900 group-hover:text-black">
                    Super Platform Admin
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">superadmin@socialcore.io</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  ROOT
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('admin@apexdigital.com')}
                className="w-full text-left p-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900 group-hover:text-black">
                    Agency Admin (Apex Digital)
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">admin@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('sarah@apexdigital.com')}
                className="w-full text-left p-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    Content Creator / Reviewer
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">sarah@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                  CREATOR
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-neutral-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs font-medium border border-neutral-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-full shadow-md text-xs font-semibold text-white bg-[#111215] hover:bg-neutral-800 focus:outline-hidden disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Need a new workspace?{' '}
            <Link href="/register" className="font-bold text-neutral-900 hover:underline">
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>

        {/* Security Proof */}
        <div className="mt-8 flex items-center justify-center space-x-6 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            AES-256 Encrypted
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 mr-1.5" />
            Official Meta Partner
          </span>
        </div>
      </div>
    </div>
  );
}
