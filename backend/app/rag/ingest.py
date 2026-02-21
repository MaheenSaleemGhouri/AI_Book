import re
from pathlib import Path

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.core.config import settings

_EMBEDDING_DIM = 1536  # text-embedding-3-small output dimension


def clean_mdx(content: str) -> str:
    """Strip MDX/frontmatter/JSX noise from raw file content."""
    # Remove YAML frontmatter (--- ... ---)
    content = re.sub(r"^---[\s\S]*?---\n?", "", content, flags=re.MULTILINE)
    # Remove import/export lines
    content = re.sub(r"^(import|export)\s+.*$", "", content, flags=re.MULTILINE)
    # Remove JSX component tags  <ComponentName ... />  or  <ComponentName ...>...</ComponentName>
    content = re.sub(r"<[A-Z][a-zA-Z]*[^>]*/?>", "", content)
    content = re.sub(r"</[A-Z][a-zA-Z]*>", "", content)
    # Remove fenced code blocks
    content = re.sub(r"```[\s\S]*?```", "", content)
    # Remove heading markers
    content = re.sub(r"^#{1,6}\s+", "", content, flags=re.MULTILINE)
    return content.strip()


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Split text into word-count sliding-window chunks."""
    words = text.split()
    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        if len(chunk) >= 50:  # skip trivially short chunks
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def ingest_all_chapters(docs_path: str) -> None:
    """Ingest all MDX/MD files from docs_path into Qdrant (sync, run once)."""
    client = QdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)
    openai_client = OpenAI(api_key=settings.open_router_api, base_url=settings.openai_base_url)

    # Delete existing collection if present (idempotent re-run)
    existing = [c.name for c in client.get_collections().collections]
    if settings.collection_name in existing:
        client.delete_collection(settings.collection_name)

    client.create_collection(
        collection_name=settings.collection_name,
        vectors_config=VectorParams(size=_EMBEDDING_DIM, distance=Distance.COSINE),
    )
    print(f"Created collection: {settings.collection_name}")

    points: list[PointStruct] = []
    point_id = 0
    docs_root = Path(docs_path)

    for mdx_file in sorted(docs_root.rglob("*.mdx")) + sorted(docs_root.rglob("*.md")):
        raw = mdx_file.read_text(encoding="utf-8", errors="ignore")
        cleaned = clean_mdx(raw)
        chunks = chunk_text(cleaned)
        module = mdx_file.parent.name

        for chunk_index, chunk in enumerate(chunks):
            response = openai_client.embeddings.create(
                input=chunk.replace("\n", " "),
                model=settings.embedding_model,
            )
            vector = response.data[0].embedding
            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "content": chunk,
                        "source_file": mdx_file.name,
                        "module": module,
                        "chunk_index": chunk_index,
                    },
                )
            )
            print(f"  Embedded chunk {point_id}: {mdx_file.name} [{chunk_index}]")
            point_id += 1

    if points:
        client.upsert(collection_name=settings.collection_name, points=points)

    print(f"Done! Total chunks ingested: {point_id}")
