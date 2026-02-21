---
id: "004"
title: "Implement All 14 MDX Chapters"
stage: green
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 002-book-content-chapters
branch: 002-book-content-chapters
user: Dell
command: /sp.implement
labels: ["implementation","mdx","docusaurus","ros2","content","chapters"]
links:
  spec: specs/002-book-content-chapters/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - book/docs/module-1-ros2/week-01-intro-physical-ai.mdx
  - book/docs/module-1-ros2/week-02-embodied-intelligence.mdx
  - book/docs/module-1-ros2/week-03-ros2-architecture.mdx
  - book/docs/module-1-ros2/week-04-nodes-topics-services.mdx
  - book/docs/module-1-ros2/week-05-ros2-packages.mdx
  - book/docs/module-2-simulation/week-06-gazebo-setup.mdx
  - book/docs/module-2-simulation/week-07-urdf-sdf.mdx
  - book/docs/module-3-isaac/week-08-isaac-platform.mdx
  - book/docs/module-3-isaac/week-09-perception-manipulation.mdx
  - book/docs/module-3-isaac/week-10-sim-to-real.mdx
  - book/docs/module-4-vla/week-11-humanoid-kinematics.mdx
  - book/docs/module-4-vla/week-12-bipedal-locomotion.mdx
  - book/docs/module-4-vla/week-13-conversational-robotics.mdx
  - book/docs/capstone/autonomous-humanoid-project.mdx
  - specs/002-book-content-chapters/tasks.md
tests:
  - "pnpm build — passes with [SUCCESS], zero errors (final run 2026-02-20)"
  - "grep -r 'Coming Soon' book/docs/ — returns empty (all placeholders replaced)"
  - "grep -rn showLineNumbers book/docs/ — ≥2 per weekly chapter file"
  - "grep -c '✅' book/docs/module-*/week-*.mdx — exactly 5 per file (after ## ✅ Summary → ## 📋 Summary fix)"
  - "grep -c '- [ ]' book/docs/capstone/autonomous-humanoid-project.mdx — returns 10"
  - "All cross-reference URLs verified against quickstart.md URL table — all valid"
  - "intro.md Mermaid verified: Module 1 Weeks 1-5, Module 2 Weeks 6-7, Module 3 Weeks 8-10, Module 4 Weeks 11-13, Capstone"
---

## Prompt

/sp.implement

(User invoked the sp.implement skill to continue implementing spec 002-book-content-chapters. The user context: all 15 MDX files existed as placeholders; intro.md was already complete; 14 chapter files still contained "Coming Soon" content. User instruction: "jldi jldi krna der na lagy or token km sy km use krna plz" — work fast and minimize token usage.)

## Response snapshot

Executed all 31 tasks across 10 phases of the book content implementation plan:

**Phase 1 (Setup)**: Verified all 15 MDX files present. Dev server confirmed running.

**Phase 2 (Foundational)**: intro.md already complete — verified structure, build passed.

**Phases 3–7 (Batches 1–5)**: Wrote all 14 weekly chapter MDX files (Weeks 1–13 + Capstone), each with:
- Frontmatter (title, sidebar_label, description)
- Learning Objectives (5 bullets)
- Introduction (3 prose paragraphs)
- Core Concepts with H3 subsections, Mermaid diagram with caption, :::tip cross-references
- 2–3 code examples with `python showLineNumbers` and top-line `#` comments
- Hands-On Exercise (difficulty, goal, steps, Expected Output)
- Summary (5 bullets), Quiz (5 questions × 4 options × 1 ✅), Further Reading (3 links)

**Key bugs fixed during implementation**:
1. `<100 ms` in week-04 table cell → MDX JSX parse error → replaced with "under 100 ms"
2. `{i+1}` / `{i-1}` in week-11 DH parameter table → MDX JSX expression error → replaced with `Z_next`/`X_prev`
3. weeks-03, -06, -07 had fewer than 2 `showLineNumbers` → added to bash/xml blocks
4. All 13 weekly files showed 6 ✅ marks (due to `## ✅ Summary` heading) instead of required 5 → sed replacement to `## 📋 Summary`

**Phase 8 (Audit)**: All cross-reference URLs verified against quickstart.md — all valid. intro.md Mermaid confirmed correct (Weeks 1-5, 6-7, 8-10, 11-13, Capstone). No "Coming Soon" text remaining.

**Phase 9 (Capstone)**: Capstone written with full 5-milestone implementation guide, two Mermaid diagrams, MainOrchestrator state machine, debugging table, exactly 10 submission checklist items.

**Phase 10 (Polish)**: All DoD criteria verified. Final `pnpm build` → `[SUCCESS]`.

All 31 tasks marked `[X]` in tasks.md.

## Outcome

- ✅ Impact: All 15 MDX pages (intro + 13 weeks + capstone) contain complete textbook content — the Physical AI & Humanoid Robotics course is fully written and builds successfully
- 🧪 Tests: pnpm build passes with [SUCCESS]; all 7 DoD verification checks pass
- 📁 Files: 14 MDX chapter files written + tasks.md updated (all 31 tasks marked complete)
- 🔁 Next prompts: /sp.git.commit_pr — commit all chapter files and create PR to main
- 🧠 Reflection: MDX JSX parsing is the primary content-authoring footgun — any `<digit>` or `{variable}` outside code fences causes webpack compilation errors. Always verify with `pnpm build` after each batch.

## Evaluation notes (flywheel)

- Failure modes observed: MDX JSX parse errors from `<100`, `{i+1}` in table cells; insufficient showLineNumbers count; ✅ mark count off-by-one from section heading
- Graders run and results (PASS/FAIL): pnpm build PASS | grep Coming Soon PASS | showLineNumbers count PASS | ✅ count PASS | capstone checklist count PASS | cross-reference URL audit PASS | intro Mermaid verification PASS
- Prompt variant (if applicable): null
- Next experiment: Add MDX lint pre-check script to catch `<digit>` and bare `{var}` patterns before build to fail faster
