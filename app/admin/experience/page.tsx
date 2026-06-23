"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExperienceForm from "@/components/admin/ExperienceForm";
import { supabase } from "@/lib/supabase/client";
import {
  createExperience,
  deleteExperience,
  getAdminExperiences,
  toggleExperiencePublished,
  updateExperience,
  type PortfolioExperience,
  type PortfolioExperienceUpsert,
} from "@/lib/supabase/experience";

export default function AdminExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<PortfolioExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioExperience | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadExperiences = useCallback(async () => {
    setError("");

    try {
      const rows = await getAdminExperiences();
      setExperiences(rows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load experiences."
      );
    }
  }, []);

  useEffect(() => {
    async function checkUserAndLoadExperiences() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      await loadExperiences();
      setLoading(false);
    }

    checkUserAndLoadExperiences();
  }, [loadExperiences, router]);

  async function handleSubmit(experience: PortfolioExperienceUpsert) {
    if (editing) {
      await updateExperience(editing.id, experience);
    } else {
      await createExperience(experience);
    }

    setShowForm(false);
    setEditing(null);
    await loadExperiences();
  }

  async function handleToggle(experience: PortfolioExperience) {
    setBusyId(experience.id);
    setError("");

    try {
      await toggleExperiencePublished(
        experience.id,
        !experience.is_published
      );
      await loadExperiences();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update experience."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(experience: PortfolioExperience) {
    if (
      !window.confirm(`Delete "${experience.title}"? This cannot be undone.`)
    ) {
      return;
    }

    setBusyId(experience.id);
    setError("");

    try {
      await deleteExperience(experience.id);
      await loadExperiences();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete experience."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function startCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(experience: PortfolioExperience) {
    setEditing(experience);
    setShowForm(true);
  }

  function cancelForm() {
    setEditing(null);
    setShowForm(false);
  }

  if (loading) {
    return (
      <main className="site-shell">
        <section className="mini-home-shell is-room-home admin-page-shell p-8">
          <p className="text-sm text-ink-soft">Loading admin experience...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home admin-page-shell p-6">
        <div className="mx-auto w-full max-w-6xl rounded-xl border border-line bg-paper-bright p-6 shadow-soft">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                Experience Editor
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Manage the roles shown in the portfolio experience window.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/projects"
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Projects
              </Link>
              <button
                type="button"
                onClick={startCreate}
                className="rounded-md border border-coral-deep bg-coral px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-white"
              >
                New Experience
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-ink-soft"
              >
                Logout
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
              {error}
            </p>
          ) : null}

          {showForm ? (
            <div className="mb-6 rounded-lg border border-line bg-mist p-4">
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                {editing ? "Edit Experience" : "New Experience"}
              </h2>
              <ExperienceForm
                key={editing?.id ?? "new"}
                experience={editing}
                onSubmit={handleSubmit}
                onCancel={cancelForm}
              />
            </div>
          ) : null}

          {!experiences.length ? (
            <p className="rounded-lg border border-line bg-mist p-4 text-sm text-ink-soft">
              No experiences found.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-line bg-white">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="bg-mist">
                  <tr>
                    <th className="border-b border-line px-3 py-2">Order</th>
                    <th className="border-b border-line px-3 py-2">Org</th>
                    <th className="border-b border-line px-3 py-2">Title</th>
                    <th className="border-b border-line px-3 py-2">Dates</th>
                    <th className="border-b border-line px-3 py-2">Place</th>
                    <th className="border-b border-line px-3 py-2">
                      Published
                    </th>
                    <th className="border-b border-line px-3 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {experiences.map((experience) => {
                    const disabled = busyId === experience.id;

                    return (
                      <tr key={experience.id}>
                        <td className="border-b border-line px-3 py-2">
                          {experience.order_index ?? ""}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          {experience.company_url ? (
                            <a
                              href={experience.company_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-coral-deep underline-offset-2 hover:underline"
                            >
                              {experience.org}
                            </a>
                          ) : (
                            experience.org
                          )}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          {experience.title}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          {experience.date_label ?? experience.start_date ?? ""}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          {experience.place ?? ""}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          {experience.is_published ? "Yes" : "No"}
                        </td>
                        <td className="border-b border-line px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(experience)}
                              className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleToggle(experience)}
                              className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink disabled:opacity-50"
                            >
                              {experience.is_published
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleDelete(experience)}
                              className="rounded border border-coral bg-white px-2 py-1 text-xs text-coral-deep disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
