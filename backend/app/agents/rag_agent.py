from openai import AsyncOpenAI

from app.core.config import settings
from app.rag.retriever import retrieve_chunks

SYSTEM_PROMPT = (
    "You are a helpful teaching assistant for the Physical AI & Humanoid Robotics "
    "textbook. Answer ONLY from the provided context. If the answer is not in the "
    "context, say: I couldn't find that in the book. Please check the relevant chapter."
)

_FALLBACK = "I couldn't find that in the book. Please check the relevant chapter."

_client = AsyncOpenAI(
    api_key=settings.open_router_api,
    base_url=settings.openai_base_url,
)


async def get_rag_answer(question: str) -> dict[str, str | list[str]]:
    """Retrieve context from Qdrant, then generate a grounded answer via OpenRouter."""
    chunks = await retrieve_chunks(question, top_k=5)

    if not chunks:
        return {"answer": _FALLBACK, "sources": []}

    # Build numbered context block
    context_lines: list[str] = []
    for i, chunk in enumerate(chunks, start=1):
        context_lines.append(f"[{i}] (source: {chunk['source']})\n{chunk['content']}")
    context = "\n\n".join(context_lines)

    user_prompt = f"Context:\n{context}\n\nQuestion: {question}"

    response = await _client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    answer: str = response.choices[0].message.content or _FALLBACK

    # Deduplicate source filenames while preserving order
    seen: set[str] = set()
    sources: list[str] = []
    for chunk in chunks:
        src = chunk["source"]
        if isinstance(src, str) and src and src not in seen:
            seen.add(src)
            sources.append(src)

    return {"answer": answer, "sources": sources}
