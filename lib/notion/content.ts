import { cached, cacheScope, notion, NotionError, sourceId } from "./client";
import {
  type Block,
  type BlockData,
  type ContentBlock,
  type ContentKind,
  type NotionPage,
  fileUrl,
  isPublic,
  normalizeId,
  safeUrl,
} from "./model";

const supported = new Set([
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list_item",
  "numbered_list_item",
  "to_do",
  "toggle",
  "quote",
  "callout",
  "code",
  "divider",
  "image",
  "bookmark",
  "link_preview",
  "file",
  "pdf",
  "video",
  "embed",
  "column_list",
  "column",
  "table",
  "table_row",
  "equation",
]);
export async function assertPublicPage(kind: ContentKind, id: string) {
  if (!/^[0-9a-f]{32}$/i.test(normalizeId(id)))
    throw new NotionError(404, "Content not found.");
  // Fresh metadata prevents a cached body from exposing an unpublished or moved page.
  const page = await notion<NotionPage>(`pages/${id}`);
  if (
    normalizeId(page.parent?.data_source_id ?? "") !==
      normalizeId(sourceId(kind)) ||
    !isPublic(page, kind)
  )
    throw new NotionError(404, "Content not found.");
  return page;
}
export async function readBlocks(
  id: string,
  depth = 0,
  budget = { remaining: 2000 },
): Promise<ContentBlock[]> {
  if (depth > 12)
    throw new NotionError(502, "Notion content nesting limit exceeded.");
  const output: ContentBlock[] = [];
  let cursor: string | undefined;
  do {
    const result: {
      results: Block[];
      has_more: boolean;
      next_cursor: string | null;
    } = await notion(
      `blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ""}`,
    );
    for (const block of result.results) {
      if (--budget.remaining < 0)
        throw new NotionError(502, "Notion content size limit exceeded.");
      if (block.archived || block.in_trash) continue;
      // Never traverse nested databases, child pages, synced sources, or linked pages.
      if (
        [
          "child_database",
          "child_page",
          "synced_block",
          "link_to_page",
        ].includes(block.type)
      )
        continue;
      if (!supported.has(block.type)) {
        output.push({
          id: block.id,
          type: "unsupported",
          text: [],
          children: [],
        });
        continue;
      }
      const data = block[block.type] as BlockData;
      const node: ContentBlock = {
        id: block.id,
        type: block.type,
        text: data.rich_text ?? [],
        children: [],
        caption: data.caption,
        language: data.language,
        checked: data.checked,
        toggleable: data.is_toggleable,
        cells: data.cells,
        columnHeader: data.has_column_header,
      };
      if (["image", "file", "pdf", "video"].includes(block.type))
        node.url = fileUrl(data);
      if (["bookmark", "link_preview", "embed"].includes(block.type))
        node.url = safeUrl(data.url);
      if (block.type === "equation")
        node.text = [
          {
            plain_text: String(
              (data as { expression?: string }).expression ?? "",
            ),
          },
        ];
      if (block.has_children)
        node.children = await readBlocks(block.id, depth + 1, budget);
      output.push(node);
    }
    if (
      result.has_more &&
      (!result.next_cursor || result.next_cursor === cursor)
    )
      throw new NotionError(502, "Incomplete Notion response.");
    cursor = result.has_more ? result.next_cursor! : undefined;
  } while (cursor);
  return output;
}
export async function publicContent(kind: ContentKind, id: string) {
  await assertPublicPage(kind, id);
  // Shorter than signed file URL lifetime; no stale response is served on failure.
  return cached(
    `body:${kind}:${cacheScope(kind)}:${id}`,
    () => readBlocks(id),
    120,
  );
}
