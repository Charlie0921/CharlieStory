// /pages/Project/api.js
import { supabase } from "./supabaseClient.js";

// 전체 프로젝트 불러오기
export async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select(`
      project_id,
      project_title,
      project_date,
      project_description,
      project_skills,
      project_position,
      project_github,
      project_website,
      project_image,
      details:project_detail (
        id,
        project_inspirations,
        project_whatitdoes,
        project_challenges,
        project_resolutions,
        project_accomplishments,
        project_lessons,
        project_improvements
      )
    `);

  if (error) {
    console.error("Supabase fetchProjects error:", error);
    return [];
  }
  return data ?? [];
}

// 특정 프로젝트 1개 불러오기
export async function fetchProjectById(projectId) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      project_id,
      project_title,
      project_date,
      project_description,
      project_skills,
      project_position,
      project_github,
      project_website,
      project_image,
      details:project_detail (
        id,
        project_inspirations,
        project_whatitdoes,
        project_challenges,
        project_resolutions,
        project_accomplishments,
        project_lessons,
        project_improvements
      )
    `
    )
    .eq("project_id", projectId)
    .single();

  if (error) {
    console.error("Supabase fetchProjectById error:", error);
    return null;
  }
  return data;
}
