import "./globals.css";
import Link from "next/link";
import StatBar from "@/components/StatBar";
import { DEMO_MODE } from "@/lib/env";
import PWA from "@/components/PWA";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import QuickActions from "@/components/QuickActions";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata = {
  title: "Marmol-Radziner Construction BP",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/apple-touch-icon.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MR BP",
  },
  themeColor: "#111111",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PWA />
        <header className="border-b bg-white sticky top-0 z-30">
          <div className="container flex items-center justify-between py-3">
            <Link href="/" className="text-base sm:text-xl font-bold">Marmol-Radziner Construction BP</Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
              <Link href="/install" className="hover:underline">Install App</Link>
              <a href="https://www.csiresources.org/standards/masterformat" target="_blank" rel="noreferrer" className="hover:underline">CSI MasterFormat</a>
            </nav>
          </div>
        </header>
        <main className="container py-4 pb-24 sm:pb-10">
          {DEMO_MODE && (
            <div className="banner">
              Demo mode is ON. Sign-ins are bypassed; progress uses a demo user. Set <code>DEMO_MODE=false</code> and connect Supabase/Auth to go live.
            </div>
          )}
          <StatBar />
          <div className="mt-4"><PageTransition>{children}</PageTransition></div>
        </main>
        <MobileNav />
        <QuickActions />
        <InstallPrompt />
        <footer className="hidden sm:block container py-10 text-sm text-gray-500">
          Built for luxury residential training. Starter by ChatGPT.
        </footer>
      </body>
    </html>
  );
}
