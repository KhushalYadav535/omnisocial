'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Smooth springs for buttery cursor inertia
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Only enable on pointer devices (exclude pure touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, visible]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-40 transition-opacity duration-300"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Light iridescent ambient aura */}
      <div className="w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.09)_0%,rgba(14,165,233,0.05)_40%,transparent_70%)] blur-2xl" />
      {/* Precision micro-dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500/40 ring-4 ring-indigo-500/10" />
    </motion.div>
  );
}

