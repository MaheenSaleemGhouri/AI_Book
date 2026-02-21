---
id: 002
title: RAG Chatbot Architecture Plan
stage: plan
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: 004-rag-chatbot
branch: 004-rag-chatbot
user: Dell
command: /sp.plan
labels: ["rag","fastapi","qdrant","neon","docusaurus","architecture","planning"]
links:
  spec: specs/004-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-rag-chatbot/plan.md
  - specs/004-rag-chatbot/research.md
  - specs/004-rag-chatbot/data-model.md
  - specs/004-rag-chatbot/quickstart.md
  - specs/004-rag-chatbot/contracts/openapi.yaml
  - history/prompts/004-rag-chatbot/002-rag-chatbot-architecture-plan.plan.prompt.md
tests:
  - Constitution Check: 5/7 principles ✅, 2 documented deviations
  - Research: 5/5 clarifications resolved
---

## Prompt

Implement the RAG chatbot for the Physical AI textbook. Backend is FastAPI (Python), frontend is a React ChatWidget inside Docusaurus. Follow this exact phase order — do not skip or reorder phases.

Phase order: A→Backend setup, B→Database layer, C→RAG layer, D→Agent layer, E→API endpoints, F→Dockerfile, G→Frontend ChatWidget, H→Docusaurus Root.tsx, I→Integration test

Key constraints:
- Python package manager: uv ONLY
- Node package manager: pnpm ONLY
- TypeScript strict mode ON — zero any types
- All Python functions must have type hints
- All DB operations must be async
- No hardcoded secrets anywhere — all from .env
- After every phase: run the verification command listed

## Response snapshot

Generated complete architectural plan with 5 artifacts:

**plan.md** — Full implementation plan covering:
- Technical context (Python 3.11+, TS strict, Neon, Qdrant, HF Spaces)
- Constitution Check: 5/7 pass; 2 deviations documented (branch naming convention, Phase 1 deployment gate)
- 6 Architecture Decisions (RAG pipeline sequence, chunking strategy, OpenAI Agents SDK, Docusaurus env vars, Neon connection pooling, Qdrant async client)
- API design: POST /chat, GET /history/{session_id}, GET /health
- 9 implementation phases (A→I) with verification gates
- Risk register (6 risks)

**research.md** — 5 research questions resolved:
1. OpenAI Agents SDK: `await Runner.run()` + `.final_output` — natively async ✅
2. Docusaurus env vars: Use `customFields` + `useDocusaurusContext()`, NOT `REACT_APP_*` ⚠️ (spec deviation noted)
3. Qdrant async: `from qdrant_client import AsyncQdrantClient` ✅
4. Docker: `uv sync --frozen --no-dev` with committed `uv.lock` ✅
5. Neon: `NullPool` + `statement_cache_size=0` mandatory ✅

**data-model.md** — Full relational + vector model:
- `chat_sessions` (UUID PK, client-generated) + `chat_messages` (SERIAL PK, FK, CHECK constraint)
- Qdrant collection `physical_ai_book`: 1536-dim cosine, metadata (source_file, module, chunk_index)
- SQLAlchemy ORM mappings, Neon engine config, Pydantic request/response models

**contracts/openapi.yaml** — Full OpenAPI 3.1.0 spec for all 3 endpoints with examples

**quickstart.md** — Developer setup guide: prerequisites, credentials, ingest script, both servers, Docker, integration test checklist, troubleshooting table

## Outcome

- ✅ Impact: Complete architectural plan ready — 5 artifacts created; implementation can proceed with /sp.tasks then /sp.implement
- 🧪 Tests: Constitution Check passed (5/7, 2 documented deviations); 5/5 research questions resolved
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml
- 🔁 Next prompts: /sp.tasks to generate implementation tasks; /sp.adr for documented architecture decisions
- 🧠 Reflection: Key catch — Docusaurus does NOT support REACT_APP_* env vars; must use customFields. Also Neon requires NullPool + statement_cache_size=0 — would cause silent connection failures without this.

## Evaluation notes (flywheel)

- Failure modes observed: Research agent had slightly outdated info on OpenAI Agents SDK (.output vs .final_output); deferred to spec as authoritative source
- Graders run and results (PASS/FAIL): Constitution Check PASS (with documented deviations)
- Prompt variant (if applicable): null
- Next experiment: Include Docusaurus customFields pattern in spec template for future chatbot/widget features
