# Feature Specification: Dark Brown & Beige Theme + Typography Overhaul

**Feature Branch**: `003-dark-beige-theme`
**Created**: 2026-02-20
**Status**: Draft
**Input**: User description: "Apply the Dark Brown & Beige theme and premium typography system to the Physical AI & Humanoid Robotics Docusaurus book site — matching approved preview design (Option 3). Only styling files touched."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dark Brown & Beige Global Palette (Priority: P1)

As a **reader**, I want the entire site to use the Dark Brown & Beige color palette so the visual experience is warm, premium, and consistent with the approved design preview — replacing every default Docusaurus blue/white color.

**Why this priority**: The color palette is the visual foundation. All other stories depend on it being correct first. Without it, default Docusaurus blue/cyan chrome remains visible everywhere.

**Independent Test**: Open any page. Verify the background is `#1A0F0A`, the navbar is `#0F0804`, and all accent colors (links, active states, borders) are warm beige `#C8A882`. Zero blue, cyan, or white defaults appear.

**Acceptance Scenarios**:

1. **Given** the site is built and served, **When** I open any doc or landing page, **Then** the page background is `#1A0F0A` and no default Docusaurus blue is visible.
2. **Given** I navigate to a documentation chapter, **When** I inspect the sidebar, **Then** sidebar background is `#0F0804`, border is `#5C3D2A`, and the active link color is `#C8A882`.
3. **Given** I view the footer, **When** I inspect it, **Then** footer background is `#0F0804` with a `#5C3D2A` top border.
4. **Given** the CSS has both `:root` and `[data-theme='dark']` scopes, **When** the page loads in dark-only mode, **Then** all palette variables resolve to the Dark Brown & Beige values.
5. **Given** I run `pnpm build` inside `book/`, **When** the build completes, **Then** exit code is `0` with zero errors.
6. **Given** color mode is locked, **When** I inspect the page, **Then** no theme toggle switch is present in the UI.

---

### User Story 2 - Premium Typography System (Priority: P2)

As a **reader**, I want headings rendered in Syne 800 and body text in Space Grotesk so the typography feels distinctive, premium, and consistent with the approved preview.

**Why this priority**: Typography is the second most visible element after color. Correct fonts transform the reading experience and brand perception.

**Independent Test**: Open any chapter. Confirm `h1`/`h2` use Syne (visually geometric, distinct), body text and sidebar links use Space Grotesk, and code blocks use JetBrains Mono on a near-black background.

**Acceptance Scenarios**:

1. **Given** I open a chapter page, **When** I inspect an `h1` or `h2` element, **Then** `font-family` resolves to `Syne` at weight `800` (h1) or `700` (h2).
2. **Given** I inspect body paragraphs or sidebar links, **When** I check computed styles, **Then** `font-family` resolves to `Space Grotesk`.
3. **Given** I inspect an inline `code` or `pre` block, **When** I check computed styles, **Then** `font-family` resolves to `JetBrains Mono` at `0.9rem`.
4. **Given** the page loads, **When** fonts render, **Then** no layout shift occurs and no unstyled fallback text flash is visible.
5. **Given** `docusaurus.config.ts` is updated, **When** I view the page `<head>`, **Then** Google Fonts preconnect and stylesheet link tags for Syne and Space Grotesk are present.

---

### User Story 3 - Animated Hover Effects on All Interactive Elements (Priority: P3)

As a **visitor**, I want smooth, premium hover animations on every interactive element — cards lift, buttons glow, sidebar links slide — so the site feels polished and responsive.

**Why this priority**: Animations layer on top of color and typography. They enhance perceived quality but do not block content access.

**Independent Test**: On the landing page, hover over each module card, feature card, and CTA button. On a doc page, hover over sidebar links and pagination buttons. All respond with smooth 250ms transitions matching the approved values. DevTools shows zero JS event listeners for animations.

**Acceptance Scenarios**:

1. **Given** I hover over a module card, **When** the cursor enters, **Then** the card lifts `translateY(-6px)`, border shifts to `#C8A882`, background becomes `#3D2314`, and a `0 8px 32px rgba(200,168,130,0.22)` glow appears — all in 250ms ease-in-out.
2. **Given** I hover over a feature card, **When** the cursor enters, **Then** the card lifts `translateY(-4px)`, left border shifts to `#C8A882`, and a `0 6px 24px rgba(200,168,130,0.18)` shadow appears.
3. **Given** I hover over the primary CTA button, **When** the cursor enters, **Then** the button scales to `1.05`, background shifts to `#D4B896`, and a `0 0 24px rgba(200,168,130,0.4)` glow appears.
4. **Given** I hover over the ghost CTA button, **When** the cursor enters, **Then** border shifts to `#C8A882` and text shifts to `#F5E6D0`.
5. **Given** I hover over a sidebar link, **When** the cursor enters, **Then** padding-left increases 4px, text shifts to `#F5E6D0`, and background becomes `rgba(200,168,130,0.08)`.
6. **Given** I hover over a navbar link, **When** the cursor enters, **Then** a beige underline slides in from the left and text shifts to `#F5E6D0`.
7. **Given** I hover over a Prev/Next pagination button, **When** the cursor enters, **Then** button lifts `translateY(-2px)`, border shifts to `#C8A882`, and a subtle glow appears.
8. **Given** all animations are applied, **When** I inspect JS event listeners on animated elements, **Then** zero JS listeners exist for hover animations — all implemented in pure CSS.

---

### User Story 4 - All 15 Sidebar Chapters Correctly Linked (Priority: P4)

As a **student**, I want every sidebar chapter link to open the correct page with zero 404 errors so I can navigate the full course without interruption.

**Why this priority**: Correct navigation is essential for usability. It is a configuration-only fix (no new content) and depends on the sidebar styling (P1) being active to show the beige active state.

**Independent Test**: Run `pnpm build` with `onBrokenLinks: "throw"` — a zero-error exit confirms all 15 doc IDs map to existing files. Manually click each link in the live site.

**Acceptance Scenarios**:

1. **Given** `sidebars.ts` is updated with all 15 doc IDs, **When** I run `pnpm build`, **Then** exit code is `0` and zero broken-link errors appear.
2. **Given** the site is running, **When** I click any of the 15 chapter sidebar links, **Then** the correct chapter page opens with no 404.
3. **Given** I am on a chapter page, **When** I view the sidebar, **Then** the current chapter link is highlighted in beige (`#C8A882`) with a `3px solid #C8A882` left border.

---

### Edge Cases

- **Google Fonts unavailable**: If the CDN is unreachable, `system-ui` and `monospace` fallbacks render readable text. Acceptable — no local font bundling required.
- **Broken doc ID in sidebars.ts**: The `pnpm build` with `onBrokenLinks: "throw"` will error immediately, blocking deployment. Fix by correcting the doc ID to match the actual file path.
- **@fontsource import failure**: If JetBrains Mono CSS imports fail, the build errors. Resolution: verify the package exists in `book/node_modules/@fontsource/jetbrains-mono/`.
- **Animation in reduced-motion environments**: The current spec does not handle `prefers-reduced-motion`. This is a future accessibility enhancement, explicitly out of scope here.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display `#1A0F0A` as the page background on all pages.
- **FR-002**: The site MUST display `#0F0804` as the navbar background.
- **FR-003**: The site MUST display `#0F0804` as the sidebar and footer background, with `#5C3D2A` borders.
- **FR-004**: All `--ifm-color-primary-*` CSS variables MUST use the beige family (`#C8A882` base, with full dark/darker/darkest/light/lighter/lightest scale).
- **FR-005**: Both `:root` and `[data-theme='dark']` CSS scopes MUST carry identical Dark Brown & Beige values.
- **FR-006**: Color mode MUST be locked to dark-only: `defaultMode: 'dark'`, `disableSwitch: true`, `respectPrefersColorScheme: false`.
- **FR-007**: All `h1` elements MUST render in Syne at weight 800 and `1.8rem`.
- **FR-008**: All `h2` elements MUST render in Syne at weight 700 and `1.3rem`.
- **FR-009**: All body text, sidebar links, buttons, navbar links, and footer text MUST render in Space Grotesk.
- **FR-010**: All `code`, `pre`, and `.prism-code` blocks MUST render in JetBrains Mono at `0.9rem`.
- **FR-011**: Syne and Space Grotesk MUST be loaded via Google Fonts `headTags` in `docusaurus.config.ts` (preconnect + stylesheet links).
- **FR-012**: JetBrains Mono MUST be loaded via `@fontsource/jetbrains-mono` CSS `@import` statements in `custom.css`.
- **FR-013**: Module cards (4 total) MUST animate on hover: `translateY(-6px)`, `#C8A882` border, `#3D2314` background, card glow shadow, 250ms ease-in-out transition.
- **FR-014**: Feature cards (3 total) MUST animate on hover: `translateY(-4px)`, `#C8A882` left border, glow shadow, 250ms ease-in-out transition.
- **FR-015**: The primary CTA button MUST animate on hover: `scale(1.05)`, `#D4B896` background, button glow shadow, 250ms ease-in-out transition.
- **FR-016**: The ghost CTA button MUST animate on hover: `#C8A882` border and `#F5E6D0` text, 250ms ease-in-out transition.
- **FR-017**: Sidebar links MUST animate on hover: +4px padding-left, `#F5E6D0` text, `rgba(200,168,130,0.08)` background.
- **FR-018**: Active sidebar link MUST display: `#C8A882` text, `3px solid #C8A882` left border, `rgba(200,168,130,0.12)` background.
- **FR-019**: Navbar links MUST display a beige underline sliding from left on hover, with text shifting to `#F5E6D0`.
- **FR-020**: Pagination Prev/Next buttons MUST animate on hover: `translateY(-2px)`, `#C8A882` border, subtle glow.
- **FR-021**: All animations MUST be implemented in pure CSS — zero JavaScript.
- **FR-022**: `sidebars.ts` MUST contain correct doc IDs for all 15 chapters (5 in Module 1, 2 in Module 2, 3 in Module 3, 3 in Module 4, 1 capstone, plus intro).
- **FR-023**: `pnpm build` inside `book/` MUST complete with exit code `0` and zero broken-link or CSS errors.

### Scope Constraints (Non-Goals)

Explicitly **out of scope**:
- No changes to any `docs/**` MDX content files
- No changes to `static/**` assets
- No changes to `package.json` or installation of new packages
- No changes to `.github/**` workflows
- No structural or content changes to `index.tsx` — className attributes only
- No light mode styling (site is dark-only)
- No `prefers-reduced-motion` accessibility handling (future work)

### Key Entities

- **`book/docusaurus.config.ts`**: Site configuration — receives `headTags` for Google Fonts and `colorMode` lock.
- **`book/src/css/custom.css`**: Global stylesheet — full rewrite with all CSS custom properties and component overrides.
- **`book/src/pages/index.module.css`**: Landing page CSS module — full rewrite with layout, card, button, and animation styles.
- **`book/src/pages/index.tsx`**: Landing page React component — `className` attribute updates only, no structural changes.
- **`book/sidebars.ts`**: Sidebar configuration — all 15 doc IDs corrected.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every page displays a dark espresso-brown background — zero white, blue, or cyan backgrounds remain, confirmed by visual inspection after build.
- **SC-002**: All 15 sidebar chapter links open the correct pages with zero 404 errors, verified by `pnpm build` passing with `onBrokenLinks: "throw"` and manual click-through of each link.
- **SC-003**: Heading elements on every page are visually distinct from body text (different typeface), confirmed by visual inspection on at least 3 different pages.
- **SC-004**: All 9 interactive hover targets (4 module cards, 3 feature cards, primary CTA, ghost CTA) and sidebar links, navbar links, and pagination buttons respond with smooth animations — confirmed by manual hover testing.
- **SC-005**: `pnpm build` completes with exit code `0` and zero errors, confirmed immediately after all 4 files are updated.
- **SC-006**: The color mode toggle is absent from the rendered UI — visitors cannot switch to light mode.
- **SC-007**: The site's visual appearance matches the approved Dark Brown & Beige design preview on side-by-side comparison — no default Docusaurus chrome visible.

---

## Assumptions

- `@fontsource/jetbrains-mono` is already installed in `book/node_modules` (confirmed by user).
- All 15 chapter MDX files already exist under `book/docs/` at the paths matching the doc IDs specified in the updated `sidebars.ts`.
- `index.tsx` already contains the JSX structural elements (hero, module cards, feature cards, outcomes, hardware badges, footer CTA) that need only `className` updates.
- Google Fonts are accessible from the development environment; no offline/local font bundling is required.
- The build tool is `pnpm` — `npm` and `yarn` are not used.
- TypeScript strict mode remains on; no `any` types are introduced by this feature.
