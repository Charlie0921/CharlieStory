import { supabase } from "./client";
import type {
  PortfolioProfile,
  PortfolioProfileUpdate,
  PortfolioSkill,
  PortfolioSkillUpsert,
  SkillGroup,
} from "@/lib/types";

function sortSkills(
  a: Pick<PortfolioSkill, "order_index" | "skill_group">,
  b: Pick<PortfolioSkill, "order_index" | "skill_group">
) {
  const aOrder = a.order_index ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.order_index ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.skill_group.localeCompare(b.skill_group);
}

export function mapPortfolioSkillToSkillGroup(skill: PortfolioSkill): SkillGroup {
  return {
    group: skill.skill_group,
    items: skill.items,
  };
}

export async function getProfile(): Promise<PortfolioProfile | null> {
  const { data, error } = await supabase
    .from("portfolio_profile")
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as PortfolioProfile | null;
}

export async function updateProfile(
  id: string,
  profile: PortfolioProfileUpdate
) {
  const { error } = await supabase
    .from("portfolio_profile")
    .update(profile)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getPublishedSkills(): Promise<PortfolioSkill[]> {
  const { data, error } = await supabase
    .from("portfolio_skills")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("skill_group", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PortfolioSkill[]).sort(sortSkills);
}

export async function getAdminSkills(): Promise<PortfolioSkill[]> {
  const { data, error } = await supabase
    .from("portfolio_skills")
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("skill_group", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PortfolioSkill[]).sort(sortSkills);
}

export async function createSkill(skill: PortfolioSkillUpsert) {
  const { error } = await supabase.from("portfolio_skills").insert(skill);

  if (error) {
    throw error;
  }
}

export async function updateSkill(id: string, skill: PortfolioSkillUpsert) {
  const { error } = await supabase
    .from("portfolio_skills")
    .update(skill)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from("portfolio_skills").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function toggleSkillPublished(id: string, isPublished: boolean) {
  const { error } = await supabase
    .from("portfolio_skills")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
