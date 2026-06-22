import { supabase } from "./client";
import type { Project, ProjectImage, ProjectLinks } from "@/lib/types";

export type PortfolioProjectRow = {
  id: string;
  file_no: string;
  title: string;
  impact: string | null;
  org: string | null;
  status: string | null;
  domain: Project["domain"] | null;
  category: string | null;
  problem: string | null;
  solution: string | null;
  role: string | null;
  result: string | null;
  stack: string[] | null;
  images: ProjectImage[] | null;
  links: Partial<ProjectLinks> | null;
  technical_details: string[] | null;
  challenges: string[] | null;
  display_order: number | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PortfolioProjectUpsert = {
  file_no: string;
  title: string;
  impact: string | null;
  org: string | null;
  status: string | null;
  domain: Project["domain"] | null;
  category: string | null;
  problem: string | null;
  solution: string | null;
  role: string | null;
  result: string | null;
  stack: string[];
  images: ProjectImage[];
  links: Partial<ProjectLinks>;
  technical_details: string[];
  challenges: string[];
  display_order: number | null;
  is_published: boolean;
};

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function asLinks(value: Partial<ProjectLinks> | null | undefined): ProjectLinks {
  return {
    github: value?.github ?? "",
    demo: value?.demo ?? "",
    caseStudy: value?.caseStudy ?? "",
  };
}

export function mapPortfolioProject(row: PortfolioProjectRow): Project {
  return {
    fileNo: row.file_no,
    title: row.title,
    impact: row.impact ?? "",
    org: row.org ?? "",
    status: row.status ?? "",
    domain: row.domain ?? "product",
    category: row.category ?? "",
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    role: row.role ?? "",
    result: row.result ?? "",
    stack: asArray(row.stack),
    images: asArray(row.images),
    links: asLinks(row.links),
    technicalDetails: asArray(row.technical_details),
    challenges: asArray(row.challenges),
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

  return ((data ?? []) as PortfolioProjectRow[]).map(mapPortfolioProject);
}

export async function getAllPortfolioProjects(): Promise<PortfolioProjectRow[]> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PortfolioProjectRow[];
}

export async function getPortfolioProjectById(
  id: string
): Promise<PortfolioProjectRow | null> {
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as PortfolioProjectRow;
}

export async function createPortfolioProject(project: PortfolioProjectUpsert) {
  const { error } = await supabase.from("portfolio_projects").insert(project);

  if (error) {
    throw error;
  }
}

export async function updatePortfolioProject(
  id: string,
  project: PortfolioProjectUpsert
) {
  const { error } = await supabase
    .from("portfolio_projects")
    .update(project)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function setPortfolioProjectPublished(
  id: string,
  isPublished: boolean
) {
  const { error } = await supabase
    .from("portfolio_projects")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deletePortfolioProject(id: string) {
  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
