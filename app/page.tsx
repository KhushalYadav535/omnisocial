'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Share2, 
  Inbox, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Layers, 
  Building2, 
  Users, 
  Key, 
  Check, 
  Lock,
  ChevronRight,
  TrendingUp,
  MessageSquareText,
  ThumbsUp
} from 'lucide-react';
import { Facebook, Instagram } from '../components/Icons';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'connect' | 'studio' | 'calendar'>('connect');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">OmniSocial</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#1-click-connect" className="hover:text-indigo-600 transition-colors">1-Click Connect</a>
            <a href="#multi-tenancy" className="hover:text-indigo-600 transition-colors">Multi-Tenancy</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3.5 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-xs hover:shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Enterprise AI Social Media Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Manage Multiple Brands. <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Single-Click Social API Connect.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Multi-tenant social suite for agencies, boutique creators, and enterprises. 
            Connect Facebook & Instagram in 1-click, synchronize comments & DMs into a unified inbox, 
            and generate brand-voice AI replies with <strong>mandatory human approval</strong>.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free Agency Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Interactive Demo</span>
            </Link>
          </div>

          {/* Trust proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" /> 1-Click Meta OAuth</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" /> BYOK Custom API Keys</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" /> Human-in-the-loop Guardrails</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" /> Super Admin Portal</span>
          </div>

          {/* Interactive Feature Demo Mockup */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
            {/* Window bar */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-medium text-slate-500 ml-2">omnisocial-ai.enterprise.console</span>
              </div>
              <div className="flex space-x-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold text-slate-700">
                <button
                  onClick={() => setActiveTab('connect')}
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'connect' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  1-Click Connect
                </button>
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'inbox' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Unified Inbox & AI
                </button>
                <button
                  onClick={() => setActiveTab('studio')}
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'studio' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  AI Content Studio
                </button>
              </div>
            </div>

            {/* Tab 1: 1-Click Connect Preview */}
            {activeTab === 'connect' && (
              <div className="p-6 sm:p-8 bg-slate-50">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Single-Click Social Media Integration</h3>
                      <p className="text-xs text-slate-500">Connect Facebook Pages & Instagram Creator Accounts in under 5 seconds.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Zero Manual Scripting
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                          <Facebook className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Facebook Page & Instagram Business</p>
                          <p className="text-xs text-slate-500">Official Meta Graph OAuth with automated long-lived token exchange</p>
                        </div>
                      </div>
                      <Link
                        href="/login"
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-xs"
                      >
                        1-Click Connect
                      </Link>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">BYOK: Bring Your Own Page Access Token</p>
                          <p className="text-xs text-slate-500">Paste your Meta Graph Page Token for instant zero-redirect connection</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        Supported
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Inbox Preview */}
            {activeTab === 'inbox' && (
              <div className="p-6 sm:p-8 bg-slate-50">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop"
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Priya"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">Priya Kulkarni</h4>
                          <span className="text-xs text-slate-400">@priya_k</span>
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Instagram Comment
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1">
                          "Hey! Are the cotton summer dresses restocked yet? Need them for my Goa trip next week! ❤️✨"
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      Positive Sentiment (94%)
                    </span>
                  </div>

                  {/* AI Suggested Response Box */}
                  <div className="mt-4 p-4 rounded-lg bg-indigo-50/50 border border-indigo-200">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-2">
                      <span className="flex items-center">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                        AI Suggested Reply (Adhering to Aura Wear Brand Voice)
                      </span>
                      <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-sm">
                        Mandatory Human Approval Required
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-mono bg-white p-2.5 rounded-md border border-indigo-100">
                      "Hey Priya! ✨ So exciting, Goa trips are the best! 🌴 Our Pure Cotton Summer Breeze collection is being restocked this Friday at 12 noon! Drop us a quick DM and we will send you early-bird notification! 💛"
                    </p>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-md bg-white border border-slate-200">
                        Edit Draft
                      </button>
                      <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md shadow-xs">
                        Approve & Send to Instagram
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Studio Preview */}
            {activeTab === 'studio' && (
              <div className="p-6 sm:p-8 bg-slate-50">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-slate-900">AI Post Generator Preview</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Target: Facebook & Instagram</span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                      <p className="font-bold text-slate-700">Prompt Idea:</p>
                      <p className="text-slate-600 italic">"Announce the Spring Summer 2026 linen collection with a resort aesthetic."</p>
                    </div>
                    <div className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-200 text-xs space-y-2">
                      <p className="font-bold text-indigo-900">Generated Caption & Hashtags:</p>
                      <p className="text-slate-800 leading-relaxed">
                        "Breathe easy in effortless style. 🌿 Our Spring/Summer 2026 resort collection is officially live! Handcrafted from 100% sustainable European flax linen. #AuraLifestyle #Resort2026"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1-Click Connect Deep Dive Section */}
      <section id="1-click-connect" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Seamless Integration
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Single-Click Social Media Connection: How It Works
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Whether you are an agency managing 20 client brands or a creator with custom developer apps, 
              connecting accounts takes 1-click without messy API configuration.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">1-Click Meta OAuth</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Click "Connect Facebook / Instagram". The official Meta popup opens where the user logs in and picks their eligible Facebook Pages and linked Instagram accounts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Token Exchange</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Backend securely converts the authorization code into a 60-day Long-Lived Token and retrieves Page Access Tokens (which never expire until revoked), keeping sync active 24/7.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">BYOK & Custom App Support</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Agencies can also plug their own Meta App ID/Secret (or direct Page Tokens) in Tenant Settings so client consent screens show their custom agency branding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tenancy Architecture Section */}
      <section id="multi-tenancy" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Enterprise Hierarchy
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Scale: Super Admin to Multi-Brand Workspaces
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Complete multi-tenancy isolation ensures that each agency or enterprise owns their data, team seats, and API keys.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900">Super Platform Admin</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Oversees all agencies, creators, and tenants. Manages subscription tiers, platform usage metrics, and system audit trail.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Building2 className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900">Tenants & Agencies</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dedicated tenant boundary. Agency Admin can invite team members with RBAC and plug custom BYOK credentials.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Layers className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900">Businesses & Brands</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Each tenant can manage multiple client businesses and brands. Each brand has its custom AI voice profile and FAQs.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Share2 className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900">Connected Accounts</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Each brand connects its respective Facebook Pages and Instagram handles for publishing, comments, and DMs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Subscription Plans
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple, Transparent Pricing for Creators & Agencies
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Manage all client brands from a single pane of glass.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900">Starter Creator</h3>
              <p className="text-xs text-slate-500 mt-1">For boutique brands & solo creators</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$29</span>
                <span className="text-xs font-semibold text-slate-500 ml-1.5">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Up to 5 Brands</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 10 Connected Accounts</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 3 Team Member Seats</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Unified Inbox & Sentiment</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 50,000 AI Voice Tokens</li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Choose Starter
              </Link>
            </div>

            {/* Agency Pro (Featured) */}
            <div className="p-8 rounded-2xl bg-indigo-50/50 border-2 border-indigo-600 shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular for Agencies
              </span>
              <h3 className="text-lg font-bold text-slate-900">Agency Pro</h3>
              <p className="text-xs text-slate-500 mt-1">Multi-tenant power for marketing agencies</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$99</span>
                <span className="text-xs font-semibold text-slate-500 ml-1.5">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Up to 25 Client Brands</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 50 Connected Accounts</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 15 Team Member Seats & RBAC</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Custom BYOK Meta & AI Keys</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Content Studio & Calendar</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 250,000 AI Voice Tokens</li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                Get Started with Agency Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900">Enterprise Scale</h3>
              <p className="text-xs text-slate-500 mt-1">Unlimited scale & white-label infrastructure</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">$249</span>
                <span className="text-xs font-semibold text-slate-500 ml-1.5">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 100+ Brands & Workspaces</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 200+ Connected Accounts</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> 50 Team Member Seats</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Custom White-label Domain</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Dedicated Webhook Infrastructure</li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">OmniSocial AI</span>
            <span className="text-xs text-slate-500">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register Agency</Link>
            <a href="#features" className="hover:text-white transition-colors">Platform Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
