# Research: Book Content — All 13 Weeks + Capstone

**Phase**: 0 (Research)
**Date**: 2026-02-19
**Feature**: 002-book-content-chapters

---

## Research Questions Resolved

### 1. Internal Cross-Reference URL Pattern

**Decision**: Use `/module-1-ros2/week-03-ros2-architecture` format (no `/docs/` prefix).

**Rationale**: `docusaurus.config.ts` sets `routeBasePath: '/'`, which means docs are served at the site root, not under `/docs/`. Using `/docs/...` would produce broken links and fail the build (`onBrokenLinks: 'throw'`).

**Alternatives considered**: `/docs/module-1-ros2/...` — REJECTED (would fail build), relative paths `../week-03-ros2-architecture` — valid but less readable.

**Reference**: `book/docusaurus.config.ts` line `routeBasePath: '/'`

---

### 2. Frontmatter Schema for Existing Placeholder Files

**Decision**: Preserve existing `title` and `sidebar_label` frontmatter fields. Do NOT add `sidebar_position` — it is not used (sidebars.ts manages ordering explicitly).

**Rationale**: All 15 placeholder files use `title` + `sidebar_label` format. The `sidebars.ts` file explicitly lists each doc ID in the correct order — adding `sidebar_position` would be ignored and creates unnecessary noise. Adding a `description` field for SEO is acceptable and additive.

**Existing frontmatter pattern**:
```yaml
---
title: "Week N: Chapter Title"
sidebar_label: "Week N: Short Label"
---
```

**Extended pattern for chapters** (add `description` only):
```yaml
---
title: "Week N: Chapter Title"
sidebar_label: "Week N: Short Label"
description: "One-sentence SEO description."
---
```

---

### 3. Mermaid Diagram Support

**Decision**: Use standard ` ```mermaid ` fenced code blocks. No special imports required.

**Rationale**: `docusaurus.config.ts` has `themes: ['@docusaurus/theme-mermaid']` and `markdown: { mermaid: true }`. The package `@docusaurus/theme-mermaid` is installed. Mermaid v10 syntax is supported.

**Confirmed working**: The placeholder `week-01-intro-physical-ai.mdx` already contains a working Mermaid diagram using `graph TD` syntax.

**Supported diagram types for this project**: `flowchart LR/TD`, `graph TD/LR`, `sequenceDiagram` — stick to these well-tested types.

---

### 4. Python Code Block Syntax

**Decision**: Use ` ```python showLineNumbers ` exactly as specified. No JSX required.

**Rationale**: Docusaurus uses Prism for syntax highlighting. The `showLineNumbers` meta flag is natively supported by the Prism plugin. The `@fontsource/jetbrains-mono` is installed as the monospace font.

---

### 5. Docusaurus Admonition Syntax

**Decision**: Standard Docusaurus admonition syntax confirmed working.

```mdx
:::note
Supplementary info here.
:::

:::tip Related Chapter
Cross-reference here.
:::

:::warning
Common mistake here.
:::

:::danger
Safety warning here.
:::

:::info
Hardware requirements or system dependencies here.
:::
```

**Rationale**: Docusaurus 3.9.x uses the standard `:::type` syntax natively — no plugin needed.

---

### 6. Code Blocks Inside MDX (Backtick Escaping)

**Decision**: Use standard triple-backtick fences. No escaping needed in `.mdx` files when writing actual content (not documentation about code blocks).

**Rationale**: MDX processes code fences as Markdown first. The issue only arises when documenting code blocks about code blocks — not applicable here since chapters contain actual code, not meta-documentation.

---

### 7. File Replacement Strategy

**Decision**: Fully overwrite each placeholder file with complete content. Preserve the `title` and `sidebar_label` frontmatter values from the original.

**Rationale**: All 15 files currently contain "Coming Soon" placeholder content. A complete overwrite is cleaner than a partial edit. The frontmatter `title` and `sidebar_label` values must be preserved since `sidebars.ts` references doc IDs (not frontmatter).

---

### 8. Build Verification Checkpoint

**Decision**: Run `cd /c/Book/book && pnpm build` after each batch of chapters.

**Rationale**: `onBrokenLinks: 'throw'` in docusaurus.config.ts means any broken internal link will fail the build immediately. Catching errors per-batch (rather than at the end) prevents cascading failures.

**Known build time**: Approximately 30–90 seconds depending on content volume.

---

### 9. Cross-Reference Admonition Pattern (Canonical)

**Decision**: Use this exact pattern for all cross-references:

```mdx
:::tip Related Chapter
This concept builds on material from [Week 3: ROS 2 Architecture](/module-1-ros2/week-03-ros2-architecture). Review it if you need a refresher on the ROS 2 computation graph.
:::
```

**Note**: URL pattern is `/module-1-ros2/week-03-ros2-architecture` (no `/docs/` prefix).

---

### 10. Capstone Directory Structure

**Decision**: The capstone file lives at `book/docs/capstone/autonomous-humanoid-project.mdx`. This directory and file already exist as a placeholder.

**Sidebars entry**: `'capstone/autonomous-humanoid-project'` (already in `sidebars.ts`).

---

## Technology Stack Confirmed

| Concern | Value | Source |
|---------|-------|--------|
| Docusaurus version | 3.9.2 | package.json |
| React version | 19.2.4 | package.json |
| Mermaid plugin | `@docusaurus/theme-mermaid` installed | node_modules |
| Docs base URL | `/` (root) | docusaurus.config.ts |
| Broken links behavior | `throw` (build fails) | docusaurus.config.ts |
| Code font | JetBrains Mono | `@fontsource/jetbrains-mono` |
| Build command | `pnpm build` from `book/` | package.json |
| Dev server | `pnpm start` from `book/` | package.json |
| Python target | 3.11+ | Constitution |
| ROS 2 target | Humble (LTS) | Spec + Constitution |
