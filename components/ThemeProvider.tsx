'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; cycle: () => void; resolved: 'light' | 'dark' };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (typeof window === 'undefined' ? 'system' : (localStorage.getItem('theme') as Theme) || 'system'));
  const resolved = (() => {
    if (theme === 'system') {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    return theme;
  })() as 'light' | 'dark';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    localStorage.setItem('theme', theme);
  }, [theme, resolved]);

  const cycle = () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');

  return <ThemeCtx.Provider value={{ theme, setTheme, cycle, resolved }}>{children}</ThemeCtx.Provider>;
}
export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error('useTheme must be used within ThemeProvider');
  return v;
}
