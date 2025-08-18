import { Icons } from './Icons';

export default function RoleBadge({ system, level, name }: { system: 'PROJECT_MANAGEMENT' | 'SITE_SUPERVISION'; level: number; name?: string }) {
  const palette = system === 'PROJECT_MANAGEMENT' ? ['#1e3a8a', '#0ea5e9'] : ['#14532d', '#10b981'];
  const Icon = system === 'PROJECT_MANAGEMENT' ? Icons.pm : Icons.site;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
      style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`, color: 'white' }}>
      <Icon className="w-3.5 h-3.5 text-white" />
      Lv{level}{name ? ` • ${name}` : ''}
    </span>
  );
}
