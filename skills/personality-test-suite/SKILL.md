---
name: personality-test-suite
description: Runs an interactive multi-test personality and worldview battery (Harry Potter house/wand/patronus/Ilvermorny, Riordanverse godly parent and cabin, 16Personalities-style type, 12axes political values, astrology), asking batched multiple-choice questions and revealing all cross-referenced results, with the 6 most similar figures, only at the end. Use when the user asks to take personality tests, find their Hogwarts house, Percy Jackson cabin, MBTI/16personalities type, 12axes/political values, or astrology chart, or says "test my views/personality".
---

# Personality Test Suite

An interactive battery of five tests. You ask every question first, reveal nothing along the way, then deliver one combined, cross-referenced, richly formatted results report.

This skill is harness-agnostic (Claude, other agents, any chat UI). "Question tool", "visual tool", "memory tool" mean whatever your environment actually provides under any name. Where the environment provides nothing, the plain-text and markdown fallbacks below apply, and they are just as mandatory.

## Hard rules

These are requirements, not suggestions. Breaking one is a failed run.

1. **Capability check first.** Before the first message, inventory your tools and decide, once, for the whole run:
   - **Question tool**: any tool that collects structured user input (`AskUserQuestion`, `ask_user`, `request_user_input`, forms, polls, choice cards…). Note its per-call question limit `Q` and per-question option limit `O`.
   - **Visual tool**: any tool that renders charts, diagrams, widgets, canvases, artifacts or HTML inline.
   - **Memory tool**: any persistent memory, profile, notes or past-conversation search.
   - **Task list tool**: any todo/task/plan tool (`TodoWrite`, `TaskCreate`/`TaskUpdate`, `update_plan`, checklists…).
   - **Compute/browse**: code execution or web access (needed for an accurate astrology chart).
   Then use every capability that exists. Having a tool and not using it where this skill calls for it is a violation.
2. **Questions go through the question tool when one exists**, every time, including Steps 1, 2 and 2b. Plain-text questions are allowed only when no question tool exists, or when the tool fails (then say so in one line and fall back).
3. **Batch size**: with a question tool, `batch = min(10, Q)` questions, sent as **one** tool call, then wait for the answers. Never chain several tool calls to make up 10, never exceed `Q`. Without a tool, exactly **up to 10** questions per message.
4. **Nothing is revealed before Step 4.** No scores, leanings, hints or result-telegraphing commentary between batches.
5. **Every message follows *Formatting*** and passes the *Pre-send checklist*.
6. **Visuals are mandatory where listed** in *Required visuals*: use the visual tool when one exists, else the specified markdown fallback. A results section without its visual is incomplete.
7. **Every test's results include its 6 most similar figures, #1 featured.**
8. **Memory is read at the start and written at the end** when a memory tool exists.
9. **Progress is tracked in the task list tool** when one exists (see *Task list*).

## The tests

| ID | Test | Reference file | Quick | In depth |
|---|---|---|---|---|
| `astro` | Astrology (natal chart & related systems) | `references/astrology.md` | 3 questions | 4 questions + extended chart |
| `pj` | Riordanverse: godly parent / cabin + Roman, Norse, Egyptian | `references/percy-jackson.md` | 10 | 20 |
| `hp` | Harry Potter: house, wand, patronus, Ilvermorny | `references/harry-potter.md` | 14 | 28 |
| `16p` | 16Personalities-style type (5 dimensions) | `references/16personalities.md` | 15 | 40 |
| `12ax` | 12axes political values (12 axes, 4 categories) | `references/12axes.md` | 24 | 60 |

Read a test's reference file before writing its questions, and `references/results-format.md` before writing the final report.

## Flow: follow exactly, in order

### Step 0: Capabilities and memory (silent)

Do the capability check (Hard rule 1). If a memory tool exists, read what's relevant (see *Memory*). Don't narrate this step.

### Step 1: Exclusions

Greet in one short formatted message (title, a table of the five tests with one-line descriptions and quick-mode counts), then ask **which tests to exclude**. Nothing selected = run all five.

- **Question tool**: one multi-select question. If `O` is too small for five tests plus a "keep all" option, split into two multi-select questions in the same call:
  - "Fiction tests to skip?" → Harry Potter · Percy Jackson / Riordanverse · *Keep both*
  - "Other tests to skip?" → 16Personalities · 12axes · Astrology · *Keep all three*
- **No tool**: plain text (see *Question format*); the user may answer with letters, "none", or nothing.

### Step 2: Depth

Ask which remaining tests run **in depth** (more questions, finer results). Nothing selected = all quick. Same rules; add a *None: quick mode for all* option. Then show the **run plan** (a required visual): tests in run order, question count each, total, number of batches given the batch size.

### Step 2b: Helpful context (one batch, skippable)

Ask only what would sharpen the results for the selected tests, every item optional. Drop anything memory already answered (confirm it instead). Pick from:

- Language for questions and report.
- Country/region (12ax: country-neutral wording plus a "closest local parties/figures" note; astro: birth-place time zone).
- Familiarity with the Harry Potter / Riordan books (better-known vs. deeper-cut characters as figures).
- Results they already got elsewhere (house, type, cabin), for comparison only, never to bias scoring.
- Preferred figure pools (include/exclude politicians, scientists, musicians, athletes, fictional characters).
- Anything about themselves to take into account (occupation, hobbies, values), used only as tie-break evidence.

Skip the step if nothing would change the outcome (e.g. only astrology selected).

### Step 3: Questions (shortest test first)

- Order tests by actual question count for the chosen depth, ascending (default: astro → pj → hp → 16p → 12ax). Ties keep table order.
- Batches per Hard rule 3. A batch may span two tests when one ends mid-batch; label each question with its test.
- Number questions 1…N within each batch so the user can reply `1) A  2) C …`. Every batch shows overall progress.
- Between batches: acknowledge in one line, show progress, send the next batch. Nothing else (Hard rule 4).
- Keep a private running tally (internal notes, or a scratch file if the harness has one; never shown) of every answer and which trait/pole it feeds.
- Write original questions, fresh each run, following each reference file's blueprint. Never reproduce items verbatim from the official Wizarding World, 16Personalities, 12axes or Riordan quizzes.

### Step 3b: Tie-breakers (only if useful)

If any result is borderline (two houses/parents within ~10%, a 16p dimension within ±5%, a 12ax axis near 50% with contradictory answers, an ambiguous birth time), send one short batch of targeted, neutrally worded tie-breakers that don't reveal which results are in play. Also ask about any missing or contradictory earlier answers here.

### Step 4: Results (only at the very end)

One final report built from **all** answers across **all** tests (see *Cross-test inference*), following `references/results-format.md`, with every required visual. Then write to memory (see *Memory*).

## Question format

### With a question tool

- One call per batch, `min(10, Q)` questions (Hard rule 3).
- If an item needs more options than `O` (e.g. a 5-point agreement scale with `O = 4`), use a forced 4-point scale (Strongly agree / Agree / Disagree / Strongly disagree); the user can type "neutral" in the tool's free-text/"Other" field, scored as the midpoint.
- Put the test badge in the header/label field when one exists (`🪄 HP`, `🏛️ 12ax`), within the field's length limit.
- Put progress (`batch 3/9 · 21/64`) in the message text accompanying the call, or in the question text if the tool shows nothing else.
- If a tool supports option descriptions, keep them short and non-revealing (never "Gryffindor-ish").

### Without a tool (plain text)

Exactly this shape, up to 10 questions per message:

```
### 🪄 Harry Potter · batch 3/7 · ▓▓▓▓▓▓░░░░░░░░ 21/64

**1.** You find a locked door in an empty corridor at night. You…
A) Pick the lock, curiosity wins
B) Note it and come back with friends
C) Leave it; rules exist for a reason
D) Find out who has the key and why

**2.** …
```

In the first batch, show how to answer:

```
1) A
2) C
3) B
```

Accept loose variants (`1A 2C`, `1-a`, `a, c, b`, lowercase, extra words). Missing or ambiguous answers: re-ask only those items, prepended to the next batch (still within the batch size). "?" / "skip" / "idk" = neutral or no data.

## Formatting

Applies to **every** message, tool or no tool.

| Message | Must contain |
|---|---|
| Greeting (Step 1) | `##` title, tests table with badges and counts |
| Run plan (Step 2) | Plan table + the run-plan visual |
| Every question batch | `###` header with badge(s), batch `x/y`, progress bar `▓▓▓░░░ n/total` |
| Between-batch acknowledgment | One line + progress bar, nothing that hints at results |
| Results | Everything in `references/results-format.md` |

Conventions: test badges 🔭 astro · ⚡ pj · 🪄 hp · 🧠 16p · 🏛️ 12ax; bold for key terms; tables for anything comparative; one blank line between questions; options on their own lines.

## Required visuals

| Where | With a visual tool | Fallback (no visual tool) |
|---|---|---|
| Run plan (Step 2) | Timeline or bar of questions per test | Table + Unicode bars |
| HP house, PJ parent scores | Bar or radar chart | Table with `█░` bars and % |
| 16p dimensions | Diverging bars, 5 rows | Pole bars `I 62% ▕██████░░░░▏ 38% E` |
| 12ax axes | 12 diverging bars grouped by category | 12 pole bars in 4 category tables |
| Astrology | Chart wheel or element/modality bars | Placement table + element/modality bars |
| Cross-test synthesis | Matrix/diagram linking results | Table "test X answer → effect on test Y" |

If the visual tool renders interactive or rich output (HTML, artifacts, canvases), the whole results report may be one rich visual, but the headline results must also appear as text in the chat so they survive copy/paste.

## Pre-send checklist

Run before every message. If any item fails, fix it before sending.

- [ ] Using the question tool if one exists (Hard rule 2)?
- [ ] Batch within `min(10, Q)` (tool) or 10 (text)?
- [ ] Header, badge, batch counter and progress bar present?
- [ ] Nothing reveals or hints at a result (before Step 4)?
- [ ] Every visual required for this message present, via tool or fallback?
- [ ] Task list updated (if the tool exists), with no result hints?
- [ ] Results: 6 figures per list with #1 featured; current + historical for 16p and 12ax; ideologies, current countries and historical states for 12ax?
- [ ] User's language?

## Task list

When a task list tool exists, using it is required:

- Right after Step 2 (once tests and depth are known), create one task per remaining step and per test, e.g. `Context questions`, `🔭 Astrology (3)`, `⚡ Riordanverse (10)`, `🪄 Harry Potter (14)`, `🧠 16P (15)`, `🏛️ 12axes (24)`, `Tie-breakers`, `Results report`, `Save to memory`. Mark Steps 1 and 2 done.
- Mark a test in progress when its first question is sent and done when its last answer arrives; if the tool supports notes or descriptions, update the answered count (`9/14`) after each batch.
- Task names and notes must never reveal or hint at results (no "leaning Ravenclaw").
- Drop `Tie-breakers` if not needed and `Save to memory` if no memory tool exists; finish with every task done.
- No task list tool: the batch header's progress bar is the tracker.

## Memory

When a memory tool exists, using it is required:

- **Start** (Step 0): read birth date/time/place, country, language, occupation and interests, and earlier runs of this skill or results of other tests. Pre-fill: present found facts for one-tap confirmation ("Born 14 March in Lisbon, is that right?") instead of asking from scratch, and drop context questions memory already answers. Remembered facts never substitute for the scored test items themselves.
- **End** (after Step 4): save a compact summary (date, headline result per test, quick vs. in depth) and newly given durable facts such as birth data, so a later run can compare. Follow the memory system's own rules: some facts (political views, birth details) may be sensitive or need consent; respect that and skip what it won't store.
- If an earlier run is found, add a short "Then vs. now" section to the results.

## Cross-test inference

All answers count wherever they're informative:

- 16p Feeling/Judging/Assertive items sharpen Hufflepuff vs. Slytherin vs. Gryffindor; Intuition/Thinking supports Ravenclaw, Athena, Thoth.
- 12axes Security/Traditional/Militarist leanings inform Ares/Mars, Slytherin ambition vs. Gryffindor defiance, and patronus temperament; Acceleration informs Hephaestus/Athena and wand cores; Pacifist informs Hufflepuff/Demeter/Hestia.
- HP/PJ scenario answers (risk, loyalty, rule-breaking, curiosity) are extra evidence for 16p dimensions.
- Astrology is computed purely from birth data: it **never** changes another result, and other answers never change the computed chart. A playful "vibe sign" (the sign whose stereotype best fits the answers) is allowed if clearly labelled.

The results point out where tests agreed and where they pulled apart.

## Ground rules

- Respond in the user's language.
- Figures are public figures or published fictional characters, never private individuals. Real-person typings (16p) and political matches (12ax) are informed estimates from public record; say so once, without hedging every line.
- 12axes results describe, they don't judge: matched figures, ideologies and countries are described neutrally and accurately, with no endorsement or condemnation.
- One short disclaimer each, no more: astrology has no scientific support (included for fun); 16Personalities-style typing is a self-report model with limited validity.
- Never invent astronomical positions (see `references/astrology.md`).
- If the user stops midway, offer results for completed tests only, clearly marked partial.
