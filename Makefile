# Makefile at repo root

.PHONY: backend-test backend-run backend-ci \
        frontend-test frontend-build frontend-ci \
        test all

backend-test:
	cd backend && uv run pytest -q

backend-run:
	cd backend && uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}

backend-ci: backend-test

frontend-test:
	cd frontend && npm test

frontend-build:
	cd frontend && npm run build

frontend-ci: frontend-test frontend-build

# run both test suites
test: backend-test frontend-test

# full CI-ish run
all: backend-ci frontend-ci
