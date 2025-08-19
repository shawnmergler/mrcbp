// components/Icons.tsx
import React, { SVGProps } from 'react';

export type IconKey =
  | 'home'
  | 'osha'
  | 'codes'
  | 'standards'
  | 'pm'
  | 'site'
  | 'lesson'
  | 'division'
  | 'upload'
  | 'trash'
  | 'edit'
  | 'save'
  | 'x'
  | 'trophy'
  | 'leaderboard'
  | 'bolt'
  | 'shield'
  | 'chart';

type IconMap = Record<IconKey, (p: SVGProps<SVGSVGElement>) => JSX.Element>;

function S(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props} />;
}

export const Icons: IconMap = {
  home: (p) => (
    <S {...p}><path d="M10.2 2.6a2.4 2.4 0 0 1 3.6 0l7 8A2 2 0 0 1 20.7 14H19v6a2 2 0 0 1-2 2h-3v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v5H5a2 2 0 0 1-2-2v-6H3.3a2 2 0 0 1-1-3.4l7-8Z"/></S>
  ),
  osha: (p) => (
    <S {...p}><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 3a7 7 0 1 1-7 7 7.008 7.008 0 0 1 7-7Zm0 2a5 5 0 1 0 5 5 5.006 5.006 0 0 0-5-5Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"/></S>
  ),
  codes: (p) => (
    <S {...p}><path d="M4 4h16a2 2 0 0 1 2 2v11.5A2.5 2.5 0 0 1 19.5 20H6a2 2 0 0 1-2-2V4Zm4 3v2h8V7Zm0 4v2h8v-2Z"/></S>
  ),
  standards: (p) => (
    <S {...p}><path d="M6 3h9a3 3 0 0 1 3 3v11a4 4 0 0 1-4 4H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm2 4h7v2H8V7Zm0 4h7v2H8v-2Zm0 4h5v2H8v-2Z"/></S>
  ),
  pm: (p) => (
    <S {...p}><path d="M3 5a2 2 0 0 1 2-2h5.5a2 2 0 0 1 1.4.6l2.9 2.9a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm4 3h7v2H7V8Zm0 4h7v2H7v-2Zm0 4h5v2H7v-2Z"/></S>
  ),
  site: (p) => (
    <S {...p}><path d="M3 20h18v-2H3v2Zm2-3h3V8H5v9Zm5 0h3V4h-3v13Zm5 0h3v-7h-3v7Z"/></S>
  ),
  lesson: (p) => (
    <S {...p}><path d="M6 4h9a3 3 0 0 1 3 3v12l-4.5-2L9 19 6 21V7a3 3 0 0 1 3-3Z"/></S>
  ),
  division: (p) => (
    <S {...p}><path d="M4 4h16v4H4V4Zm0 6h16v10H4V10Zm3 2v6h10v-6H7Z"/></S>
  ),
  upload: (p) => (
    <S {...p}><path d="M12 3 7 8h3v5h4V8h3l-5-5Zm-7 13h14v4H5v-4Z"/></S>
  ),
  trash: (p) => (
    <S {...p}><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm0 6h2v8H9V9Zm6 0h-2v8h2V9Z"/></S>
  ),
  edit: (p) => (
    <S {...p}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-1.5-1.5a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75 1.29-1.47Z"/></S>
  ),
  save: (p) => (
    <S {...p}><path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 3v4h8V6H7Z"/></S>
  ),
  x: (p) => (
    <S {...p}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></S>
  ),
  trophy: (p) => (
    <S {...p}><path d="M19 4h2v3a5 5 0 0 1-5 5h-1a6 6 0 0 1-6 0H8a5 5 0 0 1-5-5V4h2V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1Zm-7 11a6 6 0 0 0 4 1 4 4 0 0 1-4 3h-2a4 4 0 0 1-4-3 6 6 0 0 0 4-1h2Z"/></S>
  ),
  leaderboard: (p) => (
    <S {...p}><path d="M4 20h4V8H4v12Zm6 0h4V4h-4v16Zm6 0h4v-6h-4v6Z"/></S>
  ),
  bolt: (p) => (
    <S {...p}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></S>
  ),
  shield: (p) => (
    <S {...p}><path d="M12 2 4 5v6c0 5.25 3.438 8.75 8 11 4.562-2.25 8-5.75 8-11V5l-8-3Z"/></S>
  ),
  chart: (p) => (
    <S {...p}><path d="M4 19h16v2H4v-2Zm2-8h3v7H6v-7Zm5-5h3v12h-3V6Zm5 3h3v9h-3V9Z"/></S>
  ),
};

export default Icons;
