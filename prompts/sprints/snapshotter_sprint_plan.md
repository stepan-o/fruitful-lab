## Sprint Plan Overview

**Goal:** Ship a deterministic, auditable, S3-writing Snapshotter running on **Replit** with **LangGraph orchestration**, producing spec-compliant artifacts for a repo scan.

**Deliverables (by end):**
- ✅ Pass 1: `repo_index.json` + `artifact_manifest.json`
- ✅ Pass 2: `ARCHITECTURE_SUMMARY_SNAPSHOT.json` + `GAPS_AND_INCONSISTENCIES.json` + optional `ONBOARDING.md`
- ✅ One printed **Worker Result Contract JSON** (success/failure)
- ✅ S3 layout exactly per spec
- ✅ Safety/bounds/observability enforced

## Sprint 0 — Spec Lock + Repo Hardening (Foundation)

### 0.1 — Definition of Done (DoD)
- Repo builds/runs in Replit with `uv run python main.py`
- Artifacts generated locally in `/tmp/snapshotter/out/...`
- No tarball code path remains
- Uploads succeed to S3 with AES256 SSE
- Output contract matches spec shape (success + failure)

**Acceptance criteria**
- Running on a test repo produces valid JSON files and uploads them under the correct S3 prefix.
- `ok=false` errors include `stage` + `error_code` + `error_message`.

### 0.2 — Remove Tarball Completely (Spec compliance)

**Work**
- Delete tarball creation and env toggle:
    - remove `tarfile` import
    - remove `build_tarball_from_index()`
    - remove `SNAPSHOTTER_TARBALL` handling
    - remove tarball references from:
        - `artifact_manifest.json` inputs
        - result contract (`artifacts.tarball`, `hashes.tarball_sha256`)
        - S3 uploads

**Acceptance criteria**
- No `repo_snapshot.tar.gz` anywhere (local outputs, manifest, S3, printed result).
- `replit.md` updated accordingly.

### 0.3 — Job Input Contract: Single Payload (Locked)

**Work**
- Add one canonical input path (pick one and standardize):
    - `SNAPSHOTTER_JOB_JSON` env containing JSON payload **or**
    - read JSON payload from stdin (recommended for LangGraph) **or**
    - `job.json` file path env
- Parse payload into `Job` model (Pydantic) with:
    - `limits`, `filters`, `output`, `metadata`
    - defaults per spec
- Keep env vars only as optional *developer convenience* (but payload is authoritative).

**Acceptance criteria**
- Running Snapshotter with only the JSON payload works end-to-end.
- Job fields in `repo_index.json.job` match payload + derived fields.

### 0.4 — Pass 1 Safety + Boundaries (Fix gaps)

**Work**
- Fix deny regex behavior:
    - change `rx.match(rel_path)` → `rx.search(rel_path)`
- Expand deny patterns to cover v0.1 safety:
    - include `.env` (and common secrets file variants)
    - include common credential filenames (e.g., `credentials.json`, `service_account*.json`, etc.) if desired
- Add **binary detection** and skip binary unless explicitly allowed:
    - “binary” heuristic: null bytes in first N bytes OR very low UTF-8 decodability ratio
    - record skip as `binary_file`
- Fix `max_files` termination:
    - cleanly stop scanning (break out of os.walk entirely)
    - record `max_files_reached` once
- Ensure skip reporting is complete and deterministic.

**Acceptance criteria**
- `repo_index.json` includes accurate `files_scanned`, `files_included`, `files_skipped`, `bytes_included`
- skipped files include reasons (regex, ext, binary, size, totals, read failures)
- scan halts correctly at limits without runaway.

### 0.5 — Artifact Manifest + Determinism

**Work**
- Ensure `artifact_manifest.json` contains only v0.1 artifacts (no tarball)
- Ensure deterministic ordering:
    - manifest items sorted
    - repo files sorted lexicographically
- Ensure timestamps only appear in fields intended for them.

**Acceptance criteria**
- Re-running on the same commit yields identical structures (except generated timestamps / job timestamp path).

## Sprint 1 — LangGraph Orchestration + Pass 2 Implementation (Core)

### 1.1 — LangGraph Runtime Skeleton (Replit-first)

**Work**
- Create `snapshotter/graph.py` with LangGraph nodes:
    1) `load_job`
    2) `clone_repo`
    3) `pass1_build_index`
    4) `pass2_make_read_plan` (LLM)
    5) `pass2_fetch_files` (bounded)
    6) `pass2_generate_outputs` (LLM)
    7) `validate_outputs` (schema + reconciliation)
    8) `upload_artifacts`
    9) `emit_result`
- Add a `State` object containing:
    - job payload
    - resolved_commit
    - repo_index
    - read_plan
    - file_contents_map (bounded)
    - generated artifacts
    - local paths + s3 paths
    - coverage bookkeeping

**Acceptance criteria**
- You can run the graph from `main.py` deterministically and get the same behavior as the linear flow.
- Stages map cleanly to `stage` values in failure output.

### 1.2 — Pass 2 Read Plan (Locked behavior)

**Work**
- Implement Pass 2 “read plan” as a bounded selection pipeline:
    - input: `repo_index.json` (and optionally `read_plan_suggestions` as a hint, not authority)
    - LLM produces a list of file paths to read (max 120 default)
    - enforce `max_total_chars ~ 250k` during file fetching (hard cap)
- If LLM requests a file not in index:
    - record it in uncertainties + `files_not_read` with reason `not_in_repo_index`
- Ensure selected files are deterministic-ish:
    - use deterministic pre-suggestions as fallback if LLM fails
    - always record final chosen list

**Acceptance criteria**
- `files_read` list reflects actual files fetched.
- Bounded read enforcement works even if LLM asks for too many files.

### 1.3 — File Fetch Worker (Pass 2 streaming)

**Work**
- Build a “fetch selected file contents” function:
    - reads from local cloned repo
    - returns content as UTF-8 with replacement
    - enforces:
        - max chars per file (optional)
        - max total chars across all files
    - records `files_not_read` reasons:
        - exceeds total char cap
        - decode issues
        - missing file on disk (rare but possible)
- Do not fetch skipped files from Pass 1.

**Acceptance criteria**
- Coverage counts are accurate:
    - `coverage.files_scanned` = from Pass 1
    - `coverage.files_read` = actual fetched
    - `coverage.files_not_read` = included-but-not-read, with reasons

### 1.4 — Pass 2 Semantic Generation (Architecture + Gaps + Onboarding)

**Work**
- Implement the single-pass LLM generation that outputs:
    - `ARCHITECTURE_SUMMARY_SNAPSHOT.json`
    - `GAPS_AND_INCONSISTENCIES.json`
    - `ONBOARDING.md` (optional on by default for v0.1)
- Hard constraints enforcement:
    - responsibilities must be grounded in evidence; else “unknown” + uncertainty
    - dependencies must reconcile with Pass 1 literal imports
- Add `evidence_paths` for each module (must be subset of `files_read`)
- Populate `files_read` and `files_not_read` arrays in snapshot JSON.

**Acceptance criteria**
- Snapshot JSON is spec-valid and self-auditing.
- Every module has `evidence_paths`.
- `dependencies` are consistent with Pass 1 imports (or flagged as mismatch in gaps).

### 1.5 — Reconciliation + Validation Layer (Critical)

**Work**
- Implement a strict validation step before upload:
    - JSON schema validation (Pydantic models or jsonschema)
    - reconcile that:
        - evidence paths ∈ files_read
        - dependencies are subset of Pass 1 imports across evidence files (or explicitly flagged)
        - module paths exist in index (or flagged)
- If validation fails:
    - `ok=false`
    - stage `validate`
    - error code includes a stable reason (e.g., `SNAPSHOTTER_FAILED_VALIDATE_SCHEMA`)

**Acceptance criteria**
- Bad LLM output cannot silently upload; it fails loudly with actionable diagnostics.

### 1.6 — Upload + Final Result Contract (Locked)

**Work**
- Upload exactly these artifacts (v0.1):
    - `repo_index.json`
    - `artifact_manifest.json`
    - `ARCHITECTURE_SUMMARY_SNAPSHOT.json`
    - `GAPS_AND_INCONSISTENCIES.json`
    - `ONBOARDING.md` (if enabled)
- Ensure S3 key layout matches:
    - `{s3_prefix}/{repo_slug}/{timestamp_utc}/{job_id}/...`
- Ensure `artifact_manifest.json` includes sha256 for each artifact.
- Print one final result JSON exactly matching the spec (no extra keys).

**Acceptance criteria**
- Output JSON includes only the spec fields.
- `artifacts` contains S3 URIs for each file actually uploaded.
- All uploaded objects satisfy SSE=AES256.

## Sprint 2 — Observability, Hardening, and “No Surprises” Reliability

### 2.1 — Structured Logging + Stage Diagnostics

**Work**
- Add structured logs per stage:
    - bytes included
    - file counts
    - skip reasons histogram
    - read plan summary
    - upload summary
- Add a `stage` variable that is updated consistently (already started)

**Acceptance criteria**
- A failure report tells you exactly what failed and why without reading code.
  md
  Copy code
### 2.2 — Test Suite (Minimum viable but meaningful)

**Work**
- Add small unit tests for:
    - deny regex matching (search vs match)
    - binary detection skip
    - bounds enforcement (`max_files`, `max_total_bytes`)
    - read plan enforcement (caps)
- Add an integration test mode:
    - `SNAPSHOTTER_DRY_RUN=true` produces local artifacts and validates schemas
- Add “policy test” reminder (you already have the S3 policy test script elsewhere)

**Acceptance criteria**
- Tests can run locally and on Replit.
- Dry-run produces fully validated artifacts without S3 access.
  md
  Copy code
### 2.3 — Docs + Operator Workflow

**Work**
- Update `replit.md` to reflect:
    - job payload usage
    - artifact list (no tarball)
    - required env vars (AWS + any LLM secrets)
    - dry-run workflow
- Add a “How to run a scan for fruitful-lab repo” snippet.

**Acceptance criteria**
- A new operator can run a scan with copy/paste commands.
  md
  Copy code
## Work Breakdown (Mapping to your current code)

### Immediate edits to current repo (high priority)
- Remove tarball code path from `main.py` (and result contract / manifest / hashes)
- Fix `pass1.py` deny regex (`search` not `match`)
- Add `.env` to deny patterns
- Add binary detection skip + reporting
- Fix `max_files` termination
- Replace env-based job as primary with single JSON payload parsing

### New modules to add
- `snapshotter/graph.py` (LangGraph nodes + state)
- `snapshotter/pass2.py` (readplan + file fetch + LLM generation wrapper)
- `snapshotter/validate.py` (schema + reconciliation validators)
- `snapshotter/models_pass2.py` (Pydantic models for output validation)
  md
  Copy code
## Final Sprint Exit Checklist (Release Gate)

- [ ] Tarball removed everywhere
- [ ] Single job payload is authoritative
- [ ] Pass 1 produces deterministic repo_index + manifest
- [ ] Pass 2 reads bounded files and produces all semantic artifacts
- [ ] Snapshot + gaps outputs validated and reconciled against Pass 1
- [ ] S3 uploads succeed with AES256 SSE
- [ ] Printed result contract matches locked spec exactly
- [ ] Dry-run path produces fully validated artifacts without upload
- [ ] Replit docs updated