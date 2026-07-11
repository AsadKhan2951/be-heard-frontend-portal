import React from 'react';
import logoImg from './be-heard-logo.png';

// Shared BeHeard logo (actual wordmark image). Used everywhere for consistency.
const HEIGHTS = {
  sm: 'h-6',   // ~24px — mobile header
  md: 'h-8',   // ~32px — nav / sidebar
  lg: 'h-12'   // ~48px — login / signup
};

export default function Logo({ size = 'md', className = '' }) {
  const h = HEIGHTS[size] || HEIGHTS.md;
  return (
    <img
      src={logoImg}
      alt="BeHeard"
      className={`${h} w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
}
