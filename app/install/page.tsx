"use client";
import { useEffect, useState } from "react";

function isIOS() { if (typeof navigator === "undefined") return false; return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isAndroid() { if (typeof navigator === "undefined") return false; return /android/i.test(navigator.userAgent); }
function isStandalone() {
  // iOS PWA
  // @ts-ignore
  if (typeof window !== "undefined" && window.navigator && (window.navigator as any).standalone) return true;
  // All
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(display-mode: standalone)").matches;
  }
  return false;
}

export default function InstallPage() {
  const [platform, setPlatform] = useState<"ios"|"android"|"other">("other");
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setPlatform(isIOS() ? "ios" : isAndroid() ? "android" : "other");
    setInstalled(isStandalone());
  }, []);

  if (installed) {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">App is installed 🎉</h1>
        <p className="text-gray-600">Open it from your home screen for the best full-screen experience.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-2">Install Marmol‑Radziner Construction BP</h1>
      {platform === "android" && (
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Open this site in Chrome on your phone.</li>
          <li>Look for the <b>Install</b> banner, or open the ⋮ menu.</li>
          <li>Tap <b>Add to Home screen</b> → <b>Install</b>.</li>
        </ol>
      )}
      {platform === "ios" && (
        <ol className="list-decimal ml-5 space-y-2 text-gray-700">
          <li>Open this site in <b>Safari</b> on your iPhone.</li>
          <li>Tap <b>Share</b> <span aria-label="share">🡅</span> (bottom toolbar).</li>
          <li>Scroll and tap <b>Add to Home Screen</b>.</li>
          <li>Tap <b>Add</b>. The app appears on your home screen.</li>
        </ol>
      )}
      {platform === "other" && (
        <p className="text-gray-700">Use your browser’s menu to <b>Add to Home Screen</b> or install the app.</p>
      )}
      <p className="text-sm text-gray-500 mt-4">Tip: After installing, relaunch from your home screen to use offline and full-screen.</p>
    </div>
  );
}
