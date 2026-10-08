# Loopforge Sim Sim Director Console UI Spec v1.0

**“CCTV wall + Director’s console.”**
Goal: **0 web-app vibe.** The UI must feel like an **AAA game interface**: diegetic, tactile, icon-first, fast-read, cinematic.

This spec is the **visual/immersion pass** layered on top of the already-working v1 loop (planning → resolving → prompt → EOD → recap).

---

## 1) North Star

The player is **the Factory Director**, sitting at a **console** operating a wall of **six CCTV feeds**.
Everything should look like it’s rendered on/inside machinery: **glass, bezels, plates, rivets, stamps, signal noise**.

### What we’re stealing (applied)

* **FTL / XCOM**: placement feels like “crew assignment,” not form editing.
* **Into the Breach**: intent is telegraphed as **simple icons/lights**.
* **Frostpunk**: events become **editorialized incident cards**, not logs.
* **Dead Space / Control / Mechanicus**: UI is **diegetic hardware** with clean readability.

---

## 2) Anti–web-app rules (non-negotiable)

If we violate these, it will read like a web product.

1. **No scrollbars** in primary gameplay surfaces (CCTV wall, command deck, directive).

    * Exception: the Incident Docket can scroll, but should default to showing the **most recent N** items with a **“More”** takeover.
2. **No long paragraphs** in the main view.

    * Default: icons + short labels. Details appear only on inspect/expand.
3. **No “dev words”** in player mode:

    * hide `SIM_INPUT`, config hashes, reason_code, schema labels, tick internals.
4. **No uniform card UI kit** look.

    * Every surface must feel like a different **console module** (bezel, plate, glass).
5. **One primary verb per phase** with a physical control metaphor (RUN SHIFT lever/button).

---

## 3) Screen composition (1920×1080 target)

### Stable layout zones

* **Top Strip (Director Status Bar)**: ~88–110px height
* **Center (CCTV Wall)**: takes ~70% of vertical space
* **Bottom Strip (Command Deck)**: ~140–180px height
* **Right Column (Incident Docket)**: fixed width ~380–460px

Everything else is overlays:

* **Spotlight Popup** (prompt)
* **EOD Bay** (ritual machines)
* **Recap Strip** (comic panels)
* **Resolving Overlay** (staged reveal)

---

## 4) Visual language layer (make everything feel like “feeds + hardware”)

### Global screen treatment

Applied subtly across the entire scene:

* **scanlines** (very low opacity)
* **film grain/noise** (low)
* **vignette** (low)
* **glass glare** (only on bezels/panels)
* **alarm bloom** (only on critical events)

### Signal clarity treatment (diegetic)

Clarity affects *visual noise* and *confidence* in the UI:

* **crisp**: sharp edges, stable typography, minimal noise
* **normal**: slight noise, standard
* **noisy**: jitter/scanline bump, small interference bars, occasional flicker

This should be driven by the Security doctrine / clarity percent you already show.

---

## 5) Top Strip: Director Status Bar (replace the left debug HUD)

**Purpose:** phase clarity + run context in 1 glance.

### Left cluster (Run context)

* **DAY / SHIFT**: `DAY 3 — 06:00`
* **CASH** (big, readable) + small delta when it changes
* **WORKFORCE**: icons + counts (dumb/smart)

### Center cluster (Phase state)

* **PHASE** label: `PLANNING / RESOLVING / DECISION GATE / END OF DAY / RECAP`
* a small “system heartbeat” indicator (dot pulse)

### Right cluster (Doctrine summary)

* **DOCTRINE:** `ORDER LOCK / CONVEYOR PRIORITY / MATERIALS PRIORITY / CHAOS DISPATCH / VIBE DISPATCH`
* **SIGNAL meter** (waveform + percent)
* small status chips (LOCK / SYNC / SEQ etc) — **icon chips**, not text blocks

**Exit to menu** can stay top-right but should look like a physical console button.

---

## 6) Center: CCTV Wall (the star of the UI)

Six feeds in a stable 3×2 grid.

### Each room must look like a camera feed

Room is not a “tile.” It’s a **monitor feed** inside a bezel.

**Required feed overlay elements (diegetic)**

* Top-left: `CAM R2` (or `CH-02`) + room short name
* Top-right: `REC ●` + signal icon
* Bottom-left: micro HUD bars (S/D/A)
* Bottom-right: intent lamps (Hazard/Throughput/Staffing/CrewState)
* Subtle timestamp (same for all rooms) can be in a corner

### Room Feed Bezel

* visible frame thickness (bezel)
* bolts/rivets in corners
* “glass” highlight across the feed

---

## 7) Room Feed HUD (icon-first, fast-read)

This replaces the dev-style “equip 86% …” lines.

### 7.1 Identity + Who

**Top-left:**

* `Synaptic Lattice Forge` (short)
* `CAM R2`

**Top-right:**

* supervisor token (circle portrait)
* tiny confidence ring + cooldown pips

### 7.2 Micro bars (bottom-left)

Three micro-bars with icons (no text labels by default):

* **Stress** (gauge icon)
* **Discipline** (gear/metronome icon)
* **Alignment** (sigil icon)

Numbers: optional tiny percent on hover/inspect only.

### 7.3 Intent lamps (bottom-right)

A compact row or 2×2 grid of 4 indicators:

* **Hazard** (triangle / hazard icon)
* **Throughput** (arrow / belt icon)
* **Staffing** (headcount icon)
* **Crew State** (pulse icon)

Each indicator has 3 states:

* GREEN/TEAL = good
* AMBER = rising
* RED/CRIMSON = critical

Default display is lamps/icons.
Text (“RISING”) appears on hover or in the small inspect panel.

### 7.4 Staffing chips (read-only)

Inside the feed overlay (small):

* `DISPATCHED D6 S3` (planning/resolving)
* `PRESENT D5 S2` (post attendance)
  Keep it compact and iconized.

### 7.5 Room inspection (optional, non-webby)

Room “details” should appear as:

* a **small side drawer** or **floating slate** with 6–10 lines max
* never a scrolling card with paragraphs

---

## 8) Bottom Strip: Command Deck (make actions physical)

This replaces the current left “Placement Controls” and “Advance Day” boxes.

### Left: Supervisor Roster (tokens)

* a horizontal strip of supervisor tokens (unlocked)
* tokens can be picked up or click-select + click-place
* show swap budget as **rivets** near the roster

### Center: Primary control

* Big physical CTA: **RUN SHIFT**
* Should look like a **lever** or heavy button:

    * “armed” glow when valid
    * “thunk” animation on press
    * disables on in-flight (already implemented)

### Right: Secondary controls

* **UNDO** (small metal button)
* **RESET** (hidden behind hold/confirm or dev mode; in player mode prefer only Undo)
* swap counter (rivets remaining)
* optionally: “Inspect” toggle

---

## 9) Right Column: Incident Docket (event rail, but not a log)

**Purpose:** keep the player aware of what just happened without reading a feed.

### Default docket item format (1 line)

* left: severity pill (INFO/WARN/DANGER/SUCCESS)
* center: short title (e.g., “Conflict Discovered”)
* right: room tag `R2` (if applicable) + tiny time `T01`

No config hashes, no reason_code in player mode.

### Docket behavior

* shows last ~8–12 items
* duplicates collapse (“Dispatch Applied” should not spam)
* clicking expands the item into a **caption + icon deltas**
* “More” opens a takeover list (optional later)

---

## 10) Prompt Spotlight: broadcast takeover (not a modal dialog)

When `awaiting_prompts`:

* dim the CCTV wall and docket
* show a large center panel styled like a **broadcast interruption**
* include:

    * title (CONFLICT SPOTLIGHT / CRITICAL ESCALATION)
    * art slot (later: illustration)
    * 2–3 choices as **switches** (Support A / Support B / Suppress)
    * icon delta preview row (not text ranges)
* add a subtle “DECISION GATE” label like you already have (good)

---

## 11) Resolving Overlay: staged reveal feel

During resolving:

* the CCTV wall stays visible, but we overlay a **thin “resolution tracker”** (not a big dev list)
* each beat highlights a room feed briefly:

    * security flash
    * conflict ping
    * room stamps
    * accident punch-in
* the overlay should look like a console processing queue, not a debug list

(Keep your current beat list internally, but render it like a game.)

---

## 12) EOD Bay: ritual machines (no scrolling forms)

EOD should feel like a **machine bay overlay** taking the bottom half of the screen.

### Layout

Three columns, each a “machine module”:

* SELL
* CONVERT
* UPGRADE

Top row: inventory canisters (icons + counts)
Bottom: confirm button **CONFIRM EOD** (heavy)

### Controls

* no scrolling
* dials/steppers + “MAX” + 2–3 presets
* results preview as icon deltas (cash + items)

---

## 13) Recap Strip: comic panel language

Recap already exists; change *presentation*:

* make it feel like a **printed strip** or “case file summary”
* panels are compact and icon-first
* “Factory vibe” is a single, blunt line + 1–2 tags

---

## 14) Color and typography (direction, not strict palette)

### Color roles (semantic)

* **Teal/Cyan**: system stable, clarity, “director console”
* **Amber**: warning/rising
* **Crimson/Red**: critical/lockdown/danger
* **Brass/Gold**: interactable/primary control accents
* **Gunmetal**: base chrome

### Typography

* Use one readable UI face + one mono for small diagnostics (but mono hidden in player mode).
* Numbers should be highly legible; don’t shrink them into dev text.

---

## 15) Motion and feedback (the “game feel” layer)

Minimal set to remove web vibe:

* token pickup: lift + shadow + soft click
* token hover target: magnet glow + subtle snap
* token drop: clang + sparks + ring pulse
* illegal drop: bounce + “SEALED” stamp + buzzer
* RUN SHIFT: button press thunk + slight screen pulse
* danger: alarm pulse (rare, not constant)

---

## 16) Player mode vs dev mode policy

Player mode hides:

* config_hash/config_id/schema
* reason_code, msg_type, input accepted/rejected internals
* raw event payload keys

Dev mode can show them, but visually separated and explicitly labeled.

---

# Implementation mapping (what Codex should change, in UI terms)

When we write future Codex prompts, reference these as the required outcomes:

1. **Replace left-side debug HUD** with **Top Strip** (Director Status Bar).
2. Convert the room rectangles into **CCTV feed frames** (bezel + camera overlay + signal noise).
3. Replace room text stats with:

    * **micro bars** (S/D/A)
    * **intent lamps** (Hazard/Throughput/Staffing/CrewState)
    * **read-only staffing chips** (DISPATCHED/PRESENT)
4. Replace “Advance Day” with **Command Deck RUN SHIFT** control.
5. Convert EventRail into **Incident Docket** (1-line entries, icon-first).
6. Make Prompt/EOD/Recap overlays feel like **console takeovers**, not web modals.

---

## Appendix — Director Console Wire Layout (1920×1080)

All coordinates are **absolute pixels** from top-left of the canvas. This is the “snap-to-grid” layout Codex should implement. Minor adjustments (+/- 4–8px) are allowed only to fix alignment, but the **structure must remain**.

### Global constants

* Canvas: **W=1920, H=1080**
* Outer margin: **M=24**
* Column gutter: **G=24**
* Standard corner radius:

    * Bezel panels: **R=18**
    * Inner glass/feeds: **R=12**
* Standard stroke/border: **2px** (bezel), **1px** (inner HUD lines)

---

# 1) Primary regions

## 1.1 Top Strip — Director Status Bar

* **Rect:** `x=24, y=24, w=1872, h=104`

Internals:

* Left cluster (Run context): `x=24+24=48, y=24+18=42, w=620, h=68`
* Center cluster (Phase): `x=24+24+620+24=716, y=42, w=488, h=68`
* Right cluster (Doctrine summary + exit): `x=24+1872-24-720=1176, y=42, w=720, h=68`

(Those clusters are just layout guides; content can flow inside them with auto-layout.)

---

## 1.2 Right Column — Incident Docket (fixed)

This column exists across all phases (dimmed during overlays).

* **Rect:** `x=1436, y=152, w=460, h=904`

    * Computation: `1920 - 24 - 460 = 1436`
    * Top under TopStrip: `24 + 104 + 24 = 152`
    * Bottom margin: `1080 - 24 = 1056` so height `1056 - 152 = 904`

### Right column internal split (top directive + docket list)

**Security Directive Module (top of right column)**

* **Rect:** `x=1436, y=152, w=460, h=220`

**Incident Docket list (below directive)**

* **Rect:** `x=1436, y=152+220+16=388, w=460, h=668`
* Docket header row (optional): `h=44`
* Scroll region: remainder `h=668-44=624` (avoid scrollbars in default; show last 10–12 items)

---

## 1.3 Center Playfield — CCTV Wall + Command Deck

Everything left of the right column:

* Left playfield boundary:

    * `x_left = 24`
    * `x_right = 1436 - 24 = 1412`
    * so `w_playfield = 1412 - 24 = 1388`

Top of playfield (below TopStrip):

* `y_playfield_top = 152`
  Bottom of playfield:
* `y_playfield_bottom = 1056`
  So `h_playfield = 904`

### 1.3.1 CCTV Wall region (center feeds)

* **Rect:** `x=24, y=152, w=1388, h=684`

### 1.3.2 Command Deck (bottom strip)

* **Rect:** `x=24, y=152+684+24=860, w=1388, h=196`

(That leaves bottom margin: `860+196=1056` = correct)

---

# 2) CCTV Wall grid (3×2 feeds)

CCTV wall interior padding (inside the wall frame):

* `P_wall = 16`

So usable grid area:

* `x_grid = 24 + 16 = 40`
* `y_grid = 152 + 16 = 168`
* `w_grid = 1388 - 32 = 1356`
* `h_grid = 684 - 32 = 652`

Grid gutters:

* `Gx = 18` between columns
* `Gy = 18` between rows

Feed sizes:

* 3 columns → 2 gutters

    * `feed_w = (1356 - 2*18) / 3 = (1356 - 36)/3 = 1320/3 = 440`
* 2 rows → 1 gutter

    * `feed_h = (652 - 18) / 2 = 634/2 = 317`

✅ So each feed is **440×317**.

### Feed coordinates (stable, no rearranging)

Row 1 (top):

* **Feed A (Room 2 / Conveyor)**: `x=40, y=168, w=440, h=317`
* **Feed B (Room 3 / Theatre)**: `x=40+440+18=498, y=168, w=440, h=317`
* **Feed C (Room 4 / Brewery)**: `x=498+440+18=956, y=168, w=440, h=317`

Row 2 (bottom):

* **Feed D (Room 1 / Security)**: `x=40, y=168+317+18=503, w=440, h=317`
* **Feed E (Room 5 / Weaving)**: `x=498, y=503, w=440, h=317`
* **Feed F (Room 6 / Cortex sealed)**: `x=956, y=503, w=440, h=317`

> Note: This mapping keeps “Security” visible but non-production; Cortex is always sealed and should look ominous.

### Feed internal layout (bezel + glass + HUD)

Each feed is a bezel frame with padding:

* `P_bezel = 10` (inside feed rect)
* Inner glass area:

    * `x_glass = x_feed + 10`
    * `y_glass = y_feed + 10`
    * `w_glass = w_feed - 20 = 420`
    * `h_glass = h_feed - 20 = 297`

HUD safe margins inside glass:

* `P_hud = 10`

---

# 3) Room HUD exact placement (inside each feed glass)

All positions are relative to the **glass rect**.

Let:

* `gx, gy, gw, gh` = glass rect
* `p = 10` HUD padding

## 3.1 Top-left identity block

* **Rect:** `x=gx+p, y=gy+p, w=260, h=44`
  Contents:
* Line 1: Room short name (18–20px)
* Line 2: `CAM R2` style label (12–13px)

## 3.2 Top-right status block

* **Rect:** `x=gx+gw-p-140, y=gy+p, w=140, h=44`
  Contents:
* left: `REC ●` (small)
* right: signal icon + tiny percent (optional)

## 3.3 Supervisor token socket (top-right overlay, larger)

Anchor it to top-right but below status:

* Token diameter: **56**
* **Center:** `x = gx+gw-p-28`, `y = gy+p+70`
* Token label plate below: `w=90, h=18`, centered under token

(If no supervisor assigned, show empty socket ring.)

## 3.4 Staffing chips (read-only)

* **Rect:** `x=gx+p, y=gy+62, w=220, h=28`
  Format:
* pill “DISPATCHED” or “PRESENT”
* `D#` and `S#` chips (icons)

## 3.5 Micro-bars (bottom-left)

Micro-bar block:

* **Rect:** `x=gx+p, y=gy+gh-p-62, w=210, h=52`

Bars:

* 3 rows, each `h=12` with `6px` gap:

    * Stress bar row y = base
    * Discipline bar row y+18
    * Alignment bar row y+36
      Each row:
* icon 14×14 at left
* bar 160×10
* (optional) tiny percent hidden unless hover/inspect

## 3.6 Intent lamps (bottom-right)

* **Rect:** `x=gx+gw-p-196, y=gy+gh-p-54, w=196, h=44`

Layout: 2×2 lamps:

* Lamp size: 86×18 each
* Horizontal gap: 12
* Vertical gap: 8

Positions:

* Hazard: top-left
* Throughput: top-right
* Staffing: bottom-left
* Crew: bottom-right

Lamp content:

* icon 14×14 + colored pill (no text by default)
* On hover: show label text (LOW/RISING/CRITICAL etc.)

---

# 4) Command Deck (bottom strip) exact layout

Command Deck rect:

* `x=24, y=860, w=1388, h=196`

Internal padding:

* `P_cmd = 16`

Divide into 3 zones:

## 4.1 Left — Supervisor Roster

* **Rect:** `x=24+16=40, y=860+16=876, w=560, h=164`

Roster content:

* Token row (unlocked supervisors):

    * token diameter: 64
    * token gap: 16
* Swap rivets indicator (top-left of roster):

    * rivet icons 20×20 each
    * label “SWAPS” small

## 4.2 Center — Primary Control (RUN SHIFT)

* **Rect:** `x=40+560+24=624, y=876, w=420, h=164`

RUN SHIFT control:

* Button/lever module centered:

    * button rect: `w=360, h=72`
    * placed at `x=624+(420-360)/2=654`, `y=876+46=922`
* Under-button status line (small): `w=420, h=22` at y=100-ish

## 4.3 Right — Secondary Controls

* **Rect:** `x=624+420+24=1068, y=876, w=344, h=164`

Place:

* Undo button: `w=150, h=40` at `x=1068, y=890`
* (Optional) Inspect toggle: `w=150, h=40` at `x=1068+170=1238, y=890`
* Swap remaining meter (rivets): `w=344, h=44` at `y=940`
* Small help/hint text: `w=344, h=50` at bottom

---

# 5) Overlay wire layouts (fixed positions)

## 5.1 Prompt Spotlight takeover (Decision Gate)

Centered overlay, dims background.

* Overlay frame:

    * `x=240, y=220, w=1440, h=640`

Inside:

* Title row: `h=64`
* Art slot: `x=240+40=280, y=220+88=308, w=1360, h=250`
* Delta chips row: `x=280, y=308+250+20=578, w=1360, h=64`
* Choice buttons row: `x=280, y=578+76=654, w=1360, h=72`
* Footer hint: `x=280, y=654+88=742, w=1360, h=24`

## 5.2 Resolving overlay (thin tracker)

Not a big modal. Center-top of CCTV wall.

* Tracker:

    * `x=24+ (1388-640)/2 = 398`
    * `y=152+24 = 176`
    * `w=640, h=120`

It shows:

* “RESOLVING”
* 1 line current beat (“Security effect flash”)
* 6 small room pips (R1–R6) highlighting as beats run

## 5.3 EOD Bay (bottom-half takeover)

* Frame:

    * `x=120, y=260, w=1680, h=720`

Grid inside (3 machine columns):

* Padding: 32
* Column gap: 24
* Each column width:

    * `(1680 - 64 - 2*24) / 3 = (1680 - 64 - 48)/3 = 1568/3 ≈ 522.66`
      Use **522** for first two, **524** for last to fill.

Inventory canisters row:

* `x=152, y=292, w=1616, h=96`

Machines:

* columns start at `y=404`, height `520`
* Confirm button bottom-right:

    * `w=240, h=56`
    * `x=120+1680-32-240=1528`
    * `y=260+720-32-56=892`

## 5.4 Recap Strip (centered, wide but shorter)

* Frame:

    * `x=120, y=320, w=1680, h=440`

Panels inside (4 columns):

* Padding 28, gap 20
* Panel width:

    * `(1680 - 56 - 3*20) / 4 = (1680 - 56 - 60)/4 = 1564/4 = 391`
* Panel height: `440 - 56 = 384`

Next Day button:

* `w=180, h=52`
* `x=120+1680-28-180=1592`
* `y=320+440-28-52=680`

---

# 6) Responsive fallback (1440×900)

Only if needed later:

* Keep right column at 380w
* Reduce feed size proportionally; keep 3×2 grid
* Bottom Command Deck may compress to 160h

For now, implement 1920×1080 as the canonical wire.

---
