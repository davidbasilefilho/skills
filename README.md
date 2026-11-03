# Basile Skills

A collection of agent skills by David Basile Filho.

## Install

<details>
<summary>Bun</summary>

```bash
bunx --bun skills add davidbasilefilho/skills
```

</details>
<details>
<summary>npm</summary>

```bash
npx -y skills add davidbasilefilho/skills
```

</details>

## Included skills

- `clash-royale-strategies` - Builds and reviews Clash Royale decks and upgrade plans from the player's real data (API profile, battlelog, wild cards), with a bundled Node CLI that fetches a profile and battlelog by player tag
- `personality-test-suite` - Interactive battery of five tests (Harry Potter, Riordanverse, 16Personalities-style type, 12axes political values, astrology) with batched multiple-choice questions and one cross-referenced results report at the end, including the 6 most similar figures per test
- `weight-space-programming` - Reads, fixes and hand-writes neural networks by reasoning about their weights without training, with a baseline, held-out evaluation, edit log and honest reporting of what a gain really is

## Usage

Skills follow the open Agent Skills format and work in any harness that supports it. The agent loads `SKILL.md` and reads files under `references/` as needed. Say something like "test my personality" or "run the personality test suite".

## Repository structure

```text
skills/
  <skill-name>/
    SKILL.md
    references/
    scripts/
```

## Development

Tooling runs on Bun (see `mise.toml`).

```bash
bun install     # also installs the lefthook hooks
bun run check   # oxlint (type-aware via oxlint-tsgolint), tsc, oxfmt --check
bun run fmt     # format with oxfmt
```

Code lives in `src/` and uses [Effect](https://effect.website) for every effect: async work, errors and validation. Promises, `async`/`await`, `try`/`catch` and `throw` are only allowed inside `src/**/adapters/**`; elsewhere wrap them with `Effect.tryPromise` or `Effect.try`. The `effect-only` oxlint plugin in `lint/` enforces this.

Skill scripts are bundled from `src/` into single Node files with `bun run build`. The lefthook pre-commit hook runs the checks and, when `src/` changes, rebuilds and stages the bundles.

Fetch a Clash Royale profile and battlelog (needs a token from developer.clashroyale.com):

```bash
CLASH_ROYALE_API_TOKEN=... bun run cr:profile '#TAG' --out profile.json
```

## Contributing

- Keep each skill focused on a single job
- Prefer clear, direct instructions over duplicated guidance
- Update this README when adding or renaming skills

## License

See `LICENSE` for repository licensing details.
