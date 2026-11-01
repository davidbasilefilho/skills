---
name: personality-test-suite
description: Runs an interactive multi-test personality and worldview battery: Harry Potter (house, wand, patronus, Ilvermorny), Riordanverse (godly parent/cabin, Roman, Norse, Egyptian), 16Personalities-style type, 12axes political values, and astrology: asking batched multiple-choice questions and revealing all cross-referenced results, with the 6 most similar figures, only at the end. Use when the user asks to take personality tests, find their Hogwarts house, Percy Jackson cabin, MBTI/16personalities type, 12axes/political values, or astrology chart, or says "test my views/personality".
---

# Personality Test Suite

An interactive battery of five tests. You ask every question first, reveal nothing along the way, then deliver one combined, cross-referenced, richly formatted results report.

This skill is harness-agnostic (Claude, other agents, any chat UI). Wherever it says "question tool" or "visual tool", use whatever your environment actually provides, and fall back to the plain-text formats defined here when it provides nothing.

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

### Step 1: Exclusions (right after the skill loads)

Greet in one short, nicely formatted message (title, a table of the five tests with one-line descriptions and quick-mode question counts), then ask **which tests to exclude**. Nothing selected = run all five.

- **With a question tool**: one multi-select question. If the tool caps options (e.g. 4 per question), split into two multi-select questions sent in the same call:
  - "Fiction tests to skip?" → Harry Potter · Percy Jackson / Riordanverse · *Keep both*
  - "Other tests to skip?" → 16Personalities · 12axes · Astrology · *Keep all three*
- **Without one**: plain text (see *Question format*), letting the user answer with letters, "none", or nothing.

### Step 2: Depth

Ask which of the remaining tests should run **in depth** (more questions, finer results). Nothing selected = all quick. Same tool/splitting rules; add a *None: quick mode for all* option. Then show a short plan: tests in the order they'll run, question count per test, total, number of batches.

### Step 2b: Helpful context (optional, one batch)

Ask only what would actually sharpen the results for the selected tests, as one batch (same format rules, max 10, every item skippable). Pick from:

- Language for the questions and report.
- Country/region (12ax: country-neutral wording plus a "closest local parties/figures" note; astro: time zone of birth place).
- How well they know the Harry Potter / Riordan books (pick better-known vs. deeper-cut characters as figures).
- Any result they already got elsewhere (house, type, cabin), so the report can compare: but never let it bias scoring.
- Preferred figure pools (e.g. include/exclude politicians, scientists, musicians, athletes, fictional characters).
- Anything about themselves they'd like taken into account (occupation, hobbies, values), used only as tie-break evidence.

Skip this step entirely if nothing would change the outcome (e.g. only astrology selected).

### Step 3: Questions (shortest test first)

- Order tests by their actual question count for the chosen depth, ascending (default order: astro → pj → hp → 16p → 12ax). Ties: keep the table order.
- Ask in batches of **at most 10 questions** per message/tool call. A batch may span two tests when one ends mid-batch; label each question with its test.
- Number questions 1–10 within each batch so the user can reply `1) A  2) C …`. Show overall progress in the batch header.
- **Reveal nothing** between batches: no scores, leanings, hints, or "interesting!" commentary that telegraphs a result. Just acknowledge, show progress, and send the next batch.
- Keep a private running tally (internal notes or a scratch file if your harness has one; never shown) of every answer and which trait/pole it feeds.
- Write questions yourself, fresh for each run, following the blueprint in each reference file. Do not reproduce questions verbatim from the official Wizarding World, 16Personalities, 12axes, or Riordan quizzes; write original items that probe the same traits.

### Step 3b: Tie-breakers (only if useful)

Before the results, if any result is borderline (two houses/parents within ~10%, a 16p dimension within ±5%, a 12ax axis near 50% with contradictory answers, an ambiguous birth time), send one short extra batch of targeted tie-breaker questions. Phrase them neutrally: they must not reveal which results are in play. Also ask here about any earlier answers that were missing or contradictory.

### Step 4: Results (only at the very end)

One final report, built from **all** answers across **all** tests: answers to one test inform the others (see *Cross-test inference*). Follow `references/results-format.md`. Every test gets its **6 most similar figures, the first one featured** in depth.

## Memory

If the environment provides any memory tools (persistent memory, user profile, notes, past-conversation search), use them:

- **At the start** (before Step 1): read what's relevant: birth date/time/place, country, language, occupation and interests, previous results from this skill or from other tests. Use found facts to **pre-fill** questions: present them for one-tap confirmation ("Born 14 March in Lisbon, is that right?") instead of asking from scratch, and drop context questions memory already answers. Never treat remembered facts as answers to the scored test items themselves.
- **At the end**: save a compact summary of the results (date taken, each headline result, quick vs. in-depth), plus newly given durable facts such as birth data, so a future run can compare ("last time: Ravenclaw, INTP"). Respect the memory system's own rules: some facts, e.g. political views or birth details, may be treated as sensitive or need consent; follow them, and skip what the system won't store.
- If a previous run is found, add a small "Then vs. now" comparison to the results.

## Question format

### With a question / form tool (mandatory when one exists)

If the environment exposes any tool for structured user input: `AskUserQuestion`, `ask_user`, `request_user_input`, a form or poll tool, or similar: you **must** use it for every question, including Steps 1–2.

- Pack as many questions per call as the tool allows, up to 10. If it allows fewer (e.g. 4), send consecutive calls for the batch or make each call its own batch; never exceed 10 before getting answers.
- If the tool caps options per question below what an item needs (e.g. 4 options for a 5-point Likert scale), use a forced 4-point scale (Strongly agree / Agree / Disagree / Strongly disagree) and note that the user may type "neutral" via the tool's free-text/"Other" option, scoring it as the midpoint.
- Put the test name in the tool's header/label field when one exists (e.g. `🪄 HP`, `🏛️ 12ax`).

### Without a tool (plain text fallback)

Use exactly this shape, max 10 questions per message:

```
### 🪄 Harry Potter · batch 3/7 · ▓▓▓▓▓▓░░░░░░░░ 21/64

**1.** You find a locked door in an empty corridor at night. You…
A) Pick the lock: curiosity wins
B) Note it and come back with friends
C) Leave it; rules exist for a reason
D) Find out who has the key and why

**2.** …
```

Tell the user once (first batch) how to answer:

```
1) A
2) C
3) B
```

Accept loose variants (`1A 2C`, `1-a`, `a, c, b`, lowercase, extra words). If an answer is missing or ambiguous, ask only about those items in the next message: don't re-ask the whole batch. "?" / "skip" / "idk" = neutral or no data.

## Formatting every message

Every message in the process must look polished:

- Markdown throughout: headings, bold, tables, emoji test badges (🔭 astro · ⚡ pj · 🪄 hp · 🧠 16p · 🏛️ 12ax), a Unicode progress bar (`▓▓▓░░░`) in each batch header.
- Use visualization tools whenever the environment has them (inline chart/diagram/widget tools, canvases, artifacts, HTML renders, Mermaid). Typical uses: a plan/timeline at Step 2; at results: bar charts for axis/dimension percentages, a radar/score chart for houses and parents, a chart wheel or element/modality chart for astrology.
- Without visual tools: markdown tables with Unicode bars (`█████████░ 87%`) and, if Mermaid renders, Mermaid charts.
- Keep question batches scannable: one blank line between questions, options on their own lines.

## Cross-test inference

All answers count everywhere they're informative. Examples:

- 16p Feeling/Judging/Assertive items sharpen Hufflepuff vs. Slytherin vs. Gryffindor; Intuition/Thinking supports Ravenclaw, Athena, Thoth.
- 12axes Security/Traditional/Militarist leanings inform Ares/Mars, Slytherin-ambition vs. Gryffindor-defiance, and the patronus temperament; Acceleration informs Hephaestus/Athena, wand cores; Pacifist informs Hufflepuff/Demeter/Hestia.
- HP/PJ scenario answers (risk, loyalty, rule-breaking, curiosity) are extra evidence for 16p dimensions.
- Astrology is computed purely from birth data: **never** let it change any other result, and never let other answers change the computed chart. You may add a playful "vibe sign" line (the sign whose stereotype best fits their answers) clearly labelled as such.

In the results, briefly point out where tests agreed and where they pulled in different directions.

## Ground rules

- Respond in the user's language.
- Figures must be public figures or published fictional characters: never private individuals. Real-person typings (16p) and political matches (12ax) are informed estimates based on public record; say so once, without hedging every line.
- 12axes results describe; they don't judge. Describe matched figures, ideologies, and countries neutrally and accurately, with no endorsement or condemnation.
- One short disclaimer each, no more: astrology has no scientific support (included for fun); 16Personalities-style typing is a self-report model with limited validity.
- Never invent astronomical positions (see `references/astrology.md` for what to do without an ephemeris).
- If the user stops midway, offer to produce results for completed tests only, clearly marked partial.
