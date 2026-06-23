import type { Project } from "@/lib/types";

export function mapPortfolioProject(row: any): Project {
  return {
    fileNo: row.file_no,
    title: row.title,
    impact: row.impact,
    org: row.org,
    status: row.status,
    domain: row.domain,
    category: row.category,
    problem: row.problem,
    solution: row.solution,
    role: row.role,
    result: row.result,
    stack: row.stack ?? [],
    images: row.images ?? [],
    links: row.links ?? {},
    technicalDetails: row.technical_details ?? [],
    challenges: row.challenges ?? [],
  };
}
