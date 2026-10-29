'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
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
          password: loginPassword
        })
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">OmniSocial AI</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
          Sign in to your Workspace
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your organization credentials or click a demo account below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Pills */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Instant 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('superadmin@socialcore.io')}
                className="w-full text-left p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-amber-900">Super Platform Admin</p>
                  <p className="text-[11px] text-amber-700 font-mono">superadmin@socialcore.io</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-amber-200 text-amber-900">
                  Full Root
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('admin@apexdigital.com')}
                className="w-full text-left p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-indigo-900">Agency Admin (Apex Digital)</p>
                  <p className="text-[11px] text-indigo-700 font-mono">admin@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-indigo-200 text-indigo-900">
                  Agency Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('sarah@apexdigital.com')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">Team Member / Content Creator</p>
                  <p className="text-[11px] text-slate-500 font-mono">sarah@apexdigital.com</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-200 text-slate-800">
                  Team Member
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Work Email
              </label>
              <div className="mt-1 relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            New agency or creator?{' '}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

