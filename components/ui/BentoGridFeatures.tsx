'use client';

import React from 'react';
import {
  Sparkles,
  Share2,
  Key,
  ShieldCheck,
  Zap,
  Layers,
  Building2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Calendar,
  MessageSquareCode,
  CheckCircle2,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { ScrollReveal } from './ScrollReveal';
import { Facebook, Instagram } from '../Icons';

export function BentoGridFeatures() {
  return (
    <section id="features" className="relative py-28 md:py-36 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL CAPABILITIES</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Engineered for agencies. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Unmatched precision at scale.
              </span>
            </h2>
          </ScrollReveal>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Every layer of OmniSocial AI is calibrated to eliminate manual friction, prevent AI hallucinations, and give agencies sovereign control over their clients.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: 1-Click Meta OAuth Handshake (7 cols) */}
          <div className="md:col-span-7">
            <ScrollReveal direction="up" delay={0.1}>
              <SpotlightCard className="h-full bg-gradient-to-br from-white via-indigo-50/20 to-white">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    ZERO SCRIPTS REQUIRED
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-black text-slate-900">
                    1-Click Meta Graph OAuth Handshake
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Say goodbye to confusing Meta Developer consoles. Client onboarding takes one click. Our automated backend exchanges ephemeral tokens for 60-day durable tokens and acquires zero-expiry Page tokens instantly.
                  </p>
                </div>

                {/* Visual simulation inside card */}
                <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">API Handshake:</span>
                    <span className="font-bold text-emerald-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      Meta Graph API v22.0 Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 pt-1">
                    <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 flex items-center space-x-2 text-xs font-bold text-blue-900">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook Pages API</span>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs font-bold text-rose-900">
                      <Instagram className="w-4 h-4 text-rose-600" />
                      <span>Instagram Business Graph</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          {/* Bento Card 2: Human-in-the-Loop Sentinel (5 cols) */}
          <div className="md:col-span-5">
            <ScrollReveal direction="up" delay={0.2}>
              <SpotlightCard className="h-full bg-white">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    HALLUCINATION IMMUNE
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-black text-slate-900">
                    Human-in-the-Loop Sentinel
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Zero automated blunders. Every AI suggested reply passes through a mandatory human approval checkpoint. One click to approve, or modify inline before dispatch.
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span>Tone Guardrail Status:</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                      100% Brand Aligned
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-950 font-mono">
                    “Never posts autonomously. Your agency retains absolute sovereign sign-off.”
                  </p>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          {/* Bento Card 3: Multi-Tenancy Boundary (4 cols) */}
          <div className="md:col-span-4">
            <ScrollReveal direction="up" delay={0.15}>
              <SpotlightCard className="h-full bg-white">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Multi-Tenant Sovereign Partition
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Engineered for agency operations. Manage 100+ clients with independent brand profiles, dedicated team RBAC permissions, and total data isolation.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Explore Tenant Architecture</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          {/* Bento Card 4: BYOK Custom Keys (4 cols) */}
          <div className="md:col-span-4">
            <ScrollReveal direction="up" delay={0.25}>
              <SpotlightCard className="h-full bg-white">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/10 text-slate-900 flex items-center justify-center mb-4">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  BYOK Custom Credentials
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bring Your Own Keys. Plug your own Meta App ID/Secret and OpenAI or Anthropic API keys so clients see your custom branding on permission screens.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Read BYOK Protocol</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>

          {/* Bento Card 5: AI Content Studio & Calendar (4 cols) */}
          <div className="md:col-span-4">
            <ScrollReveal direction="up" delay={0.35}>
              <SpotlightCard className="h-full bg-white">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Omnichannel Content Studio
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Generate viral hooks, captions, and hashtags formatted for Instagram Carousels and Facebook Posts with our visual scheduler and automated queue.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Discover Post Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

