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
import { getProfile } from "@/lib/supabase/resume";
import {
  fallbackSidebarProfile,
  getSidebarProfile,
} from "@/lib/supabase/sidebarProfile";
import type { Project, Role, SidebarProfileUpsert, Track, WindowId } from "@/lib/types";

type NavId = "home" | WindowId;

const NAV: NavId[] = [
  "home",
  "projects",
  "experience",
  "resume",
  "notes",
  "contact",
];

const HOME_NAV_LABELS: Partial<Record<NavId, string>> = {
  home: "HOME",
  notes: "BLOG",
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<WindowId | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Role[]>(EXPERIENCE);
  const [resumeHref, setResumeHref] = useState(PROFILE.resume);
  const [sidebarProfile, setSidebarProfile] =
    useState<SidebarProfileUpsert>(fallbackSidebarProfile);

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

  useEffect(() => {
    let active = true;

    async function loadResumeHref() {
      try {
        const profile = await getProfile();
        const resumeUrl = profile?.resume_url?.trim();

        if (active && resumeUrl) {
          setResumeHref(resumeUrl);
        }
      } catch (error) {
        console.error("Failed to fetch resume link:", error);
      }
    }

    loadResumeHref();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSidebarProfile() {
      try {
        const profile = await getSidebarProfile();

        if (active && profile) {
          setSidebarProfile({
            profile_image_url: profile.profile_image_url,
            display_name: profile.display_name,
            role_title: profile.role_title,
            short_bio: profile.short_bio,
            status_text: profile.status_text,
            footer_text: profile.footer_text,
            github_url: profile.github_url,
            linkedin_url: profile.linkedin_url,
            bgm_title: profile.bgm_title,
            bgm_artist: profile.bgm_artist,
            bgm_audio_url: profile.bgm_audio_url,
          });
        }
      } catch (error) {
        console.error("Failed to fetch sidebar profile:", error);
      }
    }

    loadSidebarProfile();

    return () => {
      active = false;
    };
  }, []);

  const sidebarTracks: Track[] = sidebarProfile.bgm_audio_url?.trim()
    ? [
        {
          title: sidebarProfile.bgm_title?.trim() || "BGM",
          artist: sidebarProfile.bgm_artist?.trim() || "Portfolio",
          src: sidebarProfile.bgm_audio_url,
        },
      ]
    : [];

  const CONTENT: Record<WindowId, ReactNode> = {
    about: <AboutWindow />,
    projects: <ProjectsWindow projects={projects} />,
    experience: <ExperienceWindow experiences={experiences} />,
    resume: <ResumeWindow />,
    notes: <NotesWindow />,
    contact: <ContactWindow />,
  };

  return (
    <BgmPlayerProvider tracks={sidebarTracks}>
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
                  src={sidebarProfile.profile_image_url || "/images/profile.png"}
                  alt={sidebarProfile.display_name}
                  className="profile-photo"
                />
              </div>

              <div className="profile-copy">
                <h2>{sidebarProfile.display_name}</h2>
                <p className="profile-title">{sidebarProfile.role_title}</p>
                <div className="hidden">
                <p className="profile-title">Software engineer · builder</p>
                </div>
                <p className="profile-intro">
                  {sidebarProfile.short_bio}
                </p>
              </div>

              <div className="profile-status">
                <span /> {sidebarProfile.status_text}
              </div>

              <div className="profile-bgm">
                <BgmWidget mini />
              </div>

              <button
                onClick={() => setActiveTab("about")}
                className="hidden"
              >
                VIEW FULL PROFILE <span>→</span>
              </button>

              <div className="profile-links" aria-label="Profile links">
                <a href={sidebarProfile.github_url || PROFILE.github} target="_blank" rel="noreferrer">
                  GITHUB ↗
                </a>
                <a href={sidebarProfile.linkedin_url || PROFILE.linkedin} target="_blank" rel="noreferrer">
                  LINKEDIN ↗
                </a>
              </div>

              <div className="profile-footer">{sidebarProfile.footer_text}</div>

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
                    title={HOME_NAV_LABELS[activeTab] ?? WINDOW_META[activeTab].title}
                    subtitle={WINDOW_META[activeTab].subtitle}
                    accent={WINDOW_META[activeTab].accent}
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
                      <section className="home-intro" aria-label="Portfolio entry points">
                        <div className="home-intro__copy">
                          <p className="home-intro__description">
                            A small room for software projects, business systems, and creative tools.
                          </p>
                        </div>

                        <div className="home-intro__actions" aria-label="Primary actions">
                          <button
                            type="button"
                            className="home-cta home-cta--primary"
                            onClick={() => setActiveTab("projects")}
                          >
                            View Projects
                          </button>
                          <a
                            className="home-cta"
                            href={resumeHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Resume
                          </a>
                        </div>
                      </section>

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
  id: NavId;
  activeTab: WindowId | null;
  onSelect: (id: WindowId | null) => void;
}) {
  const active = id === "home" ? activeTab === null : activeTab === id;
  const label =
    id === "home" ? HOME_NAV_LABELS.home : HOME_NAV_LABELS[id] ?? WINDOW_META[id].title;

  return (
    <button
      onClick={() => onSelect(id === "home" ? null : id)}
      aria-selected={active}
      role="tab"
      className={`mini-tab ${active ? "is-active" : ""}`}
    >
      <span className="tab-dot" />
      {label}
      <span className="tab-arrow">›</span>
    </button>
  );
}
