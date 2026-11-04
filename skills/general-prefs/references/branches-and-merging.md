# Branches and merging

Research dated 2026-11-04. Items marked **verify** were not confirmed against current docs: check them with web search or fetch before relying on them.

## Branches

- `main` and `dev` are the only permanent branches. Protect both: no deletion, no force push.
- Pull requests target `dev`. `dev` merges into `main` through its own pull request, and `main` is merged back into `dev` afterwards (see below).
- Release stack branches (`release/0.Y.Z/...`) are temporary. Delete them after the stack merges.

## Squash only: two layers that must agree

Configure both layers. A ruleset that requires a method the repository setting disables can make merging impossible, so keep them consistent.

1. **Repository settings.** The REST update-repository endpoint (`PATCH /repos/{owner}/{repo}`) takes `allow_squash_merge: true`, `allow_merge_commit: false`, `allow_rebase_merge: false`. **Verify** the field names at https://docs.github.com/en/rest/repos/repos#update-a-repository.
2. **Ruleset.** Create it with `POST /repos/{owner}/{repo}/rulesets` (https://docs.github.com/en/rest/repos/rules):
   - target `branch`, `conditions.ref_name.include` set to `refs/heads/main` and `refs/heads/dev`, enforcement `active`;
   - a `pull_request` rule whose `parameters.allowed_merge_methods` is `["squash"]` (the merge-method parameter has been generally available since 2025-03-24);
   - the `deletion`, `non_fast_forward` and `required_linear_history` rules, and a `required_status_checks` rule listing the version and ZeroVer test job from [Versioning](versioning.md) so an unvalidated change cannot merge. The version test skips pushes to `main`, so this required check on pull requests into `dev` and `main` is what enforces a new version per `main` commit. **Verify** these rule names and their parameters.
   - A pattern such as `refs/heads/release/**` may cover the release family in a separate ruleset. **Verify** the pattern syntax.

The stack merge command takes the method explicitly (`--squash`); see [Pull request stacks](stacks.md).

When the repository is not on GitHub, apply the same two layers with the host's equivalents: a project-level merge method setting and a branch protection rule.

## Sync main back into dev

A squash merge of `dev` into `main` puts one new commit on `main` that `dev` does not contain. The next `dev` into `main` pull request then diffs against an old merge base and can conflict on changes already released. A squash cannot record the ancestry that removes this, so after every squash merge into `main` a workflow merges `main` back into `dev` with one merge commit. This merge-back is the only exception to squash always, and `main` still gets one commit per release.

Choose the merge by comparing trees:

- `main` only ever received changes through `dev`: its tree equals the tree of a commit already in `dev`. Run `git merge -s ours --no-ff origin/main`. It records `main` as an ancestor and changes no content, so `dev` keeps everything it has gained since. A direct change on `main` whose tree happens to equal an old `dev` commit (a revert to a previous release, for example) is taken as this case and its content is dropped, so land such a change through `dev` instead.
- `main` received a direct fix: no commit in `dev` has its tree. Run a normal `git merge --no-ff origin/main` so the fix reaches `dev`. This merge also carries the release squash commit, so it conflicts whenever `dev` has since touched the same files. Expect this path to need a human: the workflow aborts, opens an issue and fails. It never forces a push or resolves a conflict itself.

```yaml
name: sync-back
on:
  push:
    branches: [main]
concurrency: sync-back
permissions:
  contents: write
  issues: write
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<current major>
        with:
          fetch-depth: 0
          ref: dev
          token: ${{ secrets.SYNC_BACK_TOKEN || github.token }}
      - name: Merge main into dev
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          set -euo pipefail
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          msg="chore: merge main back into dev"
          for attempt in 1 2 3; do
            git fetch origin main dev
            git checkout -B dev origin/dev
            if git merge-base --is-ancestor origin/main HEAD; then
              echo "dev already contains main"
              exit 0
            fi
            # write the trees to a file: grep -q on a pipe can SIGPIPE git log and fail under pipefail
            git log --format=%T origin/dev > "$RUNNER_TEMP/dev-trees"
            if grep -qxF "$(git rev-parse 'origin/main^{tree}')" "$RUNNER_TEMP/dev-trees"; then
              echo "path: ours"
              git merge -s ours --no-ff origin/main -m "$msg"
            elif git merge --no-ff origin/main -m "$msg"; then
              echo "path: normal"
            else
              git merge --abort || true
              echo "path: conflict"
              title="Merge main back into dev needs manual resolution"
              if [ -z "$(gh issue list --state open --search "\"$title\" in:title" --json number --jq '.[].number')" ]; then
                gh issue create --title "$title" \
                  --body "A direct change on main conflicts with dev. Merge origin/main into dev by hand, resolve the conflicts, and push the merge commit. Run: $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
              fi
              exit 1
            fi
            if out=$(git push origin HEAD:dev 2>&1); then
              exit 0
            fi
            echo "$out"
            case "$out" in
              *non-fast-forward*|*"fetch first"*) ;; # dev moved: fetch and retry
              *) exit 1 ;; # rejected for another reason, such as a missing bypass
            esac
          done
          echo "dev kept moving; push failed three times"
          exit 1
```

Notes:

- `dev` rules from this skill (pull request required, squash only, linear history) reject this push. Let the workflow identity bypass them on `dev` only: a ruleset bypass actor for the workflow identity, or a token in `SYNC_BACK_TOKEN` owned by a bypass actor. **Verify** the exact bypass setup (actor type for the GitHub Actions app or a GitHub App, and whether `required_linear_history` must be exempt too) in https://docs.github.com/en/rules/creating-rulesets and the repository settings. The squash-only repository setting does not block a push.
- A push made with `github.token` does not start other workflows. Use a token or app credential in `SYNC_BACK_TOKEN` if required checks must run on the merge commit. **Verify** this behavior in the Actions docs.
- The version test skips this merge commit; see [Versioning](versioning.md). That skip matches only while `origin/main` is still the merge's second parent, so re-running the check after `main` has advanced fails on the equal versions. Re-run the sync-back instead, or merge the newer `main` into `dev` first.
- On hosts other than GitHub, run the same script as a post-merge job in the host's pipeline.

## Verify the setup

After configuring, read the settings back through the API or the repository settings page and confirm squash is the only enabled method on both layers. Report what you read, not what you sent.
