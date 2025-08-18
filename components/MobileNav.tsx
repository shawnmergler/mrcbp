'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from './Icons';
import { haptic } from '@/lib/haptics';

function Item({ href, label, Icon }: { href: string; label: string; Icon: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <button
      onClick={() => { haptic('light'); router.push(href); }}
      className="flex flex-col items-center justify-center flex-1 py-2 active:scale-[0.98]"
    >
      <Icon className={`w-6 h-6 ${active ? 'text-gray-900' : 'text-gray-500'}`} />
      <span className={`text-[11px] ${active ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[rgba(255,255,255,0.85)] backdrop-blur border-t border-[rgba(17,24,39,0.08)] z-40">
      <div className="max-w-[1100px] mx-auto px-2 grid grid-cols-4">
        <Item href="/" label="Home" Icon={Icons.bolt} />
        <Item href="/system/PROJECT_MANAGEMENT" label="PM" Icon={Icons.pm} />
        <Item href="/system/SITE_SUPERVISION" label="Site" Icon={Icons.site} />
        <Item href="/leaderboard" label="Leaders" Icon={Icons.leaderboard} />
      </div>
    </nav>
  );
}
