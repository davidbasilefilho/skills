---
name: personality-test-suite
description: Run an interactive personality battery (Harry Potter, Riordanverse, 16Personalities, 12axes, astrology) with batched questions and one cross-referenced results report at the end.
---

# Personality Test Suite

An interactive battery of five tests. You ask every question first, reveal nothing along the way, then deliver one combined, cross-referenced, richly formatted results report.

This skill is harness-agnostic (Claude, other agents, any chat UI). "Question tool", "visual tool", "memory tool", "task list tool" mean whatever your environment actually provides under any name. Where the environment provides nothing, the plain-text and markdown fallbacks below apply, and they are just as mandatory.

## Hard rules

These are requirements, not suggestions. Breaking one is a failed run.

1. **Capability check first.** Before the first message, inventory your tools and decide, once, for the whole run:
   - **Question tool**: any tool that collects structured user input (`AskUserQuestion`, `ask_user`, `request_user_input`, forms, polls, choice cards…). Note its per-call question limit `Q`, per-question option limit `O`, whether it supports multi-select, a selection limit, and a free-text/"Other" field.
   - **Visual tool**: any tool that renders charts, diagrams, widgets, canvases, artifacts or HTML inline.
   - **Memory tool**: any persistent memory, profile, notes or past-conversation search.
   - **Task list tool**: any todo/task/plan tool (`TodoWrite`, `TaskCreate`/`TaskUpdate`, `update_plan`, checklists…).
   - **Compute/browse**: code execution or web access (needed for an accurate astrology chart).
   Then use every capability that exists. Having a tool and not using it where this skill calls for it is a violation.
2. **Questions go through the question tool when one exists**, every time, including Steps 1, 2 and 2b. Plain-text questions are allowed only when no question tool exists, or when the tool fails (then say so in one line and fall back).
3. **Batch size**: with a question tool, `batch = min(10, Q)` questions, sent as **one** tool call, then wait for the answers. Never chain several tool calls to make up 10, never exceed `Q`. Without a tool, exactly **up to 10** questions per message.
4. **Nothing is revealed before Step 4.** No scores, leanings, hints or result-telegraphing commentary between batches.
5. **Every question passes *Question quality*** before its batch is sent.
6. **Every question has a defined kind** (single-choice or multi-select, see *Question kinds*), and multi-select answers respect the cap.
7. **Free-text answers are always accepted and scored** (see *Free-text answers*).
8. **Every message follows *Formatting*** and passes the *Pre-send checklist*.
9. **Visuals are mandatory where listed** in *Required visuals*: use the visual tool when one exists, else the specified markdown fallback. A results section without its visual is incomplete.
10. **Every test's results include its 6 most similar figures, #1 featured.** All figure types are always eligible; never ask the user to filter them. The only figure-scope question is the 12axes closing block's "include your own country's figures and parties?".
11. **Memory is read at the start and written at the end** when a memory tool exists.
12. **Progress is tracked in the task list tool** when one exists (see *Task list*).

## The tests

| ID | Test | Reference file | Quick | In depth |
|---|---|---|---|---|
| `astro` | Astrology (natal chart & related systems) | `references/astrology.md` | 3 questions | 4 questions + extended chart |
| `pj` | Riordanverse: godly parent / cabin + Roman, Norse, Egyptian | `references/percy-jackson.md` | 10 | 20 |
| `hp` | Harry Potter: house, wand, patronus, Ilvermorny | `references/harry-potter.md` | 14 | 28 |
| `16p` | 16Personalities-style type (5 dimensions) | `references/16personalities.md` | 15 | 40 |
| `12ax` | 12axes political values (12 axes, 4 categories) + closing block | `references/12axes.md` | 29 (24 + 5) | 70 (60 + 10) |

Read a test's reference file before writing its questions, and `references/results-format.md` before writing the final report.

## Flow: follow exactly, in order

### Step 0: Capabilities and memory (silent)

Do the capability check (Hard rule 1). If a memory tool exists, read what's relevant (see *Memory*). Don't narrate this step.

### Step 1: Exclusions

Greet in one short formatted message (title, a table of the five tests with one-line descriptions and quick-mode counts), then ask **which tests to skip** as a multi-select with an explicit **None** option (see *Setup questions*).

- If `O` is too small for five tests plus "None", split into two multi-select questions in the same call, each with its own "None":
  - "Fiction tests to skip?" → Harry Potter · Percy Jackson / Riordanverse · None
  - "Other tests to skip?" → 16Personalities · 12axes · Astrology · None
- No tool: plain text (see *Question format*); the user may answer with letters or "none".

### Step 2: Depth

Ask which remaining tests run **in depth** (more questions, finer results), as a multi-select with an explicit **None** option (= all quick). Then show the **run plan** (a required visual): tests in run order, question count each, total, number of batches given the batch size. Then create the task list (see *Task list*).

### Step 2b: Helpful context (one batch, skippable)

Ask only what would sharpen the results for the selected tests, every item optional. Drop anything memory already answered (confirm it instead). Pick from:

- Language for questions and report.
- Country/region (12ax: country-neutral axis wording, the closing block's national issues and a local-context note; astro: birth-place time zone).
- Familiarity with the Harry Potter / Riordan books (better-known vs. deeper-cut characters as figures).
- Anything about themselves to take into account (occupation, hobbies, values), used only as tie-break evidence.

Never ask for results the user already got elsewhere (it biases the run), and never ask which figure types to include or exclude.

Skip the step if nothing would change the outcome (e.g. only astrology selected).

### Step 3: Questions (shortest test first)

- Order tests by actual question count for the chosen depth, ascending (default: astro → pj → hp → 16p → 12ax). Ties keep table order.
- Batches per Hard rule 3. A batch may span two tests when one ends mid-batch.
- Between batches: acknowledge in at most one line, nothing else (Hard rule 4).
- Keep a private running tally (internal notes, or a scratch file if the harness has one; never shown) of every answer and which trait/pole it feeds.
- 12axes ends with its closing block (national issues looked up at run time, personal religion, other context); see `references/12axes.md`.
- Write original questions, fresh each run, following each reference file's blueprint and *Question quality*. Never reproduce items verbatim from the official Wizarding World, 16Personalities, 12axes or Riordan quizzes.

### Step 3b: Tie-breakers (only if useful)

If any result is borderline (two houses/parents within ~10%, a 16p dimension within ±5%, a 12ax axis near 50% with contradictory answers, an ambiguous birth time), send one short batch of targeted, neutrally worded tie-breakers that don't reveal which results are in play. Also re-ask any missing or contradictory earlier answers here.

### Step 4: Results (only at the very end)

One final report built from **all** answers across **all** tests (see *Cross-test inference*), following `references/results-format.md`, with every required visual. Then write to memory (see *Memory*).

## Question kinds

Every question is exactly one kind, chosen by what it measures:

| Kind | Use for | Scoring |
|---|---|---|
| **Single-choice** | Forced trade-offs ("what matters most"), place/environment preference, agreement-scale items, anything scored toward one pole | The chosen option only |
| **Multi-select** | Items where several answers can be true at once and are scored independently: self-descriptions, kinds of happy memories, fears, social habits | Each selected option counts on its own |

Multi-select cap: **at most half the options, rounded down** (4 options → up to 2; 6 → up to 3). State the cap in the question text ("pick up to 2"). If the tool has a selection limit, set it to the cap. If it doesn't, and an answer exceeds the cap, re-ask that question (one line on why) until the answer fits.

### Setup questions

Setup/filter multi-selects where choosing nothing is valid (which tests to skip, which to run in depth) get one explicit **None** option, because question tools usually won't let the user continue with nothing selected. No "All" option: selecting every item already means all. The half-options cap does not apply to setup questions. Multi-selects inside the tests never get "None".

## Free-text answers

- The user may always answer in their own words instead of a listed option, wherever the environment allows (the tool's "Other"/free-text field, or plain text).
- Score a free-text answer by its content, possibly across several options or poles; never discard it.
- If a free-text answer doesn't fit the question (a birth time that isn't a time, an answer to a different question, an unreadable reply), say in one line why and re-ask that question in the next batch.

## Question quality

Questions are generated fresh each run, so check each one before sending. Every question must have mutually exclusive, internally consistent options:

1. **No containment**: no option contained in or implied by another (e.g. "ignorance by choice" vs. "incompetence"; "mind" vs. "body" when the brain is part of the body).
2. **No natural overlap** in single-choice questions: no two options the same person would naturally pick together (e.g. "thinking differently" vs. "strategy"). If they genuinely co-occur, the question should be multi-select or rewritten.
3. **No hidden beliefs**: no option whose meaning depends on an unstated belief (e.g. "soul", "fate", "the divine") unless framed neutrally (e.g. "what people call the soul: your inner sense of meaning and inspiration").
4. **Right kind**: the question's kind matches *Question kinds*.
5. **Non-revealing**: no option text or description names the trait, house, god or pole it scores.

Before sending each batch, check every question against these rules and rewrite any that fail.

## Question format

### With a question tool

- One call per batch, `min(10, Q)` questions (Hard rule 3).
- Question and option text are **plain**: no markdown headers, progress bars, `batch x/y` counters, badges or emoji. That decoration belongs to the plain-text fallback only.
- Each question shows its **number within its test**: `HP 17/28`, `16P 3/40`, `12ax 1/60`, `PJ 4/10`, `Astro 2/3`. Put it in the header/label field when one exists; otherwise at the start of the question text (`HP 17/28 · You find…`).
- Overall progress lives in the task list, not in question text.
- If an item needs more options than `O` (e.g. a 5-point agreement scale with `O = 4`), use a forced 4-point scale (Strongly agree / Agree / Disagree / Strongly disagree); the user can type "neutral" in the free-text field, scored as the midpoint.
- Option descriptions, when the tool supports them, stay short and non-revealing.

### Without a tool (plain text)

Exactly this shape, up to 10 questions per message:

```
### 🪄 Harry Potter · batch 3/7 · ▓▓▓▓▓▓░░░░░░░░ 21/64

**1.** (HP 9/14) You find a locked door in an empty corridor at night. You…
A) Pick the lock
B) Note it and come back with friends
C) Leave it alone
D) Find out who has the key and why

**2.** (HP 10/14) Which of these describe you? Pick up to 2.
A) …
```

In the first batch, show how to answer:

```
1) A
2) B, D
3) my own answer in words
```

Accept loose variants (`1A 2C`, `1-a`, `a, c, b`, lowercase, extra words). Missing or ambiguous answers: re-ask only those items, prepended to the next batch (still within the batch size). "?" / "skip" / "idk" = neutral or no data.

## Formatting

| Message | Must contain |
|---|---|
| Greeting (Step 1) | `##` title, tests table with badges and counts |
| Run plan (Step 2) | Plan table + the run-plan visual |
| Question batch, question tool | Plain questions labelled `TEST n/total`; at most one plain line of chat text alongside the call |
| Question batch, plain text | `###` header with badge(s), batch `x/y`, progress bar `▓▓▓░░░ n/total`, per-test numbers |
| Between batches | At most one line; nothing that hints at results |
| Results | Everything in `references/results-format.md` |

Conventions: test badges 🔭 astro · ⚡ pj · 🪄 hp · 🧠 16p · 🏛️ 12ax (chat text and results only, never inside question-tool questions); bold for key terms; tables for anything comparative.

## Required visuals

| Where | With a visual tool | Fallback (no visual tool) |
|---|---|---|
| Run plan (Step 2) | Timeline or bar of questions per test | Table + Unicode bars |
| HP house, PJ parent scores | Bar or radar chart | Table with `█░` bars and % |
| 16p dimensions | Diverging bars, 5 rows | Pole bars `I 62% ▕██████░░░░▏ 38% E` |
| 12ax axes | 12 diverging bars grouped by category | 12 pole bars in 4 category tables |
| Astrology | Chart wheel or element/modality bars | Placement table + element/modality bars |
| Cross-test synthesis | Matrix/diagram linking results | Table "test X answer → effect on test Y" |

If the visual tool renders rich output (HTML, artifacts, canvases), the whole results report may be one rich visual, but the headline results must also appear as text in the chat.

## Pre-send checklist

Run before every message. Fix any failure before sending.

- [ ] Using the question tool if one exists (Hard rule 2)?
- [ ] Batch within `min(10, Q)` (tool) or 10 (text)?
- [ ] Every question passes *Question quality* (rewrite failures)?
- [ ] Each question's kind is right; multi-selects state and enforce the cap; setup multi-selects have "None"?
- [ ] Tool questions: plain text, labelled `TEST n/total`, no decoration? Plain-text batches: header, progress bar, per-test numbers?
- [ ] Nothing reveals or hints at a result (before Step 4)?
- [ ] Task list updated (if the tool exists), with no result hints?
- [ ] Every visual required for this message present?
- [ ] Results: 6 figures per list with #1 featured; current + historical for 16p and 12ax; ideologies, current countries and historical states for 12ax?
- [ ] User's language?

## Task list

When a task list tool exists, using it is required and it is the progress tracker:

- Right after Step 2, create one task per remaining step and per test, e.g. `Context questions`, `🔭 Astrology (0/3)`, `⚡ Riordanverse (0/10)`, `🪄 Harry Potter (0/14)`, `🧠 16P (0/15)`, `🏛️ 12axes (0/29)`, `Tie-breakers`, `Results report`, `Save to memory`. Mark Steps 1 and 2 done.
- After each batch, update the answered count of each test it touched (`🪄 Harry Potter (9/14)`, in the title or notes, whichever the tool allows). Mark a test in progress at its first question and done at its last answer.
- Task names and notes never reveal or hint at results (no "leaning Ravenclaw").
- Drop `Tie-breakers` if not needed and `Save to memory` if no memory tool exists; finish with every task done.
- No task list tool: give overall progress in the one line of chat text alongside each batch (plain words, e.g. "21 of 64 answered"), still never inside the questions.

## Memory

When a memory tool exists, using it is required:

- **Start** (Step 0): read birth date/time/place, country, language, occupation and interests. Pre-fill: present found facts for one-tap confirmation ("Born 14 March in Lisbon, is that right?") instead of asking from scratch, and drop context questions memory already answers. Remembered facts never substitute for the scored test items.
- **Earlier runs** of this skill: don't look them up until scoring is done; then use them only for a short "Then vs. now" section.
- **End** (after Step 4): save a compact summary (date, headline result per test, quick vs. in depth) and newly given durable facts such as birth data. Follow the memory system's own rules: some facts (political views, birth details) may be sensitive or need consent; respect that and skip what it won't store.

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
