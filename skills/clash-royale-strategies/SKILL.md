---
name: clash-royale-strategies
description: Build, review and tune Clash Royale decks and upgrade plans from a player's real data (official API JSON, battlelog, wild card counts). Use for deck building, evo/hero slot choices, matchup and loss analysis, and deciding where to spend wild cards and gold, including upgrade order.
---

# Clash Royale Strategies

Help a player win more with the cards they actually have: build decks around their real levels, evolutions and heroes, read their battlelog for patterns, and plan upgrades that are possible right now.

This skill is model-, harness- and environment-agnostic. It never assumes a specific tool name. Instead it describes **capabilities** and says what to do when each is or is not available.

## Capabilities to look for (use them when present)

| Capability | Use it for | Fallback when absent |
|---|---|---|
| Structured question tool (multiple choice / multi-select UI) | Intake questions, choosing between deck variants, confirming spends | Ask in plain text with numbered options |
| Visualization (charts, rendered tables, diagrams, cards) | Deck tables, level comparisons, upgrade-cost bars, matchup tallies | Markdown tables |
| Web search / fetch | Current card stats, new heroes/evolutions, balance changes, upgrade-cost tables | Use `references/progression.md` and state its date |
| Code execution | Parsing large API JSON, computing shortfalls and totals exactly | Compute by hand and show the arithmetic |
| Memory / notes | Remembering the player's heroes, deck and preferences across sessions | Ask again when needed |

Prefer the richer option whenever it exists. Never claim a capability you don't have.

## Question rules (for any ask tool or plain-text question)

- Ask before building when the request says so, or when the answer changes the deck (play style, heroes owned, elixir target, how much to weigh levels).
- Batch questions: at most 4 per round.
- Say for each question whether it is **single choice** or **multiple choice**. Limit multi-select to half the options (rounded down) where that makes sense; if the harness can't enforce the limit and the player goes over, ask again.
- No progress-bar "TUI" headers inside questions. If there are several rounds, put the number in the question text (e.g. "Deck 2/4").
- For filter-style multi-selects where "none" is a valid answer, offer a "None" option and no "All" option, since whoever wants all selects all.
- Always allow free-text answers when the environment does. If a free-text answer doesn't fit the question, say why in one line and ask again.
- Options must not overlap or contradict each other.

## Workflow

### 1. Intake

Ask (only what isn't already known):

1. Play style: e.g. cycle, beatdown, bridge-spam/control, bait.
2. **Which heroes they own.** The API does not reliably show hero unlocks; never infer them.
3. Average elixir target.
4. How to weigh card levels vs. synergy.
5. Their special slot layout (which slots take evolutions, heroes or either). Never assume it; see `references/deck-format.md`.
6. Their language or game locale, for card names.
7. Current deck and gold balance, when not in the data.

### 2. Get and read the data

If the player hasn't pasted their data and you can run code, fetch it with the bundled CLI (a single file that needs only Node 20+):

```bash
CLASH_ROYALE_API_TOKEN=... node scripts/cr-profile.mjs '#TAG' [--only profile|battlelog] [--out file.json]
```

It prints `{ "profile": ..., "battlelog": ... }`, the same shape the player would paste. The token comes from developer.clashroyale.com and is bound to IP addresses; for a machine with a changing IP, create the key for the RoyaleAPI proxy IP and set `CLASH_ROYALE_API_BASE_URL=https://proxy.royaleapi.dev/v1`. Never ask the player to paste their token into the conversation; ask them to set the environment variable themselves.

Source order: official API JSON (CLI or pasted) first. If the player only gives a tag and you cannot run the CLI, fall back to royaletracker.gg pages for profile and card levels; do not rely on royaleapi.com (it blocks automated fetches), and if the decks page is empty, ask for the current deck. Third-party sites get levels right but not evolution or hero status, so confirm that from the API fields or an in-game deck screenshot. Details and URLs: `references/data-sources.md`. Say which source each fact came from.

From the official API player JSON:

- `cards[]`: `name`, `level`, `maxLevel`, `rarity`, `count` (copies held), `elixirCost`, `evolutionLevel` (present ⇒ evolution unlocked), `maxEvolutionLevel`, `starLevel`.
- `currentDeck[]`, `battlelog[]` (`team`, `opponent`, `crowns`, `trophyChange`, `elixirLeaked`, opponent `cards`).
- Use `cards[]` for copy counts, not `currentDeck[]` (they can differ).

**Normalize levels before comparing anything.** The API reports level relative to rarity. Real level = API level + offset:

| Rarity | maxLevel in API | Offset |
|---|---|---|
| Common | 16 | +0 |
| Rare | 14 | +2 |
| Epic | 11 | +5 |
| Legendary | 8 | +8 |
| Champion | 6 | +10 |

Always derive the offset from `maxLevel` (16 − maxLevel) rather than trusting this table blindly. Use real levels in every table you show the player.

### 3. Build the deck

- **Rules that worked:** a real win condition; built around the player's highest-level cards and owned evolutions/heroes; average elixir roughly 3.0 to 3.8; compared with the current deck (what left, what entered, elixir change, gained and lost).
- **Special slots:** confirm the player's layout before assigning anything, and put each owned evolution/hero in a slot that activates it. Layout example and rules: `references/deck-format.md`.
- **Card names:** use the official localized names in the player's language. Never invent a translation; when unsure, add the English name in parentheses or ask (Firecracker is "Pirotécnica" in pt-BR, not "Lançadora"). See `references/deck-format.md`.
- **Roles checklist:** win condition, tank or mini-tank, building or ground stopper, anti-air (at least two sources), splash, small spell, medium/big spell, cycle cards.
- **Levels:** favor high real levels when synergy holds; otherwise balance. Flag which cards are underleveled.
- **Meta check:** tally opponent cards across the battlelog. If many opponents run splash (Wizard, Valkyrie, Bomber, Mega Knight, Witch), swarm-based win conditions and cheap support will struggle. Say so.
- **Output:** cards numbered 1 to 8 in exact in-game order, special slots first with their slot type, each line with localized name, evo/hero/mix tag, rarity and in-game level, then average elixir. Give 2 or 3 alternatives at most, each with a one-line rationale, and a recommendation when the player asks you to choose. Format: `references/deck-format.md`.
- List the deck's real weak matchups. Don't oversell.
- If the player's previous deck was winning in their bracket, say so; "your old deck, slots optimized" is a legitimate answer.

### 4. Review games

- Ask for an updated battlelog after a few games rather than guessing.
- For each loss: opponent deck, which of their cards hard-counter which of yours, level differences.
- Distinguish **learning curve** (new archetype, 1 to 2 games) from **structural problems** (the deck loses to what the bracket plays most). Recommend reverting when the data supports it.

### 5. Plan upgrades and wild cards

Golden rule: **only spend wild cards where an upgrade becomes possible right now.** Otherwise, hold.

1. For each deck card: real level, copies, copies needed for next level, gold needed, shortfall (`references/progression.md`).
2. Same-rarity wild cards substitute copies 1:1. Common wild cards are one shared pool: show which single upgrades the pool can close and in what order.
3. **A full copy count does not make an upgrade affordable.** Gold is usually the real bottleneck: ask for or read the gold balance, and answer with an upgrade order (first, second, third, with running gold) rather than "upgrade now". Wild cards assigned to a card are not an upgrade; track "assigned, waiting for gold" separately.
4. Respect inventory caps (often shown as `x/5000` etc.). If over the cap, new wild cards may convert into something else. Spend down to below the cap first, choosing upgrades that consume the most wild cards.
5. Prioritize: cheaper gold steps on behind-level deck cards before expensive steps on already-high cards. Don't upgrade cards that left the deck.
6. When choosing between rewards (e.g. a pass reward), compare how many deck upgrades each option unlocks.

### 6. Honesty

- If unsure about a mechanic (a new hero ability, an evo cycle count), say so or look it up. Don't invent ability details.
- The player's hands-on experience with a card (e.g. "I've used both, the hero is better") outweighs theory.
- When corrected, acknowledge it once, update the answer, and move on. Don't re-litigate settled choices.
- Data from the API can be stale (opened chests after export), so tell the player to double-check counts in game before spending.

### 7. Sources and self-update

- End deck and upgrade answers with a short sources list that separates fetched or provided data (API, site, screenshot, what each supplied) from your own game knowledge (rarity, cost, roles).
- If the session surfaced corrections or new lessons (wrong card names, slot layout, a broken data source, a wrong assumption), offer the player at the end to update this skill with them. Add only general lessons to the skill, never the player's tag, name or clan.

## Bundled files

- `references/data-sources.md`: source order, royaletracker URLs, royaleapi limits, unreliable evo/hero status, sources section.
- `references/deck-format.md`: special slot layout example, localized names, deck output format, building rules.
- `references/progression.md`: copies and gold per level, rarity offsets, King Tower rule. Dated; verify with a search when possible.
- `scripts/cr-profile.mjs`: fetches profile and battlelog by tag (see step 2). Run `node scripts/cr-profile.mjs --help`. Exit codes: 0 ok, 1 failed, 2 usage error, 3 partial (one section missing).
