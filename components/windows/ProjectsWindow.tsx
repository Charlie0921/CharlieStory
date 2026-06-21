"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, DOMAIN_COLOR, DOMAIN_LABEL } from "@/lib/data";

export default function ProjectsWindow() {
  const [idx, setIdx] = useState(0); const p = PROJECTS[idx];
  return <div className="mx-auto max-w-3xl">
    <p className="mb-4 max-w-xl text-sm leading-relaxed text-ink-soft">A collection of systems, tools, and experiments I have built or contributed to.</p>
    <div className="flex gap-1 overflow-x-auto border-b border-line pl-1">{PROJECTS.map((project, i) => <button key={project.fileNo} onClick={() => setIdx(i)} className={`min-w-fit rounded-t-lg border border-b-0 border-line px-3 py-2 font-accent text-base tracking-[0.08em] ${i === idx ? "bg-white text-ink" : "bg-mist text-ink-soft"}`} style={i === idx ? { borderTop: `3px solid ${DOMAIN_COLOR[project.domain]}` } : undefined}>{project.fileNo}</button>)}</div>
    <motion.article key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-b-xl rounded-tr-xl border border-t-0 border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow" style={{ color: DOMAIN_COLOR[p.domain] }}>{p.fileNo} · {DOMAIN_LABEL[p.domain]}</p><h3 className="mt-1 font-display text-2xl font-semibold text-ink">{p.title}</h3><p className="mt-1 text-xs text-ink-soft">{p.org}</p></div><span className="rotate-[-3deg] rounded border-2 px-2 py-1 font-accent text-base uppercase tracking-[0.08em]" style={{ color: DOMAIN_COLOR[p.domain], borderColor: DOMAIN_COLOR[p.domain] }}>{p.status}</span></div>
      <p className="my-5 border-y border-dashed border-line py-3 font-display text-lg leading-snug text-ink">{p.impact}</p>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Problem">{p.problem}</Field><Field label="Solution">{p.solution}</Field><Field label="My role">{p.role}</Field><Field label="Result / Impact"><strong>{p.result}</strong></Field></div>
      <div className="mt-5"><p className="eyebrow">Tech stack</p><div className="mt-2 flex flex-wrap gap-1.5">{p.stack.map(s => <span key={s} className="rounded-md border border-line bg-mist px-2 py-1 font-mono text-[0.65rem] text-ink-soft">{s}</span>)}</div></div>
    </motion.article>
  </div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="eyebrow">{label}</p><p className="mt-1 text-sm leading-relaxed text-ink">{children}</p></div>; }
