# Implementation Plan

## Goal
Apply the compress skill to every eligible text file under `./skills`, excluding `ulw`, `shadcn`, `cave*`, and `compress`.

## Tasks
1. **Define the target file set**: Enumerate all text files under `./skills` and filter out excluded skill trees.
   - File: `./skills/**`
   - Changes: Treat eligible files as markdown and other text files such as `SKILL.md`, `README.md`, `WARP.md`, `cli.md`, `customization.md`, `mcp.md`, and `rules/*.md`, while excluding anything under `./skills/ulw/`, `./skills/shadcn/`, `./skills/cave*/`, and `./skills/compress/`.
   - Acceptance: A final file list exists before any edits, and it contains no excluded paths.

2. **Run compression on eligible files only**: Invoke the compress skill once per target file, preserving code blocks, backticks, URLs, and technical terms.
   - File: each file in the target set
   - Changes: Overwrite each file with its caveman-compressed version and create `.original.md` backups as the skill requires.
   - Acceptance: Every eligible file is processed successfully, and no excluded file is modified.

3. **Verify results and exclusions**: Check that backups were created and that excluded directories remained unchanged.
   - File: processed targets plus exclusion paths
   - Changes: Compare a sample or full diff of compressed files, confirm `.original.md` backups exist for edited files, and confirm excluded paths have no diffs.
   - Acceptance: Modified files show compressed prose, backups are present, and excluded trees are untouched.

## Files to Modify
- `./skills/**` - eligible text files only, excluding `ulw`, `shadcn`, `cave*`, and `compress` trees.

## New Files
- `./skills/**/*.original.md` - human-readable backups created by the compress workflow.

## Dependencies
- Task 1 must complete before Task 2.
- Task 2 must complete before Task 3.

## Risks
- The exclusion rule `cave*` is broad and may exclude both `cavecrew` and `caveman*` trees, so the exact match scope should be confirmed before execution.
- Mixed-content markdown files may contain code blocks that must remain verbatim.
- If any non-markdown text files exist under `./skills`, they need manual review to confirm they are safe to compress.
