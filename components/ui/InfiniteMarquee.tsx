'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InfiniteMarqueeProps {
  items: Array<{
    label: string;
    sublabel?: string;
    badge?: string;
    icon?: React.ReactNode;
  }>;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function InfiniteMarquee({
  items,
  direction = 'left',
  speed = 'normal',
  className,
}: InfiniteMarqueeProps) {
  const speedClass =
    speed === 'fast'
      ? 'animate-[marquee_22s_linear_infinite]'
      : speed === 'slow'
      ? 'animate-[marquee_50s_linear_infinite]'
      : 'animate-[marquee_34s_linear_infinite]';

  const reverseClass = direction === 'right' ? '[animation-direction:reverse]' : '';

  return (
    <div
      className={cn(
        'group relative flex w-full overflow-hidden select-none py-3 border-y border-slate-200/80 bg-white/60 backdrop-blur-md',
        className
      )}
    >
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      {/* Marquee Track (duplicated for seamless loop) */}
      <div className={cn('flex shrink-0 items-center gap-8 pl-4', speedClass, reverseClass)}>
        {items.concat(items).map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs hover:border-indigo-300 transition-colors"
          >
            {item.icon && <span className="text-indigo-600 shrink-0">{item.icon}</span>}
            <span className="text-sm font-bold tracking-tight text-slate-800 whitespace-nowrap">
              {item.label}
            </span>
            {item.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {item.badge}
              </span>
            )}
            {item.sublabel && (
              <span className="text-xs font-medium text-slate-400">
                {item.sublabel}
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={cn('flex shrink-0 items-center gap-8 pl-8', speedClass, reverseClass)}
      >
        {items.concat(items).map((item, idx) => (
          <div
            key={'dup-' + idx}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs hover:border-indigo-300 transition-colors"
          >
            {item.icon && <span className="text-indigo-600 shrink-0">{item.icon}</span>}
            <span className="text-sm font-bold tracking-tight text-slate-800 whitespace-nowrap">
              {item.label}
            </span>
            {item.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {item.badge}
              </span>
            )}
            {item.sublabel && (
              <span className="text-xs font-medium text-slate-400">
                {item.sublabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

