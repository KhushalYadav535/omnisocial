'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Share2,
  Zap,
  ShieldCheck,
  Building2,
  Sliders,
  Send,
  RefreshCw,
  Copy,
  ExternalLink,
  Lock,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Key,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Facebook, Instagram } from '../Icons';

export function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<'cadra' | 'connect' | 'inbox' | 'studio' | 'hierarchy'>('cadra');
  const [hoveredSplineMonth, setHoveredSplineMonth] = useState<number>(1);

  // Tab 1 state
  const [connectingStep, setConnectingStep] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Tab 2 state
  const [selectedTone, setSelectedTone] = useState<'luxury' | 'playful' | 'corporate'>('luxury');
  const [emojiDensity, setEmojiDensity] = useState<number>(2); // 1, 2, 3
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Tab 3 state
  const [selectedCampaign, setSelectedCampaign] = useState<'spring' | 'flash' | 'founder'>('spring');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Tab 1 Simulator Handler
  const handleSimulateConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      setConnectingStep(0);
      return;
    }

    setConnectingStep(1);
    setTimeout(() => {
      setConnectingStep(2);
      setTimeout(() => {
        setConnectingStep(3);
        setTimeout(() => {
          setIsConnected(true);
          setConnectingStep(4);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
          });
        }, 600);
      }, 700);
    }, 700);
  };

  // Tone responses
  const getAIResponse = () => {
    if (selectedTone === 'luxury') {
      return emojiDensity > 2
        ? '“Delighted to assist, Priya. ✨ The Spring Resort capsule arrives this Friday at 12 PM EST. DM us to receive privileged early-access privileges. 💛🥂”'
        : '“Delighted to assist, Priya. The Spring Resort capsule arrives this Friday at 12 PM EST. We welcome you to send a direct message for privileged early access.”';
    } else if (selectedTone === 'playful') {
      return emojiDensity > 2
        ? '“Omg Priya!! 🌴 Goa is gonna be SO iconic in this fit! 🔥 Dropping the restock FRIDAY 12 noon sharp! Run to our DMs for the VIP link bestie! ⚡✨”'
        : '“Omg Priya! Goa is gonna look amazing! Restocking Friday 12 noon sharp — shoot us a quick DM for the VIP link!”';
    } else {
      return '“Hello Priya, thank you for contacting Aura Wear. Our Summer Collection restock is scheduled for release this Friday at 12:00 PM EST. Direct message inquiries will receive priority stock notifications.”';
    }
  };

  const campaigns = {
    spring: {
      title: 'Spring / Summer 2026 Resort',
      caption:
        'Breathe easy in effortless silhouettes. Handcrafted with 100% sustainable European flax linen. Engineered for sunlit horizons.',
      hashtags: '#AuraWear #ResortCollection #SustainableLuxury #Summer2026',
      likes: '4,892',
      comments: '342',
    },
    flash: {
      title: '24-Hour VIP Private Archive Sale',
      caption:
        'A rare privilege. Unlock 30% off archival staples for the next 24 hours only. Use code VIPARCHIVE at checkout.',
      hashtags: '#PrivateSale #LimitedArchive #CuratedDesign',
      likes: '8,120',
      comments: '614',
    },
    founder: {
      title: 'Behind the Seams: The Workshop',
      caption:
        'Every stitch carries intention. A glimpse into our Lisbon atelier where our artisans spent 6 months perfecting the weave.',
      hashtags: '#AtelierCraft #BehindTheDesign #ArtisanMade',
      likes: '6,450',
      comments: '488',
    },
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/90 bg-white/90 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.12),0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-2xl overflow-hidden">
      {/* Studio Window Title Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-3 h-3 rounded-full bg-rose-400 ring-2 ring-rose-200" />
          <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-200" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-200" />
          <div className="flex items-center space-x-1.5 ml-2 text-xs font-mono font-bold text-slate-500">
            <span>omnisocial.live.engine</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              ● ACTIVE SIMULATOR
            </span>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 rounded-full bg-neutral-200/80 border border-neutral-300/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cadra')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cadra'
                ? 'bg-[#111215] text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cadra Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-[#111215] text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            1-Click Meta Connect
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-[#111215] text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Unified AI Inbox
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-[#111215] text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Post Studio
          </button>
        </div>
      </div>

      {/* Main Tab Views with AnimatePresence */}
      <div className="p-6 sm:p-8 bg-[#F4F5F7]">
        <AnimatePresence mode="wait">
          {/* TAB 0: CADRA LIVE OVERVIEW SIMULATOR (EXACT SCREENSHOT UI) */}
          {activeTab === 'cadra' && (
            <motion.div
              key="cadra"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Cadra Inner Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
                    <span>Larkspur</span>
                    <span>›</span>
                    <span>Reporting</span>
                    <span>›</span>
                    <span className="text-neutral-900 font-semibold">Overview</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <h3 className="text-2xl font-extrabold text-[#0F1012]">Overview</h3>
                    <div className="bg-[#E5E7EB] p-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1">
                      <span className="bg-white px-3 py-0.5 rounded-full text-neutral-900 shadow-2xs">Overview</span>
                      <span className="px-3 py-0.5 text-neutral-500">Report builder</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-black/[0.06] text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>3:27 PM</span>
                  </div>
                  <div className="bg-[#111215] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                    <span>+ Build a report</span>
                  </div>
                </div>
              </div>

              {/* Cadra 4-Card Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Jet Black Hero */}
                <div className="bg-[#111215] text-white rounded-[24px] p-5 border border-neutral-800 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Revenue, year to date</span>
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight my-2 font-sans">$1,721,974</p>
                  <div>
                    <span className="text-[10px] font-semibold bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded-full">
                      Best: Jun $220k
                    </span>
                  </div>
                </div>

                {/* 2. Soft Blue */}
                <div className="bg-[#E8F1FD] text-neutral-900 rounded-[24px] p-5 border border-[#D5E3FA] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>Bikes shipped</span>
                    <Share2 className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight my-2">916</p>
                  <div>
                    <span className="text-[10px] font-semibold bg-white/80 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200/50">
                      98 a month
                    </span>
                  </div>
                </div>

                {/* 3. Pure White */}
                <div className="bg-white text-neutral-900 rounded-[24px] p-5 border border-black/[0.06] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>% Gross margin</span>
                    <span>%</span>
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight my-2">51.8%</p>
                  <div>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      +4.2% AI voice margin
                    </span>
                  </div>
                </div>

                {/* 4. Pure White with Amber Badge */}
                <div className="bg-white text-neutral-900 rounded-[24px] p-5 border border-black/[0.06] flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>On time in November</span>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <p className="text-3xl font-extrabold tracking-tight my-2">91%</p>
                  <div>
                    <span className="text-[10px] font-semibold bg-[#FEF3C7] text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                      -2 pts vs Oct
                    </span>
                  </div>
                </div>
              </div>

              {/* Cadra Spline Curve + Speedometer Gauge Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left 2/3: Spline Wave Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-xs font-bold text-neutral-900">Revenue</span>
                    <div className="flex items-center space-x-3 text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-neutral-700">
                        <span className="w-2 h-2 rounded-full bg-blue-600" /> Revenue
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <span className="w-3 h-0.5 border-t border-dashed border-blue-400" /> Cost of goods
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-[180px]">
                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-neutral-400">
                      <span>$250k</span>
                      <span>$125k</span>
                      <span>$0</span>
                    </div>
                    <div className="pl-10 h-full relative">
                      <svg className="w-full h-[150px] overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="consoleSplineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 10,120 C 60,110 110,105 160,90 C 220,70 280,30 340,30 C 400,30 460,50 510,75 C 560,95 580,110 590,120 L 590,145 L 10,145 Z"
                          fill="url(#consoleSplineGrad)"
                        />
                        <path
                          d="M 10,120 C 60,110 110,105 160,90 C 220,70 280,30 340,30 C 400,30 460,50 510,75 C 560,95 580,110 590,120"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10,135 C 60,130 110,125 160,115 C 220,100 280,75 340,75 C 400,75 460,90 510,105 C 560,120 580,130 590,135"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        {/* Interactive Point on Jan */}
                        <line x1="80" y1="5" x2="80" y2="145" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="80" cy="112" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                      </svg>
                      {/* Tooltip on Jan */}
                      <div className="absolute top-6 left-16 bg-white/95 rounded-xl p-2 border border-neutral-200 shadow-md text-[10px]">
                        <p className="font-bold text-neutral-900">Jan</p>
                        <p className="text-neutral-500">Revenue: <strong className="text-neutral-900">$81k</strong></p>
                        <p className="text-neutral-500">Cost: <strong className="text-neutral-900">$42k</strong></p>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[10px] font-medium text-neutral-400">
                        {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 1/3: Speedometer Radial Gauge */}
                <div className="bg-white rounded-[24px] p-5 border border-black/[0.06] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-neutral-900">On-time delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative w-44 h-24 flex items-end justify-center">
                      <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 90">
                        <path d="M 15 80 A 65 65 0 0 1 145 80" fill="none" stroke="#E5E7EB" strokeWidth="14" strokeLinecap="round" />
                        <path d="M 15 80 A 65 65 0 0 1 135 44" fill="none" stroke="#558B2F" strokeWidth="14" strokeLinecap="round" />
                        <g transform="translate(80, 80)">
                          <circle cx="0" cy="0" r="5" fill="#111215" />
                          <line x1="0" y1="0" x2="44" y2="-34" stroke="#111215" strokeWidth="3" strokeLinecap="round" />
                        </g>
                      </svg>
                      <div className="absolute -bottom-1 flex flex-col items-center">
                        <span className="text-2xl font-extrabold text-[#0F1012]">91%</span>
                        <span className="text-[10px] text-neutral-400">November so far</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neutral-100 text-center text-[10px] text-neutral-500">
                    Target <span className="font-bold text-neutral-800">92%</span> • 12-mo avg <span className="font-bold text-neutral-800">91.3%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 1: 1-Click Connect Simulator */}
          {activeTab === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                      Interactive OAuth Test
                    </span>
                    <span className="text-xs text-slate-400">• Meta Graph v26.0</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Simulate Single-Click Meta Authorization
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Experience how client onboarding happens in 5 seconds with zero complex developer console setup.
                  </p>
                </div>

                <button
                  onClick={handleSimulateConnect}
                  disabled={connectingStep > 0 && connectingStep < 4}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md ${
                    isConnected
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/25'
                  }`}
                >
                  {connectingStep > 0 && connectingStep < 4 ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Exchanging Tokens...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Simulator</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Launch 1-Click OAuth Demo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Stepper Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { title: '1. User Consent', desc: 'Select Pages & IG handles' },
                  { title: '2. Code Exchange', desc: 'Exchange auth code for user token' },
                  { title: '3. Long-Lived Token', desc: 'Extend to 60-day durable token' },
                  { title: '4. Permanent Page Token', desc: 'Acquire zero-expiry Page tokens' },
                ].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = isConnected || connectingStep >= stepNum;
                  const isCurrent = connectingStep === stepNum;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : isCurrent
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold">
                          {isDone ? '✓ COMPLETED' : `STEP 0${stepNum}`}
                        </span>
                        {isCurrent && <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{step.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Connected Cards Preview */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${isConnected ? 'text-emerald-500' : 'text-slate-300'}`}
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {isConnected ? '2 Channels Connected & Synced' : 'Awaiting 1-Click Connection'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Client: Aura Wear Lifestyle
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Facebook className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Aura Wear Official</p>
                        <p className="text-[11px] text-slate-400">Page ID: 104829104859</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConnected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isConnected ? 'Live Webhooks' : 'Standby'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">@aurawear.style</p>
                        <p className="text-[11px] text-slate-400">Instagram Creator Account</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConnected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isConnected ? 'Live Webhooks' : 'Standby'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Unified Inbox & AI Voice Engine */}
          {activeTab === 'inbox' && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Voice Controls Bar */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950">Brand Voice Engine Controls:</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-slate-500">Tone Preset:</span>
                  {(['luxury', 'playful', 'corporate'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize transition-all ${
                        selectedTone === tone
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-slate-500">Emoji Density:</span>
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setEmojiDensity(lvl)}
                      className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                        emojiDensity === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {lvl === 1 ? '•' : lvl === 2 ? '••' : '✨'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Simulation Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      alt="Customer"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-900">Natasha Verma</h4>
                        <span className="text-[11px] text-slate-400">@natasha_v</span>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Instagram Comment
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        “Hey team! Loved your Goa shoot! Are the Linen Summer dresses coming back in stock before next week? Need it urgently! ❤️🌴”
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    97% Positive Intent
                  </span>
                </div>

                {/* AI Generated Reply */}
                <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200/70 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                      AI Brand Response Generator (Tuned to {selectedTone.toUpperCase()} persona)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">
                      MANDATORY HUMAN APPROVAL
                    </span>
                  </div>

                  <p className="text-xs text-slate-900 font-mono bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs">
                    {getAIResponse()}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Tokens: 42 • Confidence: 99.4% • Guardrails: 0 flags
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsApproved(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
                      >
                        Edit Draft
                      </button>
                      <button
                        onClick={() => {
                          setIsApproved(true);
                          confetti({
                            particleCount: 50,
                            spread: 45,
                            origin: { y: 0.7 },
                          });
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                          isApproved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isApproved ? '✓ Sent to Instagram API' : 'Approve & Push to Meta'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Post Studio */}
          {activeTab === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Prompting */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">Select Campaign Prompt</h4>
                </div>

                <div className="space-y-2.5">
                  {(['spring', 'flash', 'founder'] as const).map((key) => {
                    const c = campaigns[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCampaign(key);
                          setIsGenerating(true);
                          setTimeout(() => setIsGenerating(false), 300);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          selectedCampaign === key
                            ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{c.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.caption}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Publish Schedule:</p>
                  <p className="text-[11px] text-slate-500">
                    Simultaneous publishing to Facebook Page & Instagram Reels/Grid via official Meta Content Publishing API.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Mockup Card */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold text-xs">
                    AW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center">
                      aurawear.style
                      <CheckCircle2 className="w-3 h-3 text-blue-500 ml-1 inline" />
                    </p>
                    <p className="text-[10px] text-slate-400">Sponsored • 1-Click Multi-Sync</p>
                  </div>
                </div>

                {/* Simulated Image Box */}
                <div className="w-full h-44 rounded-xl bg-gradient-to-br from-indigo-100 via-sky-50 to-amber-50 border border-slate-100 flex flex-col items-center justify-center p-4 text-center">
                  <Flame className="w-8 h-8 text-indigo-500 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    {campaigns[selectedCampaign].title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    Auto-formatted for 1080x1350 IG Portrait
                  </span>
                </div>

                {/* Live Caption Display */}
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-800 leading-relaxed font-sans">
                    <span className="font-bold mr-1">aurawear.style</span>
                    {campaigns[selectedCampaign].caption}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-medium">
                    {campaigns[selectedCampaign].hashtags}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>❤️ {campaigns[selectedCampaign].likes} likes</span>
                  <span>💬 {campaigns[selectedCampaign].comments} comments</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Multi-Tenant Architecture Visualizer */}
          {activeTab === 'hierarchy' && (
            <motion.div
              key="hierarchy"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                <span className="font-bold text-slate-900">Tenant Boundary Isolation:</span>
                <p className="text-slate-500 mt-0.5">
                  Agencies, client brands, team member roles, and OAuth tokens are strictly partition-isolated with zero cross-tenant query risk.
                </p>
              </div>

              <div className="space-y-3">
                {/* Level 1: Super Admin */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-amber-950">Super Administrator</p>
                      <p className="text-[10px] text-amber-700">Platform Global Governance & Usage Metrics</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-sm">
                    ROOT PERMISSION
                  </span>
                </div>

                {/* Level 2: Agency Tenant */}
                <div className="ml-6 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Acme Digital Media Agency</p>
                      <p className="text-[10px] text-indigo-700">Tenant ID: ten_acme982 • 12 Active Client Brands</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-200/60 text-indigo-900 px-2 py-0.5 rounded-sm">
                    TENANT ADMIN
                  </span>
                </div>

                {/* Level 3: Client Brands */}
                <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Aura Wear (Apparel)</p>
                      <p className="text-[10px] text-slate-400">2 Connected Accounts</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Apex Robotics (Tech)</p>
                      <p className="text-[10px] text-slate-400">3 Connected Accounts</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Console Bottom Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/90 px-6 py-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            Meta Graph API v26 Connected
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline">Uptime: 99.98%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Latency: 284ms</span>
          <span className="text-indigo-600 font-bold">✓ Production Ready</span>
        </div>
      </div>
    </div>
  );
}

