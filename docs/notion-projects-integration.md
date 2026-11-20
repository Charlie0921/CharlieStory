# Notion Projects Integration

## Decision

Connect only the existing Notion Projects database to the portfolio website. Do not parse or synchronize the entire Notion portfolio page. Existing project writing can remain unchanged initially. This decision supersedes earlier suggestions to synchronize all profile and experience content.

## Content Ownership

| Content | Maintained in |
|---|---|
| Hero and introduction | Website code |
| About and experience | Website code |
| Character illustrations | Website assets |
| Project metadata | Notion Projects database |
| Case studies | Individual Notion project pages |
| Contact and social links | Website code |

Only project content updates automatically from Notion. Other content requires code changes.

## Architecture

```text
Projects data source
  -> Server-side Notion API client
  -> Content mapping and validation
  -> Project cards

Individual project pages
  -> Retrieve content blocks
  -> Block renderer
  -> Website project detail pages
```

The website controls presentation. Notion controls project content and block order. The assistant's Notion connector is separate from the deployed application's integration; configure application credentials and permissions separately.

## Existing Properties

- `제목`: project title.
- `Short Description`: project summary.
- `Position`: personal role.
- `Skills`: technology tags.
- `Date`: timeline.
- `GitHub`: repository URL.
- `Website`: demo or live application URL.
- `Members`: team information.

Use an existing page cover where appropriate, with a fallback for missing images. Validate and normalize outgoing URLs.

## Proposed Properties

These are proposals, not confirmation of database changes.

- `Published` checkbox: only explicitly checked projects may appear publicly. Missing or unchecked means unpublished.
- Optional `Featured` checkbox.
- Optional `Display Order` number.
- Optional `Slug` text for readable URLs.

Without a slug, use stable ID-based routes. Do not derive permanent URLs solely from mutable titles.

## Rendering

Do not require identical project headings or extract sections by heading names. Render supported blocks in their existing order.

Initial support:

- Headings, paragraphs, and rich text.
- Bulleted and numbered lists.
- Images and code blocks.
- Toggles, including nested content.
- Quotes, callouts, and dividers as needed.

Handle pagination and recursive child-block retrieval. Define explicit behavior for unsupported blocks. Do not automatically publish linked content.

Exclude embedded sprint databases, internal planning documents, arbitrary nested databases, and full Notion-layout replication from the initial version. In particular, exclude Tanyak Laundry's embedded sprint databases.

## Updates

Start with cached server-side fetching and time-based revalidation. Document the interval and actual behavior for the installed Next.js and Netlify adapter versions. Content edits should not require a code commit.

Automatic updates are not guaranteed instant synchronization. Consider verified webhooks later; a webhook signals a change and the application must fetch updated content.

## Security and Reliability

- Keep credentials server-side, never in browser code or `NEXT_PUBLIC_` variables.
- Grant only necessary access.
- Enforce publication checks for listings and direct detail routes.
- Account for cached content when unpublishing.
- Handle deleted or unavailable projects, API errors, and rate limits.
- Refresh expiring Notion-hosted image URLs or use stable asset storage.
- Never hard-code temporary signed image URLs.
- Keep permanent character artwork in website assets.

## First Milestone: Tanyak Laundry

1. Fetch database properties and display a card.
2. Retrieve and render the project body.
3. Preserve nested maintenance-toggle content.
4. Exclude embedded sprint databases.
5. Verify an edit appears after revalidation.
6. Verify unpublished projects are inaccessible directly.
7. Test on desktop and mobile.

## Acceptance Criteria

- Metadata and case studies come from Notion.
- Different project headings are supported.
- Website styling is independent of Notion layout.
- Drafts and private planning content are not exposed.
- Updates follow documented refresh behavior.
- Images, deletion, errors, and unpublishing are tested.

## References

- https://developers.notion.com/guides/data-apis/working-with-page-content
- https://developers.notion.com/reference/retrieve-a-page
- https://developers.notion.com/reference/get-block-children
- https://developers.notion.com/guides/authorization/credential-security
- https://developers.notion.com/reference/webhooks
- https://developers.notion.com/reference/file-object
- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/

## Status

Implementation decision only. This document does not assert that database properties, integration behavior, or deployment settings have been changed.
