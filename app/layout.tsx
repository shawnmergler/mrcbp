import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import UserPromptInjector from '@/components/UserPromptInjector';
import QuickAccess from '@/components/QuickAccess';

export const metadata = {
  title: 'Marmol-Radziner Construction BP',
  description: 'Luxury residential construction training',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="logowrap">
            <Image src="/logo.png" alt="Marmol Radziner Construction" width={360} height={64} />
            <span className="bp">BP</span>
          </Link>
          <nav className="topnav">
            <Link className="link" href="/standards">Standards</Link>
            <a className="link" href="/admin">Admin</a>
          </nav>
        </header>
        <QuickAccess />
        <main className="container">{children}</main>
        <UserPromptInjector />
      </body>
    </html>
  );
}
