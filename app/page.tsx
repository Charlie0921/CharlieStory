"use client";

import { useEffect, useState, type ReactNode } from "react";
import MiniRoomHero from "@/components/MiniRoomHero";
import Window from "@/components/Window";
import AboutWindow from "@/components/windows/AboutWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import ExperienceWindow from "@/components/windows/ExperienceWindow";
import ResumeWindow from "@/components/windows/ResumeWindow";
import NotesWindow from "@/components/windows/NotesWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import BgmWidget from "@/components/BgmWidget";
import { BgmPlayerProvider } from "@/components/BgmPlayerContext";
import ViewCounter from "@/components/ViewCounter";
import { EXPERIENCE, PROFILE, WINDOW_META } from "@/lib/data";
import {
  getPublishedExperiences,
  mapExperienceToRole,
} from "@/lib/supabase/experience";
import { getPublishedProjects } from "@/lib/supabase/projects";
import type { Project, Role, WindowId } from "@/lib/types";

const NAV: WindowId[] = [
  "about",
  "projects",
  "experience",
  "resume",
  "notes",
  "contact",
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<WindowId | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Role[]>(EXPERIENCE);

  useEffect(() => {
    async function loadProjects() {
      const data = await getPublishedProjects();
      setProjects(data);
    }

    loadProjects();
  }, []);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const data = await getPublishedExperiences();
        setExperiences(data.map(mapExperienceToRole));
      } catch (error) {
        console.error("Failed to fetch portfolio experiences:", error);
        setExperiences(EXPERIENCE);
      }
    }

    loadExperiences();
  }, []);

  const CONTENT: Record<WindowId, ReactNode> = {
    about: <AboutWindow />,
    projects: <ProjectsWindow projects={projects} />,
    experience: <ExperienceWindow experiences={experiences} />,
    resume: <ResumeWindow />,
    notes: <NotesWindow />,
    contact: <ContactWindow />,
  };

  return (
    <BgmPlayerProvider>
      <main className="site-shell">
        <section className={`mini-home-shell ${activeTab ? "" : "is-room-home"}`}>
          <header className="mini-header">
            <button
              className="brand-block"
              onClick={() => setActiveTab(null)}
              aria-label="Return to mini room"
            >
              <span className="brand-kicker">
                <i /> CHARLIE&apos;S MINI PORTFOLIO
              </span>
              <span className="brand-name">{PROFILE.handle}</span>
              <span className="brand-role">{PROFILE.role}</span>
            </button>

            <div className="mini-header-note">
              work, systems &amp; small useful things
            </div>

            <ViewCounter />
          </header>

          <div className={`mini-body ${activeTab ? "" : "is-room-home"}`}>
            <aside className="profile-card">
              <div className="profile-card-label">OWNER / PROFILE</div>

              <div className="profile-image-wrap">
                <img
                  src="/images/profile.png"
                  alt="Kunjoong Charlie Kim"
                  className="profile-photo"
                />
              </div>

              <div className="profile-copy">
                <h2>Charlie Kim</h2>
                <p className="profile-title">Software engineer · builder</p>
                <p className="profile-intro">{PROFILE.intro}</p>
              </div>

              <div className="profile-status">
                <span /> {PROFILE.status}
              </div>

              <div className="profile-bgm">
                <BgmWidget mini />
              </div>

              <button
                onClick={() => setActiveTab("about")}
                className="profile-open"
              >
                VIEW FULL PROFILE <span>→</span>
              </button>

              <div className="profile-links" aria-label="Profile links">
                <a href={PROFILE.github} target="_blank" rel="noreferrer">
                  GITHUB ↗
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  LINKEDIN ↗
                </a>
              </div>

              <div className="profile-footer">Penn State · CS · 2027</div>
            </aside>

            <div className="content-column">
              <nav
                aria-label="Portfolio sections"
                role="tablist"
                className="mobile-tabs"
              >
                {NAV.map((id) => (
                  <TabButton
                    key={id}
                    id={id}
                    activeTab={activeTab}
                    onSelect={setActiveTab}
                  />
                ))}
              </nav>

              <div
                className={`main-panel ${activeTab ? "" : "is-room-home"}`}
                role="tabpanel"
              >
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
                    <div className="room-bar">
                      <span>
                        <i /> ROOM 0921
                      </span>
                      <span>SELECT AN OBJECT OR MENU</span>
                    </div>

                    <div className="room-stage">
                      <MiniRoomHero onOpen={setActiveTab} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <nav
              aria-label="Portfolio sections"
              role="tablist"
              className="side-tabs"
            >
              {NAV.map((id) => (
                <TabButton
                  key={id}
                  id={id}
                  activeTab={activeTab}
                  onSelect={setActiveTab}
                />
              ))}
            </nav>
          </div>
        </section>
      </main>
    </BgmPlayerProvider>
  );
}

function TabButton({
  id,
  activeTab,
  onSelect,
}: {
  id: WindowId;
  activeTab: WindowId | null;
  onSelect: (id: WindowId) => void;
}) {
  const active = activeTab === id;

  return (
    <button
      onClick={() => onSelect(id)}
      aria-selected={active}
      role="tab"
      className={`mini-tab ${active ? "is-active" : ""}`}
    >
      <span className="tab-dot" />
      {WINDOW_META[id].title}
      <span className="tab-arrow">›</span>
    </button>
  );
}
