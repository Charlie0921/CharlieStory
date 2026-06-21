"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Window({ title, subtitle, accent, onClose, children }: { title: string; subtitle: string; accent: string; onClose: () => void; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.section aria-label={title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: .01 } : { duration: .18 }} className="flex h-full overflow-hidden bg-paper-bright">
      <div className="hidden w-8 flex-none items-center justify-center border-r border-black/10 sm:flex" style={{ background: accent }}>
        <span className="-rotate-90 whitespace-nowrap font-accent text-base tracking-[0.08em] text-white/75">KUNJOONG CHARLIE KIM · FILED 2026</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-2.5 sm:px-5">
          <div><h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h2><p className="font-accent text-sm uppercase tracking-[0.08em] text-ink-soft">{subtitle}</p></div>
          <button onClick={onClose} aria-label="Return to mini room" className="flex h-8 items-center gap-2 rounded border border-line px-3 font-accent text-sm uppercase tracking-[0.06em] text-ink-soft transition hover:border-[#71856b] hover:bg-[#eef2e9] hover:text-ink"><span aria-hidden>←</span> Room</button>
        </header>
        <div className="panel-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </motion.section>
  );
}
