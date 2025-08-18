import './globals.css';
import './gotham.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import PWA from '@/components/PWA';
import QuickActions from '@/components/QuickActions';
import InstallPrompt from '@/components/InstallPrompt';
import MobileNav from '@/components/MobileNav';
import StatBar from '@/components/StatBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Marmol-Radziner Construction BP',
  description: 'Luxury residential construction training'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <PWA />
          <header className="border-b bg-[rgba(255,255,255,0.7)] backdrop-blur sticky top-0 z-30">
            <div className="container flex items-center justify-between py-3">
              <Link href="/" className="text-base sm:text-xl font-bold">Marmol-Radziner Construction BP</Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
                <Link href="/install" className="hover:underline">Install App</Link>
                <a href="https://www.csiresources.org/standards/masterformat" target="_blank" rel="noreferrer" className="hover:underline">CSI MasterFormat</a>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="container py-4 pb-24 sm:pb-10">
            <StatBar />
            <div className="mt-4">{children}</div>
          </main>
          <MobileNav />
          <QuickActions />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
