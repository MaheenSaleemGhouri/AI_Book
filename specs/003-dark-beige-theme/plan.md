# Implementation Plan: Dark Brown & Beige Theme + Typography Overhaul

**Branch**: `003-dark-beige-theme` | **Date**: 2026-02-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-dark-beige-theme/spec.md`

---

## Summary

Replace the current Inter/blue/cyan Docusaurus theme with the approved Dark Brown & Beige palette (`#1A0F0A` base, `#C8A882` accent) and premium typography (Syne 800 headings, Space Grotesk body, JetBrains Mono code). All animations are pure CSS. All 15 sidebar links are verified correct. Zero structural or content changes.

**Critical research finding**: The landing page uses a 5-component architecture (`HeroSection`, `WhyPhysicalAI`, `CourseModules`, `LearningOutcomes`, `HardwareOverview`), each with its own CSS module. The originally planned `pages/index.module.css` rewrite and `index.tsx` className update (Phase E) are not applicable — Phase C targets the 5 component CSS modules directly. See [research.md](research.md).

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode ON); CSS3
**Primary Dependencies**: Docusaurus v3; `@fontsource/jetbrains-mono` (installed); Google Fonts CDN (Syne + Space Grotesk via headTags)
**Storage**: N/A
**Testing**: `pnpm build` (zero exit = pass); `pnpm start` (visual inspection)
**Target Platform**: Static site — modern browsers (Chromium/Firefox/Safari)
**Project Type**: Web — Docusaurus v3 static site inside `book/` subdirectory
**Performance Goals**: No new JS bundles; CSS-only animations; fonts via preconnect
**Constraints**: TypeScript strict mode ON; no new npm packages; no `any` types; pnpm only
**Scale/Scope**: 8 files modified; ~1,200 lines of CSS replaced/added

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | PASS | Spec `003-dark-beige-theme/spec.md` finalized before any code |
| II. Clean Code | PASS | All CSS classes clearly named; no commented-out code introduced |
| III. Phase-Based Delivery | PASS | This is Phase 1 (book frontend) work |
| IV. Content Quality | PASS | Zero MDX files touched |
| V. TypeScript Standards | PASS | `strict: true` preserved; no `any`; no TSX structural changes |
| VI. Secrets & Env | PASS | No secrets involved in styling |
| VII. Git Discipline | NOTE | Constitution says `feature/phase-N-desc` but spec convention uses `NNN-short-name`. Branch `003-dark-beige-theme` follows spec convention. Acceptable — spec convention governs feature work. |

**Gate: PASS** — no violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-dark-beige-theme/
├── spec.md              [DONE] /sp.specify
├── research.md          [DONE] /sp.plan Phase 0
├── plan.md              [DONE] This file
├── checklists/
│   └── requirements.md  [DONE] /sp.specify
└── tasks.md             [NEXT] /sp.tasks
```

### Source Code — Files to Modify

```text
book/
├── sidebars.ts                                       [PHASE D]
├── docusaurus.config.ts                              [PHASE A]
├── src/css/custom.css                                [PHASE B]
└── src/components/landing/
    ├── HeroSection.module.css                        [PHASE C-1]
    ├── WhyPhysicalAI.module.css                      [PHASE C-2]
    ├── CourseModules.module.css                      [PHASE C-3]
    ├── LearningOutcomes.module.css                   [PHASE C-4]
    └── HardwareOverview.module.css                   [PHASE C-5]
```

**NOT modified** (zero changes):
- `book/src/pages/index.tsx` — thin shell; components are self-contained
- `book/src/pages/index.module.css` — unused legacy file; not imported anywhere
- `book/src/components/landing/*.tsx` — zero JSX structural changes
- `book/docs/**` — zero MDX content changes
- `book/package.json` — no new packages
- `.github/**` — no workflow changes

**Structure Decision**: 5-component CSS module architecture requires targeting each component's CSS file individually. This is the smallest viable change that achieves the visual goal with zero structural disruption.

---

## Complexity Tracking

> No Constitution Check violations. Table empty — no justifications required.

---

## Implementation Phases (Execution Order)

### PHASE D — Fix `book/sidebars.ts`

**Goal**: Correct sidebar structure — wrap intro in `type: 'doc'` with label; set Modules 2–4 and Capstone to `collapsed: true`.

**Why first**: Ensures `pnpm build` passes with `onBrokenLinks: 'throw'` before any styling work begins. Zero-risk change with no visual side effects.

**Key constraint**: Keep `courseSidebar` as the sidebar key — changing it to `tutorialSidebar` would break `docusaurus.config.ts` which references `sidebarId: 'courseSidebar'`.

**Change diff**:
- `'intro'` (bare string) → `{ type: 'doc', id: 'intro', label: '📖 Welcome & Course Overview' }`
- Module 2, 3, 4 and Capstone: `collapsed: false` → `collapsed: true`
- All 15 doc IDs are already correct — no path changes needed

**Acceptance check**: `pnpm build` inside `book/` exits 0, zero `[broken link]` errors.

---

### PHASE A — Update `book/docusaurus.config.ts`

**Goal**: Load Google Fonts via `headTags`; lock color mode to dark-only.

**Two targeted changes only**:

**1. Add `headTags` array** (top-level config, same level as `title`, `tagline`):
```typescript
headTags: [
  {
    tagName: 'link',
    attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;600;700&display=swap',
    },
  },
],
```

**2. Update `themeConfig.colorMode`** (change 2 fields, `defaultMode` already correct):
```typescript
colorMode: {
  defaultMode: 'dark',               // unchanged
  disableSwitch: true,               // was false
  respectPrefersColorScheme: false,  // was true
},
```

**Acceptance check**: Page `<head>` shows 3 Google Fonts link tags. No theme toggle in navbar.

---

### PHASE B — Full Rewrite `book/src/css/custom.css`

**Goal**: Replace Inter/blue/cyan palette with Dark Brown & Beige CSS custom properties. Cover all Docusaurus component classes: navbar, sidebar, footer, code, TOC, admonitions, pagination, breadcrumbs, markdown tables, scrollbar.

**Remove**: All `@fontsource/inter/*` imports; all `:root` blue variables; all `[data-theme='dark']` cyan variables.

**Add**:
- `@import url('@fontsource/jetbrains-mono/400.css');`
- `@import url('@fontsource/jetbrains-mono/600.css');`
- Complete `:root` and `[data-theme='dark']` blocks with Dark Brown & Beige palette
- All component CSS overrides per Phase B spec

**Acceptance check**: `pnpm start` shows `#1A0F0A` background; `#C8A882` accent everywhere; Syne on headings; Space Grotesk on body; JetBrains Mono on code blocks.

---

### PHASE C — Rewrite 5 Component CSS Modules

**Goal**: Apply Dark Brown & Beige colors and 250ms hover animations to all landing page sections.

**Why 5 files, not 1**: Each landing component imports its own CSS module. `pages/index.module.css` is not imported anywhere. See research.md Finding 1 and 2.

**className mapping** (actual TSX classNames → new CSS values):

| Component | TSX className | New behavior |
|-----------|--------------|-------------|
| `HeroSection` | `.hero` | Dark gradient background, full viewport height |
| `HeroSection` | `.heroButton` | Beige fill → scale(1.05) + glow on hover |
| `WhyPhysicalAI` | `.featureCard` | Brown surface → translateY(-4px) + beige left border on hover |
| `WhyPhysicalAI` | `.featureDescription` | (NOT `.featureDesc` — actual TSX name) |
| `CourseModules` | `.moduleCard` | Brown surface → translateY(-6px) + beige glow on hover |
| `CourseModules` | `.moduleWeeks` | Beige label (NOT `.moduleDesc`) |
| `CourseModules` | `.moduleSummary` | Muted body text (NOT `.moduleDesc`) |
| `HardwareOverview` | `.ctaButton` | Ghost outline → fills beige + scale(1.05) on hover |

**Files and new content**:

**C-1 `HeroSection.module.css`**: Full-viewport dark gradient hero; `.heroButton` with scale+glow hover.

**C-2 `WhyPhysicalAI.module.css`**: Dark surface feature section; `.featureCard` with `translateY(-4px)` + beige left border hover.

**C-3 `CourseModules.module.css`**: Module grid; `.moduleCard` with `translateY(-6px)` + beige glow + top gradient bar hover reveal; `.moduleWeeks` as beige label; `.moduleSummary` as muted text.

**C-4 `LearningOutcomes.module.css`**: Outcome grid with dark surface cards; `li::before` checkmark in beige.

**C-5 `HardwareOverview.module.css`**: Hardware section; `.ctaButton` ghost → fills beige + scale on hover.

**Acceptance check**: Hover all 4 module cards (lift + glow), 3 feature cards (lift + border), hero button (scale + glow), CTA button (fill + scale). All transitions at 250ms.

---

## Verification Checklist

Run before creating any PR:

- [ ] `pnpm build` inside `book/` exits 0 — zero errors, zero broken links
- [ ] Page background is `#1A0F0A` — no blue or white backgrounds
- [ ] Navbar is `#0F0804`; brand title in Syne 800 beige; no theme toggle
- [ ] Footer is `#0F0804` with `#5C3D2A` top border
- [ ] Sidebar is `#0F0804` with `#5C3D2A` border; active link is `#C8A882`
- [ ] All headings render in Syne — visually distinct from body text
- [ ] Body text renders in Space Grotesk
- [ ] Code blocks render in JetBrains Mono on `#0A0503` background
- [ ] 4 module cards: `translateY(-6px)` + beige border + `0 8px 32px rgba(200,168,130,0.22)` on hover
- [ ] 3 feature cards: `translateY(-4px)` + beige left border + shadow on hover
- [ ] Hero button: `scale(1.05)` + `0 0 24px rgba(200,168,130,0.4)` glow on hover
- [ ] CTA button: fills beige + `scale(1.05)` on hover
- [ ] Sidebar links: +4px padding-left + `#F5E6D0` text on hover
- [ ] Active sidebar link: `#C8A882` text + `3px solid #C8A882` left border
- [ ] Navbar links: beige underline slides from left on hover
- [ ] Pagination Prev/Next: `translateY(-2px)` + beige border on hover
- [ ] All 15 sidebar links open correct pages — zero 404s
- [ ] Zero JS event listeners for animations (DevTools check)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `@fontsource/jetbrains-mono/600.css` does not exist | Low | Build error | Check `node_modules/@fontsource/jetbrains-mono/` before; use `500.css` if absent |
| Google Fonts CDN blocked | Low | Font fallback to system-ui | Acceptable; preconnect minimises latency |
| Prism `.token.*` overrides insufficient depth | Low | Dracula colors bleed through | Add `!important` to token overrides if needed |
| `var(--ifm-menu-link-padding-horizontal)` undefined | Very Low | Sidebar hover broken | Use `calc(var(--ifm-menu-link-padding-horizontal, 12px) + 4px)` fallback |
