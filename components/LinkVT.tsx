'use client';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export default function LinkVT({
  vtName,
  className,
  style,
  children,
  ...props
}: LinkProps & { vtName?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <Link {...props} className={className} style={style} data-vt={vtName}>
      {children}
    </Link>
  );
}
