import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - OmniSocial AI',
  description: 'Terms of service and acceptable use policy for OmniSocial AI platform.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-8 text-white">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-slate-300" />
            <div>
              <h1 className="text-2xl font-black tracking-tight">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-1">Effective Date: October 2026</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-700 text-sm leading-relaxed">
          <p className="text-xs text-slate-500">
            Welcome to OmniSocial AI. By connecting your Meta social accounts or using our workspace, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">1. Permitted Platform Use</h2>
            <p className="text-xs text-slate-600">
              OmniSocial provides brand scheduling, engagement analytics, unified inbox handling, and AI draft generation. You agree to use the platform only in compliance with all relevant laws, Meta Platform Terms, and Meta Community Guidelines. You agree not to use the platform for automated spamming or harassment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">2. AI-Assisted Content Policy</h2>
            <p className="text-xs text-slate-600">
              All AI suggestions, automated classifications, and draft replies provided by OmniSocial are advisory. <strong>Explicit human authorization and approval</strong> is required before any communication is dispatched to social channels. You remain solely responsible for published responses.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">3. Disconnection & Service Termination</h2>
            <p className="text-xs text-slate-600">
              You maintain total discretion to disconnect any social channel at any time from your Social Accounts dashboard. Upon disconnection, token synchronization terminates immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">4. Limitation of Liability</h2>
            <p className="text-xs text-slate-600">
              OmniSocial is provided on an "as is" and "as available" basis. We are not liable for any third-party social media API outages, account suspensions initiated by Meta for external policy breaches, or network interruptions.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-center text-xs text-slate-400">
          &copy; 2026 OmniSocial AI Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
