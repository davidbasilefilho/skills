# Progression

Source: Supercell's upgrade data (published 10 Nov 2025, applied 24 Nov 2025) plus third-party tables for levels 2 to 9, as compiled in 2026. Balance and economy change often, so verify with a web search when the environment allows, and tell the player the date of the data you used.

## In-game level offsets

Only needed for pasted API JSON: in-game level = `level` + (16 − `maxLevel`); defined in [SKILL.md](../SKILL.md) step 2.

| Rarity | Unlocks at in-game level | API maxLevel | Offset |
|---|---|---|---|
| Common | 1 | 16 | +0 |
| Rare | 3 | 14 | +2 |
| Epic | 6 | 11 | +5 |
| Legendary | 9 | 8 | +8 |
| Champion | 11 | 6 | +10 |

## Copies needed to reach each in-game level

Same-rarity wild cards substitute copies 1:1.

| Level | Common | Rare | Epic | Legendary | Champion |
|---|---|---|---|---|---|
| 2 | 2 | - | - | - | - |
| 3 | 4 | unlock | - | - | - |
| 4 | 10 | 2 | - | - | - |
| 5 | 20 | 4 | - | - | - |
| 6 | 50 | 10 | unlock | - | - |
| 7 | 100 | 20 | 2 | - | - |
| 8 | 200 | 50 | 4 | - | - |
| 9 | 400 | 100 | 10 | unlock | - |
| 10 | 800 | 200 | 20 | 2 | - |
| 11 | 1,000 | 300 | 30 | 4 | unlock |
| 12 | 1,500 | 400 | 50 | 6 | 2 |
| 13 | 2,500 | 550 | 70 | 9 | 5 |
| 14 | 3,500 | 750 | 100 | 12 | 8 |
| 15 | 5,500 | 1,000 | 130 | 14 | 11 |
| 16 | 7,500 | 1,400 | 180 | 20 | 15 |

## Gold per upgrade step

Gold is the same for every rarity at a given level except two cells: epic level 7 (400) and legendary level 10 (5,000). Values for levels 2 to 9 and the epic and legendary exceptions are cross-checked across three third-party tables (clashdeckster.com, deckroyale.gg, alviran.net, 2026), not read from Supercell's post. Supercell's own gold table leaves epic level 7 empty, so the 400 comes from its previous table; verify in game before relying on it.

| To level | Gold |
|---|---|
| 2 | 5 |
| 3 | 20 |
| 4 | 50 |
| 5 | 150 |
| 6 | 400 |
| 7 | 1,000 (epic: 400) |
| 8 | 2,000 |
| 9 | 4,000 |
| 10 | 8,000 (legendary: 5,000) |
| 11 | 15,000 |
| 12 | 25,000 |
| 13 | 40,000 |
| 14 | 60,000 |
| 15 | 90,000 |
| 16 | 120,000 |

## Worked example: upgrade order

Hypothetical cards, gold balance 45,000. All three have a full copy count for the next level, yet the gold covers only two upgrades.

| Order | Card | Step | Copies (have/need) | Gold | Running gold |
|---|---|---|---|---|---|
| 1 | Common B | 10 to 11 | 1,000/1,000 | 15,000 | 15,000 |
| 2 | Epic C | 11 to 12 | 50/50 | 25,000 | 40,000 |
| 3 | Rare A | 12 to 13 | 600/550 | 40,000 | blocked: 5,000 left, 35,000 short |

Answer: upgrade B, then C; hold A's copies as "assigned, waiting for gold" and spend no wild cards on A yet. The cheaper steps on behind-level cards come first.

## Collection Level

XP and King's Journey were removed in the 2026 progression update (announced for 26 May 2026; RoyaleTracker's June 2026 update post says it went live 1 June 2026). Collection Level replaced them.

- **Formula:** the sum of all card levels, tower troops included and Merge Tactics rulers excluded, plus 5 per owned Evolution and 5 per owned Hero.
- **Every upgrade adds +1 Collection Level, whatever the rarity.** The cheapest upgrade steps are therefore the most gold-efficient Collection Levels, including cards outside the deck.
- **Milestone rewards** start at Collection Level 20, then come every 10 levels up to 1,500, then every 5. The full track totals 14,955 gems, 28,920 common, 7,850 rare and 1,327 epic wild cards.
- **Using it in a plan:** weigh cheap off-deck upgrades against deck upgrades and the distance to the next milestone. The player sees that distance in game, so ask.

Sources: support.clashroyale.com/hc/en-us/articles/50815299122459, supercell.com/en/games/clashroyale/blog/news/new-collection-levels-and-mastery-changes/, royaletracker.gg/news/clash-royale-june-2026-update, egw.news (May 2026). Re-check them before quoting numbers, since the track can change.

## King Tower

King Tower level rises when enough cards reach a level, e.g. King 14 needs 12 cards at level 13+, King 15 needs 13 cards at 14+, King 16 needs 14 cards at 15+. Tower troops don't count. Low cards outside the deck do not help this rule, though they still add Collection Level.

## Other 2026 notes

- Card Mastery tasks pay a flat amount of gold per task (4,000 / 6,000 / 15,000), a good gold source for cards the player already uses. See the conflicting source below.
- Elite Wild Cards no longer exist.

## Unverified conflicts

Two third-party claims contradict the tables above. Verify in game or online before quoting either, and do not replace the table values on this evidence alone.

- **Level 14 to 15 gold.** A May 2026 guide (trophycoach.com, on the gold shortage after Collection Levels) says this step costs 100,000 gold. The table above says 90,000.
- **Mastery payout.** The same guide says a card's whole Mastery chain pays back 75,000 gold after a May 2026 Mastery rework. The per-task 4,000 / 6,000 / 15,000 note above may be outdated.
