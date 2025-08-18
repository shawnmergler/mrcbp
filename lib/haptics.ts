export type Haptic = "light" | "medium" | "heavy" | "success" | "error";

export function haptic(type: Haptic = "light") {
  if (typeof navigator === "undefined") return;
  // Android / some devices
  const vibrate = (pattern: number | number[]) => {
    try { if ("vibrate" in navigator) (navigator as any).vibrate(pattern); } catch {}
  };
  switch (type) {
    case "light": vibrate(5); break;
    case "medium": vibrate([8, 12, 8]); break;
    case "heavy": vibrate([16, 20, 16]); break;
    case "success": vibrate([10, 20, 10, 40]); break;
    case "error": vibrate([30, 30, 30]); break;
  }
}
