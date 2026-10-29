'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';
import { useSmoothScroll } from '../providers/SmoothScroll';

export function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Capabilities', href: '#features' },
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Live Demo', href: '#demo' },
    { label: 'ROI Calculator', href: '#roi' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
        <div
          className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-2xl sm:rounded-full border ${
            scrolled
              ? 'bg-white/80 backdrop-blur-xl border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-2.5 px-4 sm:px-6'
              : 'bg-white/60 backdrop-blur-md border-slate-200/60 shadow-xs py-3.5 px-5 sm:px-7'
          } flex items-center justify-between`}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900">
                OmniSocial
              </span>
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3.5 py-1.5 rounded-full hover:bg-slate-100/70 transition-all cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="group relative inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 shadow-xs hover:shadow-indigo-500/20 transition-all duration-300"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl md:hidden flex flex-col space-y-4"
          >
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  scrollTo(link.href);
                }}
                className="text-base font-bold text-slate-800 py-2 border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 shadow-sm"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

