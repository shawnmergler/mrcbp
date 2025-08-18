"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "@/lib/haptics";

export default function QuickActions() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const close = () => { setOpen(false); haptic("light"); };

  return (
    <>
      <button
        aria-label="Open quick actions"
        className="fab"
        onClick={() => { setOpen(true); haptic("light"); }}
      >
        ✨
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Quick actions"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.12, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) {
                  haptic("light");
                  setOpen(false);
                }
              }}
            >
              <button className="sheet-handle" aria-label="Drag to close" onClick={close} />
              <h3 className="text-lg font-semibold mb-2">Quick actions</h3>
              <p className="text-sm text-gray-600 mb-4">Jump back into training or review.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/system/SITE_SUPERVISION" onClick={()=>haptic('light')} className="btn btn-primary w-full">Continue Site Supervision</Link>
                <Link href="/system/PROJECT_MANAGEMENT" onClick={()=>haptic('light')} className="btn btn-ghost w-full">Continue Project Management</Link>
                <Link href="/leaderboard" onClick={()=>haptic('light')} className="btn btn-ghost w-full">View Leaderboard</Link>
                <Link href="/admin" onClick={()=>haptic('light')} className="btn btn-ghost w-full">Add Lesson (Admin)</Link>
              </div>
              <button className="btn btn-ghost w-full mt-4" onClick={close}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
