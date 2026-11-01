# Results report format

Delivered once, after the last answer. If the harness supports it, build it as a rich visual (artifact/HTML page/canvas) **and** keep a markdown version in chat; otherwise markdown only. It may span several messages if long: send them back to back.

## Structure

### 1. ✨ At a glance
A summary card/table, one row per completed test:

| Test | Result |
|---|---|
| 🔭 Astrology | ☉ Aquarius · ☽ Scorpio · ↑ Virgo · 🐉 Fire Dragon · Life path 7 |
| ⚡ Riordanverse | Child of Athena (Cabin 6) · Roman: Minerva, 5th Cohort |
| 🪄 Harry Potter | Ravenclaw (Slytherin close 2nd) · Vine, phoenix feather, 12¾", rigid · Patronus: raven · Horned Serpent |
| 🧠 16P | INTP-T: Logician |
| 🏛️ 12axes | #1 ideology … |

(Example values only.)

### 2. One section per test, in the order they were taken

Each section:
1. **Headline result** with a visual (chart/bars).
2. Short explanation tied to the user's actual answers ("you chose to re-plan rather than charge in: twice").
3. Secondary results.
4. **Most similar figures: 6, #1 featured**:

```
#### 🥇 1. <Name>: <one-line why>
<A full paragraph: specific parallels with the user's answers, where they differ, one memorable detail.>

| # | Figure | Why |
|---|---|---|
| 2 | … | … |
| 3 | … | … |
| 4 | … | … |
| 5 | … | … |
| 6 | … | … |
```

16P and 12axes repeat this block twice: **current** and **historical**. 12axes also gets the ideology, current-country and historical-state blocks in the same shape (#1 featured + table of 5).

### 3. 🔗 Cross-test synthesis
- The through-line: a short portrait combining all results.
- Agreements (e.g. "Athena + Ravenclaw + INTP all point at the analyst").
- Tensions and how they were resolved (borderline dimensions settled with evidence from other tests).
- A small table of "evidence borrowed": which answers from test X shifted test Y.

### 4. Closing
One line of disclaimers (astrology for fun; typings/matches are estimates), then offer: retake a test in depth, compare with a friend, or export the report.

## Visual conventions
- Percent bars: `█` filled, `░` empty, 10 or 20 cells, value at the end.
- Pole bars: `Left 38% ▕████░░░░░░▏ 62% Right`.
- Medals 🥇 for #1; consistent test emojis.
- Charts: houses/parents → bar or radar; 16P → diverging bars; 12axes → 12 diverging bars grouped by category; astrology → element/modality bars (and a wheel if the tool can draw one).
