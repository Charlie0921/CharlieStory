"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, SKILLS } from "@/lib/data";
import type { Project, Role } from "@/lib/types";
import NotionContent from "@/components/NotionContent";
import NotesWindow from "@/components/windows/NotesWindow";
import styles from "./portfolio.module.css";

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Role[]>([]);
  const skills = SKILLS;
  const education = { school: PROFILE.education, graduation: PROFILE.grad };
  const resume = PROFILE.resume;
  const profile = {
    name: "Charlie Kim",
    bio: PROFILE.intro,
    image: "/images/profile.png",
    github: PROFILE.github,
    linkedin: PROFILE.linkedin,
  };
  const [errors, setErrors] = useState<{
    projects: string | null;
    experience: string | null;
  }>({ projects: null, experience: null });
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/portfolio", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!Array.isArray(data.projects) || !Array.isArray(data.experiences))
          throw new Error("Invalid response");
        setProjects(data.projects);
        setExperiences(data.experiences);
        setErrors(data.errors);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setErrors({
            projects: "Projects are temporarily unavailable.",
            experience: "Experience is temporarily unavailable.",
          });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const visible = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );
  const displayedProjects = showAllProjects ? visible : visible.slice(0, 4);

  return (
    <main className={styles.page} id="top">
      <a className={styles.skip} href="#work">
        Skip to projects
      </a>
      <header className={styles.header}>
        <a
          className={styles.wordmark}
          href="#top"
          aria-label="Charlie Kim home"
        >
          ck<span>*</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a className={styles.navContact} href="#contact">
            Let’s talk
          </a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="intro-title">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>KUNJOONG “CHARLIE” KIM · DEVELOPER</p>
          <h1 id="intro-title">
            Making complex
            <br />
            things <span>feel simple.</span>
          </h1>
          <p className={styles.heroCopy}>{profile.bio}</p>
          <div className={styles.actions}>
            <a className={styles.darkButton} href="#work">
              Explore my work
            </a>
            <a
              className={styles.lightButton}
              href={resume}
              target="_blank"
              rel="noreferrer"
            >
              View résumé
            </a>
          </div>
          <p className={styles.heroMeta}>
            Computer Science @ Penn State <span> / </span> Class of 2027
          </p>
        </div>
        <div className={styles.heroArt}>
          <span className={styles.handNote}>
            a little curiosity,
            <br />a lot of building.
          </span>
          <div className={styles.portrait}>
            <img src={profile.image} alt={profile.name} />
            <span>Hello, I’m {profile.name.split(" ")[0]}.</span>
          </div>
          <span className={styles.heroComputer} aria-hidden="true">
            <img src="/images/character/computer.png" alt="" />
          </span>
          <span className={styles.artLabel}>software + systems + people</span>
        </div>
      </section>

      <div className={styles.interests}>
        <span>Built with purpose.</span>
        <p>
          Full-stack development <i /> Business systems <i /> Applied AI
        </p>
        <span className={styles.smallFlower}>✳</span>
      </div>

      <section
        id="work"
        className={styles.section}
        aria-labelledby="work-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>SELECTED WORK</p>
            <h2 id="work-title">Real problems. Useful software.</h2>
          </div>
          <p>
            From everyday friction to working products.
            <br />A few things I’ve helped bring to life.
          </p>
        </div>
        <div className={styles.filters} aria-label="Filter projects">
          {[
            ["all", "All work"],
            ["Full Stack", "Full Stack"],
            ["Business Systems", "Business Systems"],
            ["Machine Learning", "Machine Learning"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={filter === id}
              onClick={() => {
                setFilter(id);
                setShowAllProjects(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.projectGrid} id="project-grid">
          {displayedProjects.map((project, index) => (
            <article className={styles.project} key={project.fileNo}>
              <button
                className={`${styles.projectImage} ${styles[`tone${index % 3}`]}`}
                onClick={() => setSelected(project)}
                aria-label={`Read ${project.title} case study`}
              >
                {project.images[0] ? (
                  <img
                    src={project.images[0].src}
                    alt={project.images[0].alt}
                    loading="lazy"
                  />
                ) : (
                  <span className={styles.projectPlaceholder}>
                    {project.title}
                  </span>
                )}
                <span className={styles.projectBadge}>
                  {project.status || "Project"}
                </span>
                <span className={styles.imageAction}>Explore project</span>
              </button>
              <div className={styles.projectMeta}>
                <span>{project.category || "Project"}</span>
                <span>{project.role}</span>
              </div>
              <h3>
                <button onClick={() => setSelected(project)}>
                  {project.title}
                </button>
              </h3>
              <p>{project.impact}</p>
              <div className={styles.tags}>
                {project.stack.slice(0, 4).map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        {visible.length > 4 && (
          <div className={styles.projectToggleWrap}>
            <span className={styles.projectCharacter} aria-hidden="true">
              <img
                src="/images/character/more%20project.png"
                alt=""
                loading="lazy"
              />
            </span>
            <button
              className={styles.projectToggle}
              type="button"
              aria-controls="project-grid"
              aria-expanded={showAllProjects}
              onClick={() => setShowAllProjects((current) => !current)}
            >
              <span>
                {showAllProjects
                  ? "Show fewer projects"
                  : `View more projects (${visible.length - 4})`}
              </span>
              <span className={styles.projectToggleIcon} aria-hidden="true">
                {showAllProjects ? "↑" : "↓"}
              </span>
            </button>
          </div>
        )}
        {!visible.length && (
          <div
            className={`${styles.empty} ${loading ? styles.loadingState : ""}`}
            role="status"
          >
            {loading && (
              <span className={styles.loadingCharacter} aria-hidden="true">
                <img src="/images/character/search.png" alt="" />
              </span>
            )}
            <p>
              {loading
                ? "Loading projects…"
                : errors.projects ||
                  "No published projects in this category yet."}
            </p>
          </div>
        )}
        {errors.projects && (
          <button
            className={styles.lightButton}
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        )}
      </section>

      <section
        id="about"
        className={`${styles.section} ${styles.about}`}
        aria-labelledby="about-title"
      >
        <div>
          <p className={styles.eyebrow}>THE PERSON BEHIND THE CODE</p>
          <h2 id="about-title">
            An engineer’s mindset.
            <br />
            <span>A builder’s curiosity.</span>
          </h2>
          <p>{PROFILE.bio}</p>
          <p>{PROFILE.bio2}</p>
          <a
            className={styles.lightButton}
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            Find me on GitHub
          </a>
        </div>
        <div className={styles.aboutCard}>
          <span className={styles.cardFlower}>✳</span>
          <h3>A little about me</h3>
          <dl>
            <div>
              <dt>Studying</dt>
              <dd>{education.school}</dd>
            </div>
            <div>
              <dt>Graduating</dt>
              <dd>{education.graduation}</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt>Speaking</dt>
              <dd>{PROFILE.languages}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        id="experience"
        className={styles.section}
        aria-labelledby="experience-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>ALONG THE WAY</p>
            <h2 id="experience-title">Where I’ve contributed.</h2>
          </div>
          <p>
            Engineering, operations, and the
            <br />
            people who connect them.
          </p>
        </div>
        {!experiences.length && (
          <p role="status" className={styles.empty}>
            {loading
              ? "Loading experience…"
              : errors.experience || "No published experience yet."}
          </p>
        )}
        {errors.experience && (
          <button
            className={styles.lightButton}
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        )}
        <div className={styles.experience}>
          {experiences.map((role, index) => (
            <details key={`${role.org}-${index}`}>
              <summary>
                <span className={styles.dates}>{role.dates}</span>
                <span>
                  <strong>{role.org}</strong>
                  <span className={styles.roleTitle}>{role.title}</span>
                </span>
                <span className={styles.expand} aria-hidden="true">
                  +
                </span>
              </summary>
              <div className={styles.roleDetails}>
                {role.place && <p>{role.place}</p>}
                <ul>
                  {role.logs.map((log) => (
                    <li key={log}>{log}</li>
                  ))}
                </ul>
                <div className={styles.tags}>
                  {role.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.toolbox}`}
        aria-labelledby="tools-title"
      >
        <div>
          <p className={styles.eyebrow}>MY TOOLBOX</p>
          <h2 id="tools-title">
            The right tools.
            <br />
            For the real problem.
          </h2>
          <p>Across interfaces, APIs, data, and workflows.</p>
        </div>
        <div className={styles.skillGrid}>
          {skills.map((skill) => (
            <div key={skill.group}>
              <h3>{skill.group}</h3>
              <p>{skill.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.notes}`}
        aria-labelledby="notes-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>THINKING OUT LOUD</p>
            <h2 id="notes-title">Notes from the process.</h2>
          </div>
          <button
            className={styles.lightButton}
            aria-expanded={showNotes}
            aria-controls="technical-notes"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? "Close notes" : "Browse technical notes"}
          </button>
        </div>
        {showNotes && (
          <div id="technical-notes" className={styles.notesPanel}>
            <NotesWindow />
          </div>
        )}
      </section>

      <section
        id="contact"
        className={styles.contact}
        aria-labelledby="contact-title"
      >
        <span className={styles.contactCharacter} aria-hidden="true">
          <img
            src="/images/character/contact.png"
            alt=""
            loading="lazy"
          />
        </span>
        <p className={styles.eyebrow}>HAVE SOMETHING IN MIND?</p>
        <h2 id="contact-title">
          Let’s build something
          <br />
          <span>that makes a difference.</span>
        </h2>
        <p>{PROFILE.open}.</p>
        <a className={styles.darkButton} href={`mailto:${PROFILE.email}`}>
          Say hello
        </a>
        <a className={styles.email} href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
      </section>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Made with care &amp; a little curiosity.</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="project-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div className={styles.dialogBody}>
            <button
              className={styles.close}
              onClick={() => dialog.current?.close()}
              aria-label="Close project"
            >
              Close ×
            </button>
            <p className={styles.eyebrow}>
              {selected.org} · {selected.role}
            </p>
            <h2 id="project-title">{selected.title}</h2>
            <p className={styles.lead}>{selected.impact}</p>
            <div className={styles.tags}>
              {selected.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <NotionContent
              key={selected.fileNo}
              kind="projects"
              id={selected.fileNo}
            />
            <div className={styles.actions}>
              {Object.entries(selected.links)
                .filter(([, href]) => href)
                .map(([label, href]) => (
                  <a
                    className={styles.lightButton}
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label === "github"
                      ? "Source code"
                      : label === "demo"
                        ? "Live demo"
                        : "Full case study"}
                  </a>
                ))}
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}
