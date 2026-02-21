# Tasks: RAG Chatbot for Physical AI Textbook

**Input**: Design documents from `/specs/004-rag-chatbot/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/openapi.yaml ✅ · quickstart.md ✅

**Tests**: No test tasks — spec does not request TDD. Verification gates use manual checks and build commands per plan.md.

**Organization**: Tasks grouped by user story. Implementation order differs from spec priority order because US-4 (ingest) is a technical prerequisite for US-1 (ask question) to work end-to-end.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies between them)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All tasks include exact file paths

---

## Phase 1: Setup — Backend Project Initialization

**Purpose**: Initialize the `backend/` Python project, install all dependencies, create the full folder skeleton, and set up configuration. No user story work begins until this phase is complete.

- [x] T001 Initialize uv project: run `uv init backend` from repo root to create `backend/pyproject.toml` and `backend/.python-version`
- [x] T002 Add all runtime dependencies: run `uv add fastapi "uvicorn[standard]" openai openai-agents qdrant-client "sqlalchemy[asyncio]" asyncpg pydantic-settings python-dotenv tiktoken` inside `backend/`
- [x] T003 Add dev dependencies: run `uv add --dev pytest pytest-asyncio httpx` inside `backend/`
- [x] T004 [P] Create all `__init__.py` placeholder files for every package in `backend/app/`, `backend/app/api/`, `backend/app/agents/`, `backend/app/rag/`, `backend/app/db/`, `backend/app/core/` — each file contains only `# placeholder`
- [x] T005 [P] Create `backend/app/core/config.py` with a `pydantic-settings` `Settings` class loading: `openai_api_key`, `embedding_model` (default `text-embedding-3-small`), `chat_model` (default `gpt-4o-mini`), `qdrant_url`, `qdrant_api_key`, `collection_name` (default `physical_ai_book`), `database_url`, `allowed_origins` (default `http://localhost:3000`); instantiate `settings = Settings()` at module level
- [x] T006 [P] Create `backend/.env.example` with all six required keys: `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `COLLECTION_NAME`, `DATABASE_URL`, `ALLOWED_ORIGINS` — with placeholder values and inline comments explaining each
- [x] T007 Create empty `backend/scripts/` directory and `backend/scripts/ingest_book.py` placeholder file
- [x] T008 Verify Phase 1 gate: `cd backend && uv run python -c "from app.core.config import settings; print('Config OK:', settings.collection_name)"` — must print `Config OK: physical_ai_book`

**Checkpoint**: All Python infrastructure ready — 8 tasks complete

---

## Phase 2: Foundational — Database Layer + RAG Infrastructure

**Purpose**: Build the async DB engine, ORM models, CRUD operations, and RAG embedding/retrieval components. These are shared prerequisites that ALL user story phases depend on.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [x] T009 Create `backend/app/db/neon.py` with: async SQLAlchemy engine using `postgresql+asyncpg://` connection string, `poolclass=NullPool` for Neon serverless, `connect_args={"statement_cache_size": 0}` for PgBouncer compatibility, `async_sessionmaker` factory as `AsyncSessionLocal`, `DeclarativeBase` subclass as `Base`, and async `get_db()` generator for FastAPI dependency injection
- [x] T010 [P] Create `backend/app/db/models.py` with two ORM classes: `ChatSession` (UUID PK with `as_uuid=True`, `TIMESTAMPTZ` `created_at`, nullable `TEXT` `user_agent`, relationship to messages with cascade delete) and `ChatMessage` (SERIAL PK, UUID FK to `chat_sessions.id` with `ON DELETE CASCADE`, `String(20)` `role` with `CheckConstraint("role IN ('user', 'assistant')")`, `Text` `content`, `TIMESTAMPTZ` `created_at`, back-reference to session) — all columns use `Mapped[]` type annotations
- [x] T011 Create `backend/app/db/crud.py` with three fully typed async functions: `get_or_create_session(db, session_id, user_agent)` that upserts a `ChatSession`; `save_message(db, session_id, role, content)` that inserts a `ChatMessage`; `get_history(db, session_id, limit=50)` that returns messages ordered by `created_at ASC` — all functions must have explicit return type hints
- [x] T012 [P] Create `backend/app/rag/embedder.py` with a module-level `AsyncOpenAI` client (keyed from `settings.openai_api_key`) and an async `get_embedding(text: str) -> list[float]` function that strips newlines, calls `client.embeddings.create(input=text, model=settings.embedding_model)`, and returns `response.data[0].embedding`
- [x] T013 [P] Create `backend/app/rag/retriever.py` with a module-level `AsyncQdrantClient` instance and an async `retrieve_chunks(query: str, top_k: int = 5) -> list[dict]` function that: calls `get_embedding(query)`, calls `qdrant.search(collection_name, query_vector, limit, with_payload=True)`, and returns a list of dicts with keys `content`, `source`, and `score`
- [x] T014 Verify Phase 2 gate: `cd backend && uv run python -c "from app.db.models import ChatSession, ChatMessage; from app.rag.embedder import get_embedding; print('Foundation OK')"` — must print `Foundation OK`

**Checkpoint**: DB + RAG infrastructure complete — user story phases can begin

---

## Phase 3: User Story 4 — Developer Ingests Book Content (Priority: P4)

> **Implementation Note**: US-4 (ingest) is implemented before US-1 (ask question) because the Qdrant vector index must be populated before any RAG answer can be retrieved. US-4 spec priority (P4) reflects user-facing importance; implementation order reflects technical dependency.

**Goal**: A developer runs `uv run python scripts/ingest_book.py` once and all MDX chapters are chunked, embedded, and stored in Qdrant with correct metadata.

**Independent Test**: Run the script against an empty Qdrant collection → Qdrant dashboard shows N chunks with metadata fields `source_file`, `module`, `chunk_index`.

- [x] T015 [US4] Create `backend/app/rag/ingest.py` with three functions: `clean_mdx(content: str) -> str` (strips frontmatter via regex, removes JSX import lines, removes MDX component tags, removes code fences, strips heading markers); `chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]` (word-count sliding window — returns chunks, skips any chunk under 50 characters); `ingest_all_chapters(docs_path: str) -> None` (sync — initializes `QdrantClient`, deletes existing collection if present, creates `physical_ai_book` collection with 1536-dim cosine vectors, recursively finds all `.mdx` and `.md` files, cleans + chunks each, embeds each chunk via sync `OpenAI` client, upserts `PointStruct` list with payload `{content, source_file, module, chunk_index}`, prints final count)
- [x] T016 [US4] Write `backend/scripts/ingest_book.py` as the CLI entry point: add `backend/` parent to `sys.path`, call `load_dotenv()`, resolve the `book/docs/` path relative to the script location, call `ingest_all_chapters(docs_path)` with progress output, exit 0 on success or exit 1 with traceback on failure
- [ ] T017 [US4] Verify US-4 gate: run `cd backend && uv run python scripts/ingest_book.py` — output must include "Created collection: physical_ai_book" and end with "Done! Total chunks ingested: N" where N > 0; verify Qdrant dashboard shows the collection with correct point count

**Checkpoint**: Qdrant vector store populated — US-1 (POST /chat) can now retrieve context

---

## Phase 4: User Story 1 — Student Asks a Question (Priority: P1) 🎯 MVP

**Goal**: A student clicks the chat bubble, types a question, and receives a grounded answer citing book sources — all within 10 seconds.

**Independent Test**: With backend running, POST `{"session_id": "00000000-0000-0000-0000-000000000001", "message": "What is ROS 2?"}` to `http://localhost:8000/chat` → response contains non-empty `answer` and non-empty `sources` array within 10 seconds.

- [x] T018 [US1] Create `backend/app/agents/rag_agent.py` with: `SYSTEM_PROMPT` constant enforcing book-only answers with exact fallback text; async `get_rag_answer(question: str) -> dict[str, str | list[str]]` function that calls `retrieve_chunks(question, top_k=5)`, returns fallback dict immediately if chunks list is empty, builds `context` string with numbered source blocks, constructs user prompt embedding context + question, constructs an `Agent(name="BookAssistant", instructions=SYSTEM_PROMPT, model=settings.chat_model)`, calls `await Runner.run(agent, user_prompt)`, extracts `result.final_output`, returns `{"answer": str, "sources": list[str]}` with deduplicated source filenames
- [x] T019 [US1] Create `backend/app/api/chat.py` with Pydantic models (`ChatRequest`, `MessageOut`, `ChatResponse`, `HistoryResponse`) and `POST /chat` endpoint that: validates non-empty message (raise 422 if empty), calls `get_or_create_session()`, calls `save_message()` for user message, calls `get_rag_answer()` wrapped in try/except (raise HTTP 500 with `detail` on exception), calls `save_message()` for assistant message, returns `ChatResponse`
- [x] T020 [US1] Create `backend/app/main.py` with: `lifespan` context manager that calls `Base.metadata.create_all` on startup and `engine.dispose()` on shutdown; `FastAPI` app instance with title and lifespan; `CORSMiddleware` configured with `allowed_origins` split from `settings.allowed_origins`, `allow_credentials=True`, `allow_methods=["GET","POST","OPTIONS"]`, `allow_headers=["*"]`; `app.include_router(chat_router)`; `GET /health` endpoint returning `{"status": "ok"}`
- [ ] T021 [US1] Verify US-1 gate: start `cd backend && uv run uvicorn app.main:app --reload --port 8000` → (a) `curl http://localhost:8000/health` returns `{"status":"ok"}`; (b) `POST /chat` with `{"session_id": "00000000-0000-0000-0000-000000000001", "message": "What is ROS 2?"}` returns JSON with non-empty `answer` and at least one entry in `sources`; (c) `POST /chat` with missing `message` field returns HTTP 422

**Checkpoint**: US-1 MVP complete — students can ask book questions and get grounded answers

---

## Phase 5: User Story 2 — Student Resumes Chat After Reloading (Priority: P2)

**Goal**: When a student reloads any page, their entire previous chat session is restored automatically from Neon Postgres via the history endpoint.

**Independent Test**: After Phase 4 chat test, call `GET /history/00000000-0000-0000-0000-000000000001` → response shows `{"messages": [...]}` with both user and assistant messages in chronological order. Then call `GET /history/aaaaaaaa-0000-0000-0000-000000000000` → response is `{"messages": []}` (not 404).

- [x] T022 [US2] Add `GET /history/{session_id}` endpoint to `backend/app/api/chat.py`: call `get_history(db, session_id, limit=50)`, return `HistoryResponse` with `MessageOut` list (each with `role`, `content`, `created_at` as ISO string); if `session_id` is not a valid UUID, return empty `{"messages": []}` rather than raising; if no messages found, return empty `{"messages": []}`
- [ ] T023 [US2] Verify US-2 gate: (a) after T021 chat test, call `GET http://localhost:8000/history/00000000-0000-0000-0000-000000000001` — expect 2+ messages in ascending order; (b) call `GET http://localhost:8000/history/ffffffff-ffff-ffff-ffff-ffffffffffff` — expect `{"messages": []}` with HTTP 200, not 404

**Checkpoint**: Session persistence complete — reloads restore chat history

---

## Phase 6: User Story 3 — ChatWidget on Every Page (Priority: P3)

**Goal**: A floating chat bubble appears fixed bottom-right on every page of the Docusaurus book site. Clicking it opens a Dark Brown & Beige chat panel with full send/receive functionality.

**Independent Test**: `cd book && pnpm build` completes with zero TypeScript errors; `pnpm start` shows the bubble on landing page AND on a doc chapter page without any layout conflict.

- [x] T024 [P] [US3] Create `book/src/components/ChatWidget/types.ts` with four TypeScript interfaces: `Message` (`role: 'user' | 'assistant'`, `content: string`, optional `created_at?: string`, optional `sources?: string[]`); `ChatRequest` (`session_id: string`, `message: string`); `ChatResponse` (`answer: string`, `session_id: string`, `sources: string[]`); `HistoryResponse` (`messages: Message[]`) — strict mode, zero `any` types
- [x] T025 [P] [US3] Create `book/src/components/ChatWidget/ChatWidget.module.css` with complete CSS Modules implementing the Dark Brown & Beige theme: `.container` (fixed bottom-right 24px), `.bubble` (56px circle, `#C8A882` background, hover scale+glow), `.panel` (360px×500px, `#1A0F0A` background, `1px solid #5C3D2A` border, 16px radius, shadow), `.header` (`#0F0804` background, `.headerTitle` in `#C8A882`), `.closeBtn`, `.messages` (flex-column scrollable), `.emptyState`, `.message`, `.userMessage` (right-aligned, `#C8A882` bubble, `12px 12px 4px 12px` radius), `.aiMessage` (left-aligned, `#2C1810` bubble, `#F5E6D0` text), `.messageBubble`, `.sources`, `.sourceTag`, `.loadingDots` with 3-dot pulse animation, `.inputArea` (`#0F0804` background), `.input` (`#2C1810` background, `#F5E6D0` text, focus border `#C8A882`), `.sendBtn` (`#C8A882` background), plus mobile responsive breakpoint at 400px
- [x] T026 [US3] Add `customFields` to `book/docusaurus.config.ts`: inside the `config` object add `customFields: { chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000' }` so the API URL is injected at build time and accessible to React components
- [x] T027 [US3] Create `book/src/components/ChatWidget/index.tsx` — full React component (no `any` types, all props typed): `getOrCreateSessionId()` helper using `localStorage` with key `pai_chat_session_id` and `crypto.randomUUID()`; `useState` for `isOpen`, `messages: Message[]`, `input`, `isLoading`, `sessionId`; `useEffect` on mount to call `GET {apiUrl}/history/{sessionId}` and populate messages; `useEffect` to scroll to bottom on new messages; `sendMessage()` async function implementing the pipeline (optimistic user message append → POST /chat → append AI response with sources → catch shows error message); `handleKeyDown` for Enter submission; render bubble button and conditional panel with header, messages list (with loading dots), and input area; API URL from `useDocusaurusContext().siteConfig.customFields?.chatApiUrl as string`
- [x] T028 [US3] Create `book/src/theme/Root.tsx` with a typed `RootProps` interface (`children: React.ReactNode`) and default export that renders `<>{children}<ChatWidget /></>` — this is Docusaurus's official global wrapper swizzle point
- [ ] T029 [US3] Verify US-3 dev: create `book/.env.local` with `CHAT_API_URL=http://localhost:8000`, run `cd book && pnpm start`, navigate to landing page and a chapter doc page — confirm chat bubble visible bottom-right on both, click bubble opens panel, typing and Enter work, bubble does not overlap page content
- [x] T030 [US3] Verify US-3 build: run `cd book && pnpm build` — must complete with zero TypeScript errors; if errors, fix and re-run until clean

**Checkpoint**: ChatWidget globally registered — bubble visible on all pages, full send/receive cycle works

---

## Phase 7: User Story 5 — Developer Deploys to Hugging Face Spaces (Priority: P5)

**Goal**: `docker build .` in `backend/` succeeds; container starts on port 7860 with all secrets from env vars; `GET /health` returns `{"status": "ok"}`.

**Independent Test**: `docker build -t pai-chatbot .` completes with no errors; `docker run -p 7860:7860 -e OPENAI_API_KEY=... pai-chatbot` starts; `curl http://localhost:7860/health` returns `{"status":"ok"}`.

- [x] T031 [US5] Generate lock file: run `cd backend && uv lock` to create `backend/uv.lock` — this file must be committed to git for `uv sync --frozen` to work inside Docker
- [x] T032 [US5] Create `backend/Dockerfile`: base image `python:3.11-slim`, `WORKDIR /app`, `RUN pip install uv`, `COPY pyproject.toml uv.lock* ./`, `RUN uv sync --frozen --no-dev`, `COPY app/ ./app/`, `EXPOSE 7860`, `CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]` — no secrets in image, all loaded from env at runtime
- [x] T033 [P] [US5] Create `backend/README.md` with HF Space description: project overview, endpoint table (`POST /chat`, `GET /history/{session_id}`, `GET /health`), required environment variables table with descriptions
- [ ] T034 [US5] Verify US-5 gate: run `docker build -t pai-chatbot .` in `backend/` — build must succeed with no errors; optionally run `docker run -p 7860:7860 -e OPENAI_API_KEY=test -e QDRANT_URL=test -e QDRANT_API_KEY=test -e DATABASE_URL=test pai-chatbot` and confirm startup logs appear (config validation failure is acceptable since test values are invalid; the image must start, not crash at build time)

**Checkpoint**: Container ready for HF Spaces deployment

---

## Phase 8: Polish & Integration Test

**Purpose**: Full end-to-end validation, gitignore hygiene, and final build gate.

- [x] T035 [P] Add `backend/.env` and `backend/.venv/` to `backend/.gitignore` (create file if absent) — secrets must never be committed
- [x] T036 [P] Add `book/.env.local` to `book/.gitignore` (append if file exists) — local API URL config must not be committed
- [ ] T037 Run full integration test: start backend (`cd backend && uv run uvicorn app.main:app --port 8000`) + frontend (`cd book && pnpm start`) simultaneously, then work through all 13 checklist items from `specs/004-rag-chatbot/quickstart.md` — all items must pass before marking this task complete
- [x] T038 Final build gate: run `cd book && pnpm build` with no running processes — must complete with zero TypeScript errors and zero warnings; this confirms the full feature is production-build-clean

**Checkpoint**: All 5 user stories verified end-to-end — feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)        → No dependencies — start immediately
Phase 2 (Foundational) → Depends on Phase 1 completion — BLOCKS all user story phases
Phase 3 (US-4 Ingest)  → Depends on Phase 2 — BLOCKS US-1 end-to-end test (Qdrant must have data)
Phase 4 (US-1 Chat)    → Depends on Phase 2 + Phase 3 (for end-to-end verification)
Phase 5 (US-2 History) → Depends on Phase 4 (GET /history added to same file as POST /chat)
Phase 6 (US-3 Widget)  → Depends on Phase 4 + Phase 5 (widget calls both endpoints)
Phase 7 (US-5 Docker)  → Depends on Phase 4 (app/main.py must exist); independent of US-3
Phase 8 (Polish)       → Depends on all Phase 1–7 completion
```

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|------------|----------------------|
| US-4 (Ingest) | Phase 2 Foundational | Phase 4 setup tasks (T018) |
| US-1 (POST /chat) | Phase 2 + US-4 data in Qdrant | US-5 Dockerfile (T031-T033) |
| US-2 (GET /history) | US-1 (same router file) | US-3 CSS + types (T024-T025) |
| US-3 (ChatWidget) | US-1 + US-2 endpoints working | None (sequential after US-2) |
| US-5 (Docker) | Phase 4 app/main.py exists | US-3 frontend work |

### Within Each Phase

- `[P]` tasks within a phase can run simultaneously (different files)
- Non-`[P]` tasks depend on prior tasks within the same phase
- Verification tasks (T008, T014, T017, T021, T023, T029, T030, T034, T037, T038) must run AFTER their phase tasks

---

## Parallel Opportunities

### Phase 1 Parallel Group
```
Simultaneously:
  T004 — Create __init__.py files
  T005 — Create config.py
  T006 — Create .env.example
After T001-T003 complete.
```

### Phase 2 Parallel Group
```
T009 — Create neon.py (must complete before T011 since T011 uses Base)

Then simultaneously:
  T010 — Create models.py
  T012 — Create embedder.py
  T013 — Create retriever.py
After T009 completes.

Then sequentially:
  T011 — Create crud.py (depends on models.py from T010)
```

### Phase 6 Parallel Group
```
Simultaneously (before T027):
  T024 — Create types.ts
  T025 — Create ChatWidget.module.css
Then sequentially:
  T026 — Update docusaurus.config.ts (must be before T027)
  T027 — Create index.tsx (depends on types.ts T024)
  T028 — Create Root.tsx (depends on index.tsx T027)
```

### Phase 7 + Phase 6 Cross-Phase Parallel
```
Once Phase 5 (US-2) is complete:
  Developer A: Phase 6 frontend tasks (T024-T030)
  Developer B: Phase 7 Docker tasks (T031-T034)
```

---

## Implementation Strategy

### MVP First (US-1 Only — Phases 1–4)

1. Complete Phase 1: Setup (T001–T008)
2. Complete Phase 2: Foundational (T009–T014)
3. Complete Phase 3: US-4 Ingest (T015–T017)
4. Complete Phase 4: US-1 Chat endpoint (T018–T021)
5. **STOP and VALIDATE**: `POST /chat` returns grounded answers — backend MVP verified
6. Demo to stakeholders if needed before building frontend

### Incremental Delivery

1. Phases 1–4 → Backend answers questions (CLI-testable via curl/Swagger)
2. Phase 5 → Session history works (full backend complete)
3. Phase 6 → ChatWidget embedded in book (full user experience)
4. Phase 7 → Docker container ready (deployable to HF Spaces)
5. Phase 8 → Integration validated (production-ready)

### Single Developer Sequence

Execute in strict order:
T001 → T002 → T003 → T004,T005,T006 (parallel) → T007 → T008
→ T009 → T010,T012,T013 (parallel) → T011 → T014
→ T015 → T016 → T017
→ T018 → T019 → T020 → T021
→ T022 → T023
→ T024,T025 (parallel) → T026 → T027 → T028 → T029 → T030
→ T031 → T032 → T033 (parallel) → T034
→ T035,T036 (parallel) → T037 → T038

---

## Notes

- All Python files: explicit type hints on every function signature — no bare `except` clauses
- All TypeScript files: `strict: true` — zero `any` types — use type assertions (`as`) only where necessary with comment explaining why
- All secrets: loaded via `pydantic-settings` from `.env` — never hardcoded
- `uv` only for Python deps; `pnpm` only for Node deps — no exceptions
- Commit `uv.lock` to git before building Docker image — required for `uv sync --frozen`
- `customFields.chatApiUrl` in Docusaurus — do NOT use `process.env.REACT_APP_*` (silently undefined in Docusaurus builds)
- `NullPool` + `statement_cache_size=0` in `neon.py` — do NOT remove these; required for Neon Free Tier PgBouncer
- Stop at any checkpoint to validate independently before continuing to next phase
