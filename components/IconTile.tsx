'use client';
import LinkVT from './LinkVT';
import { Icons, IconKey } from './Icons';

export default function IconTile({
  label, href, icon, hint, vtName,
}: {
  label: string;
  href: string;
  icon: IconKey;
  hint?: string;
  vtName?: string;
}) {
  const Icon = Icons[icon];
  return (
    <LinkVT href={href} vtName={vtName} className="tile active:scale-[0.98]">
      <Icon className="w-7 h-7 text-gray-900" aria-hidden="true" data-vt />
      <div className="text-xs text-gray-900 font-medium">{label}</div>
      {hint ? <div className="text-[10px] text-gray-500">{hint}</div> : null}
    </LinkVT>
  );
}
