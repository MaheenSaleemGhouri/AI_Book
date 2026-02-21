---
id: "001"
title: "Docusaurus Site Scaffold Spec"
stage: spec
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 001-docusaurus-scaffold
branch: 001-docusaurus-scaffold
user: user
command: /sp.specify
labels: ["spec","docusaurus","site-scaffold","github-pages","physical-ai-robotics"]
links:
  spec: specs/001-docusaurus-scaffold/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-docusaurus-scaffold/spec.md
  - specs/001-docusaurus-scaffold/checklists/requirements.md
  - history/prompts/001-docusaurus-scaffold/001-docusaurus-site-scaffold-spec.spec.prompt.md
tests:
  - N/A
---

## Prompt

Build the complete Docusaurus v3 site for the "Physical AI & Humanoid Robotics" textbook.
This spec covers ONLY the frontend site scaffold, configuration, custom theme, landing page,
and GitHub Pages deployment pipeline. No book content, no backend, no chatbot — just the
site structure working and live.

User stories provided:
- US-01: Site Scaffold — Docusaurus v3 in book/ with TypeScript, pnpm, zero errors
- US-02: Custom Theme & Branding — dark mode default, #0066CC/#00D4FF palette, custom logo, fonts, footer
- US-03: Sidebar Structure — all 15 items (intro + 13 weeks + capstone), zero 404s
- US-04: Landing Page — hero, 3 feature cards, 4 module cards, 6 outcomes, hardware overview, CTA
- US-05: MDX Support — JSX components, Mermaid diagrams, syntax highlighting (Python/Bash/YAML/TS/C++)
- US-06: GitHub Actions Deployment — auto-deploy to GitHub Pages on push to main

Out of scope: chapter content, RAG chatbot, backend, auth, PersonalizeButton, UrduToggle.

## Response snapshot

Created feature branch `001-docusaurus-scaffold` and wrote spec to
`specs/001-docusaurus-scaffold/spec.md` with:
- 6 user stories (P1–P6) with acceptance scenarios
- 16 functional requirements (FR-001 to FR-016)
- 7 measurable success criteria (SC-001 to SC-007)
- Edge cases section (broken links, CI failure, narrow viewport)
- Assumptions section (public repo, font CDN, robot SVG placeholder)
- Spec quality checklist at checklists/requirements.md — all items pass
- Zero [NEEDS CLARIFICATION] markers

## Outcome

- ✅ Impact: Spec ready for /sp.plan; all 6 user stories documented with acceptance criteria
- 🧪 Tests: N/A (spec artifact)
- 📁 Files: specs/001-docusaurus-scaffold/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan — architecture and implementation planning
- 🧠 Reflection: User provided very detailed acceptance criteria; spec required minimal inference.
  Constitution constraints (pnpm, TypeScript strict, CSS Modules) referenced as constraints
  rather than implementation leakage.

## Evaluation notes (flywheel)

- Failure modes observed: create-new-feature.ps1 errored on history/prompts path argument
  but branch and spec file were created successfully before the error
- Graders run and results (PASS/FAIL): All checklist items PASS
- Prompt variant (if applicable): initial creation
- Next experiment: /sp.plan for 001-docusaurus-scaffold
