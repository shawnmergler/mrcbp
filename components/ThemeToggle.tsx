'use client';
import { useTheme } from './ThemeProvider';
import { Icons } from './Icons';

export default function ThemeToggle() {
  const { cycle, theme, resolved } = useTheme();
  const Icon = resolved === 'dark' ? Icons.shield : resolved === 'light' ? Icons.bolt : Icons.chart;
  const label = theme === 'system' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark';
  return (
    <button onClick={cycle} className="btn btn-ghost flex items-center gap-2" aria-label="Toggle theme">
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
