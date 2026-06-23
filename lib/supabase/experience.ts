import { supabase } from "./client";
import type { PortfolioExperience, Role } from "@/lib/types";

export type { PortfolioExperience };
export type PortfolioExperienceRow = PortfolioExperience;

export type PortfolioExperienceUpsert = {
  org: string;
  title: string;
  slug: string | null;
  type: string | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  place: string | null;
  logs: string[];
  skills: string[];
  impact: string | null;
  company_url: string | null;
  order_index: number | null;
  is_published: boolean;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function sortExperiences(
  a: Pick<PortfolioExperience, "order_index" | "start_date">,
  b: Pick<PortfolioExperience, "order_index" | "start_date">
) {
  const aOrder = a.order_index ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.order_index ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  const aStart = a.start_date ? Date.parse(a.start_date) : 0;
  const bStart = b.start_date ? Date.parse(b.start_date) : 0;

  return bStart - aStart;
}

export function mapPortfolioExperience(
  row: PortfolioExperienceRow
): PortfolioExperience {
  return {
    ...row,
    slug: row.slug ?? null,
    type: row.type ?? null,
    start_date: row.start_date ?? null,
    end_date: row.end_date ?? null,
    date_label: row.date_label ?? null,
    place: row.place ?? null,
    logs: stringArray(row.logs),
    skills: stringArray(row.skills),
    impact: row.impact ?? null,
    company_url: row.company_url ?? null,
    order_index: row.order_index ?? null,
    is_published: Boolean(row.is_published),
  };
}

export function mapExperienceToRole(experience: PortfolioExperience): Role {
  return {
    org: experience.org,
    title: experience.title,
    dates: experience.date_label ?? "",
    place: experience.place ?? "",
    logs: experience.logs,
    skills: experience.skills,
    impact: experience.impact ?? "",
  };
}

export async function getPublishedExperiences(): Promise<PortfolioExperience[]> {
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("start_date", { ascending: false, nullsFirst: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PortfolioExperienceRow[])
    .map(mapPortfolioExperience)
    .sort(sortExperiences);
}

export async function getAdminExperiences(): Promise<PortfolioExperience[]> {
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("start_date", { ascending: false, nullsFirst: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PortfolioExperienceRow[])
    .map(mapPortfolioExperience)
    .sort(sortExperiences);
}

export async function createExperience(experience: PortfolioExperienceUpsert) {
  const { error } = await supabase
    .from("portfolio_experiences")
    .insert(experience);

  if (error) {
    throw error;
  }
}

export async function updateExperience(
  id: string,
  experience: PortfolioExperienceUpsert
) {
  const { error } = await supabase
    .from("portfolio_experiences")
    .update(experience)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteExperience(id: string) {
  const { error } = await supabase
    .from("portfolio_experiences")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function toggleExperiencePublished(
  id: string,
  isPublished: boolean
) {
  const { error } = await supabase
    .from("portfolio_experiences")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
