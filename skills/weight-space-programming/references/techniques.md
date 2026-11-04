# Techniques catalog

Methods for reading, editing and writing networks by reasoning about weights, with the evidence behind each. Dated 2026-11-03.

Main source for the worked examples: the weight-space-programming post by Takehi, https://rikiyat.github.io/blog/weight-space-programming/ (2026-11-02), with prompts, logs and per-experiment READMEs at https://github.com/RikiyaT/lm_understand-logs (raw files under https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/main/). In those experiments a proprietary frontier model (named gpt-6-astra in the logs) worked with its agent tools switched off or tightly limited. The work is self-published and unreviewed, and no replication on another model was found (an independent rerun of one published Qwen edit exists, see below), so treat the numbers as reported, not established.

Each entry gives what it is, when it fits, how it worked in the source, and the URL. Mechanisms from the background papers are paraphrased from their abstracts or summaries.

## Reading weights

### Channel and output-layer reading (small MLPs)

- What: in a small input-to-output network, check where each input channel's first-layer weights concentrate and which actions or outputs the last layer separates.
- Fits: small policy or classifier networks whose inputs have a known layout (an image grid with named channels, a feature vector).
- Source: Experiment 1, "which game". The model got a 500-32-32-5 MLP (17,253 weights) as plain text, with no tools, and identified the game by seeing, for example, that the channel for the agent in Breakout concentrates weight on the bottom row (the paddle) and that the output layer separates left, right and fire style actions.
- URL: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 1, folder exp1_which_game in the logs repo).

### Output-layer decoding of a generator

- What: read the final layer and ask what each hidden unit contributes to the output, when output positions have a known meaning.
- Fits: small generative nets with a spatial or structured output, where you can attribute output pixels or coordinates to hidden units.
- Source: Experiment 2, diffusion shape (MLP 160-64-64-144). No forward pass was allowed. Each hidden unit's output weights drew one piece of the shape's edge, and the model assembled the outline. It drew outlines although the networks generate filled shapes, which the authors read as evidence of reading structure and not simulating.
- Limit: partial; the outline was not the filled output.
- URL: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 2, folder exp2_diffusion).

### Composition of attention matrices (induction and copying heads)

- What: treat each head as separate QK (where to look) and OV (what to write) matrices that read and write a shared residual stream, then multiply matrices across layers to see which later heads use what an earlier head carried.
- Fits: transformers where you can get at the per-head matrices. Find a first-layer previous-token head, then find later heads whose queries or keys read what it writes. This is how induction (copy what followed last time) heads are found.
- Source: Experiment 3. Four-layer, six-head character-level transformers with input and output layers removed. Code was allowed for linear algebra on the matrices, but no forward pass of any layer on any input. The model reinvented the composition method from the transformer-circuits framework without being told. Every copying head it named matched the heads measured in all 3 models. It told romaji from other languages because the last block wrote into fewer directions (fewer letters in use). 6 to 11 code runs.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 3, folder exp3_language). Method background: Elhage et al. 2021, https://transformer-circuits.pub/2021/framework/index.html.

### Attention-pattern reading when weights are not enough (sycophancy)

- What: when comparing two models by weights fails, run both on a few inputs you wrote and read only the attention patterns.
- Fits: a behavior difference between two checkpoints that weight differences do not explain. Needs forward passes.
- Source: Experiment 7, a pair of Gemma 3 270M models (a sycophantic one and an honest one). Weights alone failed in 4 of 4 attempts: the model found many differing weights and could not map them to behavior. With only attention patterns from up to 16 self-written texts (at most 20 runs, no generated outputs shown, embeddings frozen so token statistics could not leak the answer), it found a mid-layer head (10.2) that attends to the user's suggested answer in the sycophantic model (85.7% of attention) and to the question's own numbers in the honest model (94.3%).
- Lesson: weights alone can fail. When observation is allowed, use it.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 7), https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/main/exp7_sycophancy/README.md.

## Editing weights

### Side-path insertion for a stuck policy (small RL network)

- What: diagnose why a trained policy is stuck (a local minimum), then add a small parallel path of a few units per layer that detects the stuck state and overrides the output until the state clears, leaving the original network to do the rest.
- Fits: a trained policy that fails in a specific, identifiable situation while working elsewhere. Needs the scene or inputs, and ideally one episode to look at.
- Source: Experiment 4, Kinetix car task, policy 679-128-5x128-16 (171,664 weights). The model got the weights, the scene and one episode, and replied once with no tools. It read body position and velocity, backed the car up, switched to full drive, then switched itself off once the wheel passed the strip. It wrote 51 edit statements in a small edit language, such as `actor0.W[6,122] = 80`. Result: 1024 of 1024 test successes from 0%, with 3.5% of weights changed.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 4), https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/main/exp4_fix_car/README.md.

### Direction removal from layer outputs (Qwen loop fix)

- What: find a direction in the residual stream that the network writes when it is doing an unwanted thing, then project that direction out of the output of the matrices that write it. With direction u and strength a, the edit is W' = W - a * u (u^T W) on the columns of a down-projection matrix.
- Fits: an unwanted behavior that has a single dominant direction, such as repetition loops or a refusal-like pattern. Needs forward passes and activations to find the direction, and a metric that shows the behavior.
- Source: Experiment 8, Qwen3.5-0.8B on math with long reasoning. The base model hit the token cap on 93% of answers, mostly by looping. The model searched for a "repetition" direction, with budgets of 10, 25 and 50 forward passes and at most 300 code runs, with gradient descent, backward passes, autograd and iterative fitting banned. The tool for saving edits refused edits to the final norm, embeddings and output layers, and refused pure whole-tensor scaling. The 10-pass run removed a rank-one direction across 30 matrices (layers 8 to 22). The 25-pass run zeroed one attention head (head 7 of layer 15). The final 50-pass edit changed 64 output columns in each of layers 15 and 19: 131,072 weights, 0.016% of the model.
- Budget matters: at 10 and 25 passes the loops barely went away (MATH-500 about 12 to 14%). Only the 50-pass edit reached 48.1% MATH-500, and the cut-off share fell from 93% to 33.1%.
- Later independent findings (read these before quoting the gain):
  - akhaliq reran MATH-500 on the published edit and got 51.0%, so the reported improvement itself reproduced. Model card: https://huggingface.co/RikiyaT/Qwen3.5-0.8B-weight-space-programming.
  - Hedwig measured the unedited model with thinking off at 43.6% on MATH-500, against 45.2% for the edited model, a gain of about 1.6 points. The unedited model scored 34.3% when its thinking was cut at 8,192 tokens. So most of the headline gain is loop removal under a generous token limit, not better mathematics. https://www.hedwigai.com/blog/weight-edit-math-or-loops.
  - A dev.to write-up reached the same conclusion: the jump was a loop fix, and the edit helps mainly with thinking on and long context. https://dev.to/alanwest/gpt-6-astra-edited-qwen35-08bs-weights-the-math-500-jump-was-a-loop-fix-2g5a.
- Take-away: this is a real repair of a failure mode (the headline score reproduced on the published edit), and it is an unlock of existing ability, not new capability. Always report cut-off share and a capped or thinking-off baseline next to the headline score.
- Practice and held-out setup in the source: GSM8K and MATH training problems (7,469 and 7,275) and 714 AIME problems with answers only were the practice material; MATH-500, GSM8K test and IFEval evaluations were never visible to the model.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 8), https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/main/exp8_math/README.md.

### Embedding-row nudge on a tied-embedding model (unverified community report)

- What: raise the scores of a small model by editing a handful of input-embedding rows for frequent response openers (for example "We", "To", "Step", "Let", "First"). In a model with tied embeddings, an edit to a row also moves that token's output logit direction, which makes the edit act on both the input and the output side.
- Fits: models with tied input and output embeddings where an output-format or starting-token bias may be the real problem.
- Status: UNVERIFIED. This comes from a report by @AdamHoltererer on X; sources found no public evidence of it as of the snapshot date. The figures attached to it (scores going from 24 to 46, 25 to 47 at 256 tokens, wrong-equation counts from 26 to 29, and the claim that an LLM chose the five tokens) are not confirmed. Do not cite them as results.
- What is verified: the SmolLM2-135M-Instruct config sets tied embeddings to true (Llama architecture, hidden size 576, 30 layers, vocabulary 49,152), so the tying mechanism is real. https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct/raw/main/config.json. The SmolLM2 paper lists tied embeddings for the 1.7B size; no 135M-specific statement was found there, so the config is the authority. https://arxiv.org/html/2502.02737v1.
- Reading of the claim: if it holds, a rise from a few embedding rows fits a start-token or output-format bias, not new math skill, the same unlock-not-capability pattern as Gemma and Qwen. The wrong-equation count rising fits that, as does a short token cap. A homemade 96-question set has wide error bars. Replicate with a held-out set, a strict scorer and a cut-off-share metric before trusting it.

### Attention head ablation

- What: zero a whole head's output contribution to remove what it does.
- Fits: a behavior traced to one head. Cheap to try, easy to revert.
- Source: used in the 25-pass Qwen run (head 7 of layer 15), where it only partly helped compared with the 50-pass column edit.
- URL: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 8).

## Writing networks from scratch

### Program-to-layers compilation for a small game policy

- What: reason out the game as a program, then compile it layer by layer into weights, starting from all-zero weights.
- Fits: small networks on a task with clear rules and a compact state, where hidden layers can be given a human meaning.
- Source: Experiment 5, MinAtar (600-32-32-6 MLP with tanh), one reply, no tools, no rollouts. For Breakout, the first layer computes where the ball will land and the second moves the paddle there. Reported scores: Breakout 517.4 versus 25.3 for a PPO agent trained for 500M steps; Seaquest 53.1 versus 88.9; Asterix 53.2 versus 55.2. So it won clearly in one game, trailed in another and nearly matched in the third.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 5, MinAtar).

### Layered hand-written net with a practice loop (Go)

- What: write the whole net as a program that builds weights, with layers for stone and liberty marking, propagation along chains, and a last layer that scores moves. Then use limited practice games to find which part is behind each loss and edit that part.
- Fits: a larger structured network (here 243-512x6-82, 1.48M weights) when the model can use code to generate the weights and the user allows a small number of forward passes.
- Source: Experiment 6. The net was written as a 336-line program. Early layers mark stones and liberties, middle layers propagate along chains to find groups in danger, and the last layer scores capture, saving a group, avoiding atari and not filling own eyes. A forward pass was defined as up to 128 games or 256 positions. Budgets of 0, 10, 25 and 50 passes with up to 120 code runs. Banned: fitting weights to data, tree search or rollouts, and running the net outside counted passes. Edits were kept only if the net won more. Scored against PPO seeds that it never played, while practice opponents were random, REINFORCE and another PPO seed. With 0 passes it already beat two small PPO nets, and with 50 passes it beat a same-size net trained on 20M games.
- URLs: https://rikiyat.github.io/blog/weight-space-programming/ (experiment 6), https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/main/exp6_go_from_scratch/README.md.

### Compiling programs to transformers (Tracr)

- What: a compiler that turns programs written in a RASP-style language into transformer weights with a known internal structure.
- Fits: when you need a transformer with a known algorithm inside, for testing interpretability methods or as a hand-built starting point.
- URL: Lindner et al., https://arxiv.org/abs/2301.05062.

### Tiny hand-coded transformers (AdderBoard)

- What: a community leaderboard for the smallest transformer that adds two 10-digit numbers at 99% or better on a 10,000-example held-out set, with separate tracks for trained and hand-coded models. At the snapshot time the hand-coded leader used 6 parameters (10 under strict counting, so check the counting rule). Tricks include rotary digit routing, ALiBi, tied embeddings, parabolic decoding and a hinge-ReLU carry.
- Fits: a source of ideas for squeezing a structured task into very few parameters, and the tiny-scale precedent for hand-writing weights.
- URL: https://github.com/anadim/AdderBoard.

## Adjacent background

These are not weight-space programming as defined in the post, but they inform how to find and edit what matters.

- **Logit lens.** Apply the final unembedding to an intermediate layer's activations to read the model's running guess for the next token. Fits when you want to see where in depth an answer forms. Needs forward passes. nostalgebraist 2020, https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens.
- **Refusal direction ablation.** Refusal behavior in chat models is mediated by a single direction in activation space: erasing it stops refusals and adding it induces them. The paper also describes a weight-orthogonalization form of the edit. A close relative of the Qwen loop fix. Arditi et al. 2024, https://arxiv.org/abs/2406.11717. (Only the abstract was checked for this catalog.)
- **ROME.** Locate mid-layer feed-forward modules that store a fact with causal tracing, then apply a rank-one weight update to rewrite one fact. Fits editing individual facts. Meng et al., https://arxiv.org/abs/2202.05262.
- **MEMIT.** The same idea scaled to thousands of facts at once, shown on GPT-J and GPT-NeoX. Meng et al., https://arxiv.org/abs/2210.07229.
- **Task arithmetic.** A task vector is the fine-tuned weights minus the base weights. Adding it steers toward the task, negating it steers away. Fits when you have a fine-tuned and a base checkpoint and want to move behavior without training. Ilharco et al., https://arxiv.org/abs/2212.04089.
- **Activation steering (ActAdd).** Add the activation difference from a contrast pair during the forward pass. This acts on activations, not weights, so it is a way to test a hypothesis ("is this direction the behavior?") before baking it into weights. Turner et al., https://arxiv.org/abs/2308.10248.
- **Transformer circuits framework.** The QK/OV view of heads and the residual stream, used in the reading entries above. Elhage et al. 2021, https://transformer-circuits.pub/2021/framework/index.html.

## Documented limits

- **Gemma 3 270M math.** Edits could not add ability. Failures were ordinary arithmetic and algebra mistakes with no single component to switch off. No edit moved MATH-500 by more than about a point (6.8% base, 7.0 to 7.7% edited). Source: the post, https://rikiyat.github.io/blog/weight-space-programming/.
- **Sycophancy from weights.** 4 of 4 attempts failed; attention patterns were needed (see the entry above).
- **Qwen gain is mostly loop removal** (Hedwig, dev.to and the model card above). It is a repair of a failure mode, not a gain in capability.
- **Authors' own caveat.** The post calls the results exciting but still limited by context length and harness inefficiency.
- **Scale and fit.** In the no-tool runs, the weights had to fit in the context window. Go needed a sandbox for code. Seaquest reached about 60% of the PPO-500M score. The diffusion reading drew outlines where the model makes filled shapes.
- **Variance.** The tables show one run per condition for Go and Qwen, so run-to-run variance is unreported (inference from the tables).
- **Scope of evidence.** One self-published post on a proprietary model. Replication on other models is unconfirmed, apart from the independent MATH-500 rerun and the loop-removal analyses above.

## Protocol details from the source

Use these as examples of the discipline `evaluation.md` asks for.

- Tool-free runs were audited turn by turn (1,125 turns) to confirm no tool was used. Code ran in a sandbox with no network and a time limit per run.
- Rules differed by experiment: no tools and no forward passes allowed in experiments 1, 2, 4 and 5; code allowed but no forward pass in experiment 3; counted forward-pass budgets in experiments 6 and 8.
- Practice and held-out sets were separated and the held-out opponents or benchmarks were never visible.
- Embeddings were frozen in the sycophancy test so input and output statistics could not give the answer away.
- The logs repository ships an edit applier that verifies a sha256 hash, which is the idea behind the edit-log hash in the protocol. https://github.com/RikiyaT/lm_understand-logs.
- Budget changed the outcome: small forward-pass budgets did not work for the Qwen task (see the Qwen entry).
