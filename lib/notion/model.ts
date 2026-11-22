export type RichText = {
  plain_text?: string;
  text?: { content?: string; link?: { url?: string } | null };
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
};
export type Property = {
  type?: string;
  title?: RichText[];
  rich_text?: RichText[];
  select?: { name: string } | null;
  status?: { name: string } | null;
  multi_select?: { name: string }[];
  checkbox?: boolean;
  number?: number | null;
  url?: string | null;
  date?: { start?: string; end?: string | null } | null;
  created_time?: string;
  last_edited_time?: string;
};
export type NotionFile = {
  type?: string;
  file?: { url: string; expiry_time?: string };
  external?: { url: string };
};
export type NotionPage = {
  id: string;
  url?: string;
  archived?: boolean;
  in_trash?: boolean;
  parent?: { data_source_id?: string; database_id?: string };
  properties: Record<string, Property>;
  cover?: NotionFile | null;
};
export type Block = {
  id: string;
  type: string;
  has_children?: boolean;
  archived?: boolean;
  in_trash?: boolean;
  [key: string]: unknown;
};
export type BlockData = NotionFile & {
  rich_text?: RichText[];
  caption?: RichText[];
  language?: string;
  checked?: boolean;
  is_toggleable?: boolean;
  url?: string;
  cells?: RichText[][];
  has_column_header?: boolean;
};
export type ContentBlock = {
  id: string;
  type: string;
  text: RichText[];
  children: ContentBlock[];
  url?: string;
  caption?: RichText[];
  language?: string;
  checked?: boolean;
  toggleable?: boolean;
  cells?: RichText[][];
  columnHeader?: boolean;
};
export type ContentKind = "projects" | "experience" | "notes";
export const text = (p?: Property) =>
  (p?.title ?? p?.rich_text ?? [])
    .map((r) => r.plain_text ?? r.text?.content ?? "")
    .join("")
    .trim();
export const option = (p?: Property) =>
  p?.select?.name ?? p?.status?.name ?? "";
export const tags = (p?: Property) =>
  (p?.multi_select ?? []).map((t) => t.name);
export const plain = (r: RichText[]) =>
  r.map((t) => t.plain_text ?? t.text?.content ?? "").join("");
export function safeUrl(value?: string | null): string {
  if (!value?.trim()) return "";
  let candidate = value.trim();
  if (!/^[a-z][a-z\d+.-]*:/i.test(candidate)) {
    if (!/^[\w-]+(?:\.[\w-]+)+(?:[/?#]|$)/.test(candidate)) return "";
    candidate = `https://${candidate}`;
  }
  try {
    const url = new URL(candidate);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export const fileUrl = (f?: NotionFile | null) =>
  safeUrl(f?.external?.url ?? f?.file?.url);
export const isPublic = (page: NotionPage, kind: ContentKind) =>
  !page.archived &&
  !page.in_trash &&
  (kind === "notes"
    ? option(page.properties.Status) === "Published"
    : page.properties.Published?.checkbox === true);
export const normalizeId = (id: string) => id.replace(/-/g, "");
