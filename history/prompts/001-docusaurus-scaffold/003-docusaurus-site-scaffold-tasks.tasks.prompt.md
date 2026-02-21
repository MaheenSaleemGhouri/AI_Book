---
id: "003"
title: "Docusaurus Site Scaffold Task List"
stage: tasks
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 001-docusaurus-scaffold
branch: 001-docusaurus-scaffold
user: user
command: /sp.tasks
labels: ["tasks","docusaurus","typescript","pnpm","github-pages","landing-page","mermaid"]
links:
  spec: specs/001-docusaurus-scaffold/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-docusaurus-scaffold/tasks.md
  - history/prompts/001-docusaurus-scaffold/003-docusaurus-site-scaffold-tasks.tasks.prompt.md
tests:
  - pnpm build (zero TypeScript + zero broken-link errors)
  - quickstart.md manual checklist (15 sidebar items, Mermaid, syntax highlighting)
---

## Prompt

/sp.tasks — Generate actionable task list for feature 001-docusaurus-scaffold (Docusaurus v3
Site Scaffold). No explicit TDD/test request. Generate based on spec.md (6 user stories P1–P6)
and plan.md (complete implementation design).

## Response snapshot

Generated `specs/001-docusaurus-scaffold/tasks.md` with:
- 44 total tasks (T001–T044) across 7 phases
- Phase 1 (Setup/US1): T001–T006 — scaffold, tsconfig, package.json, delete defaults, full config, install deps
- Phase 2 (US2 Branding): T007–T008 — logo.svg, custom.css
- Phase 3 (US3 Sidebar): T009–T024 — sidebars.ts + 15 MDX placeholder files (14 [P] parallel)
- Phase 4 (US4 Landing): T025–T036 — index.module.css, 5 component pairs [P], index.tsx
- Phase 5 (US5 MDX): T037 — update week-01 MDX with Mermaid + code block test content
- Phase 6 (US6 CI/CD): T038–T039 — deploy-book.yml + URL config
- Phase 7 (Polish): T040–T044 — typecheck, build verify, quickstart audit, lint, .env.example
- No test tasks (not requested in spec)
- Parallel opportunities: 14 MDX files (Phase 3), 5 component pairs (Phase 4)
- MVP scope: T001–T006 (US1 only, ~30 min)

## Outcome

- ✅ Impact: tasks.md ready for /sp.implement; all 44 tasks have ID, checkbox, story label, file path
- 🧪 Tests: pnpm build (zero errors) + quickstart.md checklist
- 📁 Files: specs/001-docusaurus-scaffold/tasks.md created
- 🔁 Next prompts: /sp.implement to execute tasks
- 🧠 Reflection: US5 (MDX) depends on US3 (placeholder file must exist before updating);
  US4 landing page depends on US2 (custom.css must define CSS vars first).
  onBrokenLinks: throw means ALL 15 MDX files must exist before pnpm build runs cleanly.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): All 44 tasks follow checklist format — checkbox, ID,
  [P?], [USN], description with file path
- Prompt variant (if applicable): initial task generation
- Next experiment: /sp.implement for 001-docusaurus-scaffold
