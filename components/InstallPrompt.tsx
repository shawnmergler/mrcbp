// components/InstallPrompt.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { haptic } from '@/lib/haptics';

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [anim, setAnim] = useState<'in' | 'out' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don’t nag more than once per session
    if (typeof window !== 'undefined' && sessionStorage.getItem('installPromptDismissed')) return;
    timerRef.current = setTimeout(() => {
      setVisible(true);
      setAnim('in');
    }, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function close() {
    setAnim('out');
    try { haptic('light'); } catch {}
    // Wait for animation
    setTimeout(() => setVisible(false), 250);
    if (typeof window !== 'undefined') sessionStorage.setItem('installPromptDismissed', '1');
  }

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      className={[
        'fixed bottom-4 right-4 z-40',
        'max-w-sm w-[92vw] sm:w-[380px]',
        anim === 'in' ? 'animate-slide-in' : '',
        anim === 'out' ? 'animate-slide-out' : '',
      ].join(' ')}
      role="dialog"
      aria-label="Install the app"
    >
      <div className="rounded-2xl shadow-xl bg-white/85 dark:bg-gray-900/85 backdrop-blur p-4 border border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-xl bg-gray-900/90 dark:bg-white/90 p-2 text-white dark:text-gray-900">
            {/* Simple PWA-ish icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" className="block">
              <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".12"/>
              <path d="M13 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M8 14h8M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="min-w-0">
            <div className="font-semibold">Install this app</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Add it to your home screen for a faster, full-screen experience.
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Link href="/install" className="btn btn-sm" onClick={() => haptic('medium')}>
                How to install
              </Link>
              <button className="btn-ghost btn-sm" onClick={close}>
                Not now
              </button>
            </div>
          </div>

          <button className="btn-ghost btn-sm -mt-1" aria-label="Close" onClick={close}>
            ×
          </button>
        </div>
      </div>

      {/* Local CSS for tiny slide/opacity anims */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(8px); opacity: 0 }
          to   { transform: translateY(0);   opacity: 1 }
        }
        @keyframes slideOut {
          from { transform: translateY(0);   opacity: 1 }
          to   { transform: translateY(8px); opacity: 0 }
        }
        .animate-slide-in  { animation: slideIn .22s ease-out both; }
        .animate-slide-out { animation: slideOut .22s ease-in both; }
      `}</style>
    </div>
  );
}
