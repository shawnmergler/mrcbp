"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/system/SITE_SUPERVISION", label: "Site", icon: "🛠️" },
  { href: "/system/PROJECT_MANAGEMENT", label: "PM", icon: "📋" },
  { href: "/leaderboard", label: "Top", icon: "🏆" },
  { href: "/admin", label: "Admin", icon: "✍️" },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 mobile-bottom-nav border-t bg-white/95 backdrop-blur">
      <ul className="flex justify-between items-stretch">
        {tabs.map(t => {
          const active = path === t.href || (t.href !== "/" && path.startsWith(t.href));
          return (
            <li key={t.href} className="flex-1">
              <Link href={t.href} className={`mobile-tab ${active ? "mobile-tab-active" : ""}`}>
                <span aria-hidden className="text-lg">{t.icon}</span>
                <span className="text-[11px]">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
