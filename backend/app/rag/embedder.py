from openai import AsyncOpenAI

from app.core.config import settings

_client = AsyncOpenAI(api_key=settings.open_router_api, base_url=settings.openai_base_url)


async def get_embedding(text: str) -> list[float]:
    """Return the embedding vector for the given text."""
    cleaned = text.replace("\n", " ")
    response = await _client.embeddings.create(
        input=cleaned,
        model=settings.embedding_model,
    )
    return response.data[0].embedding
