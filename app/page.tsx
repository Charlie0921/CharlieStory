"use client";
import { useState } from "react";
import Room from "@/components/Room";
import Window from "@/components/Window";
import AboutWindow from "@/components/windows/AboutWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import ExperienceWindow from "@/components/windows/ExperienceWindow";
import ResumeWindow from "@/components/windows/ResumeWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import PlaylistWindow from "@/components/windows/PlaylistWindow";
import { PROFILE, WINDOW_META } from "@/lib/data";
import type { WindowId } from "@/lib/types";

const CONTENT: Record<WindowId, React.ReactNode> = { about: <AboutWindow />, projects: <ProjectsWindow />, experience: <ExperienceWindow />, resume: <ResumeWindow />, contact: <ContactWindow />, playlist: <PlaylistWindow /> };
const NAV: WindowId[] = ["about", "projects", "experience", "resume", "contact", "playlist"];

export default function Page() {
  const [activeTab, setActiveTab] = useState<WindowId | null>(null);
  return (
    <main className="site-shell min-h-dvh px-4 py-5 sm:px-6 sm:py-8">
      <header className="mx-auto mb-4 flex max-w-[1180px] items-start justify-between gap-5">
        <div>
          <div className="mb-1 flex items-center gap-2 font-accent text-base uppercase tracking-[0.08em] text-coral-deep"><span className="inline-block h-2 w-2 rounded-full bg-coral" /> Charlie’s digital room</div>
          <h1 className="font-display text-4xl font-semibold leading-none tracking-[-0.025em] text-ink sm:text-5xl">{PROFILE.handle}</h1>
          <p className="mt-2 text-sm font-medium text-ink-soft sm:text-base">{PROFILE.name} · {PROFILE.role}</p>
        </div>
        <div className="counter-card hidden rotate-1 sm:block"><p>VISITORS</p><div><span>TODAY</span><b>0001</b></div><div><span>TOTAL</span><b>650,000+</b></div></div>
      </header>

      <section className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[24px] border border-[#c9c3b7] bg-[#d7d1c6] p-2 shadow-room lg:grid-cols-[245px_1fr]">
        <aside className="profile-rail relative m-1 rounded-[18px] border border-dashed border-[#b6aea0] bg-[#f8f3e9] p-5">
          <div className="absolute right-4 top-4 rounded-sm bg-sticky px-2 py-1 font-mono text-[0.55rem] uppercase tracking-wider text-ink-soft shadow-sm">Owner</div>
          <div className="avatar-card mt-7 h-36 overflow-hidden rounded-xl border border-line bg-ice-wash">
            <img src="/images/profile.png" alt="Kunjoong Charlie Kim" className="profile-photo h-full w-full" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">Charlie Kim</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{PROFILE.intro}</p>
          <div className="my-4 border-t border-dashed border-line" />
          <p className="font-accent text-lg leading-none tracking-[0.04em] text-coral-deep">● {PROFILE.status}</p>
          <button onClick={() => setActiveTab("about")} className="mt-4 w-full rounded-lg border border-line bg-white px-3 py-2 text-left font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink transition hover:border-lilac-deep">Open profile card <span className="float-right">→</span></button>
          <div className="mt-4 flex gap-2" aria-label="Profile links"><a href={PROFILE.github} target="_blank" rel="noreferrer" className="rail-link">GitHub</a><a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="rail-link">LinkedIn</a></div>
        </aside>

        <div className="relative m-1 min-w-0 pt-12 sm:pt-11">
          <nav aria-label="Portfolio sections" role="tablist" className="folder-tabs absolute left-1 right-1 top-1 z-20 flex items-end overflow-x-auto px-3 pt-1">
            {NAV.map((id, index) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-selected={activeTab === id}
                role="tab"
                className={`folder-tab folder-tab-${index + 1} ${activeTab === id ? "is-active" : ""}`}
              >
                <span className="folder-tab-mark" aria-hidden />
                {WINDOW_META[id].title}
              </button>
            ))}
          </nav>
          <div className="folder-panel relative h-[566px] overflow-hidden border border-[#aaa397] bg-wall" role="tabpanel">
            {activeTab ? (
              <Window
                key={activeTab}
                title={WINDOW_META[activeTab].title}
                subtitle={WINDOW_META[activeTab].subtitle}
                accent={WINDOW_META[activeTab].accent}
                onClose={() => setActiveTab(null)}
              >
                {CONTENT[activeTab]}
              </Window>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-line bg-[#f8f3e9] px-4 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"><span>Room 0921 · Explore the objects</span><span className="hidden sm:inline">Online ●</span></div>
                <Room onOpen={setActiveTab} />
              </>
            )}
          </div>
        </div>
      </section>
      <footer className="mx-auto max-w-[1180px] py-5 text-center font-mono text-[0.6rem] tracking-[0.08em] text-ink-soft">Built with too much caffeine, too many tabs, and a suspicious number of console logs.</footer>
    </main>
  );
}
