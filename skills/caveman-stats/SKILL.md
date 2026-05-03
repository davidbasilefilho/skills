---
name: caveman-stats
description: >
 Show real token usage and estimated savings for current session.
 Reads directly from Claude Code session log — no AI estimation.
 Triggers on /caveman-stats. Output is injected by mode-tracker hook;
 model itself does not compute numbers.
---

This skill is delivered by `hooks/caveman-stats.js` (read by `hooks/caveman-mode-tracker.js` on `/caveman-stats`). model does not need to do anything when this skill fires — hook returns `decision: "block"` with formatted stats as reason. user sees numbers immediately.
