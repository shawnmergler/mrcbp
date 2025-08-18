'use client';
import LinkVT from './LinkVT';
import { Icons, IconKey } from './Icons';

export default function TrackCard({
  title, subtitle, href, gradient, icon, vtName,
}: {
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  icon: IconKey;
  vtName?: string;
}) {
  const Icon = Icons[icon];
  return (
    <LinkVT href={href} vtName={vtName} className="card p-4 hover:shadow-lg transition-shadow" style={{ backgroundImage: gradient }}>
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-white/70 p-2">
          <Icon className="w-6 h-6 text-gray-900" aria-hidden="true" data-vt />
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{title}</div>
          <div className="text-xs text-gray-800/80 truncate">{subtitle}</div>
        </div>
      </div>
    </LinkVT>
  );
}
