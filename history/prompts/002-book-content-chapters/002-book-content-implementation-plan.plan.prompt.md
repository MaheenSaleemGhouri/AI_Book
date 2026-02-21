---
id: "002"
title: Book Content Implementation Plan
stage: plan
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 002-book-content-chapters
branch: 002-book-content-chapters
user: architect
command: /sp.plan
labels: ["plan","mdx","textbook","ros2","gazebo","isaac","vla","docusaurus","content-writing"]
links:
  spec: specs/002-book-content-chapters/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-book-content-chapters/plan.md
  - specs/002-book-content-chapters/research.md
  - specs/002-book-content-chapters/data-model.md
  - specs/002-book-content-chapters/quickstart.md
  - specs/002-book-content-chapters/contracts/chapter-content-contract.md
tests:
  - "pnpm build verification after each batch (6 checkpoints)"
  - "Per-chapter content contract validation"
  - "Cross-reference URL validation via onBrokenLinks: throw"
---

## Prompt

Create a detailed technical implementation plan for writing all 15 MDX chapter files for the Physical AI & Humanoid Robotics textbook. The Docusaurus site is already live. This plan covers ONLY the content writing inside `book/docs/`.

[Full prompt included 6 batches of file-by-file requirements, mandatory 8-section template, tech context (MDX, Mermaid, Python 3.11+, ROS 2 Humble), execution strategy with post-batch build verification, content quality rules (10 rules), constraints, and Definition of Done (8 criteria).]

## Response snapshot

Completed full `/sp.plan` workflow:

**Phase 0 Research** (`research.md`): Resolved 10 technical decisions:
- Internal link URL pattern: `/module-X-Y/week-NN-slug` (no `/docs/` prefix — routeBasePath is `/`)
- Frontmatter: preserve `title` + `sidebar_label`; add `description` for SEO
- Mermaid: standard fenced blocks, plugin already configured (Docusaurus 3.9.2 + @docusaurus/theme-mermaid)
- Code blocks: `python showLineNumbers` confirmed working
- File strategy: full overwrite of all 15 placeholder files
- Build gate: `pnpm build` from `book/` after each batch

**Phase 1 Design**: Three artifacts created:
- `data-model.md`: Complete chapter content schema — standard (13 chapters), capstone variant, intro variant; 6 entity definitions (Chapter, MermaidDiagram, CodeExample, QuizQuestion, FurtherReadingLink, Submission Checklist)
- `contracts/chapter-content-contract.md`: Per-chapter delivery contracts for all 15 files (CONTRACT-INTRO through CONTRACT-CAPSTONE)
- `quickstart.md`: Writing workflow guide with URL reference table, pitfalls, and chapter checklist

**Phase 2 Plan** (`plan.md`): 6 sequential batches:
- Batch 1 (3 files): intro.md + Weeks 1-2
- Batch 2 (3 files): Weeks 3-5 (ROS 2 core)
- Batch 3 (2 files): Weeks 6-7 (Gazebo/URDF)
- Batch 4 (3 files): Weeks 8-10 (NVIDIA Isaac)
- Batch 5 (3 files): Weeks 11-13 (VLA/Kinematics)
- Batch 6 (1 file): Capstone

Each batch has per-task content specs with: mermaid diagram spec, code example specs (including method signatures), exercise specs with expected output, cross-references, word targets.

Constitution Check: all 7 principles PASS. Agent context updated via `update-agent-context.ps1`.

ADR suggestion surfaced: sequential vs parallel writing order.

## Outcome

- ✅ Impact: Complete implementation plan ready for `/sp.tasks` — all 15 files specified in detail
- 🧪 Tests: 6 `pnpm build` checkpoints (one per batch); contract validation per file
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/chapter-content-contract.md
- 🔁 Next prompts: `/sp.tasks` to generate atomic task list, then `/sp.implement`
- 🧠 Reflection: Content-writing features benefit from per-file delivery contracts (not just a generic template) — the CONTRACT-* entries make each chapter's requirements unambiguous for implementation agents

## Evaluation notes (flywheel)

- Failure modes observed: None — plan workflow ran cleanly; agent context update successful
- Graders run and results (PASS/FAIL): Constitution Check — all 7 gates PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Run `/sp.tasks` to extract atomic implementation tasks from this plan
