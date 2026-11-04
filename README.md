# Basile Skills

A collection of agent skills by David Basile Filho, written as plain Markdown for any agent that supports the Agent Skills format.

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

- `clash-royale-strategies` - Builds and reviews Clash Royale decks and upgrade plans from the player's real data (player tag lookup, deck screenshots, battle history, wild cards), with no API key needed
- `personality-test-suite` - Interactive battery of five tests (Harry Potter, Riordanverse, 16Personalities-style type, 12axes political values, astrology) with batched multiple-choice questions and one cross-referenced results report at the end, including the 6 most similar figures per test
- `bun-prefs` - Enforces the owner's Bun preferences: caret ranges with zeroed lower parts, Bun workspaces, a single version source, and everything tested
- `bun-stack-prefs` - Applies the owner's Bun-based tooling: Bun APIs versus portable targets, oxlint, oxfmt, tsrs, `bun test` and `bun run` scripts
- `general-prefs` - Enforces the owner's repository preferences: squash and merge always, `main` and `dev` as the permanent branches, a version higher than main on every change, release branch pull request stacks, and ZeroVer validated by tests
- `react-prefs` - Enforces the owner's React preferences: Activity for every visibility toggle, ViewTransition wherever it fits, and React Compiler with its best practices
- `upgrade-deps` - Upgrades a lockfile within the declared ranges, or bumps the declared dependencies to the latest version in the `bun-prefs` range format and relocks, for any package manager
- `web-stack` - Applies the owner's web stack: React with the TanStack libraries, TanStack Router or Start, Convex with TanStack DB, Base UI, Tailwind CSS and `cn`

## Usage

The agent loads a skill's `SKILL.md` and reads files under its `references/` as needed. Say something like "build me a Clash Royale deck", "plan my card upgrades" or "run the personality test suite".

## Contributing

Read `AGENTS.md` for the rules on skills, commits and the README structure.

## License

See `LICENSE` for repository licensing details.
