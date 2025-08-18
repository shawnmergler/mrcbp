'use client';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

export default function LinkVT({
  href,
  children,
  className,
  style,
  vtName,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  vtName?: string;
}) {
  return (
    <Link href={href} className={className} style={style} data-vt-name={vtName}>
      {children}
    </Link>
  );
}
