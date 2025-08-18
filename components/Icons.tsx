// components/Icons.tsx
import type { SVGProps } from 'react';

export const Icons = {
  pm: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  site: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 20h16M6 20V9l6-5 6 5v11" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  leaderboard: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="10" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="10" y="6" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="17" y="13" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  admin: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 20c1.5-4 14.5-4 16 0" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  bolt: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  cap: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 10l9-5 9 5-9 5-9-5z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 12v4c3 2 7 2 10 0v-4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  osha: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  codes: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  division: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  lesson: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 4h9a2 2 0 0 1 2 2v12l-4-2-4 2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 8h9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  // New icons used in ThemeToggle
  shield: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  chart: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 20h18" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="10" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="11" y="7" width="3" height="11" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="17" y="4" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
} as const;

export type IconKey = keyof typeof Icons;
