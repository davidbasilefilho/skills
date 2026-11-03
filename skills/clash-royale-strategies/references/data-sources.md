# Data sources

Order of preference, with what each source can and cannot be trusted for. Say which source each fact came from when you present results.

## 1. Official API JSON (preferred)

Use the bundled `scripts/cr-profile.mjs` CLI (see SKILL.md step 2) or JSON the player pasted. This is the only source for battlelog, exact copy counts and evolution fields.

Read evolution and hero status from the card entries' own fields (for example `evolutionLevel`, `maxEvolutionLevel`). If a field you need is absent, do not infer it from card names or icons: confirm with the player or a screenshot of the in-game deck. Hero unlocks in particular are not reliably exposed, so ask which heroes the player owns.

## 2. Third-party fallback when the player only gives a tag

Fetch with whatever web fetch capability exists. If none exists, ask for pasted JSON or a screenshot.

| URL | Gives | Notes |
|---|---|---|
| `royaletracker.gg/player/<TAG>` | Trophies, arena, win rate, clan | Worked in practice. `<TAG>` is the tag without `#` |
| `royaletracker.gg/player/<TAG>/cards` | Card levels, sortable | Worked in practice. Levels are reliable |
| `royaletracker.gg/player/<TAG>/decks` | Current deck | Often empty ("No battle history"). Ask the player for the current deck instead |

Do not rely on `royaleapi.com` pages: it blocks automated fetches (bot detection). The RoyaleAPI proxy for the official API (`proxy.royaleapi.dev`, used by the CLI) is a different thing and works.

## Evolution and hero status is not reliable on third-party sites

Third-party sites report card levels well but not evolution or hero status. Example: royaletracker listed a Hero Knight as "Evolution Knight". Never take evolved or hero status from them. Confirm from the official API fields or a screenshot of the in-game deck, and state the source of each such fact ("evo status: screenshot", "levels: royaletracker").

## Sources section in the answer

End deck and upgrade answers with a short sources list in two groups:

- Fetched or provided data: which site, API call or screenshot, and what it supplied (levels, deck, gold, battlelog).
- Own game knowledge: rarity, elixir cost, card roles, matchup theory. Mark it as not fetched, and note when it could be outdated.
