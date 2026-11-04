# Evaluation, logging and reporting

Detail for steps 6 and 7 of the workflow in `SKILL.md`. Read it before the first edit is tested and again before writing the final report.

## Experiment protocol

1. **Baseline first.** Measure the unedited network on your practice set and held-out eval before any edit. Use the same settings (sampling, token limit, prompt format) for every later run.
2. **Two sets.** The practice set is what you may look at, run and learn from. The held-out eval is data you never tune on, never inspect failures from and run only to report. If the user supplies one set, split it before starting. If you cannot get a held-out set, say the result is unvalidated.
3. **Edit log.** Keep one entry per edit with:
   - location (tensor name and indices, or the region touched);
   - old and new values, or the transform applied (for example "remove direction u from output columns 0 to 63 of tensor T, strength a");
   - the hypothesis behind it;
   - the result on the practice set, and on the held-out eval only at the end;
   - a hash of the edited file, or a diff against the original, so anyone can reproduce the state after that entry.
4. **Count the change.** Report how many weights changed and what share of the total that is. When editing an existing network, small shares are the usual pattern in the reported cases, and a large share suggests you are retraining by other means. This does not apply to a network written from scratch.
5. **Budget.** Count forward passes and runs as you go and stay within any limit the user set. Spend early passes on the baseline and on the most informative probes.
6. **Repeat.** Single runs vary with sampling and seeds. Repeat the baseline and the final comparison when the cost allows, and report the spread or say it is unmeasured.

## Honesty about results

- **Score strictly.** Use the task's own correctness rule, not a lenient one. Do not hand-grade in a way that favors the edit.
- **Add secondary metrics that could expose a fake gain.** Examples: share of outputs cut off by a token limit or stuck in repetition, format-only changes (the answer is the same but is now in the expected shape), rate of reaching a right answer by wrong work, output length, and regressions on unrelated prompts. Report them next to the headline number.
- **Compare against a fair baseline.** Where relevant, also run a capped baseline (same token limit or time limit as the edited model) and a thinking-off or reasoning-off baseline. A gain that disappears against that baseline was a different fix than it looked.
- **Name the kind of gain.** Say plainly when a gain is an unlock of behavior the network already had (a loop removed, a format restored, a start token favored) and not new capability. Say when you cannot tell.
- **Report variance and limits.** One run per condition is weak evidence. Note the size of the eval set and what error bars that implies. Note any rule you bent.
- **Report failures.** Include edits that did not work and the approaches that were tried and dropped.
- **Separate verified from reported.** Claims you read from a blog, forum or card are unverified until you reproduce them. Say which is which.

## Final report

Give: task and scoring, baseline, each kept edit (location, transform, reason), number and share of weights changed, practice and held-out results with the secondary metrics, what kind of gain it is, variance, forward passes and runs used against the budget, failed attempts, and the path and hash of the edited copy. Everything beyond what you verified is labelled as such.
