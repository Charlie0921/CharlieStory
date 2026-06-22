import { supabase } from "./client";
import type { Project } from "@/types";

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

function mapPortfolioProject(row: PortfolioProjectRow): Project {
  return {
    fileNo: row.file_no,
    title: row.title,
    impact: row.impact ?? "",
    org: row.org ?? "",
    status: row.status ?? "",
    domain: row.domain,
    category: row.category ?? "",
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    role: row.role ?? "",
    result: row.result ?? "",
    stack: row.stack ?? [],
    images: row.images ?? [],
    links: row.links ?? { github: "", demo: "", caseStudy: "" },
    technicalDetails: row.technical_details ?? [],
    challenges: row.challenges ?? [],
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch portfolio projects:", error);
    return [];
  }

  return (data ?? []).map((row) =>
    mapPortfolioProject(row as PortfolioProjectRow)
  );
}