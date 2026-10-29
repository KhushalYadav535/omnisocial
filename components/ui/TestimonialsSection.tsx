'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { ScrollReveal } from './ScrollReveal';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Founder & CEO',
      agency: 'Vanguard Growth Media',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop',
      stats: '42 Client Brands • $3.4M Ad Spend',
      quote:
        '“We migrated our 42 agency accounts from Buffer and Hootsuite in less than an afternoon. The 1-click Meta OAuth saved us hours of painful screen shares with clients, and our team hasn’t missed a single Instagram comment in 4 months.”',
    },
    {
      name: 'Marcus Chen',
      role: 'Head of Social Performance',
      agency: 'Aura Collective',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
      stats: '18 Creator Handles • 1.2M Community',
      quote:
        '“The human-in-the-loop AI reply engine is pure gold. Our community managers review 300+ comments in 15 minutes instead of 3 hours, and our clients love that the brand voice remains 100% authentic.”',
    },
    {
      name: 'Sofia Al-Mansoor',
      role: 'Managing Director',
      agency: 'Nomad Boutique Studios',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop',
      stats: '25 Luxury Brands • Global E-Commerce',
      quote:
        '“Being able to plug our own OpenAI API keys and Meta App credentials means our clients see our agency name on OAuth approvals. It feels like our own enterprise proprietary software.”',
    },
  ];

  return (
    <section className="relative py-28 md:py-36 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            <span>TRUSTED BY TOP TIER AGENCIES</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Powering the next generation of <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                autonomous social studios.
              </span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={idx} direction="up" delay={0.1 * idx}>
              <SpotlightCard className="h-full flex flex-col justify-between bg-slate-50/40">
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/70 flex items-center space-x-3.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center">
                      {t.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 ml-1.5 inline" />
                    </h4>
                    <p className="text-xs text-slate-500">
                      {t.role}, {t.agency}
                    </p>
                    <p className="text-[10px] font-mono text-indigo-600 font-bold mt-0.5">
                      {t.stats}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

