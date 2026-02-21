---
id: 001
title: RAG Chatbot Spec Creation
stage: spec
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: 004-rag-chatbot
branch: 004-rag-chatbot
user: Dell
command: /sp.specify
labels: ["rag","chatbot","fastapi","docusaurus","spec"]
links:
  spec: specs/004-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-rag-chatbot/spec.md
  - specs/004-rag-chatbot/checklists/requirements.md
  - history/prompts/004-rag-chatbot/001-rag-chatbot-spec.spec.prompt.md
tests:
  - Spec quality checklist: all 12 items pass
---

## Prompt

Build a RAG (Retrieval-Augmented Generation) chatbot for the Physical AI & Humanoid Robotics textbook. The chatbot answers student questions using ONLY the book content. It works without login — sessions are tracked via browser localStorage UUID. Backend is FastAPI deployed to Hugging Face Spaces. Frontend is a floating ChatWidget embedded in Docusaurus.

Two things to build:

1. **Backend** (`backend/`) — FastAPI server with RAG pipeline (OpenAI embeddings + Qdrant semantic search + GPT-4o-mini answers), chat history in Neon Postgres, 2 API endpoints (POST /chat and GET /history/{session_id}), and a Dockerfile for Hugging Face Spaces.

2. **Frontend** (`book/src/components/ChatWidget/`) — React component with floating chat bubble (bottom-right), Dark Brown & Beige theme, session management via localStorage, and backend API calls.

Full tech stack, folder structure, 8 user stories, API contract, env vars, and definition of done provided.

## Response snapshot

Created feature branch `004-rag-chatbot` and wrote `specs/004-rag-chatbot/spec.md` with:

- 5 prioritized user stories (P1: student Q&A, P2: session persistence, P3: global widget, P4: content ingestion, P5: deployment)
- 31 functional requirements across backend (ingestion, chat, history, infrastructure) and frontend (ChatWidget, global registration)
- 3 key entities: ChatSession, ChatMessage, BookChunk
- 8 technology-agnostic success criteria
- Comprehensive edge cases (empty submit, zero vector results, API timeout, missing session, >50 messages, loading-state guard, missing env var)
- Assumptions and Out of Scope sections
- Quality checklist: all 12 items pass — no [NEEDS CLARIFICATION] markers

## Outcome

- ✅ Impact: Full spec written for RAG chatbot feature; branch and directory structure initialized; spec is ready for /sp.plan
- 🧪 Tests: Spec quality checklist — 12/12 items pass
- 📁 Files: specs/004-rag-chatbot/spec.md, specs/004-rag-chatbot/checklists/requirements.md
- 🔁 Next prompts: /sp.plan, /sp.clarify (optional), /sp.adr for RAG orchestration + vector DB decisions
- 🧠 Reflection: User provided extremely detailed input (US, folder structure, API contract) — spec faithfully encoded all constraints while stripping implementation details per template guidelines

## Evaluation notes (flywheel)

- Failure modes observed: create-new-feature.ps1 errored on prompts dir creation (history path has spaces-related issue) — branch still created correctly; history dir created manually
- Graders run and results (PASS/FAIL): Spec quality checklist PASS (12/12)
- Prompt variant (if applicable): null
- Next experiment: Pre-check that history/prompts/ exists before running PowerShell script to avoid partial-run errors
