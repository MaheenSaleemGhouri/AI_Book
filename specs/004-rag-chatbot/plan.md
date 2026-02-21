# Implementation Plan: RAG Chatbot for Physical AI Textbook

**Branch**: `004-rag-chatbot` | **Date**: 2026-02-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-rag-chatbot/spec.md`

## Summary

Build a RAG (Retrieval-Augmented Generation) chatbot embedded in the Physical AI & Humanoid Robotics Docusaurus textbook. The system has two distinct surfaces:

1. **FastAPI backend** (`backend/`) — ingests MDX book chapters into Qdrant vector store; serves `POST /chat` (embed → retrieve → generate → persist) and `GET /history/{session_id}` (restore session); stores chat in Neon Postgres; deployed to Hugging Face Spaces via Docker.

2. **React ChatWidget** (`book/src/components/ChatWidget/`) — floating bubble fixed bottom-right; opens a 360×500 Dark Brown & Beige chat panel; restores session from localStorage + API on mount; submits questions; displays grounded answers with source tags; registered globally via `book/src/theme/Root.tsx`.

Implementation follows phases A→I as specified; every phase has a verification command that must pass before the next phase begins.

---

## Technical Context

**Language/Version**: Python 3.11+ (backend) · TypeScript 5.x strict mode (frontend)
**Primary Dependencies**:
- Backend: `fastapi`, `uvicorn[standard]`, `openai`, `openai-agents`, `qdrant-client`, `sqlalchemy[asyncio]`, `asyncpg`, `pydantic-settings`, `tiktoken`, `python-dotenv`
- Frontend: React 18 (inside Docusaurus v3), CSS Modules, native `fetch`

**Storage**:
- Neon Serverless Postgres — async SQLAlchemy (`postgresql+asyncpg://`) — chat sessions + messages
- Qdrant Cloud Free Tier — vector store — book chunk embeddings (`text-embedding-3-small`, 1536-dim, cosine)

**Testing**: `pytest` + `pytest-asyncio` + `httpx` (backend contract tests) · `pnpm build` TypeScript check (frontend)

**Target Platform**: Hugging Face Spaces (Docker, port 7860) · GitHub Pages (frontend via GitHub Actions)

**Project Type**: Web (backend API + frontend embedded widget — two separate codebases in mono-repo)

**Performance Goals**:
- `POST /chat` end-to-end ≤ 10 seconds (p95)
- `GET /history/{session_id}` ≤ 2 seconds
- Chat bubble render: zero layout shift on any Docusaurus page

**Constraints**:
- `uv` only for Python deps (never `pip install`)
- `pnpm` only for Node deps (never `npm`/`yarn`)
- TypeScript `strict: true` — zero `any` types
- All Python functions: explicit type hints
- All DB operations: async (SQLAlchemy async engine)
- All secrets from `.env` — zero hardcoded credentials
- Port 7860 mandatory (HF Spaces default)
- Sessions anonymous (no auth in this phase)

**Scale/Scope**: 13–15 MDX chapter files · anonymous user sessions · max 50 messages per session history · single Qdrant collection `physical_ai_book`

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Spec-First | spec.md must exist and be finalized before any code | ✅ `specs/004-rag-chatbot/spec.md` complete |
| II. Clean Code | Single-responsibility files, no unused imports, no commented-out code | ✅ Each file has exactly one responsibility (embedder, retriever, crud, etc.) |
| III. Phase-Based Delivery | Phase 2 (RAG chatbot) only after Phase 1 (book content) is deployed | ⚠️ See note below |
| IV. Content Quality | N/A — this feature adds a widget, not book content | ✅ N/A |
| V. TypeScript & Python Standards | `strict` mode · type hints · explicit error handling · no bare `except` | ✅ Enforced in all implementation code |
| VI. Secrets & Env Vars | All secrets via `.env` · `.env.example` kept up to date | ✅ Config via pydantic-settings; `.env.example` provided |
| VII. Git Discipline | Branch naming: `feature/phase-<N>-<short-description>` | ⚠️ See note below |

**Principle III Note**: The constitution requires Phase 1 (book content) to be deployed before Phase 2 (RAG chatbot) begins. Current status: book content is being built in parallel branches (`001-docusaurus-scaffold`, `002-book-content-chapters`, `003-dark-beige-theme`). This plan creates the RAG infrastructure in branch `004-rag-chatbot` which can be developed independently; merge to `main` will be gated on Phase 1 deployment being complete.

**Principle VII Note**: The constitution specifies branch naming `feature/phase-<N>-<short-description>`. The Specify tool (`/sp.specify`) uses `###-short-name` convention which produced `004-rag-chatbot`. This is a known framework convention deviation — documented in Complexity Tracking below.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-rag-chatbot/
├── plan.md              # This file (/sp.plan output)
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — entities + DB schema
├── quickstart.md        # Phase 1 output — developer setup guide
├── contracts/           # Phase 1 output — OpenAPI contract
│   └── openapi.yaml
├── checklists/
│   └── requirements.md  # Spec quality checklist (already complete)
└── tasks.md             # Phase 2 output (/sp.tasks — NOT created here)
```

### Source Code (repository root)

```text
backend/                              ← FastAPI RAG API server
├── app/
│   ├── __init__.py
│   ├── main.py                       ← FastAPI app, lifespan, CORS, router
│   ├── api/
│   │   ├── __init__.py
│   │   └── chat.py                   ← POST /chat + GET /history/{session_id}
│   ├── agents/
│   │   ├── __init__.py
│   │   └── rag_agent.py              ← OpenAI Agents SDK orchestration
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── embedder.py               ← text → OpenAI embedding vector
│   │   ├── retriever.py              ← Qdrant semantic search → top-5 chunks
│   │   └── ingest.py                 ← one-time MDX → chunk → embed → Qdrant
│   ├── db/
│   │   ├── __init__.py
│   │   ├── neon.py                   ← async SQLAlchemy engine + session factory
│   │   ├── models.py                 ← ChatSession + ChatMessage ORM models
│   │   └── crud.py                   ← get_or_create_session, save_message, get_history
│   └── core/
│       ├── __init__.py
│       └── config.py                 ← pydantic-settings Settings class
├── scripts/
│   └── ingest_book.py                ← CLI entry point for ingestion
├── pyproject.toml                    ← uv-managed dependencies
├── uv.lock                           ← lock file (committed)
├── Dockerfile                        ← HF Spaces deployment
├── .env.example                      ← env var template (committed)
└── README.md                         ← HF Space description

book/src/                             ← Docusaurus frontend additions
├── components/
│   └── ChatWidget/
│       ├── index.tsx                 ← React chat component
│       ├── ChatWidget.module.css     ← Dark Brown & Beige CSS Modules
│       └── types.ts                  ← TypeScript interfaces
└── theme/
    └── Root.tsx                      ← Docusaurus global wrapper (renders ChatWidget)
```

**Structure Decision**: Web application pattern (Option 2) — two separate codebases (`backend/` and `book/`) in the same mono-repo. Backend is Python/FastAPI; frontend additions live inside the existing Docusaurus `book/` tree. No shared build system between them.

---

## Architecture Decisions

### AD-1: RAG Pipeline Sequence
**Decision**: Strict linear pipeline — embed → retrieve → generate → persist — with no parallel steps.
**Rationale**: Simplest path to correctness; latency budget (10s) is met by GPT-4o-mini + text-embedding-3-small. Parallelizing save and generate adds complexity with no user-visible benefit.
**Alternative rejected**: Fire-and-forget persistence (save async in background) — rejected because lost messages on crash are worse than 200ms extra latency.

### AD-2: Chunking Strategy
**Decision**: Word-count approximation (500 words ≈ 512 tokens for English prose) rather than tiktoken tokenization.
**Rationale**: MDX content is mixed prose/code; exact token counts matter less than semantic coherence. Word-based chunks are simpler, faster at ingest time, and produce consistent results. 50-word overlap preserves context at boundaries.
**Alternative rejected**: tiktoken-based chunking — adds dependency complexity; marginal benefit for prose content.

### AD-3: OpenAI Agents SDK for Orchestration
**Decision**: Use `openai-agents` (`from agents import Agent, Runner`) for the generation step in the RAG pipeline.
**Rationale**: Mandated by spec. `Runner.run()` is async-compatible via `asyncio`. System prompt injected at `Agent(instructions=...)` construction.
**Alternative rejected**: Direct `AsyncOpenAI.chat.completions.create()` — would work but deviates from spec constraint.

### AD-4: Docusaurus Environment Variables
**Decision**: Use `customFields` in `docusaurus.config.ts` to expose the API URL, accessed in React via `useDocusaurusContext()`. Provide a typed wrapper hook `useChatApiUrl()`.
**Rationale**: Docusaurus v3 uses webpack but does NOT automatically expose arbitrary `process.env.*` variables (only those defined via `webpack.DefinePlugin` or `customFields`). `REACT_APP_*` prefix is a CRA convention that does NOT work in Docusaurus without explicit webpack config. `customFields` is the idiomatic Docusaurus approach and avoids webpack config modification.
**Alternative rejected**: Direct `process.env.REACT_APP_API_URL` — silently produces `undefined` in Docusaurus builds without explicit webpack DefinePlugin setup.
**Impact**: `docusaurus.config.ts` must include `customFields: { chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000' }`. The frontend env var name changes from `REACT_APP_API_URL` to `CHAT_API_URL`.

### AD-5: Neon Postgres Connection Pooling
**Decision**: Set `connect_args={"statement_cache_size": 0}` on the asyncpg engine for Neon serverless compatibility.
**Rationale**: Neon uses PgBouncer in transaction mode, which is incompatible with asyncpg's prepared statement cache. Without this setting, connections fail after the first few requests.
**Alternative rejected**: Session pooling mode — not available on Neon Free Tier.

### AD-6: Qdrant Async Client
**Decision**: Use `AsyncQdrantClient` from `qdrant-client >= 1.7.0` for the retriever; use synchronous `QdrantClient` in the ingest script (one-time CLI tool).
**Rationale**: FastAPI endpoints are async; blocking Qdrant calls would stall the event loop. The ingest script is not an async context, so sync client is simpler there.

---

## API Design

### Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/chat` | Send message, get RAG answer | None |
| GET | `/history/{session_id}` | Retrieve session message history | None |
| GET | `/health` | Health check for HF Spaces | None |

### POST /chat

**Request**:
```json
{ "session_id": "550e8400-e29b-41d4-a716-446655440000", "message": "What is ROS 2?" }
```

**Response (200)**:
```json
{
  "answer": "ROS 2 (Robot Operating System 2) is...",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "sources": ["week-03-ros2-architecture.mdx"]
}
```

**Errors**:
- `422` — missing `session_id` or empty `message`
- `500` — OpenAI or Qdrant call failure (message in `detail`)

**Fallback** (zero Qdrant results): returns 200 with `answer: "I couldn't find that in the book. Please check the relevant chapter."` and `sources: []`

### GET /history/{session_id}

**Response (200)**:
```json
{
  "messages": [
    { "role": "user", "content": "What is ROS 2?", "created_at": "2026-02-21T10:00:00Z" },
    { "role": "assistant", "content": "ROS 2 is...", "created_at": "2026-02-21T10:00:05Z" }
  ]
}
```

**Notes**: Returns `{ "messages": [] }` (not 404) when session unknown. Max 50 messages, ascending by `created_at`.

### GET /health

**Response (200)**:
```json
{ "status": "ok" }
```

---

## Implementation Phases

### Phase A — Backend Project Setup
- `uv init backend` in repo root
- Add all runtime + dev dependencies via `uv add`
- Create full directory structure with `__init__.py` placeholders
- Implement `app/core/config.py` (pydantic-settings)
- Create `.env.example`
- **Gate**: `uv run python -c "from app.core.config import settings; print('Config OK')"`

### Phase B — Database Layer
- `app/db/neon.py` — async SQLAlchemy engine with `statement_cache_size=0` for Neon
- `app/db/models.py` — `ChatSession` + `ChatMessage` ORM models with proper FK/constraints
- `app/db/crud.py` — `get_or_create_session()`, `save_message()`, `get_history()`
- **Gate**: `uv run python -c "from app.db.models import ChatMessage; print('DB models OK')"`

### Phase C — RAG Layer
- `app/rag/embedder.py` — async `get_embedding(text)` via `AsyncOpenAI`
- `app/rag/retriever.py` — async `retrieve_chunks(query, top_k=5)` via `AsyncQdrantClient`
- `app/rag/ingest.py` — sync `ingest_all_chapters(docs_path)` — clean MDX → word chunks → embed → upsert
- `scripts/ingest_book.py` — CLI entry point, loads `.env`, calls `ingest_all_chapters`
- **Gate**: `uv run python scripts/ingest_book.py` → "Done! Total chunks ingested: N"

### Phase D — Agent Layer
- `app/agents/rag_agent.py` — `get_rag_answer(question)` — orchestrates retrieve → build context → call LLM via OpenAI Agents SDK
- Fixed system prompt enforcing book-only answers
- Returns `{ "answer": str, "sources": list[str] }`
- **Gate**: Validated in Phase E via `/docs` Swagger

### Phase E — API Endpoints + Main App
- `app/api/chat.py` — `POST /chat` + `GET /history/{session_id}` routers
- `app/main.py` — FastAPI app, lifespan (DB table creation), CORS middleware, router registration, `GET /health`
- **Gate**: `uv run uvicorn app.main:app --reload --port 8000` → `GET /health` returns `{"status": "ok"}`

### Phase F — Dockerfile
- `python:3.11-slim` base image
- Install `uv` via pip (container bootstrap only)
- `uv sync --no-dev` for production dependencies
- Expose port 7860; `CMD uvicorn app.main:app --host 0.0.0.0 --port 7860`
- **Gate**: `docker build -t pai-chatbot . && echo "Docker build OK"`

### Phase G — Frontend ChatWidget
- `book/src/components/ChatWidget/types.ts` — TypeScript interfaces
- `book/src/components/ChatWidget/index.tsx` — full React component
- `book/src/components/ChatWidget/ChatWidget.module.css` — Dark Brown & Beige CSS Modules
- API URL via `useDocusaurusContext()` reading `siteConfig.customFields.chatApiUrl`
- Update `book/docusaurus.config.ts`: add `customFields: { chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000' }`
- **Gate**: `cd book && pnpm start` — bubble visible bottom-right

### Phase H — Docusaurus Global Registration
- `book/src/theme/Root.tsx` — wraps all pages, renders `<ChatWidget />`
- **Gate**: `cd book && pnpm build` → zero TypeScript errors

### Phase I — Integration Test
- Run backend + frontend simultaneously
- Exercise all 13 manual checklist items from spec
- **Gate**: All items pass + `pnpm build` clean

---

## Risk Register

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Neon asyncpg connection failure | Medium | High | `statement_cache_size=0` in engine config (AD-5) |
| `REACT_APP_API_URL` silently undefined in Docusaurus | High | High | Use `customFields` + `useDocusaurusContext()` (AD-4) |
| OpenAI Agents SDK API instability | Low | Medium | Pin to specific version; fallback to direct `AsyncOpenAI` if needed |
| HF Spaces cold-start latency | Medium | Medium | `GET /health` probe on startup; warn students of first-message delay |
| MDX regex cleaning drops content | Low | Medium | Log chunk count per file; validate >0 chunks from each source |
| Qdrant Free Tier storage limit | Low | Low | 15 chapters × ~50 chunks = ~750 points — well within free limits |

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Branch name `004-rag-chatbot` vs `feature/phase-2-rag-chatbot` | Specify tool enforces `###-name` format; Specify creates the branch automatically during `/sp.specify` | Cannot override Specify branch naming without modifying tool scripts; impact is cosmetic only |
| Two `__init__.py`-less packages in `rag/` and `agents/` | All modules are imported within the `app` package; Python resolves correctly | N/A — all packages have `__init__.py` |
