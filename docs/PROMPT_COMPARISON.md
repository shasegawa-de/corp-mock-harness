# Corp Mock Harness — MM1 / MM2 prompt-comparison procedure

**Status:** Experimental, unapproved, isolated in a draft PR. A and B are preserved. C now expresses the actual review criteria without the former 170-word ceiling. No public catalog, reference image or `main` prompt was changed.

## 1. Sequence and decision gates

| Stage | Action | Evidence / completion criterion | Status |
| --- | --- | --- | --- |
| 0. Source check | Read `main` four-file contract and decision history; record source revision | Current `main`, [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) | Complete |
| 1. Baseline | Lock A (existing prompt bytes) and B (same vocabulary, seven-section structure) | A and B original files untouched; lexical-equivalence tests | Complete |
| 2. Direction design | Rebuild C using independently verified composition, architecture, lighting, exclusions and priorities | Scene-specific [direction trace](ART_DIRECTION_RULESET.md); explicit legacy-layout caveat | Complete as **draft**, not visually approved |
| 3. Transport / precheck | Check device count, scene contract, prompt SHA-256, API JSON and word count without a paid call | GitHub Actions Node tests + twelve dry runs | Required on each revision |
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

Same model `gpt-image-2.5-flare-2026-09-08`, `1536x864`, `quality=high`, `n=1`, independent single-scene image API call per trial. Record prompt SHA-256 and verify the outgoing JSON carries the exact fixture. Because model-internal preprocessing is not exposed, `prompt_transport=EXACT_REQUEST_SUBMITTED` **does not mean** `effective_model_prompt=MATCH`; it remains `UNVERIFIED`.

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

GitHub Actions is **preflight only**: no API key, paid execution switch or image artifact upload. Actual image requests are performed only by `node scripts/private-pilot-cli.mjs --execute --limit=12` on a trusted Mac, using private masked key entry. They are separately billed and never automatically published.

Do **not** merge solely because dry-run tests pass. Evaluation must establish whether length/structure helps or hurts fidelity. The branch-local change to [AGENTS.md](../AGENTS.md) removes its arbitrary 170-word bound, but the existing catalog prompt-editor checks still limit newly assembled prompts to 80–170 words. That mismatch is **intentional for isolation**, and is part of Stage 7's rollout work; do not describe the 32-card catalog as length-unlimited until updated and verified.

## 5. Trial identity, review and costs

The private local pilot defines six fixed arms and two trials per arm. It sends one `n=1` image request for each missing arm/trial pair, with a private `.pending` marker before the request to prevent ambiguous retries. PNG/JSON pairs are written to `~/.corp-mock-harness-private-reviews`, not to GitHub. Metadata records the arm, trial, request prompt hash, image hash, size, and any model-reported usage. Trial numbers do not set an image model random seed.

**Do not unblind scores during review.** Download all 12 images and their JSON records, conceal filenames and labels, randomize their viewing order, and evaluate them using [MM image QA form](MM_IMAGE_QA.md). Reveal the arm identities only after all scores are saved. Two images per arm is a pilot, not statistically convincing evidence of a quality advantage. Hard constraints are evaluated as vetoes, not averaged away.

Actual billable image output tokens are not predictable from the prompt's word count alone. Read `usage` and OpenAI's current pricing for costs; **do not assume a fixed USD amount for the 12-image pilot**. Both `gpt-image-2.5-flare-2026-09-08` and `1536x864` are supported per the [official image generation guide](https://developers.openai.com/api/docs/guides/image-generation). Review API expense before choosing local `--execute`; no credential is stored in GitHub or chat.

**Execution limitation:** A trusted Mac with an interactive terminal and project-scoped API key is required. This chat cannot access that terminal. The public repository deliberately contains no cloud paid-generation path.

## 6. Credential and output security — mandatory

**Current repository visibility: PUBLIC.** Never commit, paste into ChatGPT, put into issue/PR text, or place in a prompt, PNG, JSON, GitHub Actions log, command-line argument or screenshot any real API key.

- `--dry-run` never reads or sends an API key; integration tests use a harmless dummy string and a mocked HTTP transport.
- The local pilot reads the key in memory from a masked terminal prompt only when explicitly executing paid generation. It sends it as a Bearer header to the fixed HTTPS API endpoint and never writes it into metadata.
- The local runner places PNG/JSON in `~/.corp-mock-harness-private-reviews` by default, **outside Git**. It enforces private directory permissions (0700), files (0600), rejects any output directory inside the repository including symlink redirects, and refuses existing trial files **before** making a billable request.
- GitHub Actions is read-only preflight only, without credentials, image-generation requests or result artifacts. Do not enable those capabilities on this public repository.
- For personal local use, run the dedicated pilot and enter the key only at its masked prompt. Never send the key to this chat or export it into a shell environment.
- Do not collect `OPENAI_API_KEY` by form, commit, URL query, CI input, PR comment, or shared document. Restrict its project permissions and spending limits within the OpenAI API dashboard.
- The experiment has **not** used a live API credential or sent a paid image generation request from this chat. Existing GitHub Actions tests use mocks and dry-runs only.

Security evidence: [GitHub secrets reference](https://docs.github.com/en/actions/reference/security/secrets), [workflow artifacts read access](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts).

## 7. Offline two-pass score aggregation

After the Mac has generated all 12 PNG/JSON pairs, run `node scripts/private-pilot-cli.mjs --prepare-blind`. Review the images in the private `blind/` directory and enter PASS/FAIL for four hard gates, and 0–2 for geometry, composition, architecture and lighting in `blind/scores.csv`. **Leave `fidelity_0_2` blank during visual review.** The group assignment and variant-specific prompts must not be shown to the visual reviewers.

When all 12 visual scores are complete, freeze a private copy of the score sheet, then reveal `mapping-private.json`, compare each image with its original prompt and enter `fidelity_0_2` (0–2). Run `node scripts/review-summary-cli.mjs` to obtain hard-failure counts and separately averaged axes for A/B/C by scene. Incomplete visual rounds do not print any arm-level scores. This is a descriptive pilot, not statistically proven superiority. Scores and images are neither auto-uploaded nor auto-approved.

## 8. Fixed model and review-integrity controls

For the A/B/C pilot, all arms now use the explicit supported snapshot `gpt-image-2.5-flare-2026-09-08` instead of the moving alias. The shared architectural-image workflow retains its own model setting; the experiment does not modify that production module. This change occurred before any paid trial was run. The results therefore cannot be mislabelled as the current unpinned model.

The score aggregator verifies that each of the 12 distinct `arm + trial` pairs is represented once and refuses prompt-fidelity scoring until the visual review is complete. Do not reveal the privately stored identity mapping to image reviewers before recording all 12 blind visual scores.
