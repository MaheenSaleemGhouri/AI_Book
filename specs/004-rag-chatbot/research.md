# Research: RAG Chatbot for Physical AI Textbook

**Feature**: `004-rag-chatbot`
**Date**: 2026-02-21
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## R-01: OpenAI Agents SDK — Async Usage Pattern

**Question**: Is `Runner.run()` natively async? What is the return attribute?

**Decision**: Use `await Runner.run(agent, prompt)` and access `.final_output`.

**Findings**:
- The `openai-agents` SDK (released Feb 2025) provides `Runner.run()` as an **async coroutine** — it can be `await`-ed directly in an async FastAPI handler.
- Return type is `RunResult`. The correct attribute for the final LLM text output is `.final_output`.
- Usage follows the user's spec: `result = await Runner.run(agent, user_prompt)` → `result.final_output`.

**Risk**: The SDK is relatively new. If it changes APIs, fallback is to use `AsyncOpenAI.chat.completions.create()` directly — same outcome, different call chain.

**Alternatives considered**:
- `asyncio.to_thread(runner.run)` — works if SDK is sync-only; not needed since SDK is natively async.
- Direct `AsyncOpenAI` client — simpler but deviates from spec requirement of using the Agents SDK.

---

## R-02: Docusaurus v3 — Environment Variable Injection

**Question**: Does `process.env.REACT_APP_API_URL` work in Docusaurus v3 components?

**Decision**: NO — use `customFields` in `docusaurus.config.ts` + `useDocusaurusContext()` hook.

**Findings**:
- Docusaurus v3 uses webpack but does **NOT** auto-expose arbitrary `process.env.*` variables to React components. The `REACT_APP_*` prefix is a Create React App convention that requires explicit `webpack.DefinePlugin` configuration — absent in Docusaurus by default.
- The idiomatic Docusaurus approach is `customFields`:

  ```typescript
  // docusaurus.config.ts
  const config: Config = {
    customFields: {
      chatApiUrl: process.env.CHAT_API_URL ?? 'http://localhost:8000',
    },
  };
  ```

  ```typescript
  // In ChatWidget/index.tsx
  import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
  const { siteConfig } = useDocusaurusContext();
  const API_URL = siteConfig.customFields?.chatApiUrl as string ?? 'http://localhost:8000';
  ```

- **Env var name changes**: `REACT_APP_API_URL` → `CHAT_API_URL` (set in `book/.env.local` or GitHub Actions secrets).

**Impact on plan**: `docusaurus.config.ts` must be modified. The `ChatWidget/index.tsx` must use `useDocusaurusContext()` instead of `process.env.REACT_APP_API_URL`.

**Alternatives considered**:
- Modify webpack config in Docusaurus to expose `REACT_APP_*` — adds complexity, fragile across Docusaurus upgrades.
- Hardcode the API URL — violates constitution Principle VI (no hardcoded secrets/config).

---

## R-03: Qdrant AsyncQdrantClient — Import Path and Version

**Question**: How to import `AsyncQdrantClient`? Minimum version?

**Decision**: `from qdrant_client import AsyncQdrantClient` (available since v1.7.0, recommend v1.8.0+).

**Findings**:
- `AsyncQdrantClient` is available via two import paths:
  - `from qdrant_client import AsyncQdrantClient` (top-level, preferred for simplicity)
  - `from qdrant_client.async_client import AsyncQdrantClient` (explicit module path)
- Both work; prefer the top-level import for conciseness.
- Minimum version: `qdrant-client >= 1.7.0`. Recommend `>= 1.8.0` for stability.
- The sync `QdrantClient` is used in `ingest.py` (CLI script — not an async context).

**Usage pattern**:
```python
from qdrant_client import AsyncQdrantClient

qdrant = AsyncQdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)
results = await qdrant.search(collection_name=..., query_vector=..., limit=5, with_payload=True)
```

---

## R-04: uv in Docker — `uv sync` vs `uv pip install`

**Question**: Which `uv` pattern for HF Spaces Docker images?

**Decision**: `uv sync --frozen --no-dev` with committed `uv.lock`. Install `uv` via the official image layer.

**Findings**:
- `uv sync --frozen` installs exactly what's in `uv.lock` — deterministic, fast, reproducible.
- `--no-dev` excludes `pytest`/`httpx` from the production container.
- Two approaches for installing `uv` in Docker:
  1. **Bootstrap via pip**: `RUN pip install uv` — simpler, ~0.5s overhead, acceptable for HF Spaces.
  2. **Copy from official image**: `COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv` — slightly cleaner.
- HF Spaces does not require any special uv configuration beyond standard Docker.
- `uv.lock` **must be committed to git** — without it, `uv sync --frozen` fails.

**Selected Dockerfile pattern**:
```dockerfile
FROM python:3.11-slim
RUN pip install uv
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev
COPY app/ ./app/
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

The `uv.lock*` glob handles the case where the lock file doesn't exist yet (first build) but typically it must exist for `--frozen` to work. The correct flow is: generate lock file locally with `uv lock`, commit it, then build.

---

## R-05: SQLAlchemy Async + Neon Serverless Postgres

**Question**: Are there connection pooling/caching requirements for Neon with asyncpg?

**Decision**: Set `statement_cache_size=0` in `connect_args`. Use `NullPool` for serverless connections.

**Findings**:
- **Critical**: Neon Free Tier uses PgBouncer in transaction pooling mode. asyncpg's prepared statement cache is incompatible with this — statements cached on one physical connection won't exist when PgBouncer assigns a different one.
- Required engine config:
  ```python
  from sqlalchemy.pool import NullPool

  engine = create_async_engine(
      settings.database_url,
      echo=False,
      poolclass=NullPool,  # Serverless: no persistent connections
      connect_args={"statement_cache_size": 0},
  )
  ```
- `NullPool` means each request opens and closes its own DB connection — correct for serverless.
- `pool_pre_ping=True` can be used instead of `NullPool` if connection reuse is desired.
- SSL is required: `?sslmode=require` must be in `DATABASE_URL`.

**Alternatives considered**:
- Session pooling mode — not available on Neon Free Tier.
- `pool_pre_ping=True` with default pool — works but risks connection errors on Neon suspension.

---

## Summary: Decisions Affecting Implementation

| Decision | Impact on Code | Files Affected |
|----------|---------------|----------------|
| `Runner.run()` is async → use `await` + `.final_output` | Direct usage as written in spec | `app/agents/rag_agent.py` |
| Docusaurus uses `customFields` not `REACT_APP_*` | Add `customFields` to config; use `useDocusaurusContext()` in component | `book/docusaurus.config.ts`, `book/src/components/ChatWidget/index.tsx` |
| Qdrant async import: `from qdrant_client import AsyncQdrantClient` | Use `AsyncQdrantClient` in retriever; sync `QdrantClient` in ingest | `app/rag/retriever.py`, `app/rag/ingest.py` |
| Docker: `uv sync --frozen --no-dev` + committed `uv.lock` | Must `uv lock` before first `docker build` | `Dockerfile`, `uv.lock` |
| Neon: `NullPool` + `statement_cache_size=0` | Engine creation must include both settings | `app/db/neon.py` |
