---
id: "003"
title: Book Content Atomic Tasks
stage: tasks
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 002-book-content-chapters
branch: 002-book-content-chapters
user: architect
command: /sp.tasks
labels: ["tasks","mdx","textbook","ros2","gazebo","isaac","vla","docusaurus","content-writing"]
links:
  spec: specs/002-book-content-chapters/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-book-content-chapters/tasks.md
tests:
  - "pnpm build verification gate after each of 6 batches"
  - "grep showLineNumbers confirms ≥2 code blocks per chapter"
  - "grep ✅ count confirms exactly 5 per non-capstone chapter"
  - "Capstone submission checklist contains exactly 10 items"
---

## Prompt

(empty — `/sp.tasks` with no additional arguments)

## Response snapshot

Completed full `/sp.tasks` workflow for feature `002-book-content-chapters`:

**Prerequisites checked**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**User Story Mapping**:
- US1 (P1): Student reads a weekly chapter and gains measurable knowledge
- US2 (P1): Student completes hands-on exercise on their own machine
- US3 (P2): Student validates their learning via the chapter quiz
- US4 (P2): Educator assigns chapters as a structured 13-week curriculum (cross-ref audit)
- US5 (P3): Student completes the capstone project

**Generated `specs/002-book-content-chapters/tasks.md`**: 31 tasks across 10 phases:
- Phase 1 (T001–T002): Setup — verify 15 placeholder files exist, start dev server
- Phase 2 (T003–T004): Foundational — write `book/docs/intro.md` + build gate
- Phase 3 (T005–T007): US1+US2+US3 — Batch 1: Weeks 1–2 + build gate [P within batch]
- Phase 4 (T008–T011): US1+US2+US3 — Batch 2: Weeks 3–5 + build gate [P within batch]
- Phase 5 (T012–T014): US1+US2+US3 — Batch 3: Weeks 6–7 + build gate [P within batch]
- Phase 6 (T015–T018): US1+US2+US3 — Batch 4: Weeks 8–10 + build gate [P within batch]
- Phase 7 (T019–T022): US1+US2+US3 — Batch 5: Weeks 11–13 + build gate [P within batch]
- Phase 8 (T023–T025): US4 — Cross-reference audit across all chapters + build gate
- Phase 9 (T026–T027): US5 — Capstone chapter + final build gate
- Phase 10 (T028–T031): Polish — grep verifications (showLineNumbers, ✅ count, checklist items) + final pnpm build

Each file-writing task contains complete per-chapter content spec: exact frontmatter, Mermaid diagram spec, code example method signatures, exercise difficulty + expected output, word targets, cross-reference targets — sufficient for an LLM agent to write each chapter without additional context.

**Parallel opportunities**: Within each batch, chapter tasks are [P]-marked (different files, no dependencies on each other). Batches are strictly sequential due to the pnpm build gate requirement.

**Suggested MVP scope**: Phase 1 + Phase 2 + Phase 3 (T001–T007) — delivers intro page + Weeks 1–2 as a complete, independently testable reading+exercise+quiz experience.

## Outcome

- ✅ Impact: Complete 31-task implementation plan ready for `/sp.implement` — all 15 chapter files specified in atomic, self-contained detail
- 🧪 Tests: 6 `pnpm build` checkpoints (one per batch + final); 4 grep-based content validation tasks in Phase 10
- 📁 Files: specs/002-book-content-chapters/tasks.md
- 🔁 Next prompts: `/sp.implement` to execute tasks T001–T031 and write all 15 MDX chapter files
- 🧠 Reflection: Content-writing task lists benefit from embedding complete per-chapter specs inside each task rather than referencing separate contract files — this makes each task independently executable by a fresh LLM context without needing to reload all 5 design documents

## Evaluation notes (flywheel)

- Failure modes observed: None — task generation ran cleanly from the 6 existing design artifacts
- Graders run and results (PASS/FAIL): Format validation — all 31 tasks follow checklist format (checkbox, ID, [P] marker where applicable, [US] label in story phases, file path) PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Run `/sp.implement` starting from T001 to begin actual chapter writing
