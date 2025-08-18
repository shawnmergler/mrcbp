export function haptic(kind: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  const map = { light: [8], medium: [14], heavy: [24] } as const;
  navigator.vibrate(map[kind]);
}
