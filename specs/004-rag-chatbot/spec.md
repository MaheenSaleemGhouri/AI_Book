# Feature Specification: RAG Chatbot for Physical AI Textbook

**Feature Branch**: `004-rag-chatbot`
**Created**: 2026-02-21
**Status**: Draft
**Input**: User description: "Build a RAG (Retrieval-Augmented Generation) chatbot for the Physical AI & Humanoid Robotics textbook."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Student Asks a Question About Book Content (Priority: P1)

A student reading the textbook wants to ask a question about something they just read. They click the floating chat bubble in the bottom-right corner of the page, type their question, and receive an answer drawn exclusively from the textbook's content. The answer includes references to which chapter or file the information came from.

**Why this priority**: This is the core value proposition — without this working, nothing else matters. Every other story depends on it.

**Independent Test**: Open any page of the book, click the chat bubble, type "What is ROS 2?", and verify a grounded answer with source references is returned within 10 seconds.

**Acceptance Scenarios**:

1. **Given** a student is on any page of the textbook site, **When** they click the chat bubble and type a question covered in the book, **Then** they receive a relevant answer citing specific source files from the book content, all within 10 seconds.
2. **Given** a student asks a question NOT covered in the book, **When** the chatbot finds no relevant content, **Then** it responds: "I couldn't find that in the book. Please check the relevant chapter." — no crash or empty response.
3. **Given** the backend is unavailable, **When** the student submits a message, **Then** the chat widget shows "Something went wrong. Please try again." inline in the chat.

---

### User Story 2 — Student Resumes Chat After Reloading the Page (Priority: P2)

A student closes or reloads the browser tab mid-conversation. When they return to any page of the book, their previous chat messages are automatically restored so they can continue from where they left off — without logging in.

**Why this priority**: Persistence across reloads makes the anonymous session feel continuous and trustworthy. Without it, users lose context and must repeat themselves.

**Independent Test**: Exchange 3 messages, reload the browser, and verify all previous messages reappear in correct order before any new input is allowed.

**Acceptance Scenarios**:

1. **Given** a student has sent messages in a session, **When** they reload the page, **Then** all previous messages reappear in the correct chronological order.
2. **Given** a brand-new browser with no prior session, **When** the student opens any page of the book, **Then** a new anonymous session is created silently and the chat starts empty.
3. **Given** a student's session has 50 existing messages, **When** they reload, **Then** the most recent 50 messages are shown (oldest first), with no error.

---

### User Story 3 — Chat Widget Is Visible on Every Page (Priority: P3)

A student navigating between chapters, sidebar pages, and the landing page always sees the chat bubble in the same bottom-right position. It never disappears between page transitions.

**Why this priority**: The widget's global presence ensures students can ask questions at any moment without navigating away — essential for an embedded learning tool.

**Independent Test**: Navigate to the landing page, a doc page, and a sidebar page; confirm the chat bubble is visible and functional on all three without any layout breakage.

**Acceptance Scenarios**:

1. **Given** a student visits the landing page, **When** the page loads, **Then** the chat bubble is visible in the bottom-right corner.
2. **Given** a student is on a documentation chapter page, **When** they scroll or navigate, **Then** the chat bubble remains fixed in position and does not interfere with page content.
3. **Given** a developer runs `pnpm build`, **When** the build completes, **Then** it passes with zero TypeScript errors related to the ChatWidget or Root.tsx integration.

---

### User Story 4 — Developer Ingests Book Content into the Vector Store (Priority: P4)

A developer runs a one-time ingestion script that reads all MDX chapter files from the book, splits them into searchable chunks, and stores them in the vector database so the chatbot can retrieve relevant passages semantically.

**Why this priority**: Without indexed content, the chatbot cannot answer any questions. This is a prerequisite developer task, not a user-facing story, but must be independently runnable.

**Independent Test**: Run `cd backend && uv run python scripts/ingest_book.py` against an empty Qdrant collection and verify the Qdrant dashboard shows chunks stored with correct metadata.

**Acceptance Scenarios**:

1. **Given** the Qdrant collection is empty, **When** the ingestion script runs, **Then** all `.mdx` files from `book/docs/` are chunked and stored with metadata (`source_file`, `module`, `chunk_index`).
2. **Given** the collection already has data, **When** the script is re-run, **Then** it deletes and recreates the collection without error (idempotent).
3. **Given** the script encounters a malformed MDX file, **When** it processes that file, **Then** it logs a warning and continues processing remaining files — it does not crash.

---

### User Story 5 — Developer Deploys Backend to Hugging Face Spaces (Priority: P5)

A developer builds and pushes a Docker image of the FastAPI backend to Hugging Face Spaces. The backend starts on the correct port, loads all secrets from environment variables, and responds to health checks.

**Why this priority**: Deployment readiness is a prerequisite for production use. Isolated from other stories — can be validated without a frontend.

**Independent Test**: Run `docker build .` in the `backend/` directory locally; container starts and `GET /health` returns `{"status": "ok"}`.

**Acceptance Scenarios**:

1. **Given** the Dockerfile and dependency manifest are present, **When** `docker build .` runs, **Then** it succeeds without errors.
2. **Given** the container is running with valid environment variables, **When** `GET /health` is called, **Then** the response is `{"status": "ok"}` with HTTP 200.
3. **Given** a required environment variable is missing, **When** the app starts, **Then** it fails fast with a clear configuration error — it does not silently serve broken requests.

---

### Edge Cases

- What happens when the student submits an empty message? → Submit is disabled; empty messages cannot be sent.
- What happens when Qdrant vector search returns zero results? → Fallback message returned; no crash or HTTP 500.
- What happens when the OpenAI API times out or returns an error? → HTTP 500 with clear error message; frontend shows "Something went wrong. Please try again."
- What happens when a session UUID exists in localStorage but not in the database? → A new session is auto-created on the first message; history returns empty `[]`.
- What happens when a student has more than 50 messages in a session? → Only the most recent 50 are returned; older messages are silently omitted.
- What happens when the user submits while a response is loading? → Input and Send button are disabled during loading; duplicate submissions are prevented.
- What happens when `REACT_APP_API_URL` is not set? → The frontend must fail visibly (console error + inline "Something went wrong" message), not silently call the wrong URL.

---

## Requirements *(mandatory)*

### Functional Requirements

**Backend — Data Ingestion**

- **FR-001**: System MUST read all `.mdx` files from `book/docs/` recursively and chunk them into segments of 512 tokens with 50-token overlap.
- **FR-002**: Each chunk MUST be stored in the vector database with metadata: `source_file`, `module`, and `chunk_index`.
- **FR-003**: The ingestion process MUST be idempotent — re-running it must delete and recreate the collection without errors.

**Backend — Chat Endpoint**

- **FR-004**: System MUST expose a `POST /chat` endpoint accepting `{ session_id: string, message: string }`.
- **FR-005**: The chat pipeline MUST follow this strict order: embed question → retrieve top-5 semantically similar chunks → generate answer from retrieved context → save both messages → return response.
- **FR-006**: System MUST ground all answers exclusively in retrieved book content using a fixed system prompt that instructs the model to respond only from the provided context.
- **FR-007**: `POST /chat` response MUST include `{ answer, session_id, sources[] }` where `sources` lists the originating file names.
- **FR-008**: System MUST return the graceful fallback message (not an error response) when the vector store retrieves zero results.
- **FR-009**: System MUST return HTTP 422 when `session_id` or `message` is missing from the request body.
- **FR-010**: System MUST return HTTP 500 with a clear error message when the AI or vector store calls fail unexpectedly.

**Backend — History Endpoint**

- **FR-011**: System MUST expose a `GET /history/{session_id}` endpoint returning `{ messages: [] }`.
- **FR-012**: Messages MUST be ordered by creation time ascending (oldest first).
- **FR-013**: System MUST return `{ messages: [] }` (not HTTP 404) when `session_id` is not found.
- **FR-014**: System MUST return at most 50 messages per session.

**Backend — Session Persistence**

- **FR-015**: System MUST auto-create a new session record when a message arrives for an unknown `session_id`.
- **FR-016**: All database operations MUST be asynchronous.
- **FR-017**: Both session and message storage tables MUST be created automatically on application startup.

**Backend — Infrastructure**

- **FR-018**: System MUST include a `GET /health` endpoint returning `{"status": "ok"}` with HTTP 200.
- **FR-019**: CORS MUST allow requests from the local development origin, the GitHub Pages domain, and a configurable wildcard origin for development.
- **FR-020**: All secrets MUST be loaded from environment variables — none hardcoded in source code.
- **FR-021**: The containerized backend MUST listen on port 7860.

**Frontend — ChatWidget**

- **FR-022**: ChatWidget MUST render a fixed-position circular button in the bottom-right corner (24px from each edge) when in the closed state.
- **FR-023**: Clicking the bubble MUST open a chat panel with a header, scrollable messages area, and an input row at the bottom.
- **FR-024**: User messages MUST be right-aligned; assistant messages MUST be left-aligned, each with distinct styling per the Dark Brown & Beige visual theme.
- **FR-025**: Each message MUST display a timestamp; assistant messages MUST display source file tags when sources are provided in the response.
- **FR-026**: System MUST show an animated loading indicator while awaiting a response, with input and send button disabled during this state.
- **FR-027**: Pressing Enter MUST submit the message; empty messages MUST NOT be submittable.
- **FR-028**: On mount, ChatWidget MUST check browser storage for an existing session ID; if none exists, it MUST generate a new unique ID and persist it.
- **FR-029**: On mount, ChatWidget MUST fetch and display chat history for the existing session before accepting new input.
- **FR-030**: ChatWidget MUST be registered globally in Docusaurus so it appears on every page without duplicating existing page layout components.
- **FR-031**: The API base URL MUST be configurable via an environment variable so local development and production point to different backends.

### Key Entities

- **ChatSession**: An anonymous browser session identified by a client-generated unique ID stored in browser local storage. Attributes: unique identifier, creation timestamp, browser user-agent string.
- **ChatMessage**: A single message within a session. Attributes: unique identifier, session reference, role (`user` or `assistant`), text content, creation timestamp.
- **BookChunk**: A text segment extracted from a textbook MDX chapter file. Stored in the vector database. Attributes: text content, embedding vector, source file name, module identifier, chunk position index.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students receive grounded answers to book-related questions within 10 seconds of submission, measured end-to-end from Send click to answer display.
- **SC-002**: Chat history from a previous browser session is fully restored within 2 seconds of page load — no user action required.
- **SC-003**: The chat bubble appears on every page of the textbook site (landing page, all doc pages, all sidebar pages) without any layout overlap or z-index conflict.
- **SC-004**: The ingestion script processes all book chapters and stores all chunks successfully in a single run — zero file failures for well-formed MDX files.
- **SC-005**: The Docusaurus production build completes with zero TypeScript errors after ChatWidget and Root.tsx integration.
- **SC-006**: The backend container builds successfully locally and passes a health check immediately on startup.
- **SC-007**: Questions outside the book's content return the graceful fallback message in 100% of cases — no crashes or empty responses.
- **SC-008**: It is impossible to submit duplicate requests while a response is in-flight — the UI enforces a single-request-at-a-time constraint.

---

## Assumptions

- The Docusaurus site already exists under `book/` and has a working `pnpm build` setup inherited from the dark-beige-theme branch.
- Fifteen MDX chapter files exist under `book/docs/` at the time of ingestion; the exact filenames follow a `week-XX-*.mdx` naming convention.
- Qdrant Cloud Free Tier and Neon Serverless Postgres accounts will be provisioned by the developer before running the backend; the application does not provision infrastructure.
- Environment variable injection into the Docusaurus frontend build is supported via Docusaurus's `customFields` or an equivalent mechanism.
- Sessions are intentionally anonymous — there is no concept of user identity in this phase.
- The GitHub Pages deployment URL pattern is `https://{GITHUB_USERNAME}.github.io` — the exact username is configured via environment variable, not hardcoded.

---

## Out of Scope

- User authentication, login, or account management (Phase 4)
- Personalization or adaptive learning features (Phase 5)
- Urdu or multilingual translation (Phase 6)
- Streaming / server-sent event responses
- Voice input or audio output
- Image or diagram semantic search
- Rate limiting or abuse prevention (deferred to a future security hardening phase)
- Admin dashboard for viewing or moderating chat history
