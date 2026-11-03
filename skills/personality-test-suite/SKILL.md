---
name: personality-test-suite
description: Use when a user wants a personality assessment across several systems (Harry Potter, Riordanverse, 16Personalities, 12axes, astrology). Runs an interactive battery with batched questions and one cross-referenced results report at the end.
---

# Personality Test Suite

An interactive battery of five tests. You ask every question first, reveal nothing along the way, then deliver one combined, cross-referenced, richly formatted results report.

This skill must work for anyone, anywhere, in any language, in any harness (chat apps, coding agents, terminals, plain chat UIs) and with any model, strong or small. "Question tool", "visual tool", "memory tool", "task list tool" mean whatever your environment actually provides under any name. Where the environment provides nothing, the plain-text and markdown fallbacks below apply, and they are just as mandatory.

## At a glance

For any model: if the rest of this file is too long to hold at once, follow these and look up details in the sections below.

1. Find every capability the environment offers (questions, visuals, memory, task list, code, web), including tools that must be searched for or loaded first. Use each one for its job in *Capability map*. Fallbacks are only for capabilities that truly don't exist.
2. Infer language, country and personal context from the conversation and memory. Don't ask for them or confirm them.
3. Ask which tests to skip, then which to run in depth (each a multi-select with "None").
4. Ask the questions, shortest test first, `min(10, tool limit)` per batch, labelled `TEST n/total`, revealing nothing.
5. Check each question: distinct options, right kind (single or multi), no hidden beliefs, no hints.
6. At the end, one report with visuals and 6 most similar figures per list (#1 featured), in the user's language. Then save to memory.

## Capability map

The environment's own tools always beat a text imitation of them. Before Step 1, discover them properly:

- Look at the tools you were given **and** any deferred, lazy-loaded or searchable tools (tool search, plugin/connector lists, skill lists). Load the ones in this map before you need them.
- If a tool needs a setup step (reading its guide, loading a module, enabling it), do that step; it is part of the job.
- A capability counts as missing only when no tool for it exists or it fails when called. "Plain text is easier" never counts.

| If the environment has… | You must use it for… | Never instead… |
|---|---|---|
| A question/form/choice tool | Every question, including setup | Typing questions as text |
| A visual tool (charts, widgets, canvases, artifacts, HTML) | Run plan, every results chart, cross-test synthesis | Only Unicode bars |
| A rich-page or document tool (artifact, canvas, doc) | The full results report, in addition to the chat summary | Results only as a long chat message |
| A memory tool | Reading context and earlier runs at start; saving results at end | Asking the user for facts already stored |
| A task list / todo / plan tool | Progress per test and overall | Progress only in chat text |
| Web search / fetch | 12axes national issues; astrology positions if no code | Debates or positions from memory alone |
| Code execution | Astrology chart via an ephemeris library; scoring tallies if useful | Estimating planet positions |
| A scratch file / notes area | The private answer tally on long runs | Relying on recall across many batches |

After every batch, re-check: did this message use every capability in the map that applies to it?

## Environment fallbacks

Only when the matching capability truly doesn't exist:

- No question tool: plain-text questions (see *Question format*).
- No visual tool: markdown tables and Unicode bars.
- Markdown not rendered (plain terminal, SMS-like UIs): same content as plain text; tables become aligned lines, bars stay as Unicode characters.
- No memory: ask only what's missing (country only if a selected test needs it; birth data for astrology).
- No web access: say so in one line where it matters (12axes national issues, astrology positions) and follow those sections' offline rules.
- No task list tool: progress goes in one line of chat text per batch.
- Unknown language: use the language of the user's latest message.
- Unknown country and a test needs it: ask once, as the first item of the batch that needs it.

## Hard rules

These are requirements, not suggestions. Breaking one is a failed run.

1. **Capability check first.** Before the first message, inventory your tools and decide, once, for the whole run:
   - **Question tool**: any tool that collects structured user input (`AskUserQuestion`, `ask_user`, `request_user_input`, forms, polls, choice cards…). Note its per-call question limit `Q`, per-question option limit `O`, whether it supports multi-select, a selection limit, and a free-text/"Other" field.
   - **Visual tool**: any tool that renders charts, diagrams, widgets, canvases, artifacts or HTML inline.
   - **Memory tool**: any persistent memory, profile, notes or past-conversation search.
   - **Task list tool**: any todo/task/plan tool (`TodoWrite`, `TaskCreate`/`TaskUpdate`, `update_plan`, checklists…).
   - **Compute/browse**: code execution or web access (needed for an accurate astrology chart).
   Include deferred or searchable tools: search for and load them. Then use every capability that exists, as listed in *Capability map*. Having a tool and not using it where this skill calls for it, or falling back to text while the tool works, is a violation.
2. **Questions go through the question tool when one exists**, every time, including Steps 1 and 2. Never ask what can be inferred (see Step 2b). Plain-text questions are allowed only when no question tool exists, or when the tool fails (then say so in one line and fall back).
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

### Step 2b: Context (infer, don't ask)

The run is **localized and personalized by default**. Never ask what you can infer, and never ask to confirm an inference:

- **Language**: the language the user writes in (or the app/memory language). Never asked.
- **Country/region**: from memory, profile or conversation. Asked only if nothing indicates it and 12axes or astrology needs it.
- **Personal context** (occupation, studies, interests, values) from memory or the conversation: always used as tie-break evidence. Never asked.
- **Book familiarity**: never asked; mix well-known characters with a few deeper cuts.
- **Astrology birth data** already in memory: used directly, and those astro items are not asked (the run plan counts drop accordingly).

Show the inferred defaults in **one line** with the run plan (e.g. "In English, with Canada as the reference country; tell me anytime to change it", written in the user's language), then go straight to the questions. If nothing essential is missing, which is the usual case, this step asks nothing.

Never ask for results the user already got elsewhere (it biases the run), and never ask which figure types to include or exclude.

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
- If a free-text answer points out a flaw in the question (wrong premise, ambiguity, doesn't apply to them), score it by the stance it expresses and apply the correction to every later question: don't repeat the flaw.
- If a free-text answer doesn't fit the question (a birth time that isn't a time, an answer to a different question, an unreadable reply), say in one line why and re-ask that question in the next batch.

## Question quality

Questions are generated fresh each run, so check each one before sending. Every question must have mutually exclusive, internally consistent options:

1. **No containment**: no option contained in or implied by another (e.g. "ignorance by choice" vs. "incompetence"; "mind" vs. "body" when the brain is part of the body).
2. **No natural overlap** in single-choice questions: no two options the same person would naturally pick together (e.g. "thinking differently" vs. "strategy"). If they genuinely co-occur, the question should be multi-select or rewritten.
3. **No hidden beliefs**: no option whose meaning depends on an unstated belief (e.g. "soul", "fate", "the divine") unless framed neutrally (e.g. "what people call the soul: your inner sense of meaning and inspiration").
4. **Right kind**: the question's kind matches *Question kinds*.
5. **Non-revealing**: no option text or description names the trait, house, god or pole it scores. Exception: 12axes axis statements carry a pole tag (see the 12axes reference).
6. **Measures what it means to measure**: state the underlying value plainly instead of probing it through a narrow mechanism, proxy or edge case that people could accept or reject for unrelated reasons. Before writing, name (privately) the exact trait or pole the item measures, then check that someone holding the opposite view would clearly answer the other way. Bad: "Constitutional amendments should require a plebiscite" to measure direct vs. representative democracy. Good: "Citizens should vote directly on major laws instead of leaving them to elected representatives."
7. **Fits the user's reality**: no premise that is false or alien in the user's country, culture or situation; 12axes statements are written for the user's own country.

Before sending each batch, check every question against these rules and rewrite any that fail.

## Question format

### With a question tool

- One call per batch, `min(10, Q)` questions (Hard rule 3).
- Question and option text are **plain**: no markdown headers, progress bars, `batch x/y` counters, badges or emoji. That decoration belongs to the plain-text fallback only.
- Each question shows its **number within its test**: `HP 17/28`, `16P 3/40`, `12ax 1/70`, `PJ 4/10`, `Astro 2/3`. Put it in the header/label field when one exists; otherwise at the start of the question text (`HP 17/28 · You find…`).
- Overall progress (answered / total across all tests, e.g. `10/100` after the first batch of 10) lives in the task list, not in question text.
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

- [ ] Every applicable capability in *Capability map* used (question, visual, task list, memory, web, code)?
- [ ] Using the question tool if one exists (Hard rule 2)?
- [ ] Batch within `min(10, Q)` (tool) or 10 (text)?
- [ ] Every question passes *Question quality* (rewrite failures)?
- [ ] Nothing asked or confirmed that could be inferred from the conversation or memory?
- [ ] Each question's kind is right; multi-selects state and enforce the cap; setup multi-selects have "None"?
- [ ] Tool questions: plain text, labelled `TEST n/total`, no decoration? Plain-text batches: header, progress bar, per-test numbers?
- [ ] Nothing reveals or hints at a result (before Step 4)?
- [ ] Task list updated (if the tool exists), with no result hints?
- [ ] Every visual required for this message present?
- [ ] Results: 6 figures per list with #1 featured; current + historical for 16p and 12ax; ideologies, current countries and historical states for 12ax?
- [ ] Every visible string localized (questions, options, labels, tasks, visuals)?

## Task list

When a task list tool exists, using it is required and it is the progress tracker:

- Right after Step 2, create one task per remaining step and per test, e.g. `🔭 Astrology (0/3)`, `⚡ Riordanverse (0/10)`, `🪄 Harry Potter (0/14)`, `🧠 16P (0/15)`, `🏛️ 12axes (0/29)`, `Tie-breakers`, `Results report`, `Save to memory`. Mark Steps 1 and 2 done.
- After each batch, update the answered count of each test it touched (`🪄 Harry Potter (9/14)`, in the title or notes, whichever the tool allows), and the overall count on a first task `All questions (10/100)`. Mark a test in progress at its first question and done at its last answer.
- Task names and notes never reveal or hint at results (no "leaning Ravenclaw").
- Drop `Tie-breakers` if not needed and `Save to memory` if no memory tool exists; finish with every task done.
- No task list tool: give overall progress in the one line of chat text alongside each batch (plain words, e.g. "21 of 64 answered"), still never inside the questions.

## Memory

When a memory tool exists, using it is required:

- **Start** (Step 0): read birth date/time/place, country, language, occupation and interests, and any earlier runs of this skill (results, trait scores, notable answers). Use found facts directly, without confirmation questions: they fill context and any astro items, and are listed in the one-line defaults with the run plan so the user can correct them. Ask only for what is genuinely missing.
- **Earlier runs complement, they don't compare.** Treat stored results and answers as extra evidence alongside this run:
  - Questions: don't repeat items memory already covers well; spend the batch on gaps, borderline traits and areas the earlier run didn't reach (question counts stay as planned).
  - Results: merge earlier evidence with this run's answers into one result per test, as if it were a single longer test.
  - Conflicts: when an earlier answer or result contradicts a newer one, the newer one wins, silently.
  - Never compare runs: no "then vs. now" section, no "previously you were…", no mention of what changed.
- **End** (after Step 4): save a compact summary (date, quick vs. in depth, headline result per test, per-dimension/axis/house scores, and answers that decided close calls) and newly given durable facts such as birth data, replacing anything this run superseded. Follow the memory system's own rules: some facts (political views, birth details) may be sensitive or need consent; respect that and skip what it won't store.

## Cross-test inference

All answers count wherever they're informative:

- 16p Feeling/Judging/Assertive items sharpen Hufflepuff vs. Slytherin vs. Gryffindor; Intuition/Thinking supports Ravenclaw, Athena, Thoth.
- 12axes Security/Traditional/Militarist leanings inform Ares/Mars, Slytherin ambition vs. Gryffindor defiance, and patronus temperament; Acceleration informs Hephaestus/Athena and wand cores; Pacifist informs Hufflepuff/Demeter/Hestia.
- HP/PJ scenario answers (risk, loyalty, rule-breaking, curiosity) are extra evidence for 16p dimensions.
- Astrology is computed purely from birth data: it **never** changes another result, and other answers never change the computed chart. A playful "vibe sign" (the sign whose stereotype best fits the answers) is allowed if clearly labelled.

The results point out where tests agreed and where they pulled apart.

## Localization

Everything the user sees is in the user's language (from Step 2b, memory, or the language they write in): greetings, question and option text, scale labels ("Strongly agree" and its equivalent), the "None" option, per-test labels, task names, chat lines, results, charts, visual labels and disclaimers.

- Translate generic labels (`HP 17/28` stays; "batch", "quick", "in depth", "None", dimension and axis names get translated).
- Proper names stay in the form used in that language's official editions or common use (e.g. Gryffindor is "Grifinória" in Portuguese and "Gryffondor" in French); keep the original in parentheses the first time when it helps.
- Test and type codes (`INTJ-A`, `12axes`) stay as they are.
- National-issue items use the terms people actually use for those debates in that country.

## Ground rules

- Respond in the user's language (see *Localization*).
- Figures are public figures or published fictional characters, never private individuals. Real-person typings (16p) and political matches (12ax) are informed estimates from public record; say so once, without hedging every line.
- 12axes results describe, they don't judge: matched figures, ideologies and countries are described neutrally and accurately, with no endorsement or condemnation.
- One short disclaimer each, no more: astrology has no scientific support (included for fun); 16Personalities-style typing is a self-report model with limited validity.
- Never invent astronomical positions (see `references/astrology.md`).
- If the user stops midway, offer results for completed tests only, clearly marked partial.
