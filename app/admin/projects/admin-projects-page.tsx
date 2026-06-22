"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import AdminProjectList from "@/components/admin/AdminProjectList";
import type { Project } from "@/lib/types";

type PortfolioProjectRow = {
  id: string;
  file_no: string;
  title: string;
  impact: string | null;
  org: string | null;
  status: string | null;
  domain: Project["domain"];
  category: string | null;
  problem: string | null;
  solution: string | null;
  role: string | null;
  result: string | null;
  stack: string[] | null;
  images: Project["images"] | null;
  links: Project["links"] | null;
  technical_details: string[] | null;
  challenges: string[] | null;
  display_order: number | null;
  is_published: boolean;
};

export default function AdminProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<PortfolioProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserAndLoadProjects() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Failed to load admin projects:", error);
      } else {
        setProjects((data ?? []) as PortfolioProjectRow[]);
      }

      setLoading(false);
    }

    checkUserAndLoadProjects();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <main className="site-shell">
        <section className="mini-home-shell is-room-home p-8">
          <p className="text-sm text-ink-soft">Loading admin projects...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="mini-home-shell is-room-home p-8">
        <div className="mx-auto max-w-5xl rounded-xl border border-line bg-white p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
                Project Editor
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Manage the projects shown in the portfolio.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-md border border-line bg-mist px-3 py-2 font-accent text-sm uppercase tracking-[0.08em] text-ink-soft"
            >
              Logout
            </button>
          </div>

          <AdminProjectList projects={projects} />
        </div>
      </section>
    </main>
  );
}