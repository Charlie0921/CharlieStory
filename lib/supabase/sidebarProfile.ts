import { PROFILE, TRACKS } from "@/lib/data";
import type { SidebarProfile, SidebarProfileUpsert } from "@/lib/types";
import { supabase } from "./client";

export const fallbackSidebarProfile: SidebarProfileUpsert = {
  profile_image_url: "/images/profile.png",
  display_name: "Charlie Kim",
  role_title: "Software engineer · builder",
  short_bio:
    "CS student building small useful tools for business workflows and creative interfaces.",
  status_text: PROFILE.status,
  footer_text: "Penn State · CS · 2027",
  github_url: PROFILE.github,
  linkedin_url: PROFILE.linkedin,
  bgm_title: TRACKS[0]?.title ?? null,
  bgm_artist: TRACKS[0]?.artist ?? null,
  bgm_audio_url: TRACKS[0]?.src ?? null,
};

export async function getSidebarProfile(): Promise<SidebarProfile | null> {
  const { data, error } = await supabase
    .from("portfolio_sidebar_profile")
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as SidebarProfile | null;
}

export async function saveSidebarProfile(
  id: string | null,
  profile: SidebarProfileUpsert
): Promise<SidebarProfile> {
  if (id) {
    const { data, error } = await supabase
      .from("portfolio_sidebar_profile")
      .update(profile)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as SidebarProfile;
  }

  const { data, error } = await supabase
    .from("portfolio_sidebar_profile")
    .insert(profile)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SidebarProfile;
}
