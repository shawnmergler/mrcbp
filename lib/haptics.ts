export type HapticKind = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export function haptic(kind: HapticKind = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  const patterns: Record<HapticKind, number[] | number> = {
    light: [8],
    medium: [14],
    heavy: [24],
    success: [8, 40, 8],
    error: [24, 16, 24],
  };
  // @ts-ignore: Vibration API typing
  navigator.vibrate(patterns[kind] ?? patterns.light);
}
