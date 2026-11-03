# Repository rules

Rules for working in this repository, each with the reason it exists. The repository is pure Markdown: skills under `skills/`, no code, build or tooling, so there are no gates to run beyond reading your own diff.

## The session agent

- When the holyagent plugin is present, every session here works as the holyagent root, whatever agent it started as. The root is the default, user-facing agent, which is you. Run all work through an Intent and Assignments dispatched to specialists, without being reminded; a session that read "the root" as someone else's role edited and committed in the main thread.

## Version control

- The root commits only with `holyagent vcs commit`, and uses plain Git and `gh` for branches, pushes, merges and pull requests. It never force-pushes or pushes to a protected branch without the user's approval. After a denial it stops that line of work and reports a blocker, because a workaround through another tool defeats the boundary the user set.
- A specialist makes no version-control writes and no edits under `.git/` or `.holyagent/`, and reports its changed paths for the root to record. Nothing blocks these writes, so the rule rests on the instruction.
- Pass `holyagent vcs pr --body-file` an unignored file inside the project. Files outside the project or ignored by Git are rejected, so a scratch file will not work.

## Commits and pull requests

- Write commits and pull request text in English and follow Conventional Commits, so history reads the same everywhere and tools can parse it.
- Write as the author, in first person or neutral voice, about what the change does and why. Leave out agents, Claude, sessions, "the user" and attribution trailers: the text belongs to the author, and `holyagent vcs` refuses process words.

## Writing

- Write English with no em dashes; restructure the sentence instead. This keeps one voice across every file.
- Keep user-specific data (player tags, names, accounts, clans) out of the repository, because a skill is shared by everyone who installs it.

## Skill authoring

- Make each skill model-agnostic, harness-agnostic and environment-agnostic: describe capabilities such as a structured question tool, visualization, web search or fetch, code execution and memory, and never name a specific tool. A skill that names a tool breaks anywhere that tool is missing.
- Still tell the agent to use the capabilities its environment or harness offers, with a stated fallback for each when it is absent. Agnostic does not mean minimal: the richer option gives a better answer when it exists.
- Start the `description` with the situation, then what the skill does, so a model can tell when to load it.
- Keep `SKILL.md` lean and put detail in `references/`, linked from `SKILL.md`, so the agent loads detail only when it needs it.
- Have each skill offer, at the end of a session, to update itself with general lessons the session surfaced, and never with the player's or user's own data. This is how corrections reach the next user.

## The README

- Keep `README.md` to exactly these sections, in this order: `# Basile Skills` (what the repository is), `## Install` (how to add the skills), `## Included skills` (one line per skill), `## Usage` (how to invoke them), `## Contributing` (points to this file) and `## License` (points to `LICENSE`). A reader finds the same things in the same place, and detail stays in each skill, so the README cannot drift from it.
- Update the README whenever a skill is added, renamed or removed.
