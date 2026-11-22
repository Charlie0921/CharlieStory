# Notion portfolio integration

## Implemented scope

Projects, Experience, and Technical Notes now read from Notion server-side and feed the existing design. The homepage no longer reads Supabase or substitutes local project/experience records. Introduction, education, skills, contact, and résumé remain in code. Legacy `/admin/*` entrypoints redirect to the homepage; edit content in Notion instead. Historical Supabase implementation files remain unused by the public homepage.

## Sources

| Content | Database page | Data source |
|---|---|---|
| Projects | `8a805bcf-d0bd-4ba6-8f12-fa18ac7a142c` | `86af8e7d-18fd-4b46-88fd-a4c9c9f96fe1` |
| Experience | `420282c8-196e-8117-bcf1-c3ed26ca3fc3` | `420282c8-196e-81b0-b9e7-000b1153ed16` |
| Technical Notes | `388282c8-196e-8023-8cd6-e2caaf20827c` | `388282c8-196e-807b-9b76-000b0c992fd5` |

Projects and Experience belong to `Kunjoong(Charlie) Kim`, page `6ccc4e92-aa9e-409c-ac25-142073253052`.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `NOTION_API_KEY` to a server-side Notion connection token. Never put it in a `NEXT_PUBLIC_` variable or browser code.
3. Grant that connection read access to each database using Notion's Connections menu. ChatGPT's connection does not supply credentials to the website.
4. Mark projects and experience rows `Published`; notes use the existing `Status = Published` option.
5. Restart `npm run dev`. On deployment, set the same variables in the hosting provider and redeploy.

The API uses version `2025-09-03` and `/v1/data_sources/{id}/query`. The optional source overrides take **data-source IDs**, not database page IDs. Legacy `NOTION_DATABASE_ID` / `NOTION_NOTES_DATABASE_ID` are no longer used. Defaults match the table above.

## Mapping

- Projects: `제목`, `Short Description`, `Position`, `Skills`, `GitHub`, `Website`, page cover. Optional `Display Order` controls ordering; otherwise Date descending and stable ID. Missing summaries remain empty. Website values without a scheme are normalized; invalid or non-HTTP URLs are omitted. The category filter uses actual technology tags.
- Experience: `Company`, `Position`, `Date Label`, `Location`, `Display Order`, page-body paragraphs and bullet points. Date precision is preserved. Existing `Current` remains available in Notion; the website displays `Date Label`.
- Notes: `Doc name`, `Summary`, `Category`, `Tags`, `Featured`, `Order`, created/updated times. Notes expand to show their actual body on the website.

Projects gained a `Published` checkbox during integration. Missing or unchecked publication fields never expose a record. Notion view filters are not used as access control.

## Rendering and endpoints

- `/api/portfolio`: independent project/experience results and section-specific errors.
- `/api/notes`: published note metadata.
- `/api/notion/projects/{id}` and `/api/notion/notes/{id}`: publication-checked content.
- `/api/notion/projects/{id}?asset=cover`: fresh publication-checked redirect to the current cover URL. Signed URLs are not committed or stored in card data.

Body rendering preserves ordering, rich text formatting, headings, nested lists, toggles, code, quotes, callouts, images, checklists, tables, and columns. Attachments and embeds are safe outgoing links, equations are plain notation, unsupported block types show a notice. Nested databases, child pages, synced blocks, and linked pages are not traversed or rendered. This excludes Tanyak Laundry sprint databases. Readers can still follow ordinary outgoing hyperlinks, but linked content is never fetched automatically.

## Caching and limits

- Metadata lists: strict 300-second in-memory cache per server instance, with concurrent request deduplication. A visitor receives a refreshed list on the next request after expiry. Already-open pages refresh on reload.
- Page bodies: 120-second cache. Direct body/cover requests check fresh page metadata and source membership before serving content. Unpublished/moved/deleted pages cannot be retrieved from the body cache.
- Listings can retain an unpublished card for up to the metadata cache TTL; the detail endpoint rejects it immediately when Notion reports it unpublished.
- No stale cache fallback on API failure. Empty results and failures have distinct UI states. A missing API key never exposes local fallback content.
- Cache is not shared across serverless instances and is lost on restart. Hosting-adapter behavior and real credentials still require deployment verification.
- Requests are spaced 350ms apart within a process. HTTP 429/529 uses Retry-After with bounded retries; delays longer than 30 seconds surface a retryable UI error. Lists and block children are paginated. Body safety limits are 12 levels and 2,000 blocks; exceeding them yields an error instead of silently incomplete content.

## Verification

Run `npm run test:notion` for mocked API tests covering publication checks, foreign-source rejection, pagination, cache invalidation, nested content, exclusion of child databases, and URL normalization. Run `npm run build` for the full application build. Mock tests do not prove live credentials, access grants, or deployment synchronization.
