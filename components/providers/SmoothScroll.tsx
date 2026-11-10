'use client';

import React, { createContext, useContext } from 'react';

interface SmoothScrollContextType {
  lenis: null;
  scrollTo: (target: string | HTMLElement, options?: any) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Universal Native Smooth Scroll Provider
 * Uses native browser scroll APIs to ensure 100% reliable 60fps scrolling
 * without intercepting mouse wheels, trackpads, or locking viewport scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollTo = (target: string | HTMLElement) => {
    if (typeof window === 'undefined') return;
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: null, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
