<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (template) → 1.0.0
  Modified principles: N/A — initial creation from template
  Added sections:
    - Core Principles (7 principles, expanded from 6 template slots)
    - Tech Stack (Non-Negotiable)
    - Book Content Structure
    - Governance
  Removed sections: None (all template placeholders replaced)
  Templates requiring updates:
    - .specify/templates/plan-template.md   ✅ aligned (Constitution Check gate present)
    - .specify/templates/spec-template.md   ✅ aligned (user story + FR structure intact)
    - .specify/templates/tasks-template.md  ✅ aligned (phase-based structure matches delivery model)
  Deferred TODOs:
    - None — all fields resolved from user input or today's date
-->

# physical-ai-robotics-book Constitution

## Core Principles

### I. Spec-First, Always

Every feature MUST follow the full SDD pipeline before any code is written:
`/sp.specify` → `/sp.plan` → `/sp.tasks` → `/sp.implement`.
No code MUST be committed to any branch without a finalized spec.
This constitution MUST be reviewed before starting any new module or phase.
Rationale: prevents wasted effort and ensures architectural coherence across
the 6-phase delivery model.

### II. Clean Code Standards

- Every file MUST have a single, clearly stated responsibility.
- Component names MUST be descriptive (`ChatWidget`, not `Chat`).
- No unused imports are permitted in production files.
- No commented-out code is permitted in any branch merged to `main`.
- All code merged to `main` MUST be production-quality; no experimental
  or exploratory code is allowed in the main branch.

### III. Phase-Based Delivery (Strict Priority Order)

Work MUST be sequenced as follows — no phase may begin before the prior
phase is 100% complete and verified:

| Phase | Description                              | Points    |
|-------|------------------------------------------|-----------|
| 1     | Book content (13 weeks) + GitHub Pages   | Core 100  |
| 2     | RAG Chatbot embedded in book             | Core 100  |
| 3     | Claude Code Subagents + Agent Skills     | Bonus +50 |
| 4     | better-auth Signup/Signin                | Bonus +50 |
| 5     | Personalization button per chapter       | Bonus +50 |
| 6     | Urdu translation button per chapter      | Bonus +50 |

Phase 2 MUST NOT begin before Phase 1 is deployed to GitHub Pages.
Bonus phases MUST NOT begin before both Core phases are fully working.
PRs MUST NOT mix work from different phases.

### IV. Content Quality Standards

Each chapter MDX file MUST contain all 8 of the following sections —
omitting any section is a blocking defect:

1. **Learning Objectives** — 3–5 bullet points at top of file
2. **Conceptual Explanation** — clear prose; every term MUST be defined
   before use, no undefined jargon
3. **Diagrams** — at least one Mermaid.js diagram embedded in MDX
4. **Code Examples** — ROS 2 Python snippets that are runnable as-is
5. **Hands-On Exercise** — a concrete practical task students can execute
6. **Summary** — key takeaways in bullet form
7. **Quiz** — 3–5 multiple-choice questions with answer keys
8. **Further Reading** — 2–3 curated, verified external links

### V. TypeScript & Python Standards

**TypeScript** (book frontend, Docusaurus components):
- `strict` mode MUST be enabled; `any` type is forbidden.
- All async functions MUST be properly awaited.
- Error handling MUST be explicit — silent failures are forbidden.

**Python** (FastAPI backend, RAG agents):
- Type hints MUST be present on all function signatures.
- `pydantic` MUST be used for all data models.
- All async functions MUST be properly awaited.
- Error handling MUST be explicit — no bare `except` clauses.

### VI. Secrets & Environment Variables

- API keys, tokens, and secrets MUST NEVER be hardcoded anywhere in source.
- All secrets MUST reside in `.env` (git-ignored).
- `.env.example` MUST be kept up to date with all required variable names.

Required environment variables:
```
OPENAI_API_KEY=
NEON_DATABASE_URL=
QDRANT_URL=
QDRANT_API_KEY=
BETTER_AUTH_SECRET=
```

### VII. Git Discipline

- Branch naming MUST follow: `feature/phase-<N>-<short-description>`
  (e.g., `feature/phase-1-book-content`, `feature/phase-2-rag-chatbot`).
- Commit messages MUST use conventional prefixes: `feat:`, `fix:`,
  `docs:`, `chore:`.
- Direct commits to `main` are forbidden.
- A PR MUST be created and reviewed for each phase completion before merge.

## Tech Stack (Non-Negotiable)

The following technology choices are fixed for the project lifetime.
Deviations require a formal ADR and constitution amendment.

### Package Managers

- Python dependencies: **uv** exclusively (`uv add`, never `pip install`)
- Node.js dependencies: **pnpm** exclusively (never `npm` or `yarn`)

### Frontend / Book

- **Docusaurus v3** (React-based static site generator)
- All book content in **MDX** (Markdown + JSX)
- Deployed to **GitHub Pages** via GitHub Actions

### Backend / Chatbot (Phase 2)

- **FastAPI** (Python) — RAG API server
- **OpenAI Agents SDK** — chatbot orchestration
- **Neon Serverless Postgres** — user data and chat history
- **Qdrant Cloud Free Tier** — vector embeddings (RAG)
- **ChatKit SDK** — embedded chat UI in Docusaurus

### Auth (Phase 4 — Bonus)

- **better-auth** — Signup/Signin
- User background form at signup (software + hardware experience level)

### AI Tooling

- **Claude Code** — primary coding agent
- **Spec-Kit Plus** (`specifyplus` / `sp`) — spec-driven development
- **Claude Code Subagents** — parallel chapter generation (Phase 3)
- **Claude Code Agent Skills** — reusable content patterns (Phase 3)

### OS & Runtime

- **Ubuntu 22.04 LTS** — primary development environment
- **Python 3.11+**
- **Node.js 20 LTS**

## Book Content Structure

The textbook covers 13 weeks across 4 modules plus a capstone:

```
Module 1: The Robotic Nervous System (ROS 2)
  Week 01: Introduction to Physical AI & Embodied Intelligence
  Week 02: Humanoid Robotics Landscape + Sensor Systems
  Week 03: ROS 2 Architecture & Core Concepts
  Week 04: Nodes, Topics, Services, and Actions
  Week 05: Building ROS 2 Packages with Python (rclpy)

Module 2: The Digital Twin (Gazebo & Unity)
  Week 06: Gazebo Simulation Environment Setup
  Week 07: URDF/SDF Robot Description + Physics Simulation

Module 3: The AI-Robot Brain (NVIDIA Isaac)
  Week 08: NVIDIA Isaac Sim + Isaac SDK Overview
  Week 09: AI Perception, Manipulation & Reinforcement Learning
  Week 10: Sim-to-Real Transfer Techniques

Module 4: Vision-Language-Action (VLA)
  Week 11: Humanoid Kinematics, Dynamics & Bipedal Locomotion
  Week 12: Manipulation, Grasping & Human-Robot Interaction
  Week 13: Conversational Robotics (Whisper + LLM + ROS 2)

Capstone:
  Autonomous Humanoid Project (Voice → Plan → Navigate → Grasp)
```

All chapters reside under `book/docs/` following the folder structure
defined in this constitution. No deviations from the directory layout
are permitted without a constitution amendment.

## Governance

This constitution supersedes all other practices, preferences, and
prior informal agreements for the `physical-ai-robotics-book` project.

**Amendment procedure**:
1. Propose change with rationale in a dedicated ADR (`/sp.adr <title>`).
2. Increment `CONSTITUTION_VERSION` per semver rules
   (MAJOR = breaking governance change, MINOR = new principle/section,
   PATCH = clarification/wording).
3. Update `LAST_AMENDED_DATE` to today's ISO date.
4. Propagate amendments to all dependent templates
   (`plan-template.md`, `spec-template.md`, `tasks-template.md`).
5. PR required; cannot self-merge.

**Compliance review**: All PRs MUST verify compliance with the 7 core
principles before merge. The Constitution Check section in `plan-template.md`
serves as the formal gate.

**Complexity justification**: Any deliberate deviation from these
principles MUST be documented in the `Complexity Tracking` table of the
relevant `plan.md` before work begins.

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19
