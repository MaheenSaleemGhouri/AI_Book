from qdrant_client import AsyncQdrantClient

from app.core.config import settings
from app.rag.embedder import get_embedding

_qdrant = AsyncQdrantClient(
    url=settings.qdrant_url,
    api_key=settings.qdrant_api_key,
)


async def retrieve_chunks(query: str, top_k: int = 5) -> list[dict[str, str | float]]:
    """Return top-k relevant chunks from Qdrant for the given query."""
    vector = await get_embedding(query)
    response = await _qdrant.query_points(
        collection_name=settings.collection_name,
        query=vector,
        limit=top_k,
        with_payload=True,
    )
    chunks: list[dict[str, str | float]] = []
    for hit in response.points:
        payload = hit.payload or {}
        chunks.append(
            {
                "content": str(payload.get("content", "")),
                "source": str(payload.get("source_file", "")),
                "score": float(hit.score),
            }
        )
    return chunks
