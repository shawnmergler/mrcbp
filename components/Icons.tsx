export type IconKey =
  'pm'|'site'|'leaderboard'|'admin'|'bolt'|'cap'|'osha'|'codes'|'division';

export const Icons: Record<IconKey, (p: SVGProps<SVGSVGElement>) => JSX.Element> = {
  // ...existing icons...
  codes: (p)=> (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  division: (p)=> (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
};
