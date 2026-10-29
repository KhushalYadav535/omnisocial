'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setErrorMessage(errorDescription || error || 'OAuth authorization was cancelled or denied');
      if (window.opener) {
        window.opener.postMessage({
          type: 'META_OAUTH_ERROR',
          error: errorDescription || error
        }, window.location.origin);
        setTimeout(() => window.close(), 2500);
      }
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMessage('Missing authorization code or state parameter from Meta callback');
      return;
    }

    // If opened in popup, post message to parent window
    if (window.opener) {
      setStatus('success');
      window.opener.postMessage({
        type: 'META_OAUTH_SUCCESS',
        code,
        state
      }, window.location.origin);

      setTimeout(() => {
        window.close();
      }, 1200);
    } else {
      // Direct full-page redirect flow
      sessionStorage.setItem('meta_oauth_pending', JSON.stringify({ code, state }));
      setStatus('success');
      setTimeout(() => {
        router.push('/accounts?fromOAuth=true');
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Connecting to Meta...</h2>
            <p className="text-sm text-slate-500">Exchanging credentials and verifying permissions with Facebook & Instagram.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Meta Account Verified!</h2>
            <p className="text-sm text-slate-500 mb-4">Returning to Social Accounts dashboard to discover your Facebook Pages and Instagram accounts...</p>
            <p className="text-xs text-slate-400">This window will close automatically.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Failed</h2>
            <p className="text-sm text-rose-600 mb-6 bg-rose-50 p-3 rounded-lg border border-rose-100">{errorMessage}</p>
            <button
              onClick={() => router.push('/accounts')}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
            >
              Return to Accounts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MetaCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

