'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
  Star,
  Activity,
  Terminal,
} from 'lucide-react';
import { FloatingNavbar } from '../components/ui/FloatingNavbar';
import { FlipWords } from '../components/ui/FlipWords';
import { InteractiveConsole } from '../components/ui/InteractiveConsole';
import { InfiniteMarquee } from '../components/ui/InfiniteMarquee';
import { BentoGridFeatures } from '../components/ui/BentoGridFeatures';
import { ManifestoSection } from '../components/ui/ManifestoSection';
import { ComparisonMatrix } from '../components/ui/ComparisonMatrix';
import { AgencyRoiCalculator } from '../components/ui/AgencyRoiCalculator';
import { LiveWebhookStream } from '../components/ui/LiveWebhookStream';
import { TestimonialsSection } from '../components/ui/TestimonialsSection';
import { PricingSection } from '../components/ui/PricingSection';
import { FaqSection } from '../components/ui/FaqSection';
import { StudioFooter } from '../components/ui/StudioFooter';
import { NumberTicker } from '../components/ui/NumberTicker';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { Facebook, Instagram } from '../components/Icons';

export default function LandingPage() {
  const marqueeItems = [
    { label: 'Meta Graph API v22.0', badge: 'Official Partner' },
    { label: 'Instagram Creator Webhooks', badge: '<300ms' },
    { label: 'OpenAI GPT-4o & Claude 3.5', badge: 'BYOK Supported' },
    { label: 'Sovereign Multi-Tenancy', badge: 'Zero Cross-Query' },
    { label: 'Human-in-the-Loop Guardrails', badge: '100% Safe' },
    { label: 'AES-256 Key Encryption', badge: 'SOC2 Ready' },
    { label: '99.98% System Uptime', badge: 'Enterprise SLA' },
  ];

  return (
    <div className="relative min-h-screen bg-[#fafaf9] text-slate-900 overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-950">
      {/* Floating Island Navigation */}
      <FloatingNavbar />

      {/* HERO SECTION (CLEAN EDITORIAL AWWWARDS LIGHT THEME - STATIC BACKGROUND) */}
      <section className="relative min-h-screen pt-32 pb-20 sm:pt-40 sm:pb-32 flex flex-col justify-center items-center overflow-hidden border-b border-slate-200">
        {/* Soft Static Ambient Light Aura */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[850px] h-[520px] pointer-events-none select-none opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.10), rgba(244, 63, 94, 0.04), transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Architectural Subtle Swiss Grid Overlay (Static) */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none select-none"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        {/* Swiss Blueprint Registration Crosshairs */}
        <div className="absolute top-28 left-8 text-slate-300 font-mono text-xs select-none pointer-events-none hidden lg:block">
          + 24.892° N [ GRID: 01A ]
        </div>
        <div className="absolute top-28 right-8 text-slate-300 font-mono text-xs select-none pointer-events-none hidden lg:block">
          [ LATENCY: 248MS ] +
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Badge Pill with Star Rating */}
          <ScrollReveal direction="down" delay={0.05}>
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-xs backdrop-blur-md mb-8 group hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800">
                4.9/5 RATED BY 340+ AGENCIES
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Meta v22.0
              </span>
            </div>
          </ScrollReveal>

          {/* Monumental Headline with Dynamic FlipWords */}
          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter max-w-5xl leading-[1.08] sm:leading-[1.05]">
              Manage 100+ Brands. <br />
              Autonomous Social AI for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                <FlipWords
                  words={[
                    'Creative Agencies',
                    'Boutique Creators',
                    'Multi-Brand Studios',
                    'E-Commerce Giants',
                  ]}
                />
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              Single-click Meta OAuth connection for Facebook Pages & Instagram Creators. 
              Synchronize comments and direct messages into a unified real-time inbox. 
              Generate brand-voice replies with <strong className="text-slate-900 font-bold">mandatory human approval guardrails</strong>.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="group relative w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Start Free 14-Day Agency Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-7 py-4 text-sm font-bold text-slate-700 bg-white/90 hover:bg-slate-50 border border-slate-300/80 rounded-2xl shadow-xs transition-all flex items-center justify-center space-x-2 backdrop-blur-md"
              >
                <span>Explore Live Console Demo</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </ScrollReveal>

          {/* Micro Trust Matrix */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                1-Click Meta OAuth Handshake
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                BYOK Custom Key Encryption
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                Human-in-the-Loop Signoff
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                Sovereign Multi-Tenancy
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Interactive Console Centerpiece */}
        <div id="demo" className="w-full mt-16 px-4 sm:px-6 lg:px-8 relative z-20">
          <ScrollReveal direction="up" delay={0.25} duration={0.9}>
            <InteractiveConsole />
          </ScrollReveal>
        </div>
      </section>

      {/* INFINITE MARQUEE TICKER TAPE */}
      <InfiniteMarquee items={marqueeItems} speed="normal" />

      {/* LIVE TELEMETRY & WEBHOOK STREAM */}
      <section className="py-12 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <LiveWebhookStream />
          </ScrollReveal>
        </div>
      </section>

      {/* STATS & METRICS DISPLAY */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                <NumberTicker value={4.8} decimals={1} prefix="$" suffix="M+" />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
                Agency Ad Spend Synchronized
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                <NumberTicker value={12.4} decimals={1} suffix="M" />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
                Comments & DMs Triaged
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                <NumberTicker value={99.8} decimals={1} suffix="%" />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
                Human Approval Accuracy Rate
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                <NumberTicker value={280} decimals={0} prefix="<" suffix="ms" />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500">
                Meta Webhook Ingestion Latency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <ManifestoSection />

      {/* COMPARISON MATRIX (OLD WAY VS OMNISOCIAL AI OS) */}
      <ComparisonMatrix />

      {/* BENTO GRID ARCHITECTURE & CAPABILITIES */}
      <BentoGridFeatures />

      {/* INTERACTIVE AGENCY ROI CALCULATOR */}
      <AgencyRoiCalculator />

      {/* TESTIMONIALS / WALL OF PROOF */}
      <TestimonialsSection />

      {/* PRICING MATRIX WITH ANNUAL TOGGLE */}
      <PricingSection />

      {/* FAQ SECTION */}
      <FaqSection />

      {/* BOTTOM CONVERSION HERO */}
      <section className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-16 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
            {/* Background ambient shine */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              SCALE YOUR AGENCY TODAY
            </span>

            <h2 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Ready to automate 100+ brands with complete peace of mind?
            </h2>

            <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
              Join leading marketing agencies, boutique studios, and creators scaling their engagement with OmniSocial AI.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
              >
                Sign In to Console
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              No credit card required • Instant 1-Click Meta OAuth setup • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* MONUMENTAL STUDIO FOOTER */}
      <StudioFooter />
    </div>
  );
}
