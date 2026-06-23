"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { supabase } from "@/lib/supabase/client";
import {
  createPortfolioProject,
  type PortfolioProjectUpsert,
} from "@/lib/supabase/projects";

export default function NewProjectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, [router]);

  async function handleSubmit(project: PortfolioProjectUpsert) {
    await createPortfolioProject(project);
    router.replace("/admin/projects");
  }

  if (checking) {
    return <AdminShell>Loading new project form...</AdminShell>;
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <Link href="/admin/projects" className="text-sm text-ink-soft">
          Back to projects
        </Link>
        <p className="eyebrow mt-4">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
          New Project
        </h1>
      </div>

      <ProjectForm mode="create" onSubmit={handleSubmit} />
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
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
