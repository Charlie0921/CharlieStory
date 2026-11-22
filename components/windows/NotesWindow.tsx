"use client";
import { useEffect, useState } from "react";
import type { Note } from "@/lib/types";
import NotionContent from "@/components/NotionContent";
import styles from "@/app/portfolio.module.css";

const NOTES_PER_PAGE = 5;

export default function NotesWindow() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(NOTES_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setVisibleCount(NOTES_PER_PAGE);
    setExpanded(null);
    fetch("/api/notes", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Notes are temporarily unavailable.");
        return response.json();
      })
      .then((data) => setNotes(data.notes ?? []))
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  if (loading)
    return (
      <div className={styles.contentLoading} role="status">
        <span className={styles.loadingCharacter} aria-hidden="true">
          <img src="/images/character/search.png" alt="" />
        </span>
        <p>Loading notes…</p>
      </div>
    );
  if (error)
    return (
      <div role="status">
        <p>{error}</p>
        <button
          className={styles.lightButton}
          onClick={() => setAttempt((n) => n + 1)}
        >
          Try again
        </button>
      </div>
    );
  if (!notes.length) return <p>No published notes yet.</p>;
  const visibleNotes = notes.slice(0, visibleCount);
  const remaining = Math.max(0, notes.length - visibleNotes.length);
  return (
    <div className={styles.experience}>
      {visibleNotes.map((note) => (
        <article key={note.id} className={styles.noteItem}>
          <button
            className={styles.noteToggle}
            aria-expanded={expanded === note.id}
            aria-controls={`note-${note.id}`}
            onClick={() => setExpanded(expanded === note.id ? null : note.id)}
          >
            <span className={styles.eyebrow}>
              {note.category || "Technical note"}
              {note.createdAt &&
                ` · ${new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}`}
            </span>
            <h3>{note.title}</h3>
            {note.summary && <p>{note.summary}</p>}
            <span>{expanded === note.id ? "Close note" : "Read note"}</span>
          </button>
          <div className={styles.tags}>
            {note.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {expanded === note.id && (
            <div id={`note-${note.id}`}>
              <NotionContent kind="notes" id={note.id} />
            </div>
          )}
        </article>
      ))}
      {notes.length > NOTES_PER_PAGE && (
        <div className={styles.notesMoreWrap}>
          <button
            className={styles.lightButton}
            type="button"
            onClick={() => {
              setExpanded(null);
              setVisibleCount((current) =>
                remaining
                  ? Math.min(current + NOTES_PER_PAGE, notes.length)
                  : NOTES_PER_PAGE,
              );
            }}
          >
            {remaining
              ? `View ${Math.min(NOTES_PER_PAGE, remaining)} more notes`
              : "Show fewer notes"}
          </button>
          <span>
            {visibleNotes.length} of {notes.length}
          </span>
        </div>
      )}
    </div>
  );
}
