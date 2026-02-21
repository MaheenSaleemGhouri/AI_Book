import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import ChatMessage, ChatSession


async def get_or_create_session(
    db: AsyncSession,
    session_id: str,
    user_agent: str | None = None,
) -> ChatSession:
    """Return existing session or create a new one."""
    sid = uuid.UUID(session_id)
    result = await db.execute(select(ChatSession).where(ChatSession.id == sid))
    session = result.scalar_one_or_none()
    if session is None:
        session = ChatSession(id=sid, user_agent=user_agent)
        db.add(session)
        await db.commit()
        await db.refresh(session)
    return session


async def save_message(
    db: AsyncSession,
    session_id: str,
    role: str,
    content: str,
) -> ChatMessage:
    """Persist a single chat message."""
    sid = uuid.UUID(session_id)
    message = ChatMessage(session_id=sid, role=role, content=content)
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def get_history(
    db: AsyncSession,
    session_id: str,
    limit: int = 50,
) -> list[ChatMessage]:
    """Return messages for a session ordered by created_at ascending."""
    try:
        sid = uuid.UUID(session_id)
    except ValueError:
        return []
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == sid)
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
    )
    return list(result.scalars().all())
