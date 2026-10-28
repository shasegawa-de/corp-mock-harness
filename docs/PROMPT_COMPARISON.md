# Corp Mock Harness — MM1 / MM2 prompt-comparison procedure

**Status:** Experimental, unapproved, isolated in a draft PR. A and B are preserved. C now expresses the actual review criteria without the former 170-word ceiling. No public catalog, reference image or `main` prompt was changed.

## 1. Sequence and decision gates

| Stage | Action | Evidence / completion criterion | Status |
| --- | --- | --- | --- |
| 0. Source check | Read `main` four-file contract and decision history; record source revision | Current `main`, [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) | Complete |
| 1. Baseline | Lock A (existing prompt bytes) and B (same vocabulary, seven-section structure) | A and B original files untouched; lexical-equivalence tests | Complete |
| 2. Direction design | Rebuild C using independently verified composition, architecture, lighting, exclusions and priorities | Scene-specific [direction trace](ART_DIRECTION_RULESET.md); explicit legacy-layout caveat | Complete as **draft**, not visually approved |
| 3. Transport / precheck | Check device count, scene contract, prompt SHA-256, API JSON and word count without a paid call | GitHub Actions Node tests + six dry runs | Must rerun after this revision |
| 4. Image trial | Independently render at least 2 per arm (A/B/C × MM1/MM2 = **12 total**) with fixed model/settings | Images, trial numbers, prompt hashes, usage and run metadata | Not started; separate API billing |
| 5. Blind review | Score hard constraints, geometry, composition, background, and light separately | Two independent human ratings if possible; keep rejected images | Not started |
| 6. Decision | Compare A vs B for structure, B vs C for added art direction; document failures, contradictions and uncertainty | Explicit adopt / revise / reject decision | Pending |
| 7. Integration | Only after approval: revise prompt assembly and copy behavior, regression test 32 cards, then deploy and verify Pages | Static + Chrome + Pages success and public image checks | Pending |

## 2. Comparison arms

| Scene | A: unchanged canonical fixture | B: structural headings only | C: direction-rich experimental draft |
| --- | --- | --- | --- |
| MM1 | [A](../prompts/macbookpro14-macbookpro14/side-by-side.txt) | [B](../prompts/experiments/mm1-b-structured.txt) | [C](../prompts/experiments/mm1-c-directed.txt) |
| MM2 | [A](../prompts/macbookpro14-macbookpro14/suspended-depth.txt) | [B](../prompts/experiments/mm2-b-structured.txt) | [C](../prompts/experiments/mm2-c-directed.txt) |

A = exact current catalog fixture (unaltered). B = seven headings, same lexical content as A; punctuation/order may differ. C = same seven sections but fuller scene-specific direction, including photographic intent, material coherence, rejected visual artifacts and explicit priorities. No maximum word count is enforced in this *experimental branch*. This does not establish a quality-optimal prompt length.

**Composition caveat:** Original MM1 specifies side-by-side; MM1-v5 artwork has a stronger left-front/right-rear arrangement. Original MM2 specifies left-rear/right-front; MM2-v3 visually uses left-lower/right-higher. For A/B/C controls, C **retains the original fixture's scene contract** rather than falsely claiming image reproduction or silently reversing the layout. A separate reference-matched experiment would be required to test adoption-image reproducibility.

## 3. Constant settings and interpretation

Same model `gpt-image-2.5-flare`, `1536x864`, `quality=high`, `n=1`, independent single-scene image API call per trial. Record prompt SHA-256 and verify the outgoing JSON carries the exact fixture. Because model-internal preprocessing is not exposed, `prompt_transport=EXACT_REQUEST_SUBMITTED` **does not mean** `effective_model_prompt=MATCH`; it remains `UNVERIFIED`.

Randomize the 12 outputs for blind assessment. Score these six axes separately on 0=fail, 1=partial, 2=pass: (1) exactly two open Macs, white complete screens and no extra device; (2) both keyboards/trackpads, plausible aluminum body and hinges; (3) placement, relative scale and camera; (4) ground contact and shadows for MM1 / strictly no floor or implied ground for MM2; (5) physically coherent nonrepetitive mineral architecture; (6) light direction, sculptural reflections and photographic dimensionality. Device-count or spatial-mode failure remains a **hard failure** regardless of aesthetic score. Geometry in exact millimeters cannot be certified from the render alone.

## 4. Executing and protecting production

Run zero-cost check on this PR:

```sh
node --test tests/prompt-comparison.test.mjs
for arm in mm1-a mm1-b mm1-c mm2-a mm2-b mm2-c; do
  for trial in 1 2; do
    node scripts/prompt-comparison-cli.mjs --arm="$arm" --trial="$trial" --dry-run
  done
done
```

Paid image requests are deliberately unavailable on the draft PR. The experimental manual workflow accepts `execute=false` by default. `execute=true` requires a deliberately reviewed merge to `main`, an `OPENAI_API_KEY` Repository secret, and a manual run per image. API charges are separate from ChatGPT billing. Outputs are QA-pending artifacts kept 14 days, with no automatic catalog changes.

Do **not** merge solely because dry-run tests pass. Evaluation must establish whether length/structure helps or hurts fidelity. The branch-local change to [AGENTS.md](../AGENTS.md) removes its arbitrary 170-word bound, but the existing catalog prompt-editor checks still limit newly assembled prompts to 80–170 words. That mismatch is **intentional for isolation**, and is part of Stage 7's rollout work; do not describe the 32-card catalog as length-unlimited until updated and verified.

## 5. Trial identity, review and costs

The manual workflow has **arm** and **trial** selectors. Each arm gets two independent trials, numbered `1` and `2`, each using one `n=1` API request and its own unique GitHub Actions run. A run saves two files, e.g. `mm1-c-trial-2.png` and `mm1-c-trial-2.json`. The artifact's GitHub run ID identifies the request, and its JSON records the selected trial, exact-prompt SHA-256, dimensions and model-reported `usage` (if provided). The trial number does not set the image model's random seed; independent outputs may still be similar.

**Do not unblind scores during review.** Download all 12 images and their JSON records, conceal filenames and labels, randomize their viewing order, and evaluate them using [MM image QA form](MM_IMAGE_QA.md). Reveal the arm identities only after all scores are saved. Two images per arm is a pilot, not statistically convincing evidence of a quality advantage. Hard constraints are evaluated as vetoes, not averaged away.

Actual billable image output tokens are not predictable from the prompt's word count alone. Read `usage` and OpenAI's current pricing for costs; **do not assume a fixed USD amount for the 12-image pilot**. Both `gpt-image-2.5-flare` and `1536x864` are supported per the [official image generation guide](https://developers.openai.com/api/docs/guides/image-generation). Explicitly review API expense before using `execute=true` and note that `OPENAI_API_KEY` is a repository secret, not a chat credential.

**Execution limitation:** This PR's workflow is not merged to default `main`. GitHub's workflow-dispatch interface requires a workflow registered on the default branch. The paid workflow cannot be launched via this draft PR alone. A local Node 22+ checkout of this experimental branch can also run one arm at a time with `--execute` after the owner supplies a local `OPENAI_API_KEY`. Neither route has been used to generate paid images here.

## 6. Credential and output security — mandatory

**Current repository visibility: PUBLIC.** Never commit, paste into ChatGPT, put into issue/PR text, or place in a prompt, PNG, JSON, GitHub Actions log, command-line argument or screenshot any real API key.

- `--dry-run` never reads or sends an API key; integration tests use a harmless dummy string and a mocked HTTP transport.
- The actual key is read only from `OPENAI_API_KEY` in the process environment when `--execute` is explicitly selected. The script sends it as a Bearer header over HTTPS to the fixed OpenAI API endpoint. The key is never written to output metadata.
- The local runner places PNG/JSON in `~/.corp-mock-harness-private-reviews` by default, **outside Git**. It enforces private directory permissions (0700), files (0600), rejects any output directory inside the repository including symlink redirects, and refuses existing trial files **before** making a billable request.
- The GitHub workflow is read-only (`permissions: contents: read`, no persisted checkout credentials), and **refuses paid execution when the repository is public**. This also protects review images and metadata: Actions artifacts in public repositories are accessible to users with read access. Switching to a private review repository or encrypted artifacts requires a separate security review; do not weaken this gate just to get results.
- For personal local use, enter the key in a trusted terminal *without placing it directly in a shell command or shell history*, run the review from a private Node 22+ checkout, and then clear the environment variable. Never send the key to this chat.
- Do not collect `OPENAI_API_KEY` by form, commit, URL query, CI input, PR comment, or shared document. Restrict its project permissions and spending limits within the OpenAI API dashboard.
- The experiment has **not** used a live API credential or sent a paid image generation request from this chat. Existing GitHub Actions tests use mocks and dry-runs only.

Security evidence: [GitHub secrets reference](https://docs.github.com/en/actions/reference/security/secrets), [workflow artifacts read access](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts).
