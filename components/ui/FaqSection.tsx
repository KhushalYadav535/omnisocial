'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 1-Click Meta OAuth integration work?',
      a: 'When you or your client clicks "Connect Facebook / Instagram", Meta opens an official, secure consent popup. Once authorized, our backend exchanges the short-lived code for a 60-day Long-Lived User Access Token, which then fetches permanent Page Access Tokens. Webhooks are registered automatically so incoming comments and DMs appear in real-time.',
    },
    {
      q: 'What is "Human-in-the-Loop" and why does it matter?',
      a: 'We believe autonomous AI should never publish directly to customer brand channels without oversight. OmniSocial AI drafts contextual, brand-aligned responses, flags sentiment, and presents them in an action queue where your team can approve, edit, or reject with a single click or keystroke.',
    },
    {
      q: 'Can our agency Bring Our Own Keys (BYOK)?',
      a: 'Yes! On our Agency Pro and Enterprise tiers, you can configure your own Meta App ID and Secret, as well as custom OpenAI, Claude, or Gemini API keys. This means authorization dialogs display your custom agency branding rather than ours.',
    },
    {
      q: 'How does multi-tenant data isolation work?',
      a: 'Each tenant belongs to a segregated namespace. Workspace members only access assigned client brands. Access tokens and brand guidelines are encrypted at rest with AES-256 and never shared across tenant boundaries.',
    },
    {
      q: 'Is there a free trial available?',
      a: 'Yes, every new workspace enjoys a full 14-day free trial on the Agency Pro plan with zero credit card required. You can test 1-click connect, sync accounts, and explore the AI post studio immediately.',
    },
  ];

  return (
    <section className="relative py-28 md:py-36 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono font-bold text-indigo-700 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CLARITY & ARCHITECTURE</span>
          </div>
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Answered Questions
            </h2>
          </ScrollReveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <ScrollReveal key={idx} direction="up" delay={0.06 * idx}>
                <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <span className="text-base font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

