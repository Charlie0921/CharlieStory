"use client";

import Link from "next/link";
import { useState } from "react";
import {
  deletePortfolioProject,
  setPortfolioProjectPublished,
  type PortfolioProjectRow,
} from "@/lib/supabase/projects";

type AdminProjectListProps = {
  projects: PortfolioProjectRow[];
  onChanged: () => Promise<void> | void;
};

export default function AdminProjectList({
  projects,
  onChanged,
}: AdminProjectListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function togglePublished(project: PortfolioProjectRow) {
    setBusyId(project.id);
    setError("");

    try {
      await setPortfolioProjectPublished(project.id, !project.is_published);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProject(project: PortfolioProjectRow) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    setBusyId(project.id);
    setError("");

    try {
      await deletePortfolioProject(project.id);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusyId(null);
    }
  }

  if (!projects.length) {
    return (
      <p className="rounded-lg border border-line bg-mist p-4 text-sm text-ink-soft">
        No projects found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-mist">
            <tr>
              <th className="border-b border-line px-3 py-2">Order</th>
              <th className="border-b border-line px-3 py-2">File No</th>
              <th className="border-b border-line px-3 py-2">Title</th>
              <th className="border-b border-line px-3 py-2">Status</th>
              <th className="border-b border-line px-3 py-2">Domain</th>
              <th className="border-b border-line px-3 py-2">Published</th>
              <th className="border-b border-line px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => {
              const disabled = busyId === project.id;

              return (
                <tr key={project.id}>
                  <td className="border-b border-line px-3 py-2">
                    {project.display_order ?? ""}
                  </td>
                  <td className="border-b border-line px-3 py-2 font-mono">
                    {project.file_no}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    {project.title}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    {project.status ?? ""}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    {project.domain ?? ""}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    {project.is_published ? "Yes" : "No"}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => togglePublished(project)}
                        className="rounded border border-line bg-mist px-2 py-1 text-xs text-ink disabled:opacity-50"
                      >
                        {project.is_published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => deleteProject(project)}
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
    </div>
  );
}
