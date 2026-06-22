"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, DOMAIN_COLOR, DOMAIN_LABEL } from "@/lib/data";
import type { Project } from "@/lib/types";

export default function ProjectsWindow() {
  const [idx, setIdx] = useState(0); const p = PROJECTS[idx];
  return <div className="mx-auto max-w-3xl">
    <p className="mb-4 max-w-xl text-sm leading-relaxed text-ink-soft">A collection of systems, tools, and experiments I have built or contributed to.</p>
    <div className="flex gap-1 overflow-x-auto border-b border-line pl-1">{PROJECTS.map((project, i) => <button key={project.fileNo} onClick={() => setIdx(i)} className={`min-w-fit rounded-t-lg border border-b-0 border-line px-3 py-2 font-accent text-base tracking-[0.08em] ${i === idx ? "bg-white text-ink" : "bg-mist text-ink-soft"}`} style={i === idx ? { borderTop: `3px solid ${DOMAIN_COLOR[project.domain]}` } : undefined}>{project.fileNo}</button>)}</div>
    <motion.article key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-b-xl rounded-tr-xl border border-t-0 border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow" style={{ color: DOMAIN_COLOR[p.domain] }}>{p.fileNo} · {p.category ?? DOMAIN_LABEL[p.domain]}</p><h3 className="mt-1 font-display text-2xl font-semibold text-ink">{p.title}</h3><p className="mt-1 text-xs text-ink-soft">{p.org}</p></div><span className="rotate-[-3deg] rounded border-2 px-2 py-1 font-accent text-base uppercase tracking-[0.08em]" style={{ color: DOMAIN_COLOR[p.domain], borderColor: DOMAIN_COLOR[p.domain] }}>{p.status}</span></div>
      <p className="my-5 border-y border-dashed border-line py-3 font-display text-lg leading-snug text-ink">{p.impact}</p>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Problem">{p.problem}</Field><Field label="Solution">{p.solution}</Field><Field label="My role">{p.role}</Field><Field label="Result / Impact"><strong>{p.result}</strong></Field></div>
      <div className="mt-5"><p className="eyebrow">Tech stack</p><div className="mt-2 flex flex-wrap gap-1.5">{p.stack.map(s => <span key={s} className="rounded-md border border-line bg-mist px-2 py-1 font-mono text-[0.65rem] text-ink-soft">{s}</span>)}</div></div>
      <TechnicalNotes project={p} />
      <EvidenceArchive key={p.fileNo} project={p} />
      <ProjectLinks links={p.links} />
    </motion.article>
  </div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="eyebrow">{label}</p><p className="mt-1 text-sm leading-relaxed text-ink">{children}</p></div>; }

function TechnicalNotes({ project }: { project: Project }) {
  if (!project.technicalDetails?.length && !project.challenges?.length && !project.riskFormula) return null;
  return <details className="technical-notes">
    <summary>Technical Notes</summary>
    <div className="technical-notes-content">
      {project.technicalDetails?.length ? <div><p className="eyebrow">Implementation</p><ul>{project.technicalDetails.map(note => <li key={note}>{note}</li>)}</ul></div> : null}
      {project.riskFormula ? <div><p className="eyebrow">Risk formula</p><code>{project.riskFormula}</code></div> : null}
      {project.challenges?.length ? <div><p className="eyebrow">Challenges</p><ul>{project.challenges.map(challenge => <li key={challenge}>{challenge}</li>)}</ul></div> : null}
    </div>
  </details>;
}

function EvidenceArchive({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  if (!project.images.length) return null;
  const featured = project.images[active];

  return <section className="evidence-archive" aria-label={`${project.title} evidence screens`}>
    <div className="evidence-heading"><div><p className="eyebrow">Evidence / Screens</p><p>ARCHIVE REF. {project.fileNo.replace("PROJECT-", "")}</p></div><span>{String(active + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}</span></div>
    <figure className="evidence-featured">
      <img src={featured.src} alt={featured.alt} />
      <figcaption><span>EXHIBIT {String.fromCharCode(65 + active)}</span>{featured.caption}</figcaption>
    </figure>
    {project.images.length > 1 && <div className="evidence-strip" aria-label="Select evidence image">
      {project.images.map((image, imageIdx) => <button key={image.src} type="button" onClick={() => setActive(imageIdx)} className={imageIdx === active ? "is-active" : ""} aria-label={`View ${image.caption}`} aria-pressed={imageIdx === active}>
        <img src={image.src} alt="" /><span>{String.fromCharCode(65 + imageIdx)}. {image.caption}</span>
      </button>)}
    </div>}
  </section>;
}

function ProjectLinks({ links }: { links: Project["links"] }) {
  const available = [
    { href: links.demo, label: "View Project" },
    { href: links.github, label: "Source Code" },
    { href: links.caseStudy, label: "Case Study" }
  ].filter(link => link.href);

  if (!available.length) return null;
  return <div className="project-actions">{available.map(link => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</div>;
}
