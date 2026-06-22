"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { supabase } from "@/lib/supabase/client";
import {
  getPortfolioProjectById,
  updatePortfolioProject,
  type PortfolioProjectRow,
  type PortfolioProjectUpsert,
} from "@/lib/supabase/projects";

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<PortfolioProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkUserAndLoadProject() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      try {
        const row = await getPortfolioProjectById(params.id);
        setProject(row);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project.");
      } finally {
        setLoading(false);
      }
    }

    checkUserAndLoadProject();
  }, [params.id, router]);

  async function handleSubmit(projectUpdate: PortfolioProjectUpsert) {
    await updatePortfolioProject(params.id, projectUpdate);
    router.replace("/admin/projects");
  }

  if (loading) {
    return <AdminShell>Loading project...</AdminShell>;
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <Link href="/admin/projects" className="text-sm text-ink-soft">
          Back to projects
        </Link>
        <p className="eyebrow mt-4">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
          Edit Project
        </h1>
      </div>

      {error ? (
        <p className="rounded-md border border-coral bg-white px-3 py-2 text-sm text-coral-deep">
          {error}
        </p>
      ) : project ? (
        <ProjectForm mode="edit" project={project} onSubmit={handleSubmit} />
      ) : (
        <p className="text-sm text-ink-soft">Project not found.</p>
      )}
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home admin-page-shell p-6">
        <div className="mx-auto w-full max-w-5xl rounded-xl border border-line bg-paper-bright p-6 shadow-soft">
          {children}
        </div>
      </section>
    </main>
  );
}
