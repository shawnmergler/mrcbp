import React from 'react';

export type IconKey =
  | 'pm' | 'site' | 'lesson' | 'division'
  | 'shield' | 'bolt' | 'chart'
  | 'osha' | 'codes' | 'standards'
  | 'trophy' | 'upload' | 'csv'
  | 'edit' | 'trash' | 'user';

const Svg = (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}/>;

export const Icons: Record<IconKey, (p: React.SVGProps<SVGSVGElement>) => JSX.Element> = {
  pm:       (p) => <Svg {...p}><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h12v2H3v-2Z"/></Svg>,
  site:     (p) => <Svg {...p}><path d="M4 20V8l8-5 8 5v12H4Zm8-9 6-3.75L12 3 6 7.25 12 11Z"/></Svg>,
  lesson:   (p) => <Svg {...p}><path d="M6 4h12v16H6z"/><path d="M8 6h8v2H8zM8 10h8v2H8zM8 14h8v2H8z" fill="#fff"/></Svg>,
  division: (p) => <Svg {...p}><path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"/></Svg>,
  shield:   (p) => <Svg {...p}><path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z"/></Svg>,
  bolt:     (p) => <Svg {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></Svg>,
  chart:    (p) => <Svg {...p}><path d="M4 20V4h2v14h14v2H4Zm4-4v-6h2v6H8Zm4 0v-9h2v9h-2Zm4 0v-3h2v3h-2Z"/></Svg>,
  osha:     (p) => <Svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="#fff"/></Svg>,
  codes:    (p) => <Svg {...p}><path d="M4 5h16v14H4z"/><path d="M7 8h10v2H7zM7 12h10v2H7z" fill="#fff"/></Svg>,
  standards:(p) => <Svg {...p}><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M15 2v5h5" fill="#fff"/></Svg>,
  trophy:   (p) => <Svg {...p}><path d="M6 2h12v2h2a4 4 0 0 1-4 4c-.7 2-2.5 3-4 3s-3.3-1-4-3A4 4 0 0 1 4 4h2V2Zm3 13h6v3H9v-3Z"/></Svg>,
  upload:   (p) => <Svg {...p}><path d="M12 3 7 8h3v5h4V8h3l-5-5ZM5 18h14v3H5v-3Z"/></Svg>,
  csv:      (p) => <Svg {...p}><path d="M5 3h9l5 5v13H5V3Z"/><text x="7" y="16" fontSize="7" fill="#fff">CSV</text></Svg>,
  edit:     (p) => <Svg {...p}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"/></Svg>,
  trash:    (p) => <Svg {...p}><path d="M7 4h10v2H7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6H7Z"/></Svg>,
  user:     (p) => <Svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></Svg>,
};
export default Icons;
