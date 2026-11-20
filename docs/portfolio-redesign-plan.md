# Portfolio Redesign Plan

## Goal

Build Charlie Kim's software developer portfolio around enterprise systems, full-stack development, and an interest in technology and business. Preserve the personal black-and-white illustration identity of gunpodo_is.

A personal website demonstrates work and personality; it is not a universal requirement for US employers.

## Current Scope

Connect only the existing Notion Projects database. Keep the hero, About, experience, contact information, and website design in code. The specific integration decision in `notion-projects-integration.md` takes precedence over earlier broader synchronization ideas.

## Responsibilities

- Notion: project metadata, case studies, and publication control.
- Website code: layout, navigation, responsive behavior, accessibility, and non-project content.
- Canva: optional illustration preparation and style exploration, not duplicate content management.
- GitHub: code, documentation, review, and version history.
- Netlify: hosting and server-side integration.

## Design Direction

- Warm white background and near-black text.
- Generous whitespace and clean, readable body typography.
- Small original hand-drawn illustrations and occasional annotations.
- Actual project screenshots retain their colors.
- Avoid Instagram-style profile UI, dense square grids, excessive effects, and handwritten body paragraphs.
- Your character welcomes the visitor; your projects demonstrate your capability.

## Proposed Website Structure

1. Hero: introduction, character illustration, View Work, and Resume.
2. Selected work: project cards sourced from Notion.
3. Experience: concise professional and research history.
4. About: background, interests, and approach.
5. Beyond Code: a small, separate comics section.
6. Contact: email and professional links.
7. Individual project routes: rendered Notion case studies.

## Content Guidance

Each project should make the problem, audience, personal contribution, technical decisions, and outcome understandable. Identical headings are not required. Use verified results; distinguish measured outcomes from assumptions and ongoing work.

Tanyak Laundry is the first end-to-end implementation candidate. Clarify team responsibilities, historical versus current usage, and the basis of any metrics. Review screenshots for sensitive information. Employer work should be shared only when permitted.

## Development Sequence

1. Audit existing routes, dependencies, Notion code, and production deployment configuration.
2. Confirm the project metadata mapping and publication rules.
3. Implement one Tanyak Laundry card and detail page with real content.
4. Connect server-side fetching and automatic refresh.
5. Apply the visual system and test desktop and mobile layouts.
6. Expand to other curated projects.
7. Review a preview deployment before changing production.

## Branch Strategy

Use `feature/portfolio-redesign`, created from `feature/design` at commit `4571f8ae98ad467275e1ce20d8ad144b23d2b27f`.

The Netlify production branch has not been verified. Creating this branch does not establish which branch is deployed. Do not merge or change production settings without review.

## Launch Checks

- Clear positioning and personal contributions.
- No placeholders or invented achievements.
- Working resume, repository, demo, and contact links.
- Responsive layout, keyboard navigation, visible focus, meaningful headings, and image alternatives.
- Published Notion edits appear according to documented refresh behavior.
- Unpublished projects cannot be accessed directly.
- Image expiry, API failure, deletion, and unpublishing behavior are tested.

## Documentation Maintenance

Keep this document for overall direction and `notion-projects-integration.md` for implementation scope. Update documents alongside relevant code changes. Proposed work is not evidence that it has been implemented.
