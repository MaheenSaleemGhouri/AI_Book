# Tasks: Dark Brown & Beige Theme + Typography Overhaul

**Input**: Design documents from `/specs/003-dark-beige-theme/`
**Prerequisites**: spec.md ✅, plan.md ✅, research.md ✅
**Tests**: No test tasks — not requested in spec (pure CSS styling, verified by `pnpm build` + visual inspection)

**Key architectural note**: Landing page uses 5-component architecture. Phase C targets component CSS modules, NOT `pages/index.module.css`. `index.tsx` requires zero changes. See `research.md` Finding 1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies between them)
- **[Story]**: User story this task belongs to (US1–US4)
- No test tasks — spec uses `pnpm build` exit code + visual inspection as verification

---

## Phase 1: Setup (Environment Verification)

**Purpose**: Confirm prerequisites exist before writing any code. Failures here block all subsequent phases.

- [x] T001 Verify `@fontsource/jetbrains-mono` has `400.css` and `600.css` files in `book/node_modules/@fontsource/jetbrains-mono/` — if `600.css` missing, note to use `500.css` instead
- [x] T002 Verify all 15 MDX doc files exist in `book/docs/` at these exact paths: `intro.md`, `module-1-ros2/week-01-intro-physical-ai.md`, `module-1-ros2/week-02-embodied-intelligence.md`, `module-1-ros2/week-03-ros2-architecture.md`, `module-1-ros2/week-04-nodes-topics-services.md`, `module-1-ros2/week-05-ros2-packages.md`, `module-2-simulation/week-06-gazebo-setup.md`, `module-2-simulation/week-07-urdf-sdf.md`, `module-3-isaac/week-08-isaac-platform.md`, `module-3-isaac/week-09-perception-manipulation.md`, `module-3-isaac/week-10-sim-to-real.md`, `module-4-vla/week-11-humanoid-kinematics.md`, `module-4-vla/week-12-bipedal-locomotion.md`, `module-4-vla/week-13-conversational-robotics.md`, `capstone/autonomous-humanoid-project.md`

**Checkpoint**: Both files verified. Proceed to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fix navigation wiring and load Google Fonts. These must complete before any palette/animation work begins.

**⚠️ CRITICAL**: Sidebar fix (T003) must complete and pass `pnpm build` before Phase 3 starts.

- [x] T003 Rewrite `book/sidebars.ts` — keep `courseSidebar` key (NOT `tutorialSidebar`); replace bare `'intro'` string with `{ type: 'doc', id: 'intro', label: '📖 Welcome & Course Overview' }`; change `collapsed: false` → `collapsed: true` for Module 2, Module 3, Module 4, and Capstone categories; keep all 15 doc IDs exactly as-is
- [x] T004 [P] Add `headTags` array to `book/docusaurus.config.ts` at top-level config scope (same level as `title`, `tagline`, `url`) — 3 entries: preconnect to `https://fonts.googleapis.com`, preconnect to `https://fonts.gstatic.com` (with `crossorigin: 'anonymous'`), stylesheet link for `https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;600;700&display=swap`
- [x] T005 [P] Update `themeConfig.colorMode` in `book/docusaurus.config.ts` — set `disableSwitch: true` (was `false`) and `respectPrefersColorScheme: false` (was `true`); leave `defaultMode: 'dark'` unchanged
- [x] T006 Run `pnpm build` inside `book/` directory — must exit code 0 with zero broken-link errors before proceeding

**Checkpoint**: Build passes. Fonts configured. All 15 sidebar links verified. Phase 3 can now begin.

---

## Phase 3: User Story 1 + 2 — Global Palette & Typography (Priority: P1, P2) 🎯 MVP

**Goal**: Replace the entire Inter/blue/cyan theme with the Dark Brown & Beige palette and premium fonts across all Docusaurus chrome (navbar, sidebar, footer, TOC, code blocks, pagination, admonitions, breadcrumbs, tables, scrollbar).

**Independent Test**: Run `pnpm start`. Open any doc page. Verify: background `#1A0F0A`, navbar `#0F0804`, accent `#C8A882`, headings in Syne 800, body in Space Grotesk, code in JetBrains Mono. Zero blue or white visible.

**Note**: US-01 (palette) and US-02 (typography) are implemented in a single file (`custom.css`) and are inseparable — both are covered by tasks T007–T009.

### Implementation

- [x] T007 [US1] Remove ALL existing content from `book/src/css/custom.css` and add font imports at top: `@import url('@fontsource/jetbrains-mono/400.css');` and `@import url('@fontsource/jetbrains-mono/600.css');` (use `500.css` if `600.css` absent per T001 finding)

- [x] T008 [US1] Add `:root` CSS custom properties block to `book/src/css/custom.css` with complete Dark Brown & Beige palette:
  - Primary accent family: `--ifm-color-primary: #C8A882` through full dark/darker/darkest/light/lighter/lightest scale
  - Backgrounds: `--ifm-background-color: #1A0F0A`, `--ifm-background-surface-color: #2C1810`, `--ifm-navbar-background-color: #0F0804`, `--ifm-footer-background-color: #0F0804`
  - Text: `--ifm-font-color-base: #F5E6D0`, `--ifm-font-color-secondary: #C8A882`, `--ifm-heading-color: #F5E6D0`, `--ifm-link-color: #C8A882`, `--ifm-link-hover-color: #EDD8BE`
  - Typography: `--ifm-font-family-base: 'Space Grotesk', system-ui, sans-serif`, `--ifm-font-family-monospace: 'JetBrains Mono', monospace`, `--ifm-font-size-base: 1rem`, `--ifm-line-height-base: 1.75`, `--ifm-code-font-size: 0.9rem`
  - Borders: `--ifm-toc-border-color: #5C3D2A`, `--ifm-hr-border-color: #5C3D2A`, `--ifm-color-emphasis-200: #2C1810`, `--ifm-color-emphasis-300: #5C3D2A`, `--ifm-color-emphasis-400: #8B7355`
  - Code: `--ifm-code-background: #0A0503`, `--docusaurus-highlighted-code-line-bg: rgba(200,168,130,0.12)`, `--prism-background-color: #0A0503`
  - Menu: `--ifm-menu-color: #8B7355`, `--ifm-menu-color-active: #C8A882`, `--ifm-menu-color-background-active: rgba(200,168,130,0.12)`, `--ifm-menu-color-background-hover: rgba(200,168,130,0.07)`
  - Misc: `--ifm-card-background-color: #2C1810`, `scrollbar-color: #5C3D2A #0F0804`, `scrollbar-width: thin`

- [x] T009 [US1] Add `[data-theme='dark']` block to `book/src/css/custom.css` — identical values to `:root` (dark is the only mode)

- [x] T010 [US2] Add global typography rules to `book/src/css/custom.css`:
  - `body`: `font-family: 'Space Grotesk', system-ui, sans-serif; background-color: #1A0F0A; color: #F5E6D0`
  - `h1–h6`: `font-family: 'Syne', sans-serif; color: #F5E6D0; letter-spacing: -0.3px`
  - `h1`: `font-size: 1.8rem; font-weight: 800; line-height: 1.2`
  - `h2`: `font-size: 1.3rem; font-weight: 700; line-height: 1.3`
  - `h3`: `font-size: 1.1rem; font-weight: 600`
  - `p`: `line-height: 1.75; color: #F5E6D0`
  - `a`: `color: #C8A882; transition: color 0.25s ease` + hover `color: #EDD8BE; text-decoration: none`
  - `code, pre, kbd, samp`: `font-family: 'JetBrains Mono', monospace !important; font-size: 0.9rem`

- [x] T011 [P] [US1] Add navbar overrides to `book/src/css/custom.css`: `.navbar` background `#0F0804` with `#5C3D2A` bottom border; `.navbar__title` Syne 800; `.navbar__link` Space Grotesk 600 muted + `::after` underline slide animation (width 0→100% on hover, `#C8A882` background, `transition: width 0.25s ease-in-out`)

- [x] T012 [P] [US1] Add sidebar overrides to `book/src/css/custom.css`: `.theme-doc-sidebar-container` background `#0F0804 !important` + `#5C3D2A` right border; `.menu__link` Space Grotesk 500, `border-left: 3px solid transparent`, hover adds 4px padding-left + `rgba(200,168,130,0.07)` bg + beige left border; `.menu__link--active` `#C8A882 !important` + `rgba(200,168,130,0.12) !important` bg + `#C8A882 !important` left border

- [x] T013 [P] [US1] Add footer overrides to `book/src/css/custom.css`: `.footer` background `#0F0804` + `#5C3D2A` top border; `.footer__title` Syne 700; `.footer__link-item` Space Grotesk muted + hover `#EDD8BE`; `.footer__copyright` muted small text

- [x] T014 [P] [US1] Add code block overrides to `book/src/css/custom.css`: `pre.prism-code` background `#0A0503 !important` + `#5C3D2A` border + `border-radius: 10px`; `code:not([class*='language-'])` beige tinted inline code; `.token.*` overrides for keyword `#C8A882`, string `#EDD8BE`, function `#D4B896`, number `#E0CAAA`, comment `#5C3D2A italic`, class-name `#C8A882 bold`

- [x] T015 [P] [US1] Add remaining Docusaurus component overrides to `book/src/css/custom.css`:
  - TOC: `.table-of-contents__link` muted `#5C3D2A` → hover `#C8A882`
  - Admonitions: `.alert` dark surface `#2C1810` + `#5C3D2A` border; colored left borders per type (info `#C8A882`, tip `#8B9E6A`, warning `#C8A036`, danger `#C85A42`)
  - Pagination: `.pagination-nav__link` dark surface → hover `translateY(-2px)` + beige border + glow; `.pagination-nav__label` Syne 700 `#C8A882`
  - Breadcrumbs: `.breadcrumbs__link` muted → hover `#C8A882`
  - Markdown tables: `th` Syne 700 `#C8A882` on `#2C1810`; `td` Space Grotesk `#F5E6D0`; alternating rows
  - Scrollbar: `#5C3D2A` thumb, `#0F0804` track, hover thumb `#C8A882`

**Checkpoint**: `pnpm start` shows complete Dark Brown & Beige theme. Syne headings, Space Grotesk body, JetBrains Mono code. Zero blue/cyan. Navbar underline animation works. Sidebar active state beige. Pagination hover works.

---

## Phase 4: User Story 3 — Animated Hover Effects (Priority: P3)

**Goal**: Apply Dark Brown & Beige colors and 250ms hover animations to all 5 landing page components. All 5 component CSS files can be written in parallel — they are independent files with no cross-dependencies.

**Independent Test**: Run `pnpm start`. Navigate to homepage. Hover over each of the 4 module cards (lift + glow + top gradient), 3 feature cards (lift + beige left border), hero button (scale + glow), CTA button (fill + scale). Confirm all transitions at 250ms ease-in-out. DevTools confirms zero JS event listeners on animated elements.

### Implementation (all 5 tasks can run in parallel)

- [x] T016 [P] [US3] Rewrite `book/src/components/landing/HeroSection.module.css`:
  - `.hero`: dark gradient `linear-gradient(160deg, #0F0804 0%, #1A0F0A 40%, #2C1810 100%)`, `min-height: 100vh`, centered flex, `overflow: hidden`
  - `.hero::before`: radial beige glow overlay `rgba(200,168,130,0.06)`, `pointer-events: none`
  - `.heroInner`: `max-width: 720px`, `z-index: 1`, relative position
  - `.heroTitle`: Syne 800, `3.2rem`, `#F5E6D0`, `letter-spacing: -1px`; `@media (min-width: 768px)` → `3.8rem`
  - `.heroTagline`: Space Grotesk, `1.2rem`, `#8B7355`, `line-height: 1.6`, `max-width: 500px`
  - `.heroButton`: beige fill `#C8A882`, dark text `#0F0804`, Space Grotesk 700, `14px 36px` padding, `border-radius: 8px`, `transition: all 0.25s ease-in-out`
  - `.heroButton:hover`: `background-color: #D4B896`, `transform: scale(1.05)`, `box-shadow: 0 0 24px rgba(200,168,130,0.4)`
  - Mobile: `@media (max-width: 600px)` hero padding `3rem 1rem`, title `2rem`, button full-width

- [x] T017 [P] [US3] Rewrite `book/src/components/landing/WhyPhysicalAI.module.css`:
  - `.featuresSection`: background `#0F0804`, `padding: 80px 24px`
  - `.sectionInner`: `max-width: 1100px`, centered
  - `.sectionTitle`: Syne 800, `2rem`, `#F5E6D0`, `letter-spacing: -0.5px`
  - `.featureGrid`: `grid-template-columns: 1fr`; `@media (min-width: 768px)` → `repeat(3, 1fr)`, `gap: 20px`
  - `.featureCard`: background `#2C1810`, `border: 1px solid #5C3D2A`, `border-left: 4px solid #5C3D2A`, `border-radius: 10px`, `padding: 24px 20px`, `transition: all 0.25s ease-in-out`
  - `.featureCard:hover`: `transform: translateY(-4px)`, `border-left-color: #C8A882`, `background-color: #3D2314`, `box-shadow: 0 6px 24px rgba(200,168,130,0.18)`
  - `.featureIcon`: `color: #C8A882`, `margin-bottom: 12px`
  - `.featureTitle`: Syne 700, `1rem`, `#F5E6D0`
  - `.featureDescription`: Space Grotesk, `0.875rem`, `#8B7355`, `line-height: 1.6`

- [x] T018 [P] [US3] Rewrite `book/src/components/landing/CourseModules.module.css`:
  - `.modulesSection`: background `#1A0F0A`, `padding: 80px 24px`
  - `.sectionInner`: `max-width: 1100px`, centered
  - `.sectionTitle`: Syne 800, `2rem`, `#F5E6D0`
  - `.moduleGrid`: `1fr` → `repeat(2, 1fr)` at 768px → `repeat(4, 1fr)` at 1024px, `gap: 20px`
  - `.moduleCard`: background `#2C1810`, `border: 1px solid #5C3D2A`, `border-radius: 12px`, `padding: 28px 22px`, `transition: all 0.25s ease-in-out`, `overflow: hidden`, `position: relative`
  - `.moduleCard::before`: `position: absolute; top:0; left:0; width:100%; height:3px; background: linear-gradient(90deg, #C8A882, #EDD8BE); transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease-in-out`
  - `.moduleCard:hover`: `transform: translateY(-6px)`, `border-color: #C8A882`, `background-color: #3D2314`, `box-shadow: 0 8px 32px rgba(200,168,130,0.22)`
  - `.moduleCard:hover::before`: `transform: scaleX(1)`
  - `.moduleNumber`: Space Grotesk 700, `0.7rem`, `letter-spacing: 2px`, `text-transform: uppercase`, `#C8A882`
  - `.moduleTitle`: Syne 800, `1rem`, `#F5E6D0`, `line-height: 1.3`
  - `.moduleWeeks`: Space Grotesk 600, `0.75rem`, `letter-spacing: 1px`, `text-transform: uppercase`, `#C8A882`
  - `.moduleSummary`: Space Grotesk, `0.85rem`, `#8B7355`, `line-height: 1.6`

- [x] T019 [P] [US3] Rewrite `book/src/components/landing/LearningOutcomes.module.css`:
  - `.outcomesSection`: background `#0F0804`, `padding: 80px 24px`
  - `.sectionInner`: `max-width: 900px`, centered
  - `.sectionTitle`: Syne 800, `2rem`, `#F5E6D0`
  - `.outcomeList`: `list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr; gap: 14px`; `@media (min-width: 768px)` → `repeat(2, 1fr)`
  - `.outcomeList li`: `display: flex; align-items: flex-start; gap: 12px; padding: 16px 18px; background-color: #2C1810; border: 1px solid #5C3D2A; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #F5E6D0; line-height: 1.5; position: relative`
  - `.outcomeList li::before`: `content: '✓'; color: #C8A882; font-weight: 700; flex-shrink: 0; margin-top: 1px; position: static`

- [x] T020 [P] [US3] Rewrite `book/src/components/landing/HardwareOverview.module.css`:
  - `.hardwareSection`: background `#1A0F0A`, `padding: 80px 24px`
  - `.sectionInner`: `max-width: 900px`, centered
  - `.sectionTitle`: Syne 800, `2rem`, `#F5E6D0`
  - `.hardwareGrid`: `display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center`
  - `.hardwareIcon`: `color: #C8A882`
  - `.hardwareDescription`: Space Grotesk, `1rem`, `#8B7355`, `line-height: 1.75`, `max-width: 680px`
  - `.hardwareDescription strong`: `color: #F5E6D0`
  - `.ctaSection`: `margin-top: 16px; text-align: center`
  - `.ctaTitle`: Syne 700, `1.5rem`, `#F5E6D0`, `margin-bottom: 20px`
  - `.ctaButton`: ghost button — `background-color: transparent`, `color: #C8A882`, `border: 2px solid #C8A882`, Space Grotesk 700, `13px 34px` padding, `border-radius: 8px`, `transition: all 0.25s ease-in-out`, `display: inline-flex; align-items: center; gap: 0.5rem`
  - `.ctaButton:hover`: `background-color: #C8A882`, `color: #0F0804`, `transform: scale(1.05)`, `box-shadow: 0 0 24px rgba(200,168,130,0.4)`, `text-decoration: none`

**Checkpoint**: All 4 module cards lift + glow + top bar reveals on hover. All 3 feature cards lift + beige left border. Hero button scales + glows. CTA button fills beige + scales. All transitions smooth at 250ms.

---

## Phase 5: User Story 4 — Sidebar Links Wired (Priority: P4)

**Goal**: Confirm all 15 sidebar chapter links work correctly after Phase 2 sidebars.ts fix.

**Independent Test**: `pnpm build` exits 0 with zero broken-link errors. Manual click-through of all 15 links with zero 404s. Active sidebar link shows beige `#C8A882` color with left border.

**Note**: The implementation work for US-04 was completed in Phase 2 (T003). This phase is the verification gate.

- [x] T021 [US4] Run `pnpm build` inside `book/` and confirm exit code 0 — zero broken-link or CSS errors
- [ ] T022 [US4] Run `pnpm start` and manually click all 15 sidebar links — verify each opens the correct page with zero 404 errors: intro, weeks 01–05 (Module 1), weeks 06–07 (Module 2), weeks 08–10 (Module 3), weeks 11–13 (Module 4), capstone
- [ ] T023 [US4] Verify sidebar active link styling — current chapter shows `#C8A882` text with `3px solid #C8A882` left border and `rgba(200,168,130,0.12)` background

**Checkpoint**: All 15 links work. Active styling confirmed. All user stories independently functional.

---

## Phase 6: Polish & Final Verification

**Purpose**: Final build validation and full acceptance checklist verification.

- [x] T024 Run `pnpm build` inside `book/` — must exit code 0, zero errors, zero broken links (final gate)
- [ ] T025 [P] Visual acceptance pass — verify all 18 checklist items from `plan.md` Verification Checklist: background `#1A0F0A`, navbar `#0F0804`, no toggle, footer border, sidebar active, Syne headings, Space Grotesk body, JetBrains Mono code, 4 card animations, 3 feature animations, 2 button animations, sidebar link animation, navbar underline, pagination hover, zero 404s
- [ ] T026 [P] DevTools check — inspect event listeners on module cards and CTA buttons; confirm zero JavaScript hover listeners (all animations are pure CSS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup): No dependencies — start immediately
- **Phase 2** (Foundational): Depends on Phase 1 verification — **blocks all user story phases**
- **Phase 3** (US-01+02, custom.css): Depends on Phase 2 completion — specifically T004 (headTags) must be done before fonts can be verified
- **Phase 4** (US-03, component CSS): Depends on Phase 3 — palette variables must exist for component CSS to verify correctly against the theme
- **Phase 5** (US-04 verification): T003 (sidebars.ts) already done in Phase 2 — this phase is verification only
- **Phase 6** (Polish): Depends on all user story phases complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|-----------|-------|
| US-04 (sidebar links) | Phase 2 T003 | Implementation done in foundational phase; this is the highest-risk build issue |
| US-01 (palette) | Phase 2 T004, T005 | Fonts must load; dark mode must be locked |
| US-02 (typography) | US-01 same file | Implemented together with US-01 in custom.css |
| US-03 (animations) | US-01 palette | Component cards use `#2C1810`, `#5C3D2A` etc. — palette vars must be set |

### Parallel Opportunities

**Within Phase 2**: T004 and T005 can run in parallel (different parts of `docusaurus.config.ts`)

**Within Phase 3**: T011–T015 can run in parallel — all add rules to `custom.css` (but must be sequential within the same file; an LLM implementing solo should do them sequentially)

**Within Phase 4 — maximum parallelism**: T016, T017, T018, T019, T020 are fully independent files:
```bash
# All 5 can be dispatched simultaneously:
Task: "Rewrite HeroSection.module.css"       → T016
Task: "Rewrite WhyPhysicalAI.module.css"     → T017
Task: "Rewrite CourseModules.module.css"     → T018
Task: "Rewrite LearningOutcomes.module.css"  → T019
Task: "Rewrite HardwareOverview.module.css"  → T020
```

**Within Phase 6**: T025 and T026 can run in parallel (visual check vs DevTools check)

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Complete Phase 1: Verification
2. Complete Phase 2: Fix sidebars + config (T003–T006)
3. Complete Phase 3 T007–T010 only: palette variables + typography rules
4. **STOP and VALIDATE**: `pnpm start` — site has Dark Brown & Beige palette with correct fonts
5. This alone satisfies FR-001 through FR-012 and SC-001, SC-005, SC-006, SC-007

### Incremental Delivery

1. Phase 1 + 2 → Build passes baseline ✓
2. Phase 3 (US-01+02) → Full palette + typography live ✓
3. Phase 4 (US-03) → All animations live ✓
4. Phase 5 (US-04 verify) → All 15 links confirmed ✓
5. Phase 6 → Final sign-off ✓

### Parallel Team Strategy

With two agents:
- **Agent A**: Phases 1, 2, 3 (sequential — config and global CSS)
- **Agent B** (starts after Phase 3): Phases 4 and 5 in parallel (5 component CSS files)

---

## Notes

- Tasks T016–T020 are fully parallelizable across separate agents (different files)
- `pages/index.module.css` is NOT modified — it is unused (research.md Finding 1)
- `index.tsx` (pages) is NOT modified — components are self-contained
- No TSX files are modified — zero structural changes
- All animations are pure CSS (`transition` property) — no JS required
- `courseSidebar` key MUST be preserved in sidebars.ts (T003) — changing it breaks `docusaurus.config.ts` navbar reference
