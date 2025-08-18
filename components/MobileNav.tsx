// components/MobileNav.tsx
'use client';

import Link from 'next/link';
import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const OSHAIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CodeBookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M15 4v3h3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 12h8M8 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const TrophyIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M8 21h8M10 17h4M7 4h10v3a5 5 0 1 1-10 0V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6h3v1a4 4 0 0 1-4-4v1a2 2 0 0 0 1 2Zm16-1v1a4 4 0 0 1-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// Keep the same API your file already used for a bottom tab item
function Item({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
}) {
  const external = href.startsWith('http');
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-200"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <Icon className="w-6 h-6" aria-hidden="true" />
      <span className="text-[11px] leading-none">{label}</span>
    </Link>
  );
}

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <div className="mx-auto max-w-screen-sm flex items-center justify-around">
        {/* Replaced PM/Site with OSHA + Building Codes */}
        <Item href="https://www.osha.gov/video" label="OSHA" Icon={OSHAIcon} />
        <Item href="https://codes.iccsafe.org/" label="Building Codes" Icon={CodeBookIcon} />
        {/* Leaderboard icon provided locally to avoid missing Icons.leaderboard */}
        <Item href="/leaderboard" label="Leaders" Icon={TrophyIcon} />
      </div>
    </nav>
  );
}
