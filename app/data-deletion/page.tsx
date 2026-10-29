import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'User Data Deletion Instructions - OmniSocial AI',
  description: 'Meta platform compliance and GDPR user data deletion policy for OmniSocial AI.'
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-8 text-white">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-rose-100 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <Trash2 className="w-8 h-8 text-rose-200" />
            <div>
              <h1 className="text-2xl font-black tracking-tight">User Data Deletion Instructions</h1>
              <p className="text-xs text-rose-100 mt-1">Compliant with Meta Platform Terms & GDPR Article 17 (Right to Erasure)</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950 text-xs">
            According to Meta Platform Policy, OmniSocial AI provides clear, accessible instructions for users to request the permanent deletion of their account data, tokens, and social interaction history.
          </div>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Method 1: Instant Removal via Facebook Settings (Recommended)</span>
            </h2>
            <p className="text-xs text-slate-600">You can revoke OmniSocial's permissions and delete associated access directly inside Facebook:</p>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
              <li>Log in to your Facebook profile and navigate to <strong>Settings & Privacy &gt; Settings</strong>.</li>
              <li>In the left sidebar menu, select <strong>Business Integrations</strong> (or <em>Apps and Websites</em>).</li>
              <li>Find <strong>OmniSocial Business</strong> in the list of authorized integrations.</li>
              <li>Click <strong>Remove</strong> and confirm your choice.</li>
              <li>Facebook will automatically send an automated de-authorization event to our servers to delete your active access tokens immediately.</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Method 2: Permanent Database Purge Request</span>
            </h2>
            <p className="text-xs text-slate-600">
              To request a complete and irreversible wipe of all customer interaction records, AI drafts, Page history, and database accounts:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <p>Email our automated data compliance team:</p>
              <p className="font-mono text-indigo-600 font-bold text-sm">privacy@omnisocial.io</p>
              <p className="text-slate-500">Subject: <code>Permanent Data Erasure Request - [Your Page Name or ID]</code></p>
              <p className="text-slate-500">All associated records will be purged from active databases and backups within <strong>48 hours</strong>, and a cryptographically signed deletion confirmation receipt will be sent to your email.</p>
            </div>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Automated Deletion Status Tracking</h3>
            <p className="text-xs text-slate-500">
              If your deletion was triggered automatically via Facebook callback, your tracking reference format is:
            </p>
            <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-700 inline-block">
              DEL-META-CONFIRMED-STATUS-200-OK
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-center text-xs text-slate-400">
          &copy; 2026 OmniSocial AI Inc. Certified Meta Platform Compliant.
        </div>
      </div>
    </div>
  );
}
