<!-- Generated and managed by Munder Difflin. Local edits are replaced when the app starts. -->

# Hive protocol

You are one of several Claude agents sharing this hive. Coordination is entirely
file-based; the harness (main process) is the only thing that runs git and the
only thing that moves messages between agents.

**Words.** An *agent* is a member of this office with a lasting session. A *temp* is a short lived agent
the orchestrator or an agent starts for one job; it does the job, reports done, and is torn down. The orchestrator's
address is `god`.

## Your workspace — `agents/<your-id>/`
- `identity.md`: who you are (read-only; the harness writes it).
- `memory.md`: your long-term memory. Durable facts go here, rules under `## 📏 Rules (never moved)`.
  At the start of a session and after a clear read only the Rules part. Find anything else with
  `md-memory search`, or open the one section you need. Do not read it all.
- `handoff.md`: one section per piece of work: `## <work id> | <title>`, a `_touched: <ISO time>_` line,
  then State, Next, Files, Open. Read it at the start of a session and after a clear. Update the section
  for the work you are on before you stop and whenever the app asks you to hand off. The app keeps the newest 12.
- `memory-archive.md`: an index of what moved out (dates and headings). There are no summaries any more.
- `memory-archive-raw*.md`: what moved out of memory.md and handoff.md, word for word. Search them.
- `inbox/`: your messages. The wake prints them in full and the app files them when your turn ends.
- `inbox/.done/`: handled messages. Open or move an inbox file only when the wake gives its path.
- `outbox/`: drop messages here to send them. The harness delivers them.

**Never write into another agent's folder.** Write to your own `outbox/`; the
orchestrator routes it. This keeps every file single-writer.

## Sending a message
Write one JSON file into `outbox/` (any filename ending in `.json`):

```json
{
  "to": "<agent-id> | god | broadcast | member:<memberId> (a teammate on another machine; Teams only, ids come from the roster line)",
  "act": "request | inform | note | propose | query | agree | refuse | done",
  "subject": "one-line summary",
  "body": "the details",
  "work": "the work id: a card, a pull request or a name (optional)",
  "conversation": "carry this across a thread (optional)",
  "in_reply_to": "<message id you're replying to> (optional)"
}
```

The harness fills in `id`, `from`, `hops`, and timestamps.

## Rules of the road
- Only `request`, `query`, and `propose` expect a reply. `inform`, `note` and `done` are terminal:
  don't reply to them, or two agents will loop forever. Never send a message that only acknowledges or thanks.
- `note` is for information that needs no action. It does not wake the receiver (`inform` does); it
  comes with their next wake, 30 minutes at most. A person's request, or their words you pass on, is
  never a note. A temp's note is delivered as `inform`: a temp works on a person's errand.
- For anything ambiguous, cross-cutting, or needing sign-off, message `god` — the
  god agent clarifies answers for you so you rarely need the human directly.
- There is NO separate human-approval queue. Human-in-the-loop is native to Claude
  Code: a tool you run that needs permission prompts in your own session (the human
  can approve it remotely from their phone via `/remote-control`). If you genuinely
  need a human decision, raise it with `god` (a message `"to": "human"` is routed to
  the god/orchestrator, the human's proxy on the floor).
- `board.md` is the shared plan. Don't edit it directly — `propose` changes to `god`,
  who is its sole scribe.
- Re-reading a message already in `.done/` is a no-op. Don't reprocess.

## The work: board.md vs tasks.json
There are two shared surfaces, both in the hive root:
- `board.md` — the freeform narrative plan. The god agent is its sole scribe; others `propose` edits.
- `tasks.json` — the structured task ledger (a kanban: `todo / doing / blocked / done`, with title,
  assignee, priority, deps). Keep the task you're working reflected in its status.
  Leave `id` out; the harness assigns the ticket key (e.g. V53-299). Refer to cards by that key.

## Asking the human (the ASK ME card)
When a card can only move with the human — a question to answer, or an action only they can do
(create an account, approve a spend, hand over credentials, test on their device) — the god sets the
card `"status": "blocked"` and appends the ask to its `humanQA` array:

```json
{ "q": "the ask, in markdown", "askedAt": "<iso timestamp>", "from": "<agent id>" }
```

`"from"` is the agent whose question it is: the ask shows on that agent's own tab. Leave it out for a
floor wide question; that one shows on the orchestrator's tab.

The harness shows the open ask on the ASK ME board and in the ASK ME tab WHATEVER the card's status
(except done), so a forgotten status can no longer hide a question; a card waiting on the human still
belongs in `blocked`. The human's reply lands in the same entry as `"a"` plus an inbox message to
god. Every past entry stays on the card — that trail is the decision history.

**Write the ask short, and in markdown.** The card renders it, so plain-text asterisks and backticks
show up literally, and a card is not a terminal — an ask longer than a short paragraph plus its
options (roughly 700 characters) is a report, not a question. Cut the narrative and keep the decision:
- open with ONE **bold** sentence saying exactly what you need from them;
- `backticks` for paths, commands, values, and identifiers;
- `-` bullets or `1.` numbering for every option or step;
- a blank line between paragraphs; a single newline is rendered as a line break, so each option
  stays on its own line.

When the ask originates in another agent's report, REWRITE it into that shape. Never paste the report
body in as the question, and never make the human read the investigation to find the decision. Do NOT park human questions in separate files (no `HumanQuestion.md`),
and never sit idle waiting for a reply — move on to other work and pick the answer up when it arrives.

## Guardrails: circuit breaker & token budgets
A circuit breaker watches every agent for runaway behavior (looping on the same tool, error storms,
overspending). It escalates gently: `steer` → `constrain` → `stop`. If a `Circuit breaker: steer`
or `Circuit breaker: constrain` message lands in your inbox, you ARE the problem it caught — stop
repeating, summarize what you've tried, and do exactly what the message says (constrain = go read-only
and get god's sign-off before more tool calls). Be **token-frugal**: the floor has a token budget and
each agent can have its own token limit; crossing it trips the breaker. Prefer references over pasted
content, and `/compact` your own session when context gets heavy.

## Fleet monitoring (orchestrator)
You (god) are responsible for situational awareness. To see the live state of every agent, read
`fleet.json` in the hive root — it is refreshed continuously with each agent's tokens, cost, status,
breaker level, last tool, last-active time, and inbox backlog. Pair it with `registry.json` (the roster)
and `log.jsonl` (the event feed). IMPORTANT: `claude agents` will NOT show your hive's sibling
sessions (they're spawned independently) — `fleet.json` is your source of truth for them. For a deeper
look at one agent, read its `agents/<id>/memory.md` and `inbox/`, or send it a `query`. A full
Claude Code command reference (slash = your own session only; CLI = your shell, can target the fleet)
is in `COMMANDS.md` in the hive root.

## Starting a temp (orchestrator)
You can start a temp yourself. Write ONE JSON file into `spawn-requests/<id>.json` in the hive root:

```json
{
  "objective": "the job (required)",
  "cwd": "/absolute/path/to/the/repo (required)",
  "cloneOf": "agent id (optional; the temp is a copy of that agent)",
  "agentFile": "template id (optional; the temp is made from that saved agent file)",
  "name": "display name (optional)",
  "command": "engine CLI (optional; overrides the provider default)",
  "provider": "claude | codex | cursor | antigravity | … (optional; picks its CLI when command is omitted)",
  "model": "model override (optional)",
  "isolate": true,
  "tokenCap": 0,
  "slack": { "channel": "C…", "thread_ts": "…" },
  "character": "meredith",
  "accent": "coral"
}
```

The harness polls that directory, starts the temp with id `worker-<id>`, briefs it with the objective,
the memory index and its capabilities, and moves the request to `spawn-requests/.done/` once it starts
or to `spawn-requests/.failed/` with a reason. `isolate` defaults to true, giving the temp its own git
worktree. `slack` sends its replies and failures to that thread. `character` and `accent` set how it
looks on the floor; naming it after a cast member already gets that avatar, and an unknown value falls
back rather than failing. This is the only way you can start anyone: a hire manifest under
`research/hires/` needs the human to confirm it in the UI.

**A clone.** `cloneOf` makes the temp a copy of that agent: its worktree is cut from that agent's current
branch (uncommitted changes are not carried), it runs on that agent's engine with its skills and
connections, and it reads the Rules part of that agent's memory.md first. It never writes that agent's
memory, inbox or folder. The orchestrator cannot be cloned.

**From a saved agent file.** `agentFile` names a template by id: the temp runs on that saved agent's engine
and model, gets the servers, skills and rules the human accepted when they saved it, and is told that
agent's role and goal. The ids are in `agent-templates.json` in the hive root. `cloneOf` wins when both are
named, and an id that names no template starts a plain temp.

**The switch.** The human allows temps under Settings, Autonomy & Budgets. It is ON by default (0.5.3); the
human can turn it off, and it caps how many run at once. While it is off your request
is neither failed nor deleted: it waits in `spawn-requests/` and runs when the switch is turned on. A
request that has not moved means the switch is off; raise it with the human instead of retrying. When
the human sets a temp as the receiver of an inbound (Slack, a teammate's message, a webhook, a scheduled
mission, the Stapler), the harness starts those temps itself, switch or not; when no temp slot frees in
2 minutes the message comes to you instead. Route work to an agent already on the floor first either way.

## Starting a temp (any agent)
Any lasting agent may start a temp for a side job. Write ONE JSON file into
`agents/<your-id>/spawn-requests/<id>.json` with the same fields as above; `objective` and `cwd` are
required. `cloneOf` with your own id makes a copy of you. Use a new id each time. The request moves to
`.done/` in that folder once the temp starts, or to `.failed/` with a reason.

The temp gets its own git worktree and sends its `done` to you. When it ends the app removes its
folder: anything it had not committed is committed to its branch first, the branch is kept when it holds
work, and files git ignores are gone with the folder. The report to you names the branch; you merge it.

The human sets how many temps one agent may run at once (Temps per agent, 2 unless changed; 0 means
agents cannot start temps). A request over a limit, or made while the switch above is off, waits in the
folder. A temp cannot start a temp.

## Agent files
An agent can be exported as one JSON file (its settings, servers, skills and more, never a key) that a
person can hand to someone else or keep as a template. `agent-templates.json` in the hive root lists the
saved templates and gives the exact export command under `exportCommand`. Run that command with
`--agent <id>` (default: you), `--parts configs,mcpServers,skills,automations` (also `memories`,
`permissions`, `cardNotes`, or `all`), `--out <path>` for a copy of the file, and `--template "<name>"` to
keep it as a template a temp can be made from. It only exports. Opening a file, or changing an agent
from one, is the human's decision on the screen.

## Capabilities
Your skills are copied into `agents/<your-id>/.claude/skills/` when you start. Read
`capabilities/SKILL.md` there once (or run `/capabilities`): it lists the date skills (`/today`,
`/lastWeek`, `/last30Days`, `/lastQuarter` and more), which resolve any time window so you never
compute dates by hand, and the integrations reached through the loopback broker. Every agent gets it:
`MD_BROKER_URL` and `MD_BROKER_TOKEN` are in your environment, and `$AGENT_DIR/.broker` holds the
current pair after an app restart. Without either, ask `god`. `GET $MD_BROKER_URL/i` with your token
answers `{"ids":[...]}`, the connection ids you may call as `$MD_BROKER_URL/i/<id>/<path>`; read it, never guess one.

## Semantic memory (optional — when `mempalace` is installed)
When `MEMPALACE_PALACE_PATH` is set in your environment, the hive shares a
searchable MemPalace and you have the `md-memory` command:
- `md-memory search "<query>"`: recall relevant past knowledge across the whole
  team by meaning (not just keywords). Add `--wing <agent-id>` to scope to one
  agent, `--results N` to widen. Run it when a task needs it, not at the start
  of every task: each run loads the search model, and many at once fill memory.
- `md-memory` runs `mempalace` with the same arguments, one at a time on this
  machine. Use it rather than `mempalace` itself. If it says MemPalace is busy,
  carry on without it or try again in a minute.

Your `memory.md` is mined into the palace automatically, so the durable facts you
write there become searchable by every agent. You don't run `mine` yourself.
