import type { Project, Role, Note } from "../types";
import { queryPages, NotionError } from "./client";
import { publicContent } from "./content";
import {
  type NotionPage,
  type ContentBlock,
  isPublic,
  option,
  safeUrl,
  tags,
  text,
  plain,
} from "./model";

const order = (page: NotionPage) =>
  page.properties["Display Order"]?.number ??
  page.properties.Order?.number ??
  Number.MAX_SAFE_INTEGER;
function sorted(pages: NotionPage[]) {
  return [...pages].sort(
    (a, b) =>
      order(a) - order(b) ||
      (b.properties.Date?.date?.start ?? "").localeCompare(
        a.properties.Date?.date?.start ?? "",
      ) ||
      a.id.localeCompare(b.id),
  );
}
export function mapProject(page: NotionPage): Project {
  const p = page.properties;
  const domain = option(p.Domain).toLowerCase();
  return {
    fileNo: page.id,
    title: text(p["제목"]),
    impact: text(p["Short Description"]),
    role: text(p.Position),
    stack: tags(p.Skills),
    domain:
      domain === "research" || domain === "enterprise" ? domain : "product",
    category: option(p.Category),
    org: text(p.Organization),
    status: option(p.Status),
    problem: "",
    solution: "",
    result: "",
    images: page.cover
      ? [
          {
            src: `/api/notion/projects/${page.id}?asset=cover`,
            alt: `${text(p["제목"])} project cover`,
            caption: "",
          },
        ]
      : [],
    links: {
      github: safeUrl(p.GitHub?.url),
      demo: safeUrl(p.Website?.url),
      caseStudy: "",
    },
  };
}
export async function getProjects() {
  return sorted(await queryPages("projects"))
    .filter((p) => isPublic(p, "projects") && text(p.properties["제목"]))
    .map(mapProject);
}
export async function getExperiences(): Promise<Role[]> {
  const pages = sorted(await queryPages("experience")).filter(
    (p) => isPublic(p, "experience") && text(p.properties.Name),
  );
  const roles: Role[] = [];
  for (const page of pages) {
    let blocks: ContentBlock[];
    try {
      blocks = await publicContent("experience", page.id);
    } catch (error) {
      if (error instanceof NotionError && error.status === 404) continue;
      throw error;
    }
    const logs: string[] = [];
    const walk = (items: ContentBlock[]) => {
      for (const b of items) {
        if (
          ["bulleted_list_item", "numbered_list_item", "paragraph"].includes(
            b.type,
          ) &&
          plain(b.text).trim()
        )
          logs.push(plain(b.text));
        walk(b.children);
      }
    };
    walk(blocks);
    roles.push({
      org: text(page.properties.Company),
      title: text(page.properties.Position),
      dates: text(page.properties["Date Label"]),
      place: text(page.properties.Location),
      logs,
      skills: tags(page.properties.Skills),
      impact: "",
    });
  }
  return roles;
}
export async function getNotes(): Promise<Note[]> {
  return (await queryPages("notes"))
    .filter((p) => isPublic(p, "notes") && text(p.properties["Doc name"]))
    .map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        title: text(p["Doc name"]),
        slug: text(p.Slug),
        summary: text(p.Summary),
        category: option(p.Category),
        tags: tags(p.Tags),
        featured: p.Featured?.checkbox ?? false,
        order: p.Order?.number ?? null,
        createdAt: p["Created time"]?.created_time ?? null,
        updatedAt: p["Last updated time"]?.last_edited_time ?? null,
        notionUrl: safeUrl(page.url),
      };
    })
    .sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
          (b.order ?? Number.MAX_SAFE_INTEGER) ||
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
}
