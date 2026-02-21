# Quickstart: RAG Chatbot — Local Development

**Feature**: `004-rag-chatbot`
**Updated**: 2026-02-21
**Branch**: `004-rag-chatbot`

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.11+ | `winget install Python.Python.3.11` |
| uv | latest | `pip install uv` (bootstrap only) |
| Node.js | 20 LTS | `winget install OpenJS.NodeJS.LTS` |
| pnpm | 9.x | `npm install -g pnpm@9` |
| Docker Desktop | latest | For Phase F verification only |

## External Services (provision before starting)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| [OpenAI Platform](https://platform.openai.com) | Embeddings + GPT-4o-mini | Pay-per-use (budget ~$1–2 for dev) |
| [Qdrant Cloud](https://cloud.qdrant.io) | Vector search | Free Tier (1GB storage) |
| [Neon](https://neon.tech) | Serverless Postgres | Free Tier (0.5GB) |

---

## Backend Setup (Phases A–F)

### 1. Initialize project

```bash
# From repo root (C:\Book)
uv init backend
cd backend
```

### 2. Install dependencies

```bash
uv add fastapi "uvicorn[standard]" openai openai-agents \
       qdrant-client "sqlalchemy[asyncio]" asyncpg \
       pydantic-settings python-dotenv tiktoken
uv add --dev pytest pytest-asyncio httpx
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your real credentials:

```dotenv
OPENAI_API_KEY=sk-proj-...
QDRANT_URL=https://xxxx.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGci...
COLLECTION_NAME=physical_ai_book
DATABASE_URL=postgresql+asyncpg://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
ALLOWED_ORIGINS=http://localhost:3000,https://YOUR_GITHUB_USERNAME.github.io
CHAT_API_URL=http://localhost:8000
```

> **Neon DATABASE_URL tip**: Copy the connection string from Neon dashboard → Connection Details → select "asyncpg" driver.

### 4. Verify config loads

```bash
cd backend
uv run python -c "from app.core.config import settings; print('Config OK:', settings.collection_name)"
```

Expected: `Config OK: physical_ai_book`

### 5. Ingest book content into Qdrant

> Run this ONCE (or whenever chapters change). Re-running is safe — it recreates the collection.

```bash
cd backend
uv run python scripts/ingest_book.py
```

Expected output:
```
Ingesting from: C:\Book\book\docs
Created collection: physical_ai_book
  Embedded chunk 1: week-01-intro.mdx [0]
  ...
Done! Total chunks ingested: 342
```

### 6. Start the backend

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

Verify:
- `http://localhost:8000/health` → `{"status": "ok"}`
- `http://localhost:8000/docs` → Swagger UI

### 7. Test a chat request

Using curl (or Swagger UI):

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "00000000-0000-0000-0000-000000000001", "message": "What is ROS 2?"}'
```

Expected: JSON with `answer`, `session_id`, and `sources` array.

---

## Frontend Setup (Phases G–H)

### 1. Configure Docusaurus for API URL

In `book/docusaurus.config.ts`, add `customFields`:

```typescript
const config: Config = {
  // ... existing config ...
  customFields: {
    chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000',
  },
};
```

### 2. Set frontend env var

```bash
# In book/.env.local (gitignored)
CHAT_API_URL=http://localhost:8000
```

### 3. Start the frontend

```bash
cd book
pnpm start
```

Open `http://localhost:3000` — the chat bubble should appear bottom-right.

### 4. Production build

```bash
cd book
pnpm build
# Must complete with zero TypeScript errors
```

---

## Docker Verification (Phase F)

```bash
cd backend
docker build -t pai-chatbot .
docker run -p 7860:7860 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e QDRANT_URL=$QDRANT_URL \
  -e QDRANT_API_KEY=$QDRANT_API_KEY \
  -e COLLECTION_NAME=physical_ai_book \
  -e DATABASE_URL=$DATABASE_URL \
  -e ALLOWED_ORIGINS="http://localhost:3000" \
  pai-chatbot
```

Verify: `http://localhost:7860/health` → `{"status": "ok"}`

---

## Integration Test Checklist (Phase I)

Run both servers simultaneously (two terminals), then verify:

**Backend** (`http://localhost:8000/docs`):
- [ ] `GET /health` → `{"status": "ok"}`
- [ ] `POST /chat` with valid session → answer + sources returned
- [ ] `POST /chat` with empty message → 422 error
- [ ] `GET /history/{session_id}` → messages after chatting
- [ ] `GET /history/00000000-0000-0000-0000-000000000999` → `{"messages": []}`

**Frontend** (`http://localhost:3000`):
- [ ] Chat bubble visible bottom-right on landing page
- [ ] Chat bubble visible on a docs page (any chapter)
- [ ] Click bubble → panel opens with animation
- [ ] Type message + Enter → loading dots appear
- [ ] Answer appears with source file tags
- [ ] Close button works
- [ ] Reload page → previous messages restored
- [ ] Panel does not overlap or shift page content
- [ ] On mobile viewport (375px width) → panel fits within screen

**Build gate**:
- [ ] `cd book && pnpm build` → zero TypeScript errors

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| `Config error: OPENAI_API_KEY missing` | `.env` not filled or not in `backend/` | `cp .env.example .env` then fill values |
| `asyncpg ConnectionError` | Missing `statement_cache_size=0` or wrong DB URL | Check `neon.py` engine config; verify `DATABASE_URL` has `?sslmode=require` |
| Chat bubble shows but API call fails | CORS rejected or wrong API URL | Check `ALLOWED_ORIGINS` in `.env`; check `CHAT_API_URL` in Docusaurus config |
| `pnpm build` TS error in ChatWidget | `any` type slipped in, or import error | Run `cd book && pnpm tsc --noEmit` to see exact error |
| Docker build fails at `uv sync` | No `uv.lock` committed | Run `uv lock` in backend/ before building |
| Qdrant returns 0 results | Collection empty or wrong name | Re-run `uv run python scripts/ingest_book.py` |
