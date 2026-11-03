---
name: weight-space-programming
description: Read, fix or write a neural network by reasoning about its weights directly, with no training. Use to tell what a network does from its weights, find why it fails, repair a failing model by targeted weight edits, hand-write a small network from scratch, or audit and compare checkpoints. Triggers include "edit the weights", "what does this network do", "fix this model without training", "write the weights by hand", "why does this checkpoint behave differently", "weight surgery". Covers reading and editing protocol, held-out evaluation, edit logs and honest reporting of gains.
---

# Weight-Space Programming

Treat a trained network as a program you can read and patch. Read weights, form a hypothesis about what a part computes, change a few numbers on purpose, test, and keep the change only if it helps. Writing a small network from scratch works the same way, with the weights as the source code.

This skill is model-, harness- and environment-agnostic. It names no tools. Use whatever you have: file access to open checkpoints, code execution to inspect and edit tensors and run forward passes, web access to look up an architecture or a paper, a scratch area for logs. If you have none of these, reason over weights pasted as text and say that is what you are doing. Naming a capability is always shorthand for "whatever your environment offers for it". Never claim one you do not have.

Concept details, worked examples and source URLs are in `references/techniques.md`. Read it when picking a method.

## Goal and rules

Goal: change what a network does by understanding it, and show the change with evidence.

1. **Edit by reasoning.** Do not use gradient descent, backpropagation, training loops, fine-tuning or iterative fitting to data, unless the user explicitly allows it. The point is that every edit has a reason you can state. Closed-form edits (a projection, a rank-one update, a hand-set value) are fine.
2. **Work on a copy.** Never overwrite or modify the original weights. Write edited weights to a new path and keep the original intact so every edit can be undone and compared.
3. **Ask before cost.** Ask first before large downloads, long runs or anything that costs real compute or money. State the estimate.
4. **Respect budgets.** If the user limits forward passes, runs, tokens or time, stay within the limit and count against it. If the user bans forward passes, do not run the model.
5. **Do not touch what you were not asked to change.** Keep edits local to the parts your hypothesis names. Embedding, output and final normalization layers are high-risk: edit them only with a stated reason.

## Working with what you have

Inventory your capabilities before starting, including ones you must load or search for.

| Capability | Use it for | If absent |
|---|---|---|
| File access | Open checkpoints and configs, write the edited copy and logs | Work from weights the user pastes |
| Code execution | Slice tensors, compute norms, matrix products, projections, apply edits, hash files | Compute small cases by hand and show the arithmetic |
| Forward passes | Baseline, practice runs, held-out eval, activations and attention patterns | Reason from weights only, and say verification is missing |
| Web | Architecture docs, model cards, papers, known tricks | Rely on `references/techniques.md` and say its date |
| Scratch notes | Edit log, results table | Keep the log in the conversation |

Large tensors do not fit as text. Without code execution, read only the slices your hypothesis needs, and say what you did not read.

## Workflow

### 1. Understand the spec

Pin down the task before opening weights: what the network should do, what it does wrong, how success is scored, which observations and compute are allowed, and what may be edited. Ask if any of these is unclear and the answer changes the plan.

### 2. Inspect architecture and formats

- Read the config or the code that defines the model: layer count, widths, heads, activation functions, normalization, positional scheme, vocabulary.
- Learn the storage format: tensor names, shapes, dtype, sharding, any quantization. Check that a tensor you edit round-trips through save and load.
- Check weight tying. If the output layer shares the input embedding matrix, an edit to one token's embedding row also changes that token's output logit direction. Verify tying from the config and the loaded tensors; do not assume it either way.
- Note conventions that cause silent errors: whether a linear layer stores weights as (out, in) or (in, out), row versus column meaning, fused projections that pack several matrices into one tensor.

### 3. Form hypotheses

Before reading deeply, write down what you expect to find and what edit it would imply. Prefer hypotheses of the form "this behavior is hidden or suppressed by a small component, and removing or damping it exposes it." These are far more likely to work than "this network lacks a skill, so I will add it". See *Expectations and limits*.

### 4. Read

Locate structure in the weights: which inputs a unit attends to, which outputs it writes, which directions a layer adds to the residual stream, which heads compose. Use the reading methods in `references/techniques.md`. When forward passes are allowed, collect activations or attention patterns on inputs you wrote yourself, and use them. Reading weights alone can fail (see the sycophancy case), and allowed observations are a legitimate way past that.

### 5. Edit

Make the smallest change that tests the hypothesis. Prefer one component at a time. Apply it to the copy. Record it in the edit log before testing.

### 6. Test

Run the practice set and compare to the baseline. Also check the secondary metrics from *Honesty about results*.

### 7. Keep or revert

Keep an edit only if it helps on the practice set and nothing it should not touch got worse. Otherwise restore the previous values from the log and record the failure; failed edits are information. Do not stack speculative edits: each kept edit earns its place with a measured gain.

### Writing a network from scratch

When there are no weights to fix, specify the task, work out the computation by reasoning, set the weights layer by layer, and test against a trivial baseline such as an all-zero or random network. Then run the same practice, keep-or-revert and held-out steps. See the writing entries in `references/techniques.md`.

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

## Expectations and limits

- **Look for a switch before adding ability.** The verified wins so far removed or damped something that was hiding existing behavior: a repetition direction, a local-minimum trap in a policy. A report that nudging opener-token embeddings helps a small model is unverified. Adding genuinely new skill to a language model by hand did not work in the reported cases (see the Gemma case in `references/techniques.md`).
- **Failure from ordinary mistakes has no switch.** If the model is wrong the way a weak model is wrong in arithmetic or reasoning, with no single component to turn off, expect little or nothing from edits.
- **Reading from weights alone can fail.** Differences between two checkpoints are easy to find and hard to map to behavior, as the sycophancy case showed. Use allowed observations such as activations, attention patterns or logit probes to narrow where to look.
- **Small networks are the sweet spot.** Hand-writing or hand-fixing works best on small, structured networks (a game-playing MLP, a policy, a tiny transformer). Scale and context length limit what fits in a reply or a pass.
- **Evidence is thin.** The main reported results come from one self-published source using one proprietary model, and appear to use one run per condition. Treat the numbers as indicative and replicate before relying on them.

## When to stop and ask

Beyond the stops already in the rules (cost, original weights, high-risk layers, budgets), stop and ask the user, with the question and your recommendation, when:

- the task or scoring rule is unclear, or no held-out data exists and you cannot build any;
- the only path forward needs training, a forward pass, or an observation the user ruled out;
- results contradict the hypothesis twice in a row and you have no new hypothesis;
- the requested change is a skill the network lacks, and the evidence says edits will not add it. Say so and offer the options (unlock a hidden behavior, accept a limit, or allow training).

## Final report

Give: task and scoring, baseline, each kept edit (location, transform, reason), number and share of weights changed, practice and held-out results with the secondary metrics, what kind of gain it is, variance, forward passes and runs used against the budget, failed attempts, and the path and hash of the edited copy. Everything beyond what you verified is labelled as such.

## Bundled files

- `references/techniques.md`: catalog of reading, editing, writing and background techniques, each with when it fits, how it worked in the source, and a source URL. Includes worked examples, the Qwen loop-fix finding and the documented failures.
