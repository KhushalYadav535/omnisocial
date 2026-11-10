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
    <html lang="en" className="antialiased light selection:bg-neutral-900 selection:text-white">
      <body className="bg-[#F4F5F7] text-[#0F1012] font-sans relative">
        <SmoothScroll>
          <CursorGlow />
          <NoiseOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
