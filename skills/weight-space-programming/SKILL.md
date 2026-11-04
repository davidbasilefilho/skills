---
name: weight-space-programming
description: Use when a neural network has to be understood, repaired, written or compared by reasoning about its weights, with no training. Reads weights, forms and tests hypotheses with targeted edits to a copy, hand-writes small networks, and reports gains with a baseline, held-out evaluation and an edit log. Triggers include "edit the weights", "what does this network do", "fix this model without training", "write the weights by hand", "why does this checkpoint behave differently", "weight surgery".
---

# Weight-Space Programming

Treat a trained network as a program you can read and patch. Read weights, form a hypothesis about what a part computes, change a few numbers on purpose, test, and keep the change only if it helps. Writing a small network from scratch works the same way, with the weights as the source code.

Techniques, worked examples and source URLs are in [references/techniques.md](references/techniques.md). Read it when picking a method. Logging, scoring and report requirements are in [references/evaluation.md](references/evaluation.md). Read it before testing the first edit.

## Goal and rules

Goal: change what a network does by understanding it, and show the change with evidence.

1. **Edit by reasoning.** Do not use gradient descent, backpropagation, training loops, fine-tuning or iterative fitting to data, unless the user explicitly allows it. The point is that every edit has a reason you can state. Closed-form edits (a projection, a rank-one update, a hand-set value) are fine.
2. **Work on a copy.** Never overwrite or modify the original weights. Write edited weights to a new path and keep the original intact so every edit can be undone and compared.
3. **Ask before cost.** Ask first before large downloads, long runs or anything that costs real compute or money. State the estimate.
4. **Respect budgets.** If the user limits forward passes, runs, tokens or time, stay within the limit and count against it. If the user bans forward passes, do not run the model.
5. **Do not touch what you were not asked to change.** Keep edits local to the parts your hypothesis names. Embedding, output and final normalization layers are high-risk: edit them only with a stated reason.

## Working with what you have

Inventory your environment's capabilities before starting, including ones you must load or search for, and use each one it offers: the richer option gives a better answer. Naming a capability here is shorthand for whatever the environment provides for it. Never claim one you lack.

| Capability | Use it for | If absent |
|---|---|---|
| File access | Open checkpoints and configs, write the edited copy and logs | Work from weights the user pastes |
| Code execution | Slice tensors, compute norms, matrix products, projections, apply edits, hash files | Compute small cases by hand and show the arithmetic |
| Forward passes (through code execution or a model runtime) | Baseline, practice runs, held-out eval, activations and attention patterns | Reason from weights only, and say verification is missing |
| Web search and fetch | Architecture docs, model cards, papers, known tricks | Rely on `references/techniques.md` and say its date |
| Structured questions | Ask the user about the spec, budgets and costs with options and a recommendation | Ask in plain text with the same options |
| Visualization | Plot weight matrices, attention patterns, and before and after metrics | Describe the structure in a text table |
| Memory | Recall general lessons about this method from earlier sessions | Skip it; rely on this skill |
| Scratch notes | Edit log, results table | Keep the log in the conversation |

Large tensors do not fit as text. Without code execution, read only the slices your hypothesis needs, and say what you did not read.

## Workflow

1. **Understand the spec.** Pin down the task before opening weights: what the network should do, what it does wrong, how success is scored, which observations and compute are allowed, and what may be edited. Ask if any of these is unclear and the answer changes the plan.
2. **Inspect architecture and formats.**
   - Read the config or the code that defines the model: layer count, widths, heads, activation functions, normalization, positional scheme, vocabulary.
   - Learn the storage format: tensor names, shapes, dtype, sharding, any quantization. Check that a tensor you edit round-trips through save and load.
   - Check weight tying. If the output layer shares the input embedding matrix, an edit to one token's embedding row also changes that token's output logit direction. Verify tying from the config and the loaded tensors; do not assume it either way.
   - Note conventions that cause silent errors: whether a linear layer stores weights as (out, in) or (in, out), row versus column meaning, fused projections that pack several matrices into one tensor.
3. **Form hypotheses.** Before reading deeply, write down what you expect to find and what edit it would imply. Prefer "this behavior is hidden or suppressed by a small component, and removing or damping it exposes it" over "this network lacks a skill, so I will add it". See *Expectations and limits*.
4. **Read.** Locate structure in the weights: which inputs a unit attends to, which outputs it writes, which directions a layer adds to the residual stream, which heads compose. Use the reading methods in `references/techniques.md`. When forward passes are allowed, collect activations or attention patterns on inputs you wrote yourself. Reading weights alone can fail, and allowed observations are a legitimate way past that.
5. **Edit.** Make the smallest change that tests the hypothesis, one component at a time, on the copy. Record it in the edit log before testing.
6. **Test.** Run the practice set and compare to the baseline, with the secondary metrics from `references/evaluation.md`.
7. **Keep or revert.** Keep an edit only if it helps on the practice set and nothing it should not touch got worse. Otherwise restore the previous values from the log and record the failure; failed edits are information. Do not stack speculative edits: each kept edit earns its place with a measured gain.

### Writing a network from scratch

When there are no weights to fix, specify the task, work out the computation by reasoning, set the weights layer by layer, and test against a trivial baseline such as an all-zero or random network. Then run the same practice, keep-or-revert and held-out steps. See the writing entries in `references/techniques.md`.

## Evidence discipline

Measure a baseline before any edit. Keep a practice set you may learn from apart from a held-out set you never tune on. Log every edit with its location, transform, hypothesis, result and a hash or diff. Report how many weights changed. Score strictly, add secondary metrics that could expose a fake gain, and say whether a gain is an unlock of existing behavior or new capability. The full protocol and report contents are in `references/evaluation.md`.

## Expectations and limits

- **Look for a switch before adding ability.** The verified wins so far removed or damped something that was hiding existing behavior: a repetition direction, a local-minimum trap in a policy. Adding genuinely new skill to a language model by hand did not work in the reported cases (see *Documented limits* in `references/techniques.md`).
- **Failure from ordinary mistakes has no switch.** If the model is wrong the way a weak model is wrong in arithmetic or reasoning, with no single component to turn off, expect little or nothing from edits.
- **Reading from weights alone can fail.** Differences between two checkpoints are easy to find and hard to map to behavior. Use allowed observations such as activations, attention patterns or logit probes to narrow where to look.
- **Small networks are the sweet spot.** Hand-writing or hand-fixing works best on small, structured networks (a game-playing MLP, a policy, a tiny transformer). Scale and context length limit what fits in a reply or a pass.
- **Evidence is thin.** The main reported results come from one self-published source using one proprietary model, and appear to use one run per condition. Treat the numbers as indicative and replicate before relying on them.

## When to stop and ask

Beyond the stops already in the rules (cost, original weights, budgets), stop and ask the user, with the question and your recommendation, when:

- the task or scoring rule is unclear, or no held-out data exists and you cannot build any;
- the only path forward needs training, a forward pass, or an observation the user ruled out;
- results contradict the hypothesis twice in a row and you have no new hypothesis;
- the requested change is a skill the network lacks, and the evidence says edits will not add it. Say so and offer the options (unlock a hidden behavior, accept a limit, or allow training).

## Updating this skill

At the end of a session, offer to update this skill with general lessons the session surfaced, such as a method that worked or failed, a format pitfall or a corrected claim. Add only lessons that help any user. Never add the user's own models, weights, data, paths or results. If the skill's files are not writable, give the lesson as text for the user to submit upstream.
