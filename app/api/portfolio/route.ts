import { NextResponse } from "next/server";
import { getProjects, getExperiences } from "@/lib/notion/portfolio";
export const dynamic = "force-dynamic";
export async function GET() {
  const results = await Promise.allSettled([getProjects(), getExperiences()]);
  const [projects, experience] = results;
  return NextResponse.json(
    {
      projects: projects.status === "fulfilled" ? projects.value : [],
      experiences: experience.status === "fulfilled" ? experience.value : [],
      errors: {
        projects:
          projects.status === "rejected"
            ? "Projects are temporarily unavailable."
            : null,
        experience:
          experience.status === "rejected"
            ? "Experience is temporarily unavailable."
            : null,
      },
    },
    {
      status: results.every((r) => r.status === "rejected") ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
