'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpotlightCard } from './SpotlightCard';
import { ScrollReveal } from './ScrollReveal';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleToggle = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
    if (cycle === 'annual') {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#ec4899', '#3b82f6'],
      });
    }
  };

  const plans = [
    {
      name: 'Starter Creator',
      tagline: 'For boutique brands, solopreneurs & content creators.',
      priceMonthly: 39,
      priceAnnual: 29,
      badge: null,
      isPopular: false,
      features: [
        'Up to 5 Brands',
        '10 Connected Facebook & Instagram Accounts',
        '3 Team Member Seats',
        'Unified Social Engagement Inbox',
        'AI Sentiment Analysis & Drafts',
        '50,000 AI Tokens / Month',
        'Standard Email Support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/register',
    },
    {
      name: 'Agency Pro',
      tagline: 'The ultimate engine for multi-client digital marketing agencies.',
      priceMonthly: 129,
      priceAnnual: 99,
      badge: 'Most Popular for Agencies',
      isPopular: true,
      features: [
        'Up to 25 Client Brands',
        '50 Connected Facebook & Instagram Accounts',
        '15 Team Member Seats with RBAC',
        'Custom BYOK (Bring Your Own Keys: Meta & AI)',
        'Content Studio, AI Visuals & Calendar',
        'Mandatory Human Approval Workflows',
        '250,000 AI Voice Tokens / Month',
        'Priority 24/7 Slack & Email Support',
      ],
      ctaText: 'Start 14-Day Agency Trial',
      ctaHref: '/register',
    },
    {
      name: 'Enterprise Scale',
      tagline: 'Custom infrastructure for global brands & holding companies.',
      priceMonthly: 349,
      priceAnnual: 279,
      badge: 'Zero Vendor Lock-in',
      isPopular: false,
      features: [
        'Unlimited Brands & Workspaces',
        'Unlimited Connected Accounts',
        'Unlimited Team Seats & Audit Logs',
        'Dedicated VPS Deployment Option',
        'Custom Model Fine-Tuning on Brand Voice',
        'Single Sign-On (SAML / Okta)',
        'Dedicated Technical Account Manager',
        '99.99% Uptime SLA Agreement',
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: '/login',
    },
  ];

  return (
    <section id="pricing" className="relative py-28 md:py-36 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT VALUE ENGINE</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Predictable, scalable pricing. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Zero surprise overages.
              </span>
            </h2>
          </ScrollReveal>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Every plan includes our 1-click Meta OAuth sync, unified engagement inbox, and brand voice guardrails.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <button
              onClick={() => handleToggle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => handleToggle('annual')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-indigo-700 font-extrabold shadow-2xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const currentPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <ScrollReveal key={idx} direction="up" delay={0.1 * idx}>
                <SpotlightCard
                  enableTilt={!plan.isPopular}
                  className={`h-full flex flex-col justify-between relative ${
                    plan.isPopular
                      ? 'ring-2 ring-indigo-600 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-xl shadow-indigo-500/10'
                      : 'bg-white'
                  }`}
                  spotlightColor={plan.isPopular ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.tagline}</p>

                    <div className="mt-6 flex items-baseline">
                      <span className="text-5xl font-black tracking-tight text-slate-900">
                        ${currentPrice}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 ml-2">
                        / month {billingCycle === 'annual' && '(billed annually)'}
                      </span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                        What's Included:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start text-xs text-slate-700">
                            <Check className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href={plan.ctaHref}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs ${
                        plan.isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Zero credit card required for 14-day trial
                    </p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

