"use client";

import { useState, type ReactNode } from "react";
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

const CONTENT: Record<WindowId, ReactNode> = {
  about: <AboutWindow />, projects: <ProjectsWindow />, experience: <ExperienceWindow />,
  resume: <ResumeWindow />, contact: <ContactWindow />, playlist: <PlaylistWindow />,
};
const NAV: WindowId[] = ["about", "projects", "experience", "resume", "contact", "playlist"];

export default function Page() {
  const [activeTab, setActiveTab] = useState<WindowId | null>(null);

  return (
    <main className="site-shell">
      <section className="mini-home-shell">
        <header className="mini-header">
          <button className="brand-block" onClick={() => setActiveTab(null)} aria-label="Return to mini room">
            <span className="brand-kicker"><i /> CHARLIE&apos;S MINI PORTFOLIO</span>
            <span className="brand-name">{PROFILE.handle}</span>
            <span className="brand-role">{PROFILE.role}</span>
          </button>
          <div className="mini-header-note">work, systems &amp; small useful things</div>
          <div className="visitor-counter" aria-label="Visitor count">
            <span>TODAY <b>0001</b></span><span>TOTAL <b>650,000+</b></span>
          </div>
        </header>

        <div className="mini-body">
          <aside className="profile-card">
            <div className="profile-card-label">OWNER / PROFILE</div>
            <div className="profile-image-wrap"><img src="/images/profile.png" alt="Kunjoong Charlie Kim" className="profile-photo" /></div>
            <div className="profile-copy">
              <h2>Charlie Kim</h2><p className="profile-title">Software engineer · builder</p>
              <p className="profile-intro">{PROFILE.intro}</p>
            </div>
            <div className="profile-status"><span /> {PROFILE.status}</div>
            <button onClick={() => setActiveTab("about")} className="profile-open">VIEW FULL PROFILE <span>→</span></button>
            <div className="profile-links" aria-label="Profile links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
            </div>
            <div className="profile-footer">Penn State · CS · 2027</div>
          </aside>

          <div className="content-column">
            <nav aria-label="Portfolio sections" role="tablist" className="mobile-tabs">
              {NAV.map((id) => <TabButton key={id} id={id} activeTab={activeTab} onSelect={setActiveTab} />)}
            </nav>
            <div className="main-panel" role="tabpanel">
              {activeTab ? (
                <Window key={activeTab} title={WINDOW_META[activeTab].title} subtitle={WINDOW_META[activeTab].subtitle} accent={WINDOW_META[activeTab].accent} onClose={() => setActiveTab(null)}>
                  {CONTENT[activeTab]}
                </Window>
              ) : (
                <><div className="room-bar"><span><i /> ROOM 0921</span><span>SELECT AN OBJECT OR MENU</span></div><div className="room-stage"><Room onOpen={setActiveTab} /></div></>
              )}
            </div>
          </div>

          <nav aria-label="Portfolio sections" role="tablist" className="side-tabs">
            {NAV.map((id) => <TabButton key={id} id={id} activeTab={activeTab} onSelect={setActiveTab} />)}
          </nav>
        </div>
      </section>
    </main>
  );
}

function TabButton({ id, activeTab, onSelect }: { id: WindowId; activeTab: WindowId | null; onSelect: (id: WindowId) => void }) {
  const active = activeTab === id;
  return <button onClick={() => onSelect(id)} aria-selected={active} role="tab" className={`mini-tab ${active ? "is-active" : ""}`}><span className="tab-dot" />{WINDOW_META[id].title}<span className="tab-arrow">›</span></button>;
}
