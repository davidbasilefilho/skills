# Data sources

Order of preference, with what each source can and cannot be trusted for. Say which source each fact came from when you present results.

## 1. Official API JSON (preferred)

Use the bundled `scripts/cr-profile.mjs` CLI (SKILL.md step 2) or JSON the player pasted. This is the only source for battlelog, exact copy counts and evolution fields.

Read evolution and hero status from the card entries' own fields (for example `evolutionLevel`, `maxEvolutionLevel`). If a field you need is absent, do not infer it from card names or icons: confirm with the player or a screenshot of the in-game deck (see the note below).

## 2. Third-party fallback when the player only gives a tag

Use only when the CLI cannot run and the player did not paste JSON. Fetch with whatever web fetch capability exists; if none exists, ask for pasted JSON or a screenshot.

| URL | Gives | Notes |
|---|---|---|
| `royaletracker.gg/player/<TAG>` | Trophies, arena, win rate, clan | Worked in practice. `<TAG>` is the tag without `#` |
| `royaletracker.gg/player/<TAG>/cards` | Card levels, sortable | Worked in practice. Levels are reliable |
| `royaletracker.gg/player/<TAG>/decks` | Current deck | Often empty ("No battle history"). Ask the player for the current deck instead |

`royaleapi.com` pages block automated fetches (bot detection), so do not rely on them. The RoyaleAPI proxy for the official API used by the CLI is a different thing and works.

### Evolution and hero status is not reliable here

Third-party sites report card levels well but not evolution or hero status. Example: royaletracker listed a Hero Knight as "Evolution Knight". Confirm from the official API fields or a screenshot of the in-game deck.

## Sources list in the answer

End deck and upgrade answers with a short list in two groups: fetched or provided data (which site, API call or screenshot, and what it supplied), and your own game knowledge (rarity, elixir cost, roles, matchup theory), marked as not fetched and possibly outdated.

```
Sources
- Fetched: card levels, copies and gold from the official API JSON the player pasted; evo/hero slots from the player's deck screenshot; win rate from the royaletracker.gg profile page.
- Own game knowledge (not fetched): rarity, elixir cost, card roles, matchup theory.
```
