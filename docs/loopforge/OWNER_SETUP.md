# Enable the first live narration test

The simulation and both presentations work without this setup. The owner has
approved a $1 total model-testing allocation. No additional model-spend approval
is needed within that cap. No paid calls have yet been made.

## Already prepared

- The server adapter, evidence validation, access gate, shared spending reservation,
  output provenance, fallback behavior and evaluation runner are implemented.
- Vercel project: `fruitful-lab`, team `stepan-oskins-projects`.
- Preview-only budget: `LOOPFORGE_BUDGET_MICRO_USD=1000000`.
- Stable allocation ID: `LOOPFORGE_BUDGET_ID=lf-initial-2026-10-03`.
- An existing `OPENAI_API_KEY` is visible by name in Preview settings. Its value
  was not revealed. It may already be usable; verification is pending.
- The owner approved the Upstash terms. The free `loopforge-preview-quota` store
  is provisioned in `iad1`, eviction disabled, connected to Preview only with
  prefix `LOOPFORGE`. Its native REST variables are accepted by the adapter.

## Owner setup completed

- The owner added `LOOPFORGE_DEMO_ACCESS_CODE` as a **Secret**, scoped to
  **Preview only**, and redeployed. Its presence and scope were verified in
  [Vercel environment variables](https://vercel.com/stepan-oskins-projects/fruitful-lab/settings/environment-variables).
  The private import file is `/tmp/loopforge-private-setup.env` with owner-only
  permissions. Its value is not in this repo. Enter that code in the demo;
  never enter the OpenAI API key in the demo.
- Complete publication to the public `stepan-o/fruitful-lab` repository and a
  reviewable hosted preview are approved. No setup approval remains pending.
- Only if the existing OpenAI key fails verification, replace it with a dedicated
   project key with Responses API permission and available API credits. That
   credential entry is also a user step. No key rotation is required speculatively.

The agent handles publication, redeployment, availability and
real-request verification, replay isolation, the evaluation run and report. Human
faithfulness/voice judgments remain explicit; a successful API call is not an
evaluation score. A replacement quota store must preserve the original spending
record before reuse; an empty new store must not silently create a second $1 cap.

References: [Vercel environment scoping](https://vercel.com/docs/environment-variables),
[Upstash persistence](https://upstash.com/docs/redis/features/durability),
[eviction](https://upstash.com/docs/redis/features/eviction),
[current free-plan limits](https://upstash.com/pricing/redis).
