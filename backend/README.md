# Physical AI RAG Chatbot — Backend

RAG-powered question answering for the **Physical AI & Humanoid Robotics** textbook.
Students ask questions; the chatbot answers using ONLY the book content (GPT-4o-mini + Qdrant).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/chat` | Send a question, receive a grounded answer with source citations |
| `GET` | `/history/{session_id}` | Retrieve previous messages for a session |
| `GET` | `/health` | Health check — returns `{"status": "ok"}` |

## Request / Response

### POST /chat

```json
// Request
{ "session_id": "uuid-string", "message": "What is ROS 2?" }

// Response
{ "answer": "ROS 2 is...", "session_id": "uuid-string", "sources": ["week-03-ros2.mdx"] }
```

### GET /history/{session_id}

```json
// Response
{ "messages": [{ "role": "user", "content": "...", "created_at": "2025-01-01T10:00:00Z" }] }
```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (embeddings + GPT-4o-mini) |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud API key |
| `COLLECTION_NAME` | Qdrant collection name (default: `physical_ai_book`) |
| `DATABASE_URL` | Neon Postgres connection string (`postgresql+asyncpg://...?sslmode=require`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (e.g. `http://localhost:3000`) |

## Local Development

```bash
# 1. Copy and fill environment variables
cp .env.example .env

# 2. Ingest book content into Qdrant (run once)
uv run python scripts/ingest_book.py

# 3. Start the server
uv run uvicorn app.main:app --reload --port 8000
```

## Docker

```bash
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
