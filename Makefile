# Makefile at repo root

.PHONY: backend-test backend-run backend-ci \
        lab-test lab-build lab-ci \
        frontend-test frontend-build frontend-ci \
        test all

backend-test:
	cd backend && uv run pytest -q

backend-run:
	cd backend && uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}

backend-ci: backend-test

lab-test:
	cd apps/lab && API_BASE_URL=http://localhost:8000 npm test

frontend-test: lab-test

lab-build:
	cd apps/lab && API_BASE_URL=http://localhost:8000 npm run build

frontend-build: lab-build

lab-ci: lab-test lab-build

frontend-ci: lab-ci

# run both test suites
test: backend-test lab-test

# full CI-ish run
all: backend-ci lab-ci
