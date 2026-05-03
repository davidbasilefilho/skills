# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## What this repo is
This repository is **Claude Code skill** implemented entirely as Markdown.

 “runtime” artifact is `SKILL.md`: Claude Code reads YAML frontmatter (metadata + allowed tools) and prompt/instructions that follow.

`README.md` is for humans: installation, usage, and compact overview of patterns.

## Key files (and how they relate)
- `SKILL.md`
- actual skill definition.
- Starts with YAML frontmatter (`---` … `---`) containing `name`, `version`, `description`, and `allowed-tools`.
- After frontmatter is editor prompt: canonical, detailed pattern list with examples.
- `README.md`
- Installation and usage instructions.
- Contains summarized “29 patterns” table and short version history.

When changing behavior/content, treat `SKILL.md` as source of truth, and update `README.md` to stay consistent.

## Common commands
### Install the skill into Claude Code
Recommended (clone directly into Claude Code skills directory):
```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

Manual install/update (only skill file):
```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md ~/.claude/skills/humanizer/
```

## How to “run” it (Claude Code)
Invoke skill:
- `/humanizer` then paste text

## Making changes safely
### Versioning (keep in sync)
- `SKILL.md` has `version:` field in its YAML frontmatter.
- `README.md` has “Version History” section.

If you bump version, update both.

### Editing `SKILL.md`
- Preserve valid YAML frontmatter formatting and indentation.
- Keep pattern numbering stable unless you’re intentionally re-numbering (since README table and examples reference same numbering).

### Documenting non-obvious fixes
If you change prompt to handle tricky failure mode (e.g., repeated mis-edit or unexpected tone shift), add short note to `README.md`’s version history describing what was fixed and why.
