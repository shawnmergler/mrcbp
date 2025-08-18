"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { haptic } from "@/lib/haptics";
type BIEvent = Event & { prompt: () => Promise<void>; userChoice?: Promise<any> };
function isStandalone() { /* iOS */ // @ts-ignore if (typeof window !== "undefined" && window.navigator && (window.navigator as any).standalone) return true; /* All */ if (typeof window !== "undefined" && window.matchMedia) { return window.matchMedia("(display-mode: standalone)").matches; } return false; }
function isIOS() { if (typeof navigator === "undefined") return false; return /iphone|ipad|ipod/i.test(navigator.userAgent); }
export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIOS] = useState(false);
  const deferredRef = useRef<BIEvent | null>(null);
  useEffect(() => {
    setIOS(isIOS());
    if (isStandalone()) return;
    const dismissed = localStorage.getItem("mrbp_install_dismissed");
    if (dismissed === "1") return;
    const handler = (e: Event) => { e.preventDefault(); deferredRef.current = e as BIEvent; setVisible(true); };
    window.addEventListener("beforeinstallprompt", handler as any);
    const t = setTimeout(() => { if (!deferredRef.current) setVisible(true); }, 1400);
    return () => { window.removeEventListener("beforeinstallprompt", handler as any); clearTimeout(t); };
  }, []);
  const install = async () => {
    const ev = deferredRef.current;
    if (!ev) { setVisible(false); return; }
    await ev.prompt(); haptic("light"); setVisible(false); localStorage.setItem("mrbp_install_dismissed", "1");
  };
  const dismiss = () => { setVisible(false); localStorage.setItem("mrbp_install_dismissed", "1"); };
  return (
    <AnimatePresence>
      {visible && !isStandalone() && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="install-banner" role="dialog" aria-live="polite">
          <div className="flex items-center gap-3 w-full">
            <div className="text-xl">📲</div>
            <div className="text-sm">
              <div className="font-semibold">Install Marmol‑Radziner Construction BP?</div>
              <div>Use it offline and full-screen.</div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="btn btn-ghost" onClick={dismiss}>Later</button>
              {ios ? (
                <Link className="btn btn-primary" href="/install" onClick={()=>{ haptic("light"); setVisible(false); }}>How to Install</Link>
              ) : (
                <button className="btn btn-primary" onClick={install}>Install</button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
