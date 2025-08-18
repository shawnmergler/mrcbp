'use client';
import { ComponentType } from 'react';
import LinkVT from './LinkVT';

export default function IconTile({
  label, href, Icon, hint, vtName,
}: {
  label: string;
  href: string;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  hint?: string;
  vtName?: string;
}) {
  return (
    <LinkVT href={href} vtName={vtName} className="tile active:scale-[0.98]">
      <Icon className="w-7 h-7 text-gray-900" aria-hidden="true" data-vt />
      <div className="text-xs text-gray-900 font-medium">{label}</div>
      {hint ? <div className="text-[10px] text-gray-500">{hint}</div> : null}
    </LinkVT>
  );
}
