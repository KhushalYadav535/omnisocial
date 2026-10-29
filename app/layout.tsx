import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniSocial AI — Multi-Tenant Social Media Management Platform",
  description: "Enterprise AI-powered Social Media Management, Unified Engagement Inbox, Brand Voice Engine, Content Studio & Scheduling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
