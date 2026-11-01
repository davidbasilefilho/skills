# 🏛️ 12axes political values

Modelled on 12axes (politicaltests.github.io/12axes), a fork of 9axes/8values: 12 axes in 4 categories, statements answered on an agreement scale, results as percentages per pole. Write original statements; don't copy the site's bank.

## Axes

| Category | Axis | First pole favours | Second pole favours |
|---|---|---|---|
| Governmental | Federal ↔ Unitary | Strong local government, decentralisation | Strong national government |
| Governmental | Democratic ↔ Autocratic | Rule by the people's choice | Leaders not chosen by vote guiding the populace |
| Governmental | Security ↔ Freedom | Government prioritising safety | Government staying out of private lives |
| Diplomatic | Nationalism ↔ Internationalism | Nation first, few alliances | International bodies, cooperation |
| Diplomatic | Militarist ↔ Pacifist | Military strength and action | Diplomacy, lower military spending |
| Diplomatic | Assimilationist ↔ Multiculturalist | Immigrants adopt national culture | Many cultures coexisting |
| Economic | Collectivize ↔ Privatize | Equal distribution of wealth and power | Private ownership, economic hierarchy |
| Economic | Planned ↔ Laissez-Faire | Planned economy | Free-market distribution |
| Economic | Isolationism ↔ Globalism | Local production, tariffs, self-reliance | International free trade |
| Societal | Irreligious ↔ Religious | Opposes belief in a higher power / religion in public life | Supports religious belief and its role |
| Societal | Progressive ↔ Traditional | Social change, acceptance of minorities | Traditional norms and moral restraint |
| Societal | Acceleration ↔ Bioconservative | Rapid tech and scientific advance | Slowing or reversing advancement |

## Questions

- Quick: **2 per axis = 24** (one keyed to each pole). In depth: **5 per axis = 60** (mixed keying).
- Scale: A) Strongly agree · B) Agree · C) Neutral · D) Disagree · E) Strongly disagree. 4-option fallback per SKILL.md.
- **Extremely localized**: write every statement for the user's own country, in its real institutions, laws, terminology and current context (e.g. its actual form of government, legislature, courts, federal units, currency, public services). Never assume a premise that doesn't fit that system (e.g. asking about plebiscites for every constitutional amendment in a representative democracy as if direct democracy were the norm). If the country is unknown and can't be inferred, ask it before the first 12axes batch.
- Concrete policy-flavoured statements. Avoid loaded wording that signals the "right" answer. Interleave axes and categories.
- **Pole tag**: every axis statement starts with the pole that agreeing pushes toward, in capitals and brackets, translated into the user's language: `[SECULAR]`, `[RELIGIOUS]`, `[UNITARY]`, `[FEDERAL]`, `[SECURITY]`, `[FREEDOM]`… (in Portuguese, e.g. `[SECULAR]`, `[RELIGIOSO]`, `[UNITÁRIO]`). Use short, natural pole names for that language. Closing-block items don't get pole tags. This is the one exception to the *Non-revealing* quality rule.

## Closing block

Right after the last axis question, ask a closing block: **5 questions in quick mode, 10 in depth**. Same test, still numbered `12ax n/N` (quick N = 29, in depth N = 70), counted in the run plan and the task list. Every item is skippable (say so in the question), never changes the axis scores, and its results are described neutrally like the rest of 12axes.

| Part | Quick | In depth | Content | Kind |
|---|---|---|---|---|
| Recent national issues | 3 | 6 | Agreement-scale statements on current, concrete debates in the user's country | Single-choice (agreement scale) |
| Religion | 1 | 2 | The user's own relationship with religion; in depth also how much it shapes their political views | Single-choice |
| Other context | 1 | 2 | Which issues matter most to them; whether to include their own country's figures and parties in the matches | Issues: multi-select, capped at half the options; inclusion: single-choice |

**Recent national issues**
- Find the user's country from Step 2b or memory; if unknown, ask it as the first item of the block.
- Look up current debates at run time with web search when available, never from memory alone. Without web access, say so in one line and use the most recent debates you know, labelled with their approximate date.
- Pick concrete, currently debated issues (a bill, a reform, a public controversy), not general axis questions in disguise.
- Word each statement neutrally, with both sides keyed across the set (some items agreeing with one side, some with the other), and no loaded terms from either side's vocabulary.
- Use the answers to refine the closest current political figures and parties and the local-context note, not the axis percentages.

**Religion**
- Example options: religious and practising · religious, not practising · spiritual, no religion · agnostic · atheist (free text always allowed).
- In depth, second item: how much personal belief shapes their political views (agreement scale or a 4-step "not at all → strongly").
- Keep it separate from the Irreligious ↔ Religious axis: the axis measures views on religion's role in public life, this measures personal belief. In the results, explain any gap between the two (e.g. personally religious but favouring a secular state, or the reverse).

**Other context**
- Issues that matter most: 6–8 broad areas (economy, security, health, education, environment, corruption, rights and freedoms, foreign policy…), "pick up to N" with N = half the options, rounded down. Use it to weight which figures and parties are most relevant, not the scores.
- Own-country figures and parties: include / don't include / only as a separate note. This is the one question about figure scope the skill asks; it never removes other figure types.

## Scoring

Per axis: compare to the maximum possible and show both poles as percentages summing to 100 (e.g. `Security 38% ▕████░░░░░░▏ 62% Freedom`). Classify each axis's lean: 50–60 neutral/centrist, 60–75 moderate, 75–90 strong, 90+ extreme.

## Results (each list: 6 items, #1 is the centre of attention)

1. **Axis bars** grouped by category (chart if a visual tool exists).
2. **6 closest ideologies**: #1 with a full section: core ideas, where it matches the user axis by axis, where it doesn't. Then #2–6 one or two lines each, with match %.
3. **6 closest current countries** (present-day political systems/policies): #1 featured.
4. **6 closest historical states/polities** (e.g. a republic, empire or regime from a specific era): #1 featured, with era.
5. **6 closest current political figures** and **6 closest historical figures/thinkers**, #1 of each featured. Current figures are refined by the closing block's national-issue answers and, if the user agreed, include their own country's figures and parties.
6. **Local context note**: where the user sits on the national issues asked, which local parties/figures are closest on them, and the personal-religion vs. axis comparison.

Matching is by public record and positions, described neutrally: say where the match is and where it breaks down. No endorsement or condemnation of any figure, party, country or ideology, including the user's own result. Cover the full spectrum of possibilities honestly: the closest match is the closest match, whatever its side.
