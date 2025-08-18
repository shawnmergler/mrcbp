import type { SVGProps } from 'react';

export type IconKey = 'pm'|'site'|'leaderboard'|'admin'|'bolt'|'cap'|'osha'|'codes'|'division'|'lesson';

function Svg(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}/>;
}

export const Icons: Record<IconKey, (p: SVGProps<SVGSVGElement>) => JSX.Element> = {
  pm: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  site: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M3 20h18M6 20V8l6-4 6 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  leaderboard: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M4 10h4v10H4zM10 4h4v16h-4zM16 14h4v6h-4z" fill="currentColor"/></svg>,
  admin: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4-7 4 2.5-7L2 9h7z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  bolt: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor"/></svg>,
  cap: (p)=> <svg viewBox="0 0 24 24" {...p}><path d="M12 3l9 5-9 5-9-5 9-5zm0 10l6 3-6 3-6-3 6-3z" fill="currentColor"/></svg>,
  osha: (p)=> <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2"/></svg>,
  codes: (p)=> <svg viewBox="0 0 24 24" {...p}><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2"/></svg>,
  division: (p)=> <svg viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2"/></svg>,
  lesson: (p)=> (<svg viewBox="0 0 24 24" {...p}><path d="M6 4h9a2 2 0 0 1 2 2v12l-4-2-4 2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M6 8h9" stroke="currentColor" strokeWidth="2"/></svg>),
};
