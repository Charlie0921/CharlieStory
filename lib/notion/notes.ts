import type { Note } from "@/lib/types";

const NOTION_VERSION = "2022-06-28";

type NotionText = {
  plain_text?: string;
};

type NotionSelect = {
  name?: string;
};

type NotionMultiSelect = {
  name?: string;
};

type NotionProperty = {
  title?: NotionText[];
  rich_text?: NotionText[];
  select?: NotionSelect | null;
  multi_select?: NotionMultiSelect[];
  checkbox?: boolean;
  number?: number | null;
  created_time?: string;
  last_edited_time?: string;
  date?: { start?: string | null } | null;
  status?: NotionSelect | null;
  url?: string | null;
};

type NotionPage = {
  id: string;
  url?: string;
  properties: Record<string, NotionProperty>;
};

type NotionDatabaseResponse = {
  results?: NotionPage[];
};

export async function getPublishedNotes(): Promise<Note[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId =
    process.env.NOTION_NOTES_DATABASE_ID ?? process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    throw new Error("Missing Notion notes environment variables.");
  }

  let response = await queryNotesDatabase(apiKey, databaseId, "status");

  if (!response.ok && response.status === 400) {
    response = await queryNotesDatabase(apiKey, databaseId, "select");
  }

  if (!response.ok) {
  const errorBody = await response.text();

  console.error("Notion API error:", {
    status: response.status,
    body: errorBody,
  });

  throw new Error(
    `Notion notes request failed: ${response.status} ${errorBody}`
  );
}

  const data = (await response.json()) as NotionDatabaseResponse;

  return (data.results ?? []).map(mapNotionPageToNote).sort(sortNotes);
}

function mapNotionPageToNote(page: NotionPage): Note {
  const properties = page.properties;

  return {
    id: page.id,
    title: getText(properties["Doc name"]),
    slug: getText(properties.Slug),
    summary: getText(properties.Summary),
    category: getSelectName(properties.Category),
    tags: getMultiSelectNames(properties.Tags),
    featured: properties.Featured?.checkbox ?? false,
    order: properties.Order?.number ?? null,
    createdAt: getDate(properties["Created time"]),
    updatedAt: getDate(properties["Last updated time"]),
    notionUrl: page.url ?? "",
  };
}

function getText(property: NotionProperty | undefined) {
  return [
    ...(property?.title ?? []),
    ...(property?.rich_text ?? []),
  ]
    .map((text) => text.plain_text ?? "")
    .join("")
    .trim();
}

function getSelectName(property: NotionProperty | undefined) {
  return property?.select?.name ?? property?.status?.name ?? "";
}

function getMultiSelectNames(property: NotionProperty | undefined) {
  return (property?.multi_select ?? [])
    .map((option) => option.name ?? "")
    .filter(Boolean);
}

function getDate(property: NotionProperty | undefined) {
  return (
    property?.created_time ??
    property?.last_edited_time ??
    property?.date?.start ??
    null
  );
}

function sortNotes(a: Note, b: Note) {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  const aOrder = a.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.order ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return dateValue(b.updatedAt) - dateValue(a.updatedAt);
}

function dateValue(value: string | null) {
  return value ? new Date(value).getTime() : 0;
}

function queryNotesDatabase(
  apiKey: string,
  databaseId: string,
  statusPropertyType: "status" | "select",
) {
  return fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      filter: {
        property: "Status",
        [statusPropertyType]: {
          equals: "Published",
        },
      },
    }),
    next: { revalidate: 300 },
  });
}
