'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6 text-neutral-900 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#111215] text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8 text-neutral-300" />
        </div>
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
            404 • Destination Not Found
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-950 mt-3 tracking-tight">
            Page does not exist
          </h1>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            The page you requested may have moved or is not part of your active workspace permissions.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#111215] hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            href="/content-studio"
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full transition-all flex items-center justify-center cursor-pointer"
          >
            Open Content Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
