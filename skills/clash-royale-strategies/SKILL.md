---
name: clash-royale-strategies
description: Use when a player wants help with Clash Royale deck building, evo/hero slot choices, matchup and loss analysis, deciding where to spend wild cards and gold, or upgrade order, from their real data (player tag lookup, deck screenshots, battle history, wild card counts). Builds, reviews and tunes decks and upgrade plans from that data.
---

# Clash Royale Strategies

Help a player win more with the cards they actually have: build decks around their in-game levels, evolutions and heroes, read their battlelog for patterns, and plan upgrades that are possible right now.

This skill is model-, harness- and environment-agnostic. It never assumes a specific tool name. Instead it describes **capabilities** and says what to do when each is or is not available.

## Capabilities to look for (use them when present)

| Capability | Use it for | Fallback when absent |
|---|---|---|
| Structured question tool (multiple choice / multi-select UI) | Intake questions, choosing between deck variants, confirming spends | Ask in plain text with numbered options |
| Visualization (charts, rendered tables, diagrams, cards) | Deck tables, level comparisons, upgrade-cost bars, matchup tallies | Markdown tables |
| Web search / fetch | Current card stats, new heroes/evolutions, balance changes, upgrade-cost tables | Use [Progression](references/progression.md) and state its date |
| Code execution | Parsing large pasted data, computing shortfalls and totals exactly | Compute by hand and show the arithmetic |
| Memory / notes | Remembering the player's heroes, deck and preferences across sessions | Ask again when needed |

Prefer the richer option whenever it exists. Never claim a capability you don't have.

## Answer formatting

- Structure every answer with markdown: a short heading per part (for example Deck, Comparison, Upgrades, Next step, Sources), a table for decks, level comparisons and upgrade plans, and short lists elsewhere. No walls of prose.
- Put the conclusion first (keep the deck, change one card, upgrade X), then the supporting detail.
- Bold only the key decision in a section, not whole sentences.
- No emojis anywhere, including headings, tables and lists.
- Keep it scannable: one idea per bullet, numbers in tables rather than inline sentences.

## Question rules (for any ask tool or plain-text question)

- Every question goes through a structured question tool when the environment has one, whatever its name. That includes requests for missing data (gold, wild cards, slot layout, screenshots) at the end of an answer: ask them with the tool, never as a closing sentence of prose.
- Without such a tool, write the questions in this exact shape: one small heading (`####`) with a relevant title, a light one-line description under it (why these questions matter), then the questions numbered:

  ```
  #### <relevant title, e.g. Missing data for the upgrade order>
  <one short line on why you need this>

  1. <question>
  2. <question>
  3. <question>
  ```

  List options under a question when there are any. The player answers by number.
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
2. **Which heroes they own.** Never infer it from third-party sites or icons (see [Data sources](references/data-sources.md)).
3. Average elixir target.
4. How to weigh card levels vs. synergy.
5. Their slot layout, only if a screenshot or the player contradicts the default in [Deck format](references/deck-format.md).
6. Their language or game locale, for card names.
7. Current deck and gold balance, when not in the data.

### 2. Get and read the data

No API key or token is needed, and never ask the player for one. Get the data in this order:

1. **Player tag.** Ask for it (for example `#ABC123`) and fetch the third-party pages in [Data sources](references/data-sources.md) with whatever web fetch capability exists. They give trophies, arena, win rate and card levels.
2. **Screenshots.** Ask for a screenshot of the deck screen for the current deck, the slot layout and which cards are evolved or hero, and of the collection or card details for copy counts, wild cards and gold when upgrades are in question.
3. **What the player types.** When neither works, ask the player to list the cards, levels and counts that matter.

If the player pastes profile JSON from the official API on their own, use it: `cards[]` has `name`, `level`, `maxLevel`, `rarity`, `count` (copies held), `elixirCost`, `evolutionLevel` (present ⇒ evolution unlocked), `maxEvolutionLevel`; `currentDeck[]` is the deck in order, `battlelog[]` the recent games. Use `cards[]` for copy counts, not `currentDeck[]`. Never ask the player to get or share a key for it.

**In-game level** is the level the game shows the player, and the only level to show in answers. Screenshots and royaletracker already show it. Pasted API JSON reports level relative to rarity, so there in-game level = `level` + (16 − `maxLevel`); the per-rarity offsets are in [Progression](references/progression.md). Normalize before comparing anything.

### 3. Build the deck

Slots, localized card names and the output format are in [Deck format](references/deck-format.md); read it before presenting a deck.

- **Rules that worked:** a real win condition; built around the player's highest in-game level cards and owned evolutions/heroes; average elixir roughly 3.0 to 3.8; compared with the current deck (what left, what entered, elixir change, gained and lost).
- **Roles checklist:** win condition, tank or mini-tank, building or ground stopper, anti-air (at least two sources), splash, small spell, medium/big spell, cycle cards.
- **Levels:** favor high levels when synergy holds; otherwise balance. Flag which cards are underleveled.
- **Meta check:** tally opponent cards across the battlelog. If many opponents run splash (Wizard, Valkyrie, Bomber, Mega Knight, Witch), swarm-based win conditions and cheap support will struggle. Say so.
- Give 2 or 3 alternatives at most, each with a one-line rationale, and one recommendation when the player asks you to choose.
- List the deck's real weak matchups. Don't oversell.
- If the player's previous deck was winning in their bracket, say so; "your old deck, slots optimized" is a legitimate answer.

### 4. Review games

- Ask for the latest results after a few games (the royaletracker profile's recent battles, battle log screenshots, or the player's own account) rather than guessing.
- For each loss: opponent deck, which of their cards hard-counter which of yours, level differences.
- Distinguish **learning curve** (new archetype, 1 to 2 games) from **structural problems** (the deck loses to what the bracket plays most). Recommend reverting when the data supports it.

### 5. Plan upgrades and wild cards

Golden rule: **only spend wild cards where an upgrade becomes possible right now.** Otherwise, hold.

1. For each deck card: in-game level, copies, copies needed for next level, gold needed, shortfall ([Progression](references/progression.md)).
2. Same-rarity wild cards substitute copies 1:1. Common wild cards are one shared pool: show which single upgrades the pool can close and in what order.
3. **A full copy count does not make an upgrade affordable.** Gold is usually the real bottleneck: ask for or read the gold balance, and answer with an upgrade order (first, second, third, with running gold) rather than "upgrade now". Wild cards assigned to a card are not an upgrade; track "assigned, waiting for gold" separately. Worked example in [Progression](references/progression.md).
4. Respect inventory caps (often shown as `x/5000` etc.). If over the cap, new wild cards may convert into something else. Spend down to below the cap first, choosing upgrades that consume the most wild cards.
5. Prioritize: cheaper gold steps on behind-level deck cards before expensive steps on already-high cards. Don't upgrade cards that left the deck.
6. When choosing between rewards (e.g. a pass reward), compare how many deck upgrades each option unlocks.

### 6. Honesty

- Your own game knowledge (card stats, costs, abilities, upgrade tables, which cards and heroes exist) can be outdated. When it is missing, uncertain or likely to have changed, search for current information with web search or fetch before answering, and prefer recent sources (patch notes, official posts, current wikis). Use memory alone only for stable facts, and say which facts you checked and which you did not.
- If you cannot search and are unsure about a mechanic (a new hero ability, an evo cycle count), say so. Don't invent ability details.
- The player's hands-on experience with a card (e.g. "I've used both, the hero is better") outweighs theory.
- When corrected, acknowledge it once, update the answer, and move on. Don't re-litigate settled choices.
- Fetched data can be stale (chests opened since the site last updated), so tell the player to double-check counts in game before spending.

### 7. Sources and self-update

- End deck and upgrade answers with a sources list that separates fetched or provided data from your own game knowledge (format and example in [Data sources](references/data-sources.md)).
- If the session surfaced corrections or new lessons (wrong card names, slot layout, a broken data source, a wrong assumption), offer the player at the end to update this skill with them. Add only general lessons to the skill, never the player's tag, name or clan.

## References

- [Data sources](references/data-sources.md): royaletracker pages, screenshots, evolution and hero reliability, the sources list.
- [Deck format](references/deck-format.md): default slot layout, localized card names, deck output format.
- [Progression](references/progression.md): level offsets, copies and gold per level, upgrade order example, King Tower.
