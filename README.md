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

- `personality-test-suite` - Interactive battery of five tests (Harry Potter, Riordanverse, 16Personalities-style type, 12axes political values, astrology) with batched multiple-choice questions and one cross-referenced results report at the end, including the 6 most similar figures per test

## Usage

Skills follow the open Agent Skills format and work in any harness that supports it. The agent loads `SKILL.md` and reads files under `references/` as needed. Say something like "test my personality" or "run the personality test suite".

## Repository structure

```text
skills/
  <skill-name>/
    SKILL.md
    references/
```

## Contributing

- Keep each skill focused on a single job
- Prefer clear, direct instructions over duplicated guidance
- Update this README when adding or renaming skills

## License

See `LICENSE` for repository licensing details.
