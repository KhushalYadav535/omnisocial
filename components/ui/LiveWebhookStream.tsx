'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Sparkles, CheckCircle2, MessageSquare, Terminal } from 'lucide-react';
import { Facebook, Instagram } from '../Icons';

interface WebhookEvent {
  id: string;
  time: string;
  type: 'instagram_comment' | 'facebook_dm' | 'token_keepalive' | 'voice_guardrail';
  brand: string;
  detail: string;
  status: string;
  statusColor: string;
}

const mockEvents: WebhookEvent[] = [
  {
    id: 'evt-1',
    time: 'just now',
    type: 'instagram_comment',
    brand: 'Aura Wear',
    detail: 'New comment from @priya_k: "Are summer dresses restocked?"',
    status: 'AI Tone Drafted • Pending Approval',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'evt-2',
    time: '4s ago',
    type: 'facebook_dm',
    brand: 'Apex Tech',
    detail: 'Direct Message from Rahul M.: "Pricing quote for agency tier"',
    status: 'Unified Inbox Synced',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'evt-3',
    time: '12s ago',
    type: 'token_keepalive',
    brand: 'Vanguard Media',
    detail: 'Meta Graph OAuth Long-Lived Token automatically verified',
    status: 'Permanent Active',
    statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'evt-4',
    time: '19s ago',
    type: 'voice_guardrail',
    brand: 'Horizon Labs',
    detail: 'AI reply verified against brand persona • Zero hallucinations',
    status: 'Guardrail Passed',
    statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
];

export function LiveWebhookStream() {
  const [events, setEvents] = useState<WebhookEvent[]>(mockEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle events smoothly to simulate real-time stream
      setEvents((prev) => {
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, prev.length - 1);
        return [{ ...last, id: 'evt-' + Date.now(), time: 'just now' }, ...rest];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-md p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
            Live Webhook & Ingestion Telemetry
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Latency: <strong className="text-emerald-600 font-bold">248ms</strong>
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {events.slice(0, 3).map((evt) => (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center space-x-2.5">
                {evt.type === 'instagram_comment' && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                )}
                {evt.type === 'facebook_dm' && (
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Facebook className="w-3.5 h-3.5" />
                  </div>
                )}
                {evt.type === 'token_keepalive' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <Terminal className="w-3 h-3" />
                  </div>
                )}
                {evt.type === 'voice_guardrail' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <span className="font-bold text-slate-900 mr-2">{evt.brand}</span>
                  <span className="text-slate-600">{evt.detail}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${evt.statusColor}`}
                >
                  {evt.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{evt.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

