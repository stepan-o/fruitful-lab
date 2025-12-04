# backend/Makefile

.PHONY: test run dev-sync

# Install deps for local dev / CI (includes pytest, alembic, httpx)
dev-sync:
	uv sync --group dev

# Run backend test suite (uses dev group so pytest is available)
test:
	uv run --group dev pytest -q

# Start the API server
run:
	uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}