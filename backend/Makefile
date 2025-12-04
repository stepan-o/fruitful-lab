# backend/Makefile

.PHONY: test run

test:
	uv run pytest -q

run: test
	uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}