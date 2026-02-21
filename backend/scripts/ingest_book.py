"""CLI entry point: ingest all MDX chapters from book/docs/ into Qdrant.

Run once (or after chapter changes) from the backend/ directory:
    uv run python scripts/ingest_book.py
"""

import sys
import traceback
from pathlib import Path

# Allow imports from backend/app/
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv  # noqa: E402

load_dotenv()

from app.rag.ingest import ingest_all_chapters  # noqa: E402

if __name__ == "__main__":
    # Resolve book/docs/ relative to this script's location:
    # scripts/ → backend/ → repo root → book/docs/
    repo_root = Path(__file__).resolve().parent.parent.parent
    docs_path = repo_root / "book" / "docs"

    if not docs_path.exists():
        print(f"ERROR: docs path not found: {docs_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Ingesting from: {docs_path}")
    try:
        ingest_all_chapters(str(docs_path))
        sys.exit(0)
    except Exception:
        traceback.print_exc()
        sys.exit(1)
