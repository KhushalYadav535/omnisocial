'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function ManifestoSection() {
  const manifestoPoints = [
    {
      num: '01',
      title: 'Zero Latency Sync',
      desc: 'Meta Graph Webhooks pipe direct engagement into our event queue in under 300ms. No refreshing, no missed viral comments.',
    },
    {
      num: '02',
      title: 'Guardrailed Intelligence',
      desc: 'Every AI suggestion undergoes tone and brand guideline verification before queuing. Human sign-off is non-negotiable.',
    },
    {
      num: '03',
      title: 'Sovereign Multi-Tenancy',
      desc: 'Complete architectural isolation for 500+ client accounts. Bring Your Own Keys (BYOK) with strict zero-leakage sandbox.',
    },
  ];

  return (
    <section id="manifesto" className="relative py-28 md:py-36 bg-white overflow-hidden border-b border-slate-200">
      {/* Background architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Pill */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-200/60">
            Manifesto // Architectural Philosophy
          </span>
        </div>

        {/* Large Editorial Headline */}
        <ScrollReveal direction="up">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[1.08] max-w-5xl">
            Social media management shouldn’t feel like a{' '}
            <span className="relative inline-block text-slate-400 line-through decoration-rose-500 decoration-wavy decoration-2">
              2012 spreadsheet.
            </span>{' '}
            We engineered an autonomous operating system for modern agencies.
          </h2>
        </ScrollReveal>

        {/* Narrative columns */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="up" delay={0.1}>
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
                Legacy suites treat agencies like solo influencers. They fail at scale, lock you into proprietary black boxes, and charge exorbitant surcharges for every extra team seat.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-base text-slate-500 leading-relaxed">
                OmniSocial AI was architected from the ground up on high-frequency Meta Webhook ingestion, BYOK token sovereignty, and human-supervised LLM brand voice engines.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Deterministic Engine</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Zero hallucinations. 100% compliant with Meta Business Partner terms of service.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Feature Points */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {manifestoPoints.map((item, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.15 * idx}>
                <div className="h-full p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.num}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600">
                    <span>Explore Protocol</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

