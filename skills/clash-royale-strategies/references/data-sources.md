# Data sources

Order of preference, with what each source can and cannot be trusted for. Say which source each fact came from when you present results.

## 1. Player tag on royaletracker.gg (main source)

Fetch with whatever web fetch capability exists; if none exists, use screenshots or ask the player.

| URL | Gives | Notes |
|---|---|---|
| `royaletracker.gg/player/<TAG>` | Trophies, arena, win rate, clan | Worked in practice. `<TAG>` is the tag without `#` |
| `royaletracker.gg/player/<TAG>/cards` | Card levels, sortable | Worked in practice. Levels are reliable |
| `royaletracker.gg/player/<TAG>/decks` | Recently used decks, with win rates | Worked in practice, but can come back empty ("No battle history"); then ask for a deck screenshot |

`royaleapi.com` pages block automated fetches (bot detection), so do not rely on them.

### Evolution and hero status is not reliable here

Third-party sites report card levels well but not evolution or hero status. Example: royaletracker listed a Hero Knight as "Evolution Knight". Confirm from a screenshot of the in-game deck or with the player.

## 2. Screenshots and what the player says

The only reliable source for the current deck order, a non-default slot layout, evolution and hero status, wild cards and gold. Read them carefully and ask when something is unclear.

## Sources list in the answer

End deck and upgrade answers with a short grouped list: fetched or provided data (which site, screenshot or pasted data, and what it supplied), what you checked online for current game info, and your own game knowledge you did not check (roles, matchup theory), marked as possibly outdated.

```
Sources
- Fetched: card levels from the royaletracker.gg cards page; win rate from its profile page; evo/hero slots and gold from the player's screenshots.
- Checked online: current upgrade costs from <site, date>.
- Own game knowledge (not checked): card roles, matchup theory.
```
