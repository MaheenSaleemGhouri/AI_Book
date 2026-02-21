# Data Model: RAG Chatbot for Physical AI Textbook

**Feature**: `004-rag-chatbot`
**Date**: 2026-02-21
**Storage Systems**: Neon Serverless Postgres (relational) + Qdrant Cloud (vector)

---

## Relational Model (Neon Postgres)

### Entity: ChatSession

Represents one anonymous browser session. The session ID is generated client-side (`crypto.randomUUID()`) and stored in `localStorage`. The backend auto-creates this record on first message.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | `PRIMARY KEY` | Client-generated; never server-generated |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Session start time |
| `user_agent` | `TEXT` | `NULLABLE` | Browser user-agent string; for diagnostics |

**Relationships**: One ChatSession → Many ChatMessages (cascade delete)

**Validation rules**:
- `id` must be a valid UUID v4 — validated by Python's `uuid.UUID()` constructor before DB write
- New sessions auto-created on first message if `id` not found

---

### Entity: ChatMessage

Represents a single message within a session. Both user and assistant messages are stored here.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | `PRIMARY KEY AUTOINCREMENT` | Server-generated sequential ID |
| `session_id` | `UUID` | `NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE` | FK to ChatSession |
| `role` | `TEXT` | `NOT NULL CHECK (role IN ('user', 'assistant'))` | Strict enum via DB constraint |
| `content` | `TEXT` | `NOT NULL` | Message text; no length limit at DB level |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Message timestamp |

**Validation rules**:
- `role` constrained by DB CHECK — only `'user'` or `'assistant'` accepted
- `content` must be non-empty (validated at API layer before DB write)
- `session_id` must exist in `chat_sessions` — FK enforced by Postgres

**Access patterns**:
- Insert: `INSERT INTO chat_messages (session_id, role, content) VALUES (...)`
- Query history: `SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 50`

---

### ER Diagram

```
chat_sessions
─────────────────────────────────
id          UUID         PK
created_at  TIMESTAMPTZ
user_agent  TEXT (null)
    │
    │ 1:N ON DELETE CASCADE
    ▼
chat_messages
─────────────────────────────────
id          SERIAL       PK
session_id  UUID         FK → chat_sessions.id
role        TEXT         CHECK IN ('user', 'assistant')
content     TEXT
created_at  TIMESTAMPTZ
```

---

### SQLAlchemy ORM Mapping

```python
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    messages: Mapped[list["ChatMessage"]] = relationship(back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String(20), CheckConstraint("role IN ('user', 'assistant')"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    session: Mapped["ChatSession"] = relationship(back_populates="messages")
```

---

### Engine Configuration (Neon-specific)

```python
engine = create_async_engine(
    settings.database_url,
    echo=False,
    connect_args={"statement_cache_size": 0},  # Required for Neon PgBouncer
)
```

`statement_cache_size=0` disables asyncpg's prepared statement cache — mandatory when Neon uses PgBouncer in transaction pooling mode (default on Free Tier).

---

## Vector Model (Qdrant Cloud)

### Collection: `physical_ai_book`

Stores chunked text from all MDX book chapters as dense vector embeddings.

**Collection config**:
```python
VectorParams(size=1536, distance=Distance.COSINE)
```

- **Dimensions**: 1536 (OpenAI `text-embedding-3-small` output size)
- **Distance metric**: Cosine similarity (standard for semantic search)
- **Collection name**: `physical_ai_book` (configurable via `COLLECTION_NAME` env var)

---

### Entity: BookChunk (Qdrant Point)

Each point represents one text segment from a book chapter.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `int` | Sequential integer; auto-incremented during ingestion |
| `vector` | `list[float]` (1536 dims) | OpenAI `text-embedding-3-small` embedding of `content` |
| `payload.content` | `str` | Raw text of this chunk (~500 words) |
| `payload.source_file` | `str` | MDX filename (e.g., `week-03-ros2-architecture.mdx`) |
| `payload.module` | `str` | Parent directory name (e.g., `module-1`) |
| `payload.chunk_index` | `int` | Zero-based position of chunk within its source file |

---

### Chunking Strategy

- **Method**: Word-count based (500 words per chunk, 50-word overlap)
- **Rationale**: 500 English words ≈ 512 tokens for prose — adequate proxy without tiktoken overhead
- **Pre-processing**: MDX files cleaned of frontmatter, JSX imports, component tags, code fences, and heading markers before chunking
- **Filter**: Chunks shorter than 50 characters are discarded (likely artifacts from MDX parsing)
- **Idempotency**: Collection is fully deleted and recreated on each run

---

### Retrieval Query

```python
# Query: embed question → cosine search → return top 5 with payload
results = await qdrant.search(
    collection_name="physical_ai_book",
    query_vector=embedding_vector,   # 1536-dim float list
    limit=5,
    with_payload=True,
)
```

---

## API Data Shapes (Pydantic Models)

### Request/Response for POST /chat

```python
class ChatRequest(BaseModel):
    session_id: str   # UUID string — validated via uuid.UUID() in handler
    message: str      # Non-empty user question

class ChatResponse(BaseModel):
    answer: str           # LLM-generated answer grounded in book content
    session_id: str       # Echo of request session_id
    sources: list[str]    # Distinct source_file names from retrieved chunks
```

### Response for GET /history/{session_id}

```python
class MessageOut(BaseModel):
    role: str         # 'user' | 'assistant'
    content: str      # Message text
    created_at: str   # ISO 8601 datetime string

class HistoryResponse(BaseModel):
    messages: list[MessageOut]   # Empty list if session not found
```

---

## State Transitions

### Session Lifecycle

```
[No localStorage entry]
        │
        │ First page load — crypto.randomUUID()
        ▼
[UUID in localStorage]
        │
        │ POST /chat (first message)
        ▼
[Session in chat_sessions] ←─── [All subsequent POST /chat requests]
        │
        │ GET /history/{session_id}
        ▼
[Messages returned ascending by created_at, max 50]
```

### Message Flow

```
User types message
        │
        ├─→ Optimistic: append user message to UI
        ├─→ POST /chat { session_id, message }
        │         │
        │         ├─→ embed(message) → 1536-dim vector
        │         ├─→ qdrant.search(vector, top_k=5) → chunks
        │         ├─→ [chunks empty?] → fallback message
        │         ├─→ Agent(instructions=SYSTEM_PROMPT) → LLM answer
        │         ├─→ save_message(session_id, 'user', message)
        │         ├─→ save_message(session_id, 'assistant', answer)
        │         └─→ return { answer, session_id, sources }
        │
        └─→ Append assistant message + sources to UI
```
