# Pull request stacks

Research dated 2026-11-04. Sources: https://docs.github.com/en/pull-requests/reference/stacked-pull-requests, https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands and https://github.com/github/gh-stack. Stacked pull requests are new and move fast: check the current docs before relying on a flag.

A stack is a chain of pull requests in one repository where each pull request targets the branch below it and the whole stack lands on one trunk. Here the trunk is `dev`. Stacks are same-repository only (no forks) and are not supported in GitHub Desktop.

## Setup

`gh stack` is an extension of the `gh` CLI. It needs gh 2.0+ and Git 2.36+.

- Install: `gh extension install github/gh-stack`. Update: `gh extension upgrade stack`.
- An agent skill for it is installable with `gh skill install github/gh-stack`.

## Commands

| Task | Command |
|---|---|
| Start a stack on `dev` with explicit names | `gh stack init --base dev release/0.5.0/version` |
| Add the next branch (run on the topmost branch) | `gh stack add release/0.5.0/feat/api` |
| Inspect | `gh stack view` (`--short`, `--json`) |
| Move around | `up`, `down`, `top`, `bottom`, `trunk`, `switch`, `checkout` |
| Push, open pull requests with correct bases, link them as a stack | `gh stack submit` |
| Push only (atomic, `--force-with-lease`) | `gh stack push` |
| Rebase after changes below or after a merge | `gh stack rebase` (`--upstack`, `--downstack`, `--continue`, `--abort`) |
| Sync with remote | `gh stack sync` (`--prune`) |
| Merge | `gh stack merge --squash -y` |

Rules from the docs:

- `init` and `add` take the branch names you give. No naming-prefix flag was found (**verify**), so always pass explicit names following the scheme in `SKILL.md`. `gh stack add -m` without a name auto-generates a `MM-DD-slug` name that breaks the scheme.
- `gh pr merge` cannot merge a stack. Use `gh stack merge`, and pass `--squash` explicitly (there is no default method), plus `-y` when non-interactive. It cannot bypass rules.
- Required reviews, status checks, CODEOWNERS and Actions are evaluated against the stack base (`dev`) for every pull request in the stack, and `pull_request` workflows targeting that base run for every pull request.
- Every pull request below must pass, and history must be linear between branches: run `gh stack rebase`, then `gh stack push`.
- After the bottom pull request is squash-merged, `gh stack rebase` detects it and replays the rest with `--onto`, so no spurious conflicts appear.
- Squash on a stack yields one squashed commit per pull request.

## Fallback without native stack support

If the host or CLI lacks stack support, or the extension cannot be installed: create the same branches by hand with the same names, open one pull request per branch whose base is the branch below it (the first one targets `dev`), and merge from the bottom up with squash, retargeting the next pull request to `dev` and rebasing it onto `dev` after each merge. State to the user that the stack is manual. Stacks managed with other tools (git-town, Jujutsu, Sapling) can still be published as a GitHub stack with `gh stack link`; those tools were not researched further.
