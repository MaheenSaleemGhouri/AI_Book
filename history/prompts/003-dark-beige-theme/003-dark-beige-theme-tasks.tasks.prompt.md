---
id: 003
title: Dark Brown Beige Theme Tasks
stage: tasks
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 003-dark-beige-theme
branch: 003-dark-beige-theme
user: user
command: /sp.tasks
labels: ["theme", "css", "tasks", "docusaurus", "animations"]
links:
  spec: specs/003-dark-beige-theme/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-dark-beige-theme/tasks.md
tests:
  - "pnpm build inside book/ exits 0"
  - "Visual: zero blue/cyan colors"
  - "Hover: all 7+ interactive targets animate at 250ms"
---

## Prompt

(empty — /sp.tasks invoked with no additional input)

## Response snapshot

Generated tasks.md for the 003-dark-beige-theme feature. 26 total tasks organized into 6 phases:

- Phase 1: Setup (T001-T002) — verify JetBrains Mono weights + 15 MDX paths
- Phase 2: Foundational (T003-T006) — sidebars.ts fix + config (headTags + colorMode) + build gate
- Phase 3: US-01+02 (T007-T015) — full custom.css rewrite (palette + typography + all Docusaurus overrides)
- Phase 4: US-03 (T016-T020) — 5 component CSS modules (fully parallelizable)
- Phase 5: US-04 (T021-T023) — sidebar verification (implementation in Phase 2)
- Phase 6: Polish (T024-T026) — final build + 18-point visual checklist + DevTools JS check

Key decisions:
- No test tasks (not requested in spec; pnpm build + visual inspection is the test strategy)
- Phase 4 tasks (T016-T020) are fully parallelizable — 5 independent files
- US-04 implementation moved to Phase 2 (foundational) since sidebars must be correct for build to pass
- pages/index.module.css and index.tsx are NOT in task list (unused/not needed)
- courseSidebar key must be preserved in T003

## Outcome

- Impact: 26 immediately-executable tasks, organized by priority; Phase 4 offers maximum parallelism
- Tests: pnpm build exit code + visual inspection + hover test + DevTools listener check
- Files: specs/003-dark-beige-theme/tasks.md
- Next prompts: /sp.implement to execute all tasks sequentially or in parallel
- Reflection: CSS-only features map cleanly to one task per file; the 5-component architecture enables genuine parallelism in Phase 4

## Evaluation notes (flywheel)

- Failure modes observed: None — tasks generated cleanly from plan.md and spec.md
- Graders run and results (PASS/FAIL): Format validation — all 26 tasks follow [ID] [P?] [Story] format with file paths — PASS
- Prompt variant (if applicable): null
- Next experiment: null
