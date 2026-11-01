# 🔭 Astrology

Entertainment only: say so once in the results, briefly, then deliver it properly. Many people enjoy it; treat it with craft, not mockery.

## Questions

| # | Quick | In depth |
|---|---|---|
| 1 | Birth date (day / month / year) | same |
| 2 | Birth time (as exact as known) | same |
| 3 | Birth city + country | same |
| 4 | - | How sure are you of the birth time? A) Exact (certificate/app) B) Within ~30 min C) Rough part of day D) Unknown |

In quick mode, ask "how sure" inline with question 2 (e.g. options: exact time / roughly / unknown, plus a free-text field for the time).

These are free-text items: with a question tool, use its free-text/"Other" field or a text-input form; in plain text, just number them and let the user type.

## What to compute

| Placement / system | Quick | In depth | Needs |
|---|---|---|---|
| ☉ Sun sign (+ decan) | ✅ | ✅ | date (cusp dates need time + year) |
| ☽ Moon sign | ✅ | ✅ | date + approx. time |
| ↑ Rising (Ascendant) | ✅ | ✅ | exact time + place |
| ☿ Mercury, ♀ Venus, ♂ Mars | - | ✅ | date (+ time near sign changes) |
| ♃ Jupiter, ♄ Saturn (generational context) | - | ✅ | date |
| Houses of the big three, MC (Midheaven), North Node | - | ✅ | exact time + place |
| Element balance (fire/earth/air/water) & modality (cardinal/fixed/mutable) | ✅ | ✅ | the placements above |
| Chinese zodiac: animal + element + yin/yang | ✅ | ✅ | date: **use the Lunar New Year boundary, not Jan 1** |
| Numerology life path number | ✅ | ✅ | date (reduce, keep master numbers 11/22/33) |
| Birthstone & birth flower | ✅ | ✅ | month |

## Accuracy rules (never invent positions)

1. If you can run code: compute with an ephemeris library (e.g. Python `kerykeion`, `pyswisseph`/Swiss Ephemeris, `flatlib`, `skyfield`), resolving the birth place to coordinates and historical time zone/DST.
2. Else if you can browse/search: look up the positions from a reputable ephemeris or chart calculator.
3. Else: give only what is deterministic from the date (Sun sign, Chinese zodiac, life path, birthstone) and state that Moon, Rising and planets need a calculator.
- Unknown birth time → skip Rising, houses and MC; note the Moon if it stays in one sign all day, otherwise give both possible signs.
- Sun near a cusp without time → give both and say which is likelier.

## Figures

6 well-known public figures sharing the user's **Sun sign** (prefer ones also sharing Moon or Rising when known: mark those, they're the stronger match). #1 featured: the one sharing the most placements, with a paragraph on the shared "signature".

## Optional extra

A "vibe sign": the sign whose popular stereotype best fits their answers to the other tests, clearly labelled as playful and separate from the computed chart.
