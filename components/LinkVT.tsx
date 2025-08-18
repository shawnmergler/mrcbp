'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { haptic } from '@/lib/haptics';
import { PropsWithChildren, MouseEvent } from 'react';

export default function LinkVT({ href, children, vtName, className }: PropsWithChildren<{ href: string; vtName?: string; className?: string }>) {
  const router = useRouter();
  const onClick = (e: MouseEvent) => {
    if (!vtName || typeof document === 'undefined' || !(document as any).startViewTransition) return;
    const el = e.currentTarget as HTMLElement;
    const target = el.querySelector('[data-vt]') as HTMLElement | null;
    if (target) target.style.viewTransitionName = vtName;
    e.preventDefault();
    haptic('light');
    (document as any).startViewTransition(() => router.push(href));
  };
  return <Link href={href} onClick={onClick} className={className}>{children}</Link>;
}
