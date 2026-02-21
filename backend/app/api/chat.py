from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, field_validator
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.rag_agent import get_rag_answer
from app.db.crud import get_history, get_or_create_session, save_message
from app.db.neon import get_db

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    message: str

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message must not be empty")
        return v


class MessageOut(BaseModel):
    role: str
    content: str
    created_at: str


class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: list[str]


class HistoryResponse(BaseModel):
    messages: list[MessageOut]


@router.post("/chat", response_model=ChatResponse)
async def post_chat(
    body: ChatRequest,
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ChatResponse:
    user_agent = request.headers.get("user-agent")
    await get_or_create_session(db, body.session_id, user_agent)
    await save_message(db, body.session_id, "user", body.message)

    try:
        result = await get_rag_answer(body.message)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    answer = str(result["answer"])
    sources: list[str] = list(result["sources"])  # type: ignore[arg-type]

    await save_message(db, body.session_id, "assistant", answer)
    return ChatResponse(answer=answer, session_id=body.session_id, sources=sources)


@router.get("/history/{session_id}", response_model=HistoryResponse)
async def get_history_endpoint(
    session_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> HistoryResponse:
    messages = await get_history(db, session_id, limit=50)
    return HistoryResponse(
        messages=[
            MessageOut(
                role=m.role,
                content=m.content,
                created_at=m.created_at.isoformat() if isinstance(m.created_at, datetime) else str(m.created_at),
            )
            for m in messages
        ]
    )
