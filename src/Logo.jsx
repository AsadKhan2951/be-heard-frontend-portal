import React from 'react';

// Shared BeHeard logo — BH badge + wordmark. Used everywhere for consistency.
const SIZES = {
  sm: { badge: 'w-7 h-7 text-[11px]', text: 'text-base' },
  md: { badge: 'w-8 h-8 text-sm', text: 'text-lg' },
  lg: { badge: 'w-11 h-11 text-lg', text: 'text-3xl' }
};

export default function Logo({ size = 'md', badge = true }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <div className="flex items-center gap-2">
      {badge && (
        <div className={`${s.badge} rounded-lg bg-[#BFFF00] text-[#0a0a0a] flex items-center justify-center font-extrabold shrink-0`}>
          BH
        </div>
      )}
      <span className={`font-bold ${s.text} leading-none`}>
        <span className="text-white">Be</span>
        <span className="text-[#BFFF00]">Heard</span>
      </span>
    </div>
  );
}
