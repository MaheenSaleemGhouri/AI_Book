FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Install dependencies (frozen for reproducibility; no dev extras)
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev

# Copy application source
COPY app/ ./app/

# Expose Hugging Face Spaces default port
EXPOSE 7860

# All secrets loaded from environment variables at runtime — nothing hardcoded
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
