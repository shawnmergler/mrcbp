// components/PageTransition.tsx
'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  // re-key on path so the animation runs on route changes
  const path = usePathname();
  return (
    <div key={path} className="fade-slide">
      {children}
    </div>
  );
}
