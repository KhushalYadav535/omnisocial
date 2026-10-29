'use client';

import React from 'react';
import { X, Check, ShieldAlert, Zap, ArrowRight, Layers } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { ScrollReveal } from './ScrollReveal';

export function ComparisonMatrix() {
  const comparisons = [
    {
      feature: 'Meta Page & Instagram Authorization',
      legacy: 'Confusing Facebook Developer App creation, Manual Graph tokens & error 190 token invalidations',
      omni: '1-Click Official Meta OAuth Handshake with automated 60-day Long-Lived Token extension',
      highlight: true,
    },
    {
      feature: 'AI Community Engagement & Replies',
      legacy: 'Uncontrolled generic chatbots hallucinating false answers or zero AI assistance',
      omni: 'Human-in-the-Loop Sentinel: Tone-guided drafts requiring 1-click human verification',
      highlight: true,
    },
    {
      feature: 'Agency Multi-Tenancy Architecture',
      legacy: 'Solo-user architecture; separate bill for every client; logins mixed up in Chrome profiles',
      omni: 'Strict Sovereign Tenant boundaries with RBAC seats, client brand isolation, and zero cross-query',
      highlight: false,
    },
    {
      feature: 'API Credentials & Privacy (BYOK)',
      legacy: 'Vendor lock-in; proprietary AI models; your client sees the software company branding',
      omni: 'Full Bring-Your-Own-Keys (BYOK) for Meta Apps & OpenAI/Claude. White-labeled agency experience',
      highlight: true,
    },
    {
      feature: 'Live Webhook Sync Speed',
      legacy: '5 to 15 minute polling delays; missed viral comments during flash campaigns',
      omni: '< 280ms direct Meta Graph webhook ingestion into real-time serverless queue',
      highlight: false,
    },
  ];

  return (
    <section className="relative py-28 md:py-36 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>[ 05 // SYSTEM COMPARISON ]</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Why leading agencies are retiring <br />
              <span className="bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                legacy social media suites.
              </span>
            </h2>
          </ScrollReveal>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A architectural breakdown between 2012-era social suites and the modern OmniSocial AI operating system.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100/80 border-b border-slate-200/90 p-4 sm:p-6 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                <div className="md:col-span-4 text-slate-500">Capability Dimension</div>
                <div className="md:col-span-4 text-rose-800 flex items-center space-x-1.5 mt-2 md:mt-0">
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Legacy Platforms (Hootsuite / Buffer)</span>
                </div>
                <div className="md:col-span-4 text-indigo-900 flex items-center space-x-1.5 mt-2 md:mt-0">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>OmniSocial AI Operating System</span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {comparisons.map((row, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-4 items-center transition-colors hover:bg-slate-50/70 ${
                      row.highlight ? 'bg-indigo-50/15' : ''
                    }`}
                  >
                    {/* Dimension */}
                    <div className="md:col-span-4">
                      <p className="text-sm font-bold text-slate-900">{row.feature}</p>
                    </div>

                    {/* Legacy */}
                    <div className="md:col-span-4 flex items-start space-x-2 text-xs text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" />
                      </div>
                      <p className="leading-relaxed">{row.legacy}</p>
                    </div>

                    {/* OmniSocial */}
                    <div className="md:col-span-4 flex items-start space-x-2 text-xs font-semibold text-slate-900 bg-white md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-indigo-100 shadow-2xs md:shadow-none">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <p className="leading-relaxed">{row.omni}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

