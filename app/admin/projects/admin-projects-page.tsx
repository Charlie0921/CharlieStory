"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminProjectList from "@/components/admin/AdminProjectList";
import { supabase } from "@/lib/supabase/client";
import {
  getAllPortfolioProjects,
  type PortfolioProjectRow,
} from "@/lib/supabase/projects";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<PortfolioProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setError("");

    try {
      const rows = await getAllPortfolioProjects();
      setProjects(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }, []);

  useEffect(() => {
    async function checkUserAndLoadProjects() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      await loadProjects();
      setLoading(false);
    }

    checkUserAndLoadProjects();
  }, [loadProjects, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <main className="site-shell">
        <section className="mini-home-shell is-room-home admin-page-shell p-8">
          <p className="text-sm text-ink-soft">Loading admin projects...</p>
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
                Project Editor
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Manage the projects shown in the portfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/projects/new"
                className="rounded-md border border-coral-deep bg-coral px-3 py-2 font-accent text-base uppercase tracking-[0.08em] text-white"
              >
                New Project
              </Link>
              <button
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

          <AdminProjectList projects={projects} onChanged={loadProjects} />
        </div>
      </section>
    </main>
  );
}
