'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [platform, setPlatform] = useState<'LINKEDIN' | 'META'>('META');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Detect whether this callback originated from LinkedIn or Meta
    let isLinkedIn = false;
    if (state) {
      try {
        const b64 = state.split('.')[0];
        const json = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(json);
        if (payload.platform === 'LINKEDIN') {
          isLinkedIn = true;
          setPlatform('LINKEDIN');
        }
      } catch {
        // keep default
      }
    }

    if (error) {
      setStatus('error');
      setErrorMessage(errorDescription || error || 'OAuth authorization was cancelled or denied');
      if (window.opener) {
        window.opener.postMessage({
          type: isLinkedIn ? 'LINKEDIN_OAUTH_ERROR' : 'META_OAUTH_ERROR',
          error: errorDescription || error
        }, window.location.origin);
        setTimeout(() => window.close(), 2500);
      }
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMessage(`Missing authorization code or state parameter from ${isLinkedIn ? 'LinkedIn' : 'Meta'} callback`);
      return;
    }

    // If opened in popup, post message to parent window
    if (window.opener) {
      setStatus('success');
      if (isLinkedIn) {
        window.opener.postMessage({
          type: 'LINKEDIN_OAUTH_SUCCESS',
          code,
          state
        }, '*');
      } else {
        window.opener.postMessage({
          type: 'META_OAUTH_SUCCESS',
          code,
          state
        }, '*');
      }

      setTimeout(() => {
        window.close();
      }, 1200);
    } else {
      // Direct full-page redirect flow
      if (isLinkedIn) {
        sessionStorage.setItem('linkedin_oauth_pending', JSON.stringify({ code, state }));
      } else {
        sessionStorage.setItem('meta_oauth_pending', JSON.stringify({ code, state }));
      }
      setStatus('success');
      setTimeout(() => {
        router.push('/accounts?fromOAuth=true');
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/[0.06] p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className={`w-10 h-10 animate-spin mb-4 ${platform === 'LINKEDIN' ? 'text-[#0A66C2]' : 'text-indigo-600'}`} />
            <h2 className="text-lg font-extrabold text-slate-900 mb-1.5">
              {platform === 'LINKEDIN' ? 'Connecting to LinkedIn...' : 'Connecting to Meta Graph...'}
            </h2>
            <p className="text-xs text-slate-500">
              {platform === 'LINKEDIN'
                ? 'Exchanging credentials and verifying permissions with LinkedIn OpenID Connect & Posts API.'
                : 'Exchanging credentials and verifying permissions with Facebook & Instagram.'}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1.5">
              {platform === 'LINKEDIN' ? 'LinkedIn Account Verified!' : 'Meta Account Verified!'}
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              {platform === 'LINKEDIN'
                ? 'Returning to Social Accounts dashboard with your connected LinkedIn profile...'
                : 'Returning to Social Accounts dashboard to discover your Facebook Pages and Instagram accounts...'}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">This window will close automatically.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1.5">Connection Failed</h2>
            <p className="text-xs text-rose-600 mb-5 bg-rose-50/80 p-3 rounded-2xl border border-rose-100">{errorMessage}</p>
            <button
              onClick={() => router.push('/accounts')}
              className="px-5 py-2.5 bg-[#0A0D12] text-white rounded-full text-xs font-bold hover:bg-neutral-800 transition cursor-pointer shadow-sm"
            >
              Return to Accounts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center text-xs text-slate-400">Processing OAuth token...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
