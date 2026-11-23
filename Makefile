# Makefile at repo root

.PHONY: backend-test backend-run backend-ci \
        lab-test lab-build lab-ci \
        fruitful-pin-install fruitful-pin-dev fruitful-pin-test fruitful-pin-build fruitful-pin-ci \
        fruitful-lab-site-install fruitful-lab-site-dev fruitful-lab-site-test fruitful-lab-site-build fruitful-lab-site-ci \
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

fruitful-pin-install:
	cd apps/fruitful-pin && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm ci

fruitful-pin-dev:
	cd apps/fruitful-pin && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm run dev:local

fruitful-pin-test:
	cd apps/fruitful-pin && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm test

fruitful-pin-build:
	cd apps/fruitful-pin && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm run build

fruitful-pin-ci: fruitful-pin-test fruitful-pin-build

fruitful-lab-site-install:
	cd apps/fruitful-lab-site && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm ci

fruitful-lab-site-dev:
	cd apps/fruitful-lab-site && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm run dev:local

fruitful-lab-site-test:
	cd apps/fruitful-lab-site && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm test

fruitful-lab-site-build:
	cd apps/fruitful-lab-site && npm_config_cache=/private/tmp/npm-cache npm_config_logs_dir=/private/tmp/npm-logs npm run build

fruitful-lab-site-ci: fruitful-lab-site-test fruitful-lab-site-build

# run both test suites
test: backend-test lab-test fruitful-pin-test fruitful-lab-site-test

# full CI-ish run
all: backend-ci lab-ci fruitful-pin-ci fruitful-lab-site-ci
