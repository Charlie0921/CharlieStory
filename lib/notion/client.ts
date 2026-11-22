import { createHash } from "node:crypto";
import type { ContentKind, NotionPage } from "./model";

export class NotionError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
const defaults: Record<ContentKind, string> = {
  projects: "86af8e7d-18fd-4b46-88fd-a4c9c9f96fe1",
  experience: "420282c8-196e-81b0-b9e7-000b1153ed16",
  notes: "388282c8-196e-807b-9b76-000b0c992fd5",
};
export function sourceId(kind: ContentKind) {
  return (
    process.env[`NOTION_${kind.toUpperCase()}_DATA_SOURCE_ID`] || defaults[kind]
  );
}
export function cacheScope(kind: ContentKind) {
  return `${sourceId(kind)}:${createHash("sha256")
    .update(process.env.NOTION_API_KEY || "")
    .digest("hex")}`;
}
const cache = new Map<string, { expires: number; value: unknown }>();
const pending = new Map<string, Promise<unknown>>();
export async function cached<T>(
  key: string,
  loader: () => Promise<T>,
  seconds = 300,
): Promise<T> {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.value as T;
  if (pending.has(key)) return pending.get(key) as Promise<T>;
  const task = loader()
    .then((value) => {
      if (cache.size >= 200) cache.delete(cache.keys().next().value!);
      cache.set(key, { value, expires: Date.now() + seconds * 1000 });
      return value;
    })
    .finally(() => pending.delete(key));
  pending.set(key, task);
  return task;
}
// Space uncached requests within each server process; cross-instance 429s use Retry-After.
let queue: Promise<unknown> = Promise.resolve();
let nextRequest = 0;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function notion<T>(path: string, body?: unknown): Promise<T> {
  const key = process.env.NOTION_API_KEY;
  if (!key) throw new NotionError(503, "Notion connection is not configured.");
  for (let attempt = 0; attempt < 3; attempt++) {
    const request = queue.then(async () => {
      await sleep(Math.max(0, nextRequest - Date.now()));
      nextRequest = Date.now() + 350;
      return fetch(`https://api.notion.com/v1/${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Notion-Version": "2025-09-03",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
    });
    queue = request.catch(() => undefined);
    const response = await request;
    if ([429, 529].includes(response.status) && attempt < 2) {
      const delay = Number(response.headers.get("Retry-After") || 2 ** attempt);
      if (!Number.isFinite(delay) || delay > 30)
        throw new NotionError(503, "Notion is temporarily busy.");
      await sleep(Math.max(1, delay) * 1000);
      continue;
    }
    if (!response.ok)
      throw new NotionError(
        response.status === 404 ? 404 : 502,
        "Notion content is temporarily unavailable.",
      );
    return response.json() as Promise<T>;
  }
  throw new NotionError(503, "Notion is temporarily busy.");
}
export async function queryPages(kind: ContentKind) {
  return cached(`list:${kind}:${cacheScope(kind)}`, async () => {
    const pages: NotionPage[] = [];
    let cursor: string | undefined;
    do {
      const result: {
        results: NotionPage[];
        has_more: boolean;
        next_cursor: string | null;
      } = await notion(`data_sources/${sourceId(kind)}/query`, {
        page_size: 100,
        filter:
          kind === "notes"
            ? { property: "Status", select: { equals: "Published" } }
            : { property: "Published", checkbox: { equals: true } },
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      pages.push(...result.results);
      if (
        result.has_more &&
        (!result.next_cursor || result.next_cursor === cursor)
      )
        throw new NotionError(502, "Incomplete Notion response.");
      cursor = result.has_more ? result.next_cursor! : undefined;
    } while (cursor);
    return pages;
  });
}
