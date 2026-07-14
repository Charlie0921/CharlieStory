"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/lib/types";

type NotesResponse = {
  notes?: Note[];
  error?: string;
};

export default function NotesWindow() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNotes() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/notes");
        const data = (await response.json()) as NotesResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load notes.");
        }

        if (active) {
          setNotes(data.notes ?? []);
        }
      } catch (loadError) {
        console.error("Failed to fetch notes:", loadError);

        if (active) {
          setError("Notes could not be loaded right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <NotesState message="Loading notes..." />;
  }

  if (error) {
    return <NotesState message={error} />;
  }

  if (!notes.length) {
    return <NotesState message="No published notes are available yet." />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 text-sm leading-relaxed text-ink-soft">
        Compact technical notes from my working archive.
      </p>

      <div className="space-y-3">
        {notes.map((note, index) => {
          const expanded = expandedId === note.id;

          return (
            <article
              key={note.id}
              className="rounded-xl border border-line bg-white p-4 sm:p-5"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : note.id)}
                aria-expanded={expanded}
                className="grid w-full gap-3 text-left sm:grid-cols-[92px_1fr]"
              >
                <div>
                  <span className="font-accent text-base tracking-[0.08em] text-coral-deep">
                    NOTE-{String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 font-accent text-base text-ink-soft">
                    {formatDate(note.createdAt)}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {note.title || "Untitled note"}
                    </h3>
                    {note.featured ? (
                      <span className="rounded border border-line px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-ink-soft">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm font-medium text-coral-deep">
                    {note.category || "Technical Note"}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {note.summary || "No summary available."}
                  </p>
                </div>
              </button>

              {expanded ? (
                <div className="mt-4 border-t border-dashed border-line pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Category">
                      {note.category || "Technical Note"}
                    </Field>
                    <Field label="Created">{formatDate(note.createdAt)}</Field>
                    <Field label="Tags">
                      {note.tags.length ? (
                        <span className="flex flex-wrap gap-1.5">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-line px-2 py-0.5 font-mono text-[0.58rem] text-ink-soft"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      ) : (
                        "None"
                      )}
                    </Field>
                  </div>

                  <div className="mt-4 rounded-md bg-[#f4f0e8] px-3 py-2 text-sm leading-relaxed text-ink">
                    {note.summary || "No summary available."}
                  </div>

                  {note.notionUrl ? (
                    <a
                      href={note.notionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="primary-button mt-4 inline-flex"
                    >
                      Read full note in Notion <span className="ml-2">↗</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function NotesState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-line bg-white p-5 text-sm text-ink-soft sm:p-7">
        {message}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
