import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '../components/providers/SmoothScroll';
import CursorGlow from '../components/ui/CursorGlow';
import NoiseOverlay from '../components/ui/NoiseOverlay';

export const metadata: Metadata = {
  title: 'OmniSocial AI — Multi-Tenant Autonomous Social Media Engine',
  description:
    'Awwwards-level enterprise social media suite for agencies & creators. Single-click Meta OAuth, Unified Engagement Inbox, and Guardrailed Brand Voice AI.',
  keywords: [
    'Social Media Management',
    'Meta OAuth',
    'Instagram Automation',
    'Facebook Pages API',
    'AI Social Inbox',
    'Multi-Tenant Agency',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light selection:bg-indigo-500/20 selection:text-indigo-950">
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-slate-900 font-sans relative">
        <SmoothScroll>
          <CursorGlow />
          <NoiseOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
