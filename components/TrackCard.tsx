import Link from 'next/link';
import { ComponentType } from 'react';

export default function TrackCard({
  title, subtitle, href, gradient, Icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Link href={href} className="track-card">
      <div className="bg" style={{ background: gradient }} />
      <div className="iconwrap">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="content">
        <div className="text-sm/5 opacity-90">{subtitle}</div>
        <div className="text-xl font-semibold">{title}</div>
      </div>
    </Link>
  );
}
