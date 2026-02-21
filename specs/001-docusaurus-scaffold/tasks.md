---
description: "Task list for 001-docusaurus-scaffold"
---

# Tasks: Docusaurus v3 Site Scaffold

**Input**: Design documents from `specs/001-docusaurus-scaffold/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | quickstart.md ✅

**Tests**: Not requested — tasks are verified by `pnpm build` (zero errors) and the manual
checklist in `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story. US1 (Scaffold) is delivered by Phase 1 setup. US2–US6 each have
their own phase.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in all descriptions

---

## Phase 1: Setup — US1 Site Scaffold & Dev Server

**Goal**: Initialize a working Docusaurus v3 project that starts without errors and shows
no default demo content.

**Independent Test (US1)**: Run `pnpm install` then `pnpm start` inside `book/`. Dev server
starts on port 3000. Browsing to `http://localhost:3000/` shows a blank or minimal page —
no tutorial links, no blog link, no "My Site" banner.

- [x] T001 [US1] Scaffold Docusaurus v3 with TypeScript classic preset by running `pnpm create docusaurus@latest book classic --typescript` from repo root — this creates the entire `book/` directory
- [x] T002 [US1] Replace `book/tsconfig.json` with strict-mode configuration: extend `@docusaurus/tsconfig`, set `strict: true`, `skipLibCheck: true`, `noUnusedLocals: true`, `noFallthroughCasesInSwitch: true`, `forceConsistentCasingInFileNames: true`
- [x] T003 [P] [US1] Add `typecheck` script to `book/package.json` scripts block: `"typecheck": "tsc"`
- [x] T004 [US1] Delete scaffold demo content from `book/`: remove directories `docs/tutorial-basics/`, `docs/tutorial-extras/`, and `blog/`; delete `docs/intro.md`
- [x] T005 [US1] Write the complete `book/docusaurus.config.ts` per plan.md Phase 1 design: title, tagline, GitHub Pages URL placeholders (`YOUR_ORG`/`YOUR_REPO`), `onBrokenLinks: 'throw'`, blog disabled, `routeBasePath: '/'`, Mermaid themes array + `markdown.mermaid: true`, Prism `additionalLanguages`, full navbar/footer, colorMode dark default, Mermaid theme config, side-effect import `import '@docusaurus/theme-mermaid'`
- [x] T006 [P] [US1] Install all additional dependencies inside `book/` with pnpm: `@fontsource/inter`, `@fontsource/jetbrains-mono`, `@docusaurus/theme-mermaid`, `lucide-react`

**Checkpoint**: `pnpm install && pnpm start` inside `book/` runs with zero errors and no default demo content visible. US1 is independently testable at this point.

---

## Phase 2: US2 — Custom Theme & Branding

**Goal**: Replace all default Docusaurus visual artefacts with the Physical AI brand identity —
dark mode, deep-blue/cyan palette, custom robot logo, Inter/JetBrains Mono fonts.

**Independent Test (US2)**: Open any page in the browser. Default colour scheme is dark. Navbar
shows a robot SVG icon and "Physical AI & Humanoid Robotics". Body text renders in Inter;
code renders in JetBrains Mono. Footer shows course name and GitHub link. No Docusaurus
"My Site" default text or colours visible.

- [x] T007 [US2] Create `book/static/img/logo.svg` — geometric robot icon SVG (rectangle head, circle eyes, antenna, mouth bar) using `#00D4FF` stroke and `#0066CC` fill as specified in plan.md section 1.5
- [x] T008 [US2] Create `book/src/css/custom.css` with: six `@import` statements for @fontsource fonts at top (Inter 400/400-italic/500/600, JetBrains Mono 400/500); `:root` block setting `--ifm-font-family-base`, `--ifm-font-family-monospace`, full `--ifm-color-primary-*` light-mode ramp (#0066CC base); `[data-theme='dark']` block with cyan (#00D4FF) primary ramp and `--ifm-background-color: #0d1117`

**Checkpoint**: `pnpm start` — dark mode is default; Inter font visible in body text; JetBrains Mono in code; robot logo in navbar; correct blue/cyan colours. US2 independently verified.

---

## Phase 3: US3 — Full Sidebar Navigation

**Goal**: Configure the sidebar with all 15 course items and create every referenced MDX file
so no broken links exist.

**Independent Test (US3)**: Navigate the sidebar — click all 15 items. Zero 404 errors. Active
page highlighted. All 5 category sections visible: Introduction, Module 1–4, Capstone.

- [x] T009 [US3] Write `book/sidebars.ts` with complete `courseSidebar` — 5 categories (Module 1 with 5 items, Module 2 with 2 items, Module 3 with 3 items, Module 4 with 3 items, Capstone with 1 item) plus top-level `'intro'` entry as specified in plan.md section 1.2; set `collapsed: false` on all categories
- [x] T010 [US3] Create `book/docs/intro.md` — Welcome & Course Overview page with frontmatter `title: "Welcome to Physical AI & Humanoid Robotics"`, brief course description paragraph, and link to Module 1 Week 1
- [x] T011 [P] [US3] Create `book/docs/module-1-ros2/week-01-intro-physical-ai.mdx` — placeholder with frontmatter (`title`, `sidebar_label`), Coming Soon admonition, 3 learning objectives bullet points
- [x] T012 [P] [US3] Create `book/docs/module-1-ros2/week-02-embodied-intelligence.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T013 [P] [US3] Create `book/docs/module-1-ros2/week-03-ros2-architecture.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T014 [P] [US3] Create `book/docs/module-1-ros2/week-04-nodes-topics-services.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T015 [P] [US3] Create `book/docs/module-1-ros2/week-05-ros2-packages.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T016 [P] [US3] Create `book/docs/module-2-simulation/week-06-gazebo-setup.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T017 [P] [US3] Create `book/docs/module-2-simulation/week-07-urdf-sdf.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T018 [P] [US3] Create `book/docs/module-3-isaac/week-08-isaac-platform.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T019 [P] [US3] Create `book/docs/module-3-isaac/week-09-perception-manipulation.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T020 [P] [US3] Create `book/docs/module-3-isaac/week-10-sim-to-real.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T021 [P] [US3] Create `book/docs/module-4-vla/week-11-humanoid-kinematics.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T022 [P] [US3] Create `book/docs/module-4-vla/week-12-bipedal-locomotion.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T023 [P] [US3] Create `book/docs/module-4-vla/week-13-conversational-robotics.mdx` — placeholder with frontmatter, Coming Soon admonition, 3 learning objectives
- [x] T024 [P] [US3] Create `book/docs/capstone/autonomous-humanoid-project.mdx` — placeholder with frontmatter `title: "Autonomous Humanoid Project"`, Coming Soon admonition, 3 capstone objectives

**Checkpoint**: `pnpm start` — sidebar shows all 15 items, clicking each navigates without 404, active item highlighted. US3 independently verified.

---

## Phase 4: US4 — Polished Landing Page

**Goal**: Replace the Docusaurus default home page with a custom React page containing hero,
3 feature cards, 4 module cards, 6 outcomes, hardware section, and footer CTA.

**Independent Test (US4)**: Navigate to `http://localhost:3000/`. Custom landing page renders
with all 6 sections. "Start Learning" button routes to `/intro`. Mobile viewport (375 px)
shows no horizontal scrollbar. No TypeScript errors. No `any` types.

- [x] T025 [US4] Create `book/src/pages/index.module.css` — all landing page styles using camelCase class names: `.hero`, `.heroInner`, `.heroTitle`, `.heroTagline`, `.heroButton`, `.main`, `.sectionInner`, `.sectionTitle`, `.featuresSection`, `.featureCard`, `.featureIcon`, `.featureTitle`, `.featureDescription`, `.modulesSection`, `.moduleGrid`, `.moduleCard`, `.moduleNumber`, `.moduleTitle`, `.moduleWeeks`, `.moduleSummary`, `.outcomesSection`, `.outcomeList`, `.hardwareSection`, `.hardwareGrid`, `.hardwareIcon`, `.hardwareDescription`, `.ctaSection`, `.ctaTitle`, `.ctaButton` — include responsive `@media (max-width: 600px)` block for hero padding and full-width buttons
- [x] T026 [P] [US4] Create `book/src/components/landing/HeroSection.tsx` — exports `HeroSection` function component: renders `<header>` with course title H1, tagline paragraph, and `<Link to="/intro">` CTA button with `ChevronRight` lucide icon; uses `book/src/components/landing/HeroSection.module.css`; no `any` types; no inline styles
- [x] T027 [P] [US4] Create `book/src/components/landing/HeroSection.module.css` — `.hero`, `.heroInner`, `.heroTitle`, `.heroTagline`, `.heroButton` styles with dark gradient background
- [x] T028 [P] [US4] Create `book/src/components/landing/WhyPhysicalAI.tsx` — exports `WhyPhysicalAI` function component: renders section with 3 `FeatureCard` sub-components (Embodied Intelligence/`Cpu`, Real-World Deployment/`Bot`, Industry Demand/`Zap`); uses `LucideIcon` type for icon prop; uses `book/src/components/landing/WhyPhysicalAI.module.css`
- [x] T029 [P] [US4] Create `book/src/components/landing/WhyPhysicalAI.module.css` — `.featuresSection`, `.featureCard`, `.featureIcon`, `.featureTitle`, `.featureDescription` styles with CSS Grid `repeat(auto-fit, minmax(280px, 1fr))`
- [x] T030 [P] [US4] Create `book/src/components/landing/CourseModules.tsx` — exports `CourseModules` function component: renders 4 module cards (01 ROS2 Weeks 1–5, 02 Digital Twin Weeks 6–7, 03 AI Brain Weeks 8–10, 04 VLA Weeks 11–13) each with number badge, title, week range, 2-line summary; uses `book/src/components/landing/CourseModules.module.css`
- [x] T031 [P] [US4] Create `book/src/components/landing/CourseModules.module.css` — `.modulesSection`, `.moduleGrid`, `.moduleCard`, `.moduleNumber`, `.moduleTitle`, `.moduleWeeks`, `.moduleSummary` styles with 4-column auto-fit grid
- [x] T032 [P] [US4] Create `book/src/components/landing/LearningOutcomes.tsx` — exports `LearningOutcomes` function component: renders `<ul>` with exactly 6 outcome items (ROS2 workspace, Gazebo sim, perception pipelines, RL training, sim-to-real, voice capstone); uses `book/src/components/landing/LearningOutcomes.module.css`
- [x] T033 [P] [US4] Create `book/src/components/landing/LearningOutcomes.module.css` — `.outcomesSection`, `.outcomeList`, `li` styles with CSS `::before` arrow character and bottom border
- [x] T034 [P] [US4] Create `book/src/components/landing/HardwareOverview.tsx` — exports `HardwareOverview` function component: renders section with `Layers` lucide icon, hardware description paragraph (Ubuntu 22.04, Python 3.11, ROS 2 Humble, Gazebo, Isaac Sim), and `<Link to="/intro">` "Ready to Begin?" CTA button with `ChevronRight`; uses `book/src/components/landing/HardwareOverview.module.css`
- [x] T035 [P] [US4] Create `book/src/components/landing/HardwareOverview.module.css` — `.hardwareSection`, `.hardwareGrid`, `.hardwareIcon`, `.hardwareDescription`, `.ctaSection`, `.ctaTitle`, `.ctaButton` styles
- [x] T036 [US4] Create `book/src/pages/index.tsx` — exports default `Home` function component using Docusaurus `Layout`; imports and composes `HeroSection`, `WhyPhysicalAI`, `CourseModules`, `LearningOutcomes`, `HardwareOverview` from `@site/src/components/landing/`; sets `title` and `description` on Layout; no `any` types; no inline styles; uses `ReactNode` return type

**Checkpoint**: `pnpm start` — custom landing page renders with all 6 sections, "Start Learning" navigates to intro, 375 px mobile layout works. Run `pnpm build` to verify zero SSR errors. US4 independently verified.

---

## Phase 5: US5 — MDX & Rich Content Support

**Goal**: Verify that MDX files support JSX components, Mermaid diagrams, and syntax-highlighted
code blocks with copy button and line numbers.

**Independent Test (US5)**: Open `week-01-intro-physical-ai.mdx` page in the browser. A Mermaid
flowchart renders as a vector graphic (not raw text). A Python code block shows coloured
syntax and a copy button. A code block with `showLineNumbers` shows line numbers in the
left gutter. Zero browser console errors.

- [x] T037 [US5] Update `book/docs/module-1-ros2/week-01-intro-physical-ai.mdx` to include MDX feature test content: (1) a `:::info` admonition, (2) a Mermaid flowchart in a ` ```mermaid ` fence block showing a simple ROS2 node graph, (3) a Python code block with `showLineNumbers` showing a minimal `rclpy` publisher node, (4) a Bash code block, (5) a YAML code block — all with language-specific syntax highlighting

**Checkpoint**: `pnpm start` → navigate to Week 1 page. Mermaid diagram renders as SVG, Python/Bash/YAML code blocks have coloured keywords and copy buttons, line numbers visible. US5 independently verified.

---

## Phase 6: US6 — Automated GitHub Pages Deployment

**Goal**: Create the GitHub Actions workflow that auto-deploys the site on every push to `main`.

**Independent Test (US6)**: Merge PR to `main`. GitHub Actions workflow "Deploy Book to GitHub Pages"
runs automatically, completes without error, and the live site is accessible at the configured
GitHub Pages URL within 10 minutes.

- [x] T038 [US6] Create `.github/workflows/deploy-book.yml` — complete workflow per plan.md section 1.7: name "Deploy Book to GitHub Pages", trigger `push: branches: [main]` + `workflow_dispatch`, `permissions: contents: write`, steps in order: checkout@v4 with `fetch-depth: 0`, pnpm/action-setup@v4 before setup-node (version 9), setup-node@v4 with `node-version: '20'` + `cache: 'pnpm'` + `cache-dependency-path: book/pnpm-lock.yaml`, `pnpm install --frozen-lockfile` in `working-directory: book`, `pnpm run build` in `working-directory: book`, peaceiris/actions-gh-pages@v3 with `publish_dir: ./book/build`, `publish_branch: gh-pages`, bot user_name/user_email, `commit_message: ${{ github.event.head_commit.message }}`
- [ ] T039 [US6] Update `book/docusaurus.config.ts` — replace `YOUR_ORG` and `YOUR_REPO` placeholders in `url`, `baseUrl`, `organizationName`, `projectName` with the actual GitHub username/org and repository name; set `trailingSlash: false` (NOTE: trailingSlash already set; placeholders require manual update after repo push)

**Checkpoint**: Push to `main` triggers the workflow. After completion, navigate to `https://<org>.github.io/<repo>/`. Site loads with correct branding, sidebar, and landing page. US6 independently verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and production-build verification across all user stories.

- [x] T040 Run `pnpm run typecheck` inside `book/` and fix any TypeScript errors until output is clean (zero errors)
- [x] T041 Run `pnpm run build` inside `book/` and verify: zero TS errors, zero broken-link errors (`onBrokenLinks: throw`), all 15 pages rendered in `build/` directory
- [ ] T042 [P] Verify `quickstart.md` checklist — confirm all 15 sidebar items navigable, Mermaid renders, Python code block has syntax colour + copy button, line numbers work; update checklist status (requires browser verification)
- [x] T043 [P] Audit `book/src/` for unused imports and remove any — verify no `any` types remain by running `grep -r ': any' book/src/`
- [x] T044 Verify `.env.example` at repo root exists and documents that no environment variables are required for Phase 1 (Phase 2+ will add entries)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup / US1)**: No dependencies — start immediately
- **Phase 2 (US2 Branding)**: Depends on Phase 1 completion
- **Phase 3 (US3 Sidebar)**: Depends on Phase 1 completion; can run in parallel with Phase 2
- **Phase 4 (US4 Landing Page)**: Depends on Phase 1 + Phase 2 completion (needs CSS variables established)
- **Phase 5 (US5 MDX)**: Depends on Phase 3 completion (updates a file created in Phase 3)
- **Phase 6 (US6 CI/CD)**: Depends on Phase 1 completion (can be written any time after scaffold exists)
- **Phase 7 (Polish)**: Depends on all phases complete

### User Story Dependencies

- **US1** (P1): Delivered by Phase 1 — no prior story dependency
- **US2** (P2): Depends on US1 (scaffold must exist)
- **US3** (P3): Depends on US1 (scaffold must exist); independent of US2
- **US4** (P4): Depends on US1 + US2 (CSS variables from custom.css must be defined before landing page references them)
- **US5** (P5): Depends on US3 (week-01 MDX file must exist to update)
- **US6** (P6): Depends on US1 only (workflow just needs the `book/` directory to exist)

### Within Each Phase

- T011–T024 in Phase 3: All 14 placeholder MDX files are independent of each other — create all in parallel
- T026–T035 in Phase 4: Component .tsx and .module.css pairs are independent of other components
- T025 (index.module.css) must be created before T036 (index.tsx references it)
- T026–T035 must be complete before T036 (index.tsx imports all 5 components)

### Parallel Opportunities

```
# Phase 1 parallel set:
T003 (package.json typecheck script) — parallel with T004 and T006

# Phase 3 parallel set (all 14 placeholder MDX files):
T011, T012, T013, T014, T015  ← Module 1 weeks
T016, T017                     ← Module 2 weeks
T018, T019, T020               ← Module 3 weeks
T021, T022, T023               ← Module 4 weeks
T024                           ← Capstone

# Phase 4 parallel set (component pairs, after T025):
T026 + T027  ← HeroSection
T028 + T029  ← WhyPhysicalAI
T030 + T031  ← CourseModules
T032 + T033  ← LearningOutcomes
T034 + T035  ← HardwareOverview
# Then T036 (index.tsx) after all 5 components complete

# Phase 7 parallel set:
T042 (quickstart verification) — parallel with T043 (lint/type audit)
```

---

## Implementation Strategy

### MVP First (US1 Only — ~6 tasks, ~30 min)

1. Complete Phase 1: T001 → T006
2. **STOP and VALIDATE**: `pnpm start` works, no default content visible
3. US1 is independently demonstrable at this point

### Incremental Delivery

1. Phase 1 (T001–T006) → US1 verified → `pnpm start` works
2. Phase 2 (T007–T008) → US2 verified → dark theme + fonts visible
3. Phase 3 (T009–T024) → US3 verified → all 15 sidebar links work
4. Phase 4 (T025–T036) → US4 verified → custom landing page live
5. Phase 5 (T037) → US5 verified → Mermaid + code blocks render
6. Phase 6 (T038–T039) → US6 verified → GitHub Pages live
7. Phase 7 (T040–T044) → Polish → clean build, typecheck passes

### Parallel Team Strategy

With two developers after Phase 1 completes:
- Developer A: Phase 2 (branding) then Phase 4 (landing page)
- Developer B: Phase 3 (all 14 placeholder MDX files) then Phase 5 (MDX test)

---

## Notes

- `[P]` tasks have different file targets and no incomplete-task dependencies — safe to parallelise
- `[USN]` labels map each task to its user story for traceability
- All 14 placeholder MDX files in Phase 3 follow the same template — highly parallelisable
- Commit after each phase checkpoint to maintain clean, reversible history
- `onBrokenLinks: 'throw'` in config means any missing MDX file will fail `pnpm build` — create all 15 files before running a full build
- Verify with **`pnpm build` not just `pnpm start`** for US4 and US5 — SSR errors only surface in a full build
