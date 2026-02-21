---
id: "001"
title: "Physical AI Robotics Book Constitution"
stage: constitution
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution","physical-ai","robotics","docusaurus","rag-chatbot"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-physical-ai-robotics-constitution.constitution.prompt.md
tests:
  - N/A
---

## Prompt

Create governing principles for the "Physical AI & Humanoid Robotics" textbook project with the following comprehensive guidelines:

PROJECT IDENTITY: physical-ai-robotics-book — AI-Native Technical Textbook (Docusaurus-based). Goal: complete, deployable textbook for teaching Physical AI & Humanoid Robotics, published on GitHub Pages with embedded RAG chatbot. Hackathon: Panaversity Hackathon I, Deadline: Nov 30, 2025.

TECH STACK (NON-NEGOTIABLE): uv for Python deps, pnpm for Node.js. Docusaurus v3 + MDX for book, GitHub Pages via GitHub Actions. FastAPI + OpenAI Agents SDK + Neon Postgres + Qdrant + ChatKit for Phase 2 backend. better-auth for Phase 4. Claude Code as primary agent, Spec-Kit Plus for SDD.

7 DEVELOPMENT PRINCIPLES: Spec-First Always, Clean Code Standards, Phase-Based Delivery (6 phases), Content Quality Standards (8-section chapters), TypeScript & Python Standards, Environment Variables, Git Discipline.

BOOK: 13 weeks across 4 modules (ROS2, Simulation, NVIDIA Isaac, VLA) + Capstone.

## Response snapshot

Created `.specify/memory/constitution.md` at v1.0.0 with:
- 7 core principles (expanded from 6-slot template)
- Tech Stack section (non-negotiable stack locked)
- Book Content Structure section (13 weeks + capstone)
- Governance section with amendment procedure and semver policy
- Sync Impact Report HTML comment prepended
- All template placeholders replaced; no bracket tokens remain
- Dates: Ratified 2026-02-19, Last Amended 2026-02-19

## Outcome

- ✅ Impact: Project constitution established at v1.0.0; governs all 6 delivery phases
- 🧪 Tests: N/A (constitution artifact, not code)
- 📁 Files: .specify/memory/constitution.md written
- 🔁 Next prompts: Run /sp.specify to create the book-core feature spec
- 🧠 Reflection: Template had 6 principle slots; user specified 7 — expanded cleanly

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): initial creation
- Next experiment: /sp.specify for specs/001-book-core/spec.md
