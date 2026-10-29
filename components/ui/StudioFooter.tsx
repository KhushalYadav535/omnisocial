'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';

export function StudioFooter() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden pt-20 pb-12">
      {/* Background Architectural Grid in footer */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">OmniSocial AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Autonomous, multi-tenant social media management suite for digital agencies, creators, and enterprise brands. Single-click Meta OAuth, Unified Engagement Inbox, and human-in-the-loop AI brand voice.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/80 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • Meta Graph v22.0</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#manifesto" className="hover:text-white transition-colors">
                  Manifesto
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Live Playground
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Subscription Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Product & Solutions */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  For Agencies
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  For Creators
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Multi-Tenant RBAC
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  BYOK Custom Keys
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Compliance & Meta Terms
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center">
                  <span>Terms of Service</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-white transition-colors flex items-center">
                  <span>Meta Data Deletion Callback</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-slate-500" />
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Official Meta Graph API Integration Partner. ISO 27001 & SOC2 Ready architecture.
              </li>
            </ul>
          </div>
        </div>

        {/* Big Editorial Watermark */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 OmniSocial AI Inc. Crafted for high-performance creative agencies.</p>
          <div className="flex items-center space-x-6">
            <span>Powered by Next.js & Lenis</span>
            <span>WebGL Three.js Engine</span>
          </div>
        </div>

        {/* Monumental Watermark Text */}
        <div className="mt-8 select-none pointer-events-none opacity-[0.07] text-center">
          <span className="text-5xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white">
            OMNISOCIAL
          </span>
        </div>
      </div>
    </footer>
  );
}
