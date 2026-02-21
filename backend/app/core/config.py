from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    open_router_api: str
    openai_base_url: str = "https://openrouter.ai/api/v1"
    embedding_model: str = "openai/text-embedding-3-small"
    chat_model: str = "openai/gpt-4o-mini"
    qdrant_url: str
    qdrant_api_key: str
    collection_name: str = "physical_ai_book"
    database_url: str
    allowed_origins: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
