'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SpotlightCard } from './SpotlightCard';
import { ScrollReveal } from './ScrollReveal';

export function AgencyRoiCalculator() {
  const [brandsCount, setBrandsCount] = useState<number>(12);
  const [commentsPerMonth, setCommentsPerMonth] = useState<number>(3500);

  // Calculations
  // Avg time spent per comment without AI: 2.5 minutes
  // With OmniSocial 1-click approval: 0.25 minutes (15 sec)
  // Time saved: 2.25 min per comment
  const hoursSavedPerMonth = Math.round((commentsPerMonth * 2.25) / 60);
  
  // Avg agency social manager cost: $35/hour
  const monthlyCostSaved = Math.round(hoursSavedPerMonth * 35);
  const annualCostSaved = monthlyCostSaved * 12;

  // Speed multiplier
  const speedMultiplier = (2.5 / 0.25).toFixed(1);

  return (
    <section id="roi" className="relative py-28 md:py-36 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>[ 04 // AGENCY VALUE METRIC ]</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Calculate your agency's <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                automated operational return.
              </span>
            </h2>
          </ScrollReveal>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            See how much manual community management time and payroll OmniSocial AI reclaims for your team every month.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.15}>
            <SpotlightCard className="p-8 sm:p-12 bg-white/95 border-slate-200/90 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Sliders Area (7 cols) */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Slider 1: Number of Brands */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span>Active Client Brands</span>
                        <span className="text-xs font-normal text-slate-400 font-mono">(1 - 50)</span>
                      </label>
                      <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200/60 font-mono">
                        {brandsCount} Brands
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brandsCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBrandsCount(val);
                        setCommentsPerMonth(val * 300);
                      }}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                      <span>1 Brand</span>
                      <span>25 Brands</span>
                      <span>50 Brands</span>
                    </div>
                  </div>

                  {/* Slider 2: Estimated Monthly Inbound Volume */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span>Total Monthly Comments & DMs</span>
                        <span className="text-xs font-normal text-slate-400 font-mono">(Inbound)</span>
                      </label>
                      <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200/60 font-mono">
                        {commentsPerMonth.toLocaleString()} msgs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="25000"
                      step="100"
                      value={commentsPerMonth}
                      onChange={(e) => setCommentsPerMonth(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                      <span>300 / mo</span>
                      <span>10,000 / mo</span>
                      <span>25,000 / mo</span>
                    </div>
                  </div>

                  {/* Micro note */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-600">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p>
                      Calculated on 2.5 min manual review vs. 15-second human signoff using OmniSocial AI contextual tone draft engine.
                    </p>
                  </div>
                </div>

                {/* Results Panel (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-lg">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                      PROJECTED IMPACT
                    </span>
                    <div className="mt-4 space-y-4">
                      {/* Metric 1 */}
                      <div className="border-b border-slate-800 pb-3">
                        <p className="text-xs text-slate-400">Payroll Hours Reclaimed</p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                            {hoursSavedPerMonth}
                          </span>
                          <span className="text-xs text-indigo-300 font-semibold">hours / month</span>
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="border-b border-slate-800 pb-3">
                        <p className="text-xs text-slate-400">Monthly Agency Capital Saved</p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                            ${monthlyCostSaved.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400">/ mo</span>
                        </div>
                        <p className="text-[11px] font-mono text-emerald-300/80 mt-0.5">
                          ~ ${annualCostSaved.toLocaleString()} annually
                        </p>
                      </div>

                      {/* Metric 3 */}
                      <div>
                        <p className="text-xs text-slate-400">Response Speed Acceleration</p>
                        <p className="text-2xl font-black font-mono text-cyan-300 mt-1">
                          {speedMultiplier}x Faster
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 flex items-center justify-center space-x-2 transition-colors shadow-xs"
                  >
                    <span>Start Free Trial on Agency Pro</span>
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
