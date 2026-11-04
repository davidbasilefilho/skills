# Branches and merging

Research dated 2026-11-04. Items marked **verify** were not confirmed against current docs: check them with web search or fetch before relying on them.

## Branches

- `main` and `dev` are the only permanent branches. Protect both: no deletion, no force push.
- Pull requests target `dev`. `dev` merges into `main` through its own pull request.
- Release stack branches (`release/0.Y.Z/...`) are temporary. Delete them after the stack merges.

## Squash only: two layers that must agree

Configure both layers. A ruleset that requires a method the repository setting disables can make merging impossible, so keep them consistent.

1. **Repository settings.** The REST update-repository endpoint (`PATCH /repos/{owner}/{repo}`) takes `allow_squash_merge: true`, `allow_merge_commit: false`, `allow_rebase_merge: false`. **Verify** the field names at https://docs.github.com/en/rest/repos/repos#update-a-repository.
2. **Ruleset.** Create it with `POST /repos/{owner}/{repo}/rulesets` (https://docs.github.com/en/rest/repos/rules):
   - target `branch`, `conditions.ref_name.include` set to `refs/heads/main` and `refs/heads/dev`, enforcement `active`;
   - a `pull_request` rule whose `parameters.allowed_merge_methods` is `["squash"]` (the merge-method parameter has been generally available since 2025-03-24);
   - the `deletion`, `non_fast_forward` and `required_linear_history` rules, and a `required_status_checks` rule listing the version and ZeroVer test job from [Versioning](versioning.md) so an unvalidated change cannot merge. **Verify** these rule names and their parameters.
   - A pattern such as `refs/heads/release/**` may cover the release family in a separate ruleset. **Verify** the pattern syntax.

The stack merge command takes the method explicitly (`--squash`); see [Pull request stacks](stacks.md).

When the repository is not on GitHub, apply the same two layers with the host's equivalents: a project-level merge method setting and a branch protection rule.

## Verify the setup

After configuring, read the settings back through the API or the repository settings page and confirm squash is the only enabled method on both layers. Report what you read, not what you sent.
