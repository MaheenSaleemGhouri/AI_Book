# Feature Specification: Docusaurus v3 Site Scaffold

**Feature Branch**: `001-docusaurus-scaffold`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "Build the complete Docusaurus v3 site for the Physical AI &
Humanoid Robotics textbook. Frontend site scaffold, configuration, custom theme, landing
page, and GitHub Pages deployment pipeline. No book content, no backend, no chatbot."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Site Scaffold & Dev Server (Priority: P1)

A developer clones the repository and needs to start contributing to the book immediately.
They run a single install command and a single start command to get a live preview of the
site in their browser with zero configuration errors.

**Why this priority**: Everything else depends on a working local dev environment. No
sidebar, landing page, or deployment is possible until the site project can boot cleanly.

**Independent Test**: After checkout, running install and start commands produces a running
site accessible in the browser. No placeholder tutorials or blog content appears.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** the developer runs the install
   command inside `book/`, **Then** all dependencies install with no errors.
2. **Given** a successful install, **When** the developer runs the start command,
   **Then** the dev server starts and the site is accessible at localhost on port 3000.
3. **Given** the running dev server, **When** the developer browses to the root URL,
   **Then** no default tutorial pages, blog links, or placeholder banners are visible.

---

### User Story 2 — Custom Theme & Branding (Priority: P2)

A first-time visitor opens the site and immediately perceives it as a professional robotics
textbook — not a generic documentation template. The visual identity communicates the
technical, forward-looking nature of Physical AI.

**Why this priority**: Branding is the site's first impression and directly affects whether
visitors trust the material and continue reading. All subsequent content renders inside
this theme shell.

**Independent Test**: A visitor landing on any page sees the custom colour scheme, logo,
fonts, and footer without any default Docusaurus visual artefacts.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site, **When** the page loads, **Then** the default colour
   theme is dark mode with deep-blue primary and cyan accent colours.
2. **Given** the site renders, **When** the visitor looks at the navbar, **Then** a custom
   robot-icon logo and the title "Physical AI & Humanoid Robotics" are visible.
3. **Given** the site renders, **When** the visitor scrolls to the bottom, **Then** the
   footer shows the course name, a "Built with Docusaurus" attribution, and a GitHub
   repository link placeholder — with no default tutorial or blog links anywhere.
4. **Given** the site renders, **When** body text and code blocks appear, **Then** custom
   fonts (humanist sans-serif for prose, monospace for code) are applied.

---

### User Story 3 — Full Sidebar Navigation (Priority: P3)

A student wants to understand the complete course structure before deciding which module to
start. They open the sidebar and see all 4 modules, 13 weeks, and the capstone listed — and
can click any item without hitting a broken link.

**Why this priority**: Navigation is the primary wayfinding mechanism. Students MUST be
able to explore the syllabus even before all chapter content is written.

**Independent Test**: Every sidebar item is clickable and loads a page (even placeholder
content). No 404 errors occur when navigating the full sidebar.

**Acceptance Scenarios**:

1. **Given** the site is running, **When** a student opens the sidebar, **Then** all
   top-level sections are visible: Introduction, Module 1, Module 2, Module 3, Module 4,
   and Capstone Project.
2. **Given** the sidebar is open, **When** the student clicks any of the 15 sidebar items,
   **Then** they are taken to a valid page — no 404 errors occur.
3. **Given** the student is on a chapter page, **When** they look at the sidebar,
   **Then** the current page is highlighted as active.

---

### User Story 4 — Polished Landing Page (Priority: P4)

A prospective student arrives at the site root for the first time. They need enough context
within 30 seconds to decide whether this course is for them and where to begin.

**Why this priority**: The landing page is the primary conversion surface. It MUST
communicate course value and provide a clear call-to-action before any chapter content
exists.

**Independent Test**: A visitor who has never heard of the course can arrive at the landing
page, understand what they will learn, and click a button to reach the first chapter — all
without scrolling more than twice on a desktop screen.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the site root, **When** the page loads, **Then** a
   hero section with the course title, tagline, and a "Start Learning" button is the first
   thing they see.
2. **Given** the visitor scrolls the landing page, **When** they read through it,
   **Then** they encounter: 3 feature cards explaining why Physical AI matters, 4 module
   summary cards, 6 learning outcome bullets, and a hardware overview section.
3. **Given** the visitor sees the "Start Learning" button, **When** they click it,
   **Then** they are taken directly to the Introduction chapter.
4. **Given** the visitor is on a mobile device (screen ≥ 375 px wide), **When** the page
   renders, **Then** all sections stack and remain readable without horizontal scrolling.

---

### User Story 5 — MDX & Rich Content Support (Priority: P5)

A content author writes a new chapter and wants to embed a system-architecture diagram
directly in the Markdown file — without switching to an external tool or adding a separate
image asset.

**Why this priority**: MDX and diagram support are prerequisites for all future chapter
content. Verifying them now prevents rework when chapters are written.

**Independent Test**: A test `.mdx` file with a JSX component, a diagram-as-code block,
and syntax-highlighted code in multiple languages renders correctly without errors.

**Acceptance Scenarios**:

1. **Given** an `.mdx` file with an embedded JSX component, **When** the author runs the
   dev server, **Then** the component renders visually in the browser without errors.
2. **Given** an `.mdx` file with a diagram-as-code block, **When** the page loads,
   **Then** the diagram renders as a vector graphic inside the page.
3. **Given** a code block tagged with a language name (Python, Bash, YAML, TypeScript, C++),
   **When** the page renders, **Then** keywords are syntax-coloured and a copy button
   appears.
4. **Given** a code block with line-number annotation, **When** the page renders,
   **Then** line numbers are shown in the left gutter.

---

### User Story 6 — Automated GitHub Pages Deployment (Priority: P6)

A developer merges a PR into the `main` branch. They expect the live public site to reflect
the changes within a few minutes — without running any manual deployment commands.

**Why this priority**: Automated deployment is the delivery mechanism for the hackathon
submission. The site MUST be publicly accessible; a broken pipeline means no public URL.

**Independent Test**: A commit pushed to `main` triggers the pipeline, which completes
successfully and produces a live, publicly accessible URL.

**Acceptance Scenarios**:

1. **Given** a commit is pushed to the `main` branch, **When** the CI pipeline runs,
   **Then** it completes all steps (install → build → deploy) without manual intervention.
2. **Given** the pipeline succeeds, **When** the developer visits the GitHub Pages URL,
   **Then** the updated site is live and publicly accessible.
3. **Given** the repository configuration, **When** reviewing the pipeline definition,
   **Then** the workflow name, trigger branch, and deployment target are explicitly declared.

---

### Edge Cases

- What happens when the sidebar references a file that does not yet exist? Each referenced
  file MUST be created (even as a one-line placeholder) before launch so no broken links
  exist at deployment time.
- What happens if the build step fails during CI? The pipeline MUST exit with a non-zero
  code and the live hosting branch MUST NOT be updated with a broken build.
- What happens on a viewport narrower than 375 px? Behaviour below this breakpoint is out
  of scope; only ≥ 375 px viewport width is guaranteed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST start and serve pages locally via a single start command with
  no additional configuration required after cloning.
- **FR-002**: The site MUST use the project-mandated package manager exclusively; no lock
  files or artefacts from other package managers are permitted in the repository.
- **FR-003**: TypeScript strict mode MUST be enabled project-wide; no untyped values are
  permitted in source files.
- **FR-004**: Dark mode MUST be the default colour theme, using a deep-blue primary colour
  (#0066CC) and cyan accent colour (#00D4FF); no default colours from the site generator
  MUST remain visible.
- **FR-005**: A custom SVG robot-icon logo MUST appear in the navbar alongside the course
  title "Physical AI & Humanoid Robotics" and tagline "Bridging the Digital Brain and the
  Physical World".
- **FR-006**: The sidebar MUST list all 15 navigable items (1 intro + 13 weekly chapters +
  1 capstone) with each item linking to a valid, non-404 page.
- **FR-007**: Every sidebar link MUST resolve to an existing file (placeholder "Coming Soon"
  content is acceptable); broken internal links are a blocking defect.
- **FR-008**: The landing page MUST be a custom-built page (NOT the site generator default)
  containing exactly: hero section, 3 feature cards, 4 module cards, 6 outcome bullets,
  hardware overview section, and a footer call-to-action.
- **FR-009**: The landing page MUST be fully readable and functional at viewport widths
  ≥ 375 px without horizontal scrolling.
- **FR-010**: Landing page styles MUST use CSS Modules only; inline styles and external
  CSS frameworks are forbidden.
- **FR-011**: MDX files MUST support embedded JSX components, diagram-as-code rendering,
  and syntax highlighting for at least: Python, Bash, YAML, TypeScript, C++.
- **FR-012**: Code blocks MUST display a copy button by default and MUST support optional
  line numbers via per-block annotation.
- **FR-013**: A CI pipeline MUST automatically build and deploy the site to the public
  hosting branch on every push to `main`, with zero manual steps required.
- **FR-014**: The CI pipeline MUST fail with a non-zero exit code if the build step fails,
  and MUST NOT deploy a broken build to the live site.
- **FR-015**: The live site URL and base path MUST be explicitly configured in the site
  configuration to match the actual public hosting address.
- **FR-016**: No default tutorial pages, blog routes, or demo content MUST appear on any
  route of the deployed site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer unfamiliar with the project can clone the repo, run two commands
  (install + start), and have the site running locally within 3 minutes.
- **SC-002**: All 15 sidebar items are navigable with zero broken links (0% 404 rate on
  internal navigation).
- **SC-003**: A diagram-as-code block and a Python code block with syntax highlighting both
  render correctly in the test MDX file on first page load, with zero browser console errors.
- **SC-004**: A push to `main` results in the live public site being updated within
  10 minutes, with no manual steps performed by the developer.
- **SC-005**: The landing page is readable and fully functional on a 375 px-wide mobile
  viewport with no horizontal scroll bar.
- **SC-006**: Zero TypeScript compilation errors are reported during site build.
- **SC-007**: No default demo content (tutorials, blog, placeholder banner) is visible on
  any route of the deployed site.

## Assumptions

- The GitHub repository will be public (required for free GitHub Pages hosting on the
  free tier).
- The `organizationName` and `projectName` values in the site configuration will be
  confirmed and set by the developer at implementation time; placeholders are acceptable
  in the initial commit.
- The robot-icon SVG logo is a simple geometric placeholder — detailed graphic design is
  out of scope for this spec.
- Custom fonts are referenced via a public CDN in the global CSS file; no local font
  asset files are required.
- The CI pipeline runs on standard GitHub-hosted cloud runners; self-hosted runners are
  out of scope.
- Mermaid diagram support is provided via the official plugin maintained by the site
  generator project.
