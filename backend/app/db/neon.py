from collections.abc import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

from app.core.config import settings


def _normalize_db_url(url: str) -> str:
    """Strip all query params — asyncpg doesn't accept sslmode/channel_binding etc.
    SSL is handled via connect_args instead."""
    parsed = urlparse(url)
    return urlunparse(parsed._replace(query=""))


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    _normalize_db_url(settings.database_url),
    echo=False,
    poolclass=NullPool,  # Serverless: each request opens its own connection
    connect_args={
        "statement_cache_size": 0,  # Required for Neon PgBouncer
        "ssl": "require",           # asyncpg SSL (replaces ?sslmode=require)
    },
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    engine,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
