# Implementation Plan: Docusaurus v3 Site Scaffold

**Branch**: `001-docusaurus-scaffold` | **Date**: 2026-02-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-docusaurus-scaffold/spec.md`

---

## Summary

Build a fully configured Docusaurus v3 static site inside `book/` using TypeScript strict
mode and pnpm. The site includes a custom dark theme (deep-blue/cyan palette), self-hosted
Inter + JetBrains Mono fonts via @fontsource, Mermaid diagram support, a 6-section custom
React landing page, a complete 15-item sidebar with placeholder MDX files for all chapters,
and a GitHub Actions CI/CD pipeline that auto-deploys to GitHub Pages on every push to `main`
using peaceiris/actions-gh-pages@v3.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode ON), Node.js 20 LTS
**Primary Dependencies**:
- `docusaurus@latest` (^3.x) with classic preset
- `@docusaurus/theme-mermaid` — Mermaid diagram support
- `@fontsource/inter` — self-hosted Inter body font
- `@fontsource/jetbrains-mono` — self-hosted JetBrains Mono code font
- `lucide-react` — icon library for landing page
- `peaceiris/actions-gh-pages@v3` — GitHub Actions deployment step

**Storage**: N/A — static site generation; no runtime persistence
**Testing**: `pnpm build` with zero TypeScript errors; manual visual verification per
quickstart.md checklist
**Target Platform**: GitHub Pages (static hosting); Node.js 20 LTS for build environment
**Project Type**: Web — frontend only; Docusaurus lives entirely inside `book/` subdirectory
**Performance Goals**: Site builds successfully; all 15 pages render; live deploy ≤ 10 min
**Constraints**:
- TypeScript strict mode — zero `any` types permitted
- pnpm only — no npm or yarn at any step
- All Docusaurus files confined to `book/` — nothing at repo root
- No blog, no tutorial demo content, no default Docusaurus pages
**Scale/Scope**: ~15 navigable pages (intro + 13 chapter placeholders + capstone);
single developer; Phase 1 of 6 delivery phases

---

## Constitution Check

*GATE: Must pass before implementation begins. Re-checked after design.*

| Principle | Requirement | Status |
|---|---|---|
| I. Spec-First | `spec.md` finalized before this plan | ✅ PASS |
| II. Clean Code | Single-responsibility components; descriptive names (`HeroSection`, not `Hero`); no unused imports; strict TypeScript | ✅ PASS |
| III. Phase-Based | This is Phase 1 (book scaffold + GitHub Pages); zero Phase 2+ code included | ✅ PASS |
| IV. Content Quality | Placeholder MDX files are acceptable at scaffold stage — full content comes in the chapter-writing phase | ✅ PASS |
| V. TypeScript Standards | `strict: true` in tsconfig; CSS Module types handled by `@docusaurus/tsconfig`; no `any` | ✅ PASS |
| VI. Secrets & Env | No secrets in this feature; `GITHUB_TOKEN` is a CI-managed secret, never hardcoded | ✅ PASS |
| VII. Git Discipline | Branch `001-docusaurus-scaffold`; conventional commits (`feat:`, `chore:`); PR required for merge to `main` | ✅ PASS |

**ALL GATES PASS — proceed to implementation.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-docusaurus-scaffold/
├── spec.md              ← Feature specification
├── plan.md              ← This file
├── research.md          ← Phase 0 research output (all unknowns resolved)
├── quickstart.md        ← Developer setup and verification guide
└── checklists/
    └── requirements.md  ← Spec quality checklist (all pass)
```

Note: No `data-model.md` or `contracts/` — this is a pure frontend static site with no
data entities and no API endpoints.

### Source Code (repository)

```text
book/                                     ← Docusaurus project root
├── docs/
│   ├── intro.md                          ← Welcome & Course Overview
│   ├── module-1-ros2/
│   │   ├── week-01-intro-physical-ai.mdx
│   │   ├── week-02-embodied-intelligence.mdx
│   │   ├── week-03-ros2-architecture.mdx
│   │   ├── week-04-nodes-topics-services.mdx
│   │   └── week-05-ros2-packages.mdx
│   ├── module-2-simulation/
│   │   ├── week-06-gazebo-setup.mdx
│   │   └── week-07-urdf-sdf.mdx
│   ├── module-3-isaac/
│   │   ├── week-08-isaac-platform.mdx
│   │   ├── week-09-perception-manipulation.mdx
│   │   └── week-10-sim-to-real.mdx
│   ├── module-4-vla/
│   │   ├── week-11-humanoid-kinematics.mdx
│   │   ├── week-12-bipedal-locomotion.mdx
│   │   └── week-13-conversational-robotics.mdx
│   └── capstone/
│       └── autonomous-humanoid-project.mdx
├── src/
│   ├── components/
│   │   └── landing/
│   │       ├── HeroSection.tsx
│   │       ├── HeroSection.module.css
│   │       ├── WhyPhysicalAI.tsx
│   │       ├── WhyPhysicalAI.module.css
│   │       ├── CourseModules.tsx
│   │       ├── CourseModules.module.css
│   │       ├── LearningOutcomes.tsx
│   │       ├── LearningOutcomes.module.css
│   │       ├── HardwareOverview.tsx
│   │       └── HardwareOverview.module.css
│   ├── pages/
│   │   ├── index.tsx                     ← Custom landing page
│   │   └── index.module.css
│   └── css/
│       └── custom.css                    ← Global tokens, fonts, colour vars
├── static/
│   └── img/
│       └── logo.svg                      ← Robot icon (geometric SVG placeholder)
├── docusaurus.config.ts
├── sidebars.ts
├── tsconfig.json
└── package.json

.github/
└── workflows/
    └── deploy-book.yml                   ← CI/CD pipeline
```

**Structure Decision**: Web application layout using Docusaurus's opinionated structure.
The `src/components/landing/` subdirectory groups all landing page components together
(Constitution Principle II: single responsibility). No backend directory at this phase.

---

## Phase 0: Completed Artifacts

All research decisions are recorded in `research.md`. Key resolutions:

| Decision | Choice | Reference |
|---|---|---|
| Init command | `pnpm create docusaurus@latest book classic --typescript` | R-01 |
| Blog disable | `blog: false` in preset; `routeBasePath: '/'` | R-02 |
| Dark mode | `colorMode.defaultMode: 'dark'` | R-03 |
| Fonts import | `@import` in `custom.css` (not config stylesheets) | R-04 |
| Mermaid | `themes: ['@docusaurus/theme-mermaid']` + `markdown.mermaid: true` | R-05 |
| Prism languages | `additionalLanguages: ['python', 'bash', 'yaml', 'cpp']` | R-06 |
| CI/CD | peaceiris/actions-gh-pages@v3 with `permissions: contents: write` | R-07 |
| CSS Modules | Native Docusaurus Webpack support; `@docusaurus/tsconfig` handles types | R-08 |
| Sidebar | Explicit `items` arrays in `sidebars.ts` — no auto-generation | R-09 |
| Landing page | 5 section components, each with own CSS Module file | R-10 |

---

## Phase 1: Design

### 1.1 `docusaurus.config.ts` — Complete Configuration

```ts
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import '@docusaurus/theme-mermaid'; // side-effect import: augments ThemeConfig types for strict TS

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the Digital Brain and the Physical World',
  favicon: 'img/favicon.ico',

  // GitHub Pages — fill YOUR_ORG and YOUR_REPO before deploying
  url: 'https://YOUR_ORG.github.io',
  baseUrl: '/YOUR_REPO/',
  organizationName: 'YOUR_ORG',
  projectName: 'YOUR_REPO',
  trailingSlash: false,

  onBrokenLinks: 'throw',       // Fail build on any broken link
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  // Mermaid support
  themes: ['@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',          // Docs at site root
        },
        blog: false,                   // Disabled per constitution
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    image: 'img/social-card.png',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Robot Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'courseSidebar',
          position: 'left',
          label: 'Course',
        },
        {
          href: 'https://github.com/YOUR_ORG/YOUR_REPO',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'Module 1: ROS 2', to: '/module-1-ros2/week-01-intro-physical-ai' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub Repository', href: 'https://github.com/YOUR_ORG/YOUR_REPO' },
          ],
        },
      ],
      copyright: `Physical AI & Humanoid Robotics — Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'cpp'],
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

### 1.2 `sidebars.ts` — Full 15-Item Definition

```ts
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  courseSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System (ROS 2)',
      collapsed: false,
      items: [
        'module-1-ros2/week-01-intro-physical-ai',
        'module-1-ros2/week-02-embodied-intelligence',
        'module-1-ros2/week-03-ros2-architecture',
        'module-1-ros2/week-04-nodes-topics-services',
        'module-1-ros2/week-05-ros2-packages',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      collapsed: false,
      items: [
        'module-2-simulation/week-06-gazebo-setup',
        'module-2-simulation/week-07-urdf-sdf',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac)',
      collapsed: false,
      items: [
        'module-3-isaac/week-08-isaac-platform',
        'module-3-isaac/week-09-perception-manipulation',
        'module-3-isaac/week-10-sim-to-real',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      collapsed: false,
      items: [
        'module-4-vla/week-11-humanoid-kinematics',
        'module-4-vla/week-12-bipedal-locomotion',
        'module-4-vla/week-13-conversational-robotics',
      ],
    },
    {
      type: 'category',
      label: 'Capstone Project',
      collapsed: false,
      items: ['capstone/autonomous-humanoid-project'],
    },
  ],
};

export default sidebars;
```

### 1.3 `src/css/custom.css` — Global Tokens and Fonts

Full content specified in research.md R-04. Key sections:
- Font `@import` statements at top (6 imports: Inter 400/400i/500/600, JetBrains 400/500)
- `:root` block: `--ifm-font-family-base`, `--ifm-font-family-monospace`, primary colour
  ramp for light mode
- `[data-theme='dark']` block: cyan primary ramp, dark background colours

### 1.4 Landing Page Component Architecture

Each component has single responsibility and its own CSS Module.

**`src/pages/index.tsx`** — page root:
```tsx
import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/landing/HeroSection';
import WhyPhysicalAI from '@site/src/components/landing/WhyPhysicalAI';
import CourseModules from '@site/src/components/landing/CourseModules';
import LearningOutcomes from '@site/src/components/landing/LearningOutcomes';
import HardwareOverview from '@site/src/components/landing/HardwareOverview';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Bridging the Digital Brain and the Physical World"
    >
      <HeroSection />
      <WhyPhysicalAI />
      <CourseModules />
      <LearningOutcomes />
      <HardwareOverview />
    </Layout>
  );
}
```

**HeroSection** — course title H1, tagline, "Start Learning →" button (`ChevronRight` icon)
**WhyPhysicalAI** — 3 feature cards (`Cpu`, `Bot`, `Zap` icons)
**CourseModules** — 4 module cards with numeric badge (no icon; typography treatment)
**LearningOutcomes** — 6 outcome bullets with CSS `::before` arrow
**HardwareOverview** — `Layers` icon + hardware paragraph + "Ready to start?" CTA

**lucide-react TypeScript convention** — pass icons as `LucideIcon` typed props:
```tsx
import type { LucideIcon } from 'lucide-react';
interface CardProps { icon: LucideIcon; title: string; description: string; }
// → const Card = ({ icon: Icon, ...}) => <Icon size={32} strokeWidth={1.5} />
```

**CSS Module rules** (enforced by constitution FR-010):
- File names: `ComponentName.module.css` (camelCase or PascalCase, `.module.css` suffix mandatory)
- Class names: camelCase only in CSS source (`.heroTitle` not `.hero-title`) — enables
  TypeScript dot-completion and strict key checking
- No per-file `.d.ts` needed — `@docusaurus/core` ships global ambient declaration

**Responsive** (SC-005 ≥ 375 px): `repeat(auto-fit, minmax(280px, 1fr))` grids collapse
naturally; `@media (max-width: 600px)` handles hero padding and full-width CTA buttons.

**SSR requirement**: Verify landing page with `pnpm build` — not only `pnpm start`.
`pnpm start` skips SSR; only a full build catches hydration errors from icon usage.
Static named imports (`import { Cpu } from 'lucide-react'`) are always SSR-safe.

### 1.5 `logo.svg` — Robot Icon Placeholder

Geometric SVG robot face (circles + rectangles) — no external tool required. Approximately:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
  <!-- robot head -->
  <rect x="8" y="10" width="24" height="20" rx="4" stroke="#00D4FF" stroke-width="2"/>
  <!-- eyes -->
  <circle cx="15" cy="18" r="3" fill="#00D4FF"/>
  <circle cx="25" cy="18" r="3" fill="#00D4FF"/>
  <!-- antenna -->
  <line x1="20" y1="10" x2="20" y2="4" stroke="#00D4FF" stroke-width="2"/>
  <circle cx="20" cy="3" r="2" fill="#0066CC"/>
  <!-- mouth -->
  <rect x="13" y="24" width="14" height="3" rx="1" fill="#00D4FF"/>
</svg>
```

### 1.6 Placeholder MDX Files

Each of the 14 placeholder files (13 chapters + capstone) uses this template:

```mdx
---
title: "Week N: [Title]"
sidebar_label: "Week N: [Short Title]"
---

# Week N: [Full Title]

:::info Coming Soon
This chapter is under active development.
:::

## Learning Objectives

- Objective 1
- Objective 2
- Objective 3

---

*Full content will be available soon. Check back or follow the GitHub repository for updates.*
```

The `intro.md` uses standard Markdown (not MDX) and serves as the course welcome page.

### 1.7 GitHub Actions Workflow (`deploy-book.yml`)

Full YAML as specified in research.md R-07. Key decisions:
- `permissions: contents: write` at job level
- `working-directory: book` for install and build steps
- `publish_dir: ./book/build` (repo-root-relative)
- `pnpm/action-setup@v4` with `version: 9` — **must come BEFORE `setup-node`** so Node can configure the pnpm cache correctly
- `cache-dependency-path: book/pnpm-lock.yaml` on the `setup-node` step
- `user_name`/`user_email` bot identity on the peaceiris step
- `commit_message: ${{ github.event.head_commit.message }}` to mirror commit message in gh-pages

---

## Implementation Order (Dependency-Sorted)

```
Step 1 — Scaffold          pnpm create docusaurus@latest
Step 2 — Config            docusaurus.config.ts + sidebars.ts + tsconfig.json
Step 3 — Assets            logo.svg + favicon
Step 4 — Global CSS        custom.css (fonts + colours)
Step 5 — Font packages     pnpm add @fontsource/*
Step 6 — Mermaid           pnpm add @docusaurus/theme-mermaid; update config
Step 7 — lucide-react      pnpm add lucide-react
Step 8 — Landing page      index.tsx + 5 section components + CSS Modules
Step 9 — Placeholder MDX   14 placeholder files (13 chapters + capstone) + intro.md
Step 10 — Verify local     pnpm start + quickstart.md checklist
Step 11 — CI/CD            .github/workflows/deploy-book.yml
Step 12 — Deploy verify    Push to main; confirm live GitHub Pages URL
```

Steps 4–7 are independent and can be done in any order. Steps 8–9 are independent.
Steps 1–3 must precede all others.

---

## Complexity Tracking

> No violations of constitution principles. This table is intentionally empty.

All choices are within constitution bounds:
- Single frontend project (no extra projects beyond what the spec requires)
- Component breakdown matches single-responsibility rule
- No backend, no auth, no Phase 2+ work included

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GitHub Pages URL/baseUrl mismatch causes 404 on live site | Medium | High | Set `onBrokenLinks: 'throw'` in config; confirm URL before deploying |
| TypeScript strict errors in Docusaurus theme override files | Low | Medium | Use `@docusaurus/tsconfig` as base; swizzled components not needed at this stage |
| pnpm-lock.yaml out of sync in CI (`--frozen-lockfile` fails) | Low | Medium | Commit lock file with every `pnpm add`; regenerate if needed |
| Mermaid renders as raw text (config not applied) | Low | Low | Verify both `themes` array and `markdown.mermaid: true` are set |
| lucide-react SSR hydration error | Low | Low | Use lucide-react v0.400+; avoid dynamic imports |
