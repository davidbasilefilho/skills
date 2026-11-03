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

## Usage

The agent loads a skill's `SKILL.md` and reads files under its `references/` as needed. Say something like "build me a Clash Royale deck", "plan my card upgrades" or "run the personality test suite".

## Contributing

Read `AGENTS.md` for the rules on skills, commits and the README structure.

## License

See `LICENSE` for repository licensing details.
