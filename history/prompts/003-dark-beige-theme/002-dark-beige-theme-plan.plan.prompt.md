---
id: 002
title: Dark Brown Beige Theme Plan
stage: plan
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 003-dark-beige-theme
branch: 003-dark-beige-theme
user: user
command: /sp.plan
labels: ["theme", "typography", "css", "docusaurus", "plan", "architecture"]
links:
  spec: specs/003-dark-beige-theme/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-dark-beige-theme/plan.md
  - specs/003-dark-beige-theme/research.md
tests:
  - "pnpm build inside book/ exits 0 (post-implementation)"
  - "Visual inspection: zero blue/cyan colors"
  - "Hover test: all 7 interactive targets animate"
---

## Prompt

Create a precise implementation plan for the Dark Brown & Beige theme and typography overhaul. Exactly 4 files are modified. Here is the complete content for each file.

CONSTRAINTS: pnpm only; no new packages; Google Fonts via docusaurus.config.ts headTags only; pure CSS animations; TypeScript strict mode ON; pnpm build must pass zero errors.

IMPLEMENTATION ORDER: Step 1 Phase D sidebars.ts; Step 2 Phase A docusaurus.config.ts; Step 3 Phase B custom.css; Step 4 Phase C index.module.css; Step 5 Phase E index.tsx classNames; Step 6 Final pnpm build.

[Full phase content provided including exact CSS for all phases and verification checklist of 18 items]

## Response snapshot

Executed full planning workflow. Key finding: landing page uses 5-component architecture — the planned `pages/index.module.css` rewrite and `index.tsx` Phase E are not applicable. Generated research.md documenting 6 findings and adapted the plan accordingly.

Plan adapts user's 4-file scope to correct 8-file scope:
- Phase D: sidebars.ts — keep `courseSidebar` key (not `tutorialSidebar`), set collapsed:true for modules 2-4 and capstone, wrap intro in type:doc
- Phase A: docusaurus.config.ts — add headTags (3 link tags), update colorMode (2 of 3 fields)
- Phase B: custom.css — full rewrite (remove Inter, add JetBrains Mono 400+600, full Dark Brown palette)
- Phase C: 5 component CSS modules (not pages/index.module.css) — all per actual TSX classNames

Architectural discovery: index.tsx is a thin shell delegating to HeroSection, WhyPhysicalAI, CourseModules, LearningOutcomes, HardwareOverview. Each has its own CSS module. pages/index.module.css is unused. Phase E eliminated.

className mismatches corrected: featureDesc→featureDescription, moduleDesc→moduleWeeks+moduleSummary, heroCta→heroButton, footerCta→ctaButton.

## Outcome

- Impact: Complete implementation plan ready for /sp.tasks — 8 files, 4 phases, all 23 FRs covered
- Tests: pnpm build + pnpm start visual inspection + hover testing
- Files: specs/003-dark-beige-theme/plan.md, specs/003-dark-beige-theme/research.md
- Next prompts: /sp.tasks to generate actionable task list; /sp.implement to execute
- Reflection: Critical architecture gap between planned monolithic index.tsx and actual 5-component architecture. Research phase caught this before any code was written — exactly the value of the plan phase.

## Evaluation notes (flywheel)

- Failure modes observed: User's plan assumed monolithic landing page; actual codebase uses component-based architecture with per-component CSS modules
- Graders run and results (PASS/FAIL): Constitution Check — all 7 principles PASS
- Prompt variant (if applicable): null
- Next experiment: For future theme plans, read index.tsx and component directory before finalizing file scope in spec
