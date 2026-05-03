# Security

## Snyk High Risk Rating

`caveman-compress` receives Snyk High Risk rating due to static analysis heuristics. This document explains what skill does and does not do.

### What triggers the rating

1. **subprocess usage**: skill calls `claude` CLI via `subprocess.run()` as fallback when `ANTHROPIC_API_KEY` is not set. subprocess call uses fixed argument list — no shell interpolation occurs. User file content is passed via stdin, not as shell argument.

2. **File read/write**: skill reads file user explicitly points it at, compresses it, and writes result back to same path. `.original.md` backup is saved alongside it. No files outside user-specified path are read or written.

### What the skill does NOT do

- Does not execute user file content as code
- Does not make network requests except to Anthropic's API (via SDK or CLI)
- Does not access files outside path user provides
- Does not use shell=True or string interpolation in subprocess calls
- Does not collect or transmit any data beyond file being compressed

### Auth behavior

If `ANTHROPIC_API_KEY` is set, skill uses Anthropic Python SDK directly (no subprocess). If not set, it falls back to `claude` CLI, which uses user's existing Claude desktop authentication.

### File size limit

Files larger than 500KB are rejected before any API call is made.

### Reporting a vulnerability

If you believe you've found genuine security issue, please open GitHub issue with label `security`.
