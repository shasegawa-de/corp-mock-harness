# MM1 / MM2 blind image-QA worksheet

**Usage:** One score sheet per masked image, 12 total (MM1-A/B/C and MM2-A/B/C, 2 repetitions each). Do not reveal the experiment arm or variant-specific prompt until all visual reviews have been recorded. Evaluate the *actual rendered PNG*, not just the written prompt.

## First pass: non-negotiable technical gates

| Gate | MM1: grounded two Macs | MM2: floorless two Macs |
| --- | --- | --- |
| Device count | Exactly two identical open 14-inch MacBooks, no others | Same |
| Screens | Both completely visible and featureless white | Same |
| Input devices | Both keyboards and trackpads visible | Same |
| Physical space | Bases directly contact a coherent floor, plausible attached shadows | Absolutely no floor, horizon, wall-floor junction, ground shadow, stand or cable |
| Single scene | One camera view, standalone 16:9 image | Same |

If any gate fails, record **HARD FAIL**. Preserve the image and evidence; do not treat an attractive background as compensation.

## Independent quality dimensions (0 fail / 1 partial / 2 pass)

| Code | Dimension | Evidence to examine |
| --- | --- | --- |
| G | Product geometry | Thin rigid aluminum bodies, realistic hinges, consistent equal-sized hardware and perspective |
| C | Composition | Intended left/right or depth layout, angle variation, visual balance, screen legibility, negative space |
| E | Architecture | Natural room-scale mineral surfaces, coherent wall-floor geometry where appropriate, no repeated vertical bands or artificial gradients |
| L | Lighting | Light direction, believable metal reflections, dimensionality, legible tonal separation without harsh glare |
| P | Prompt-scene fidelity — **second pass only** | After freezing all blind visual scores and revealing the arm, compare subject count, spatial mode, camera and selected lighting/material against the *frozen prompt* |

**Separate scores for background (E) and lighting (L)**: never assume an improved backdrop means improved lighting, or vice versa. Exact millimeter hardware fidelity requires external reference and measurement; mark it UNVERIFIED if not possible. The model's internal effective prompt is also UNVERIFIED.

## Blinded per-image entry

| Field | Recorded value |
| --- | --- |
| Blind ID | R___ |
| Image file / evidence link (without identifying arm) | |
| Two-Mac / white-screen / keyboard / single-scene hard gates | PASS / HARD FAIL |
| Grounding or floorlessness | PASS / HARD FAIL |
| G: product geometry | 0 / 1 / 2 |
| C: composition | 0 / 1 / 2 |
| E: background | 0 / 1 / 2 |
| L: lighting | 0 / 1 / 2 |
| P: contract fidelity | **Leave blank during blind review**; score 0 / 1 / 2 only after unblinding |
| Key visual issue / strength (specific, not generic) | |
| Reviewer and date | |

## Twelve-image intake checklist

| Blind ID | Image received | QA recorded | Provenance JSON present |
| --- | --- | --- | --- |
| R01 | ☐ | ☐ | ☐ |
| R02 | ☐ | ☐ | ☐ |
| R03 | ☐ | ☐ | ☐ |
| R04 | ☐ | ☐ | ☐ |
| R05 | ☐ | ☐ | ☐ |
| R06 | ☐ | ☐ | ☐ |
| R07 | ☐ | ☐ | ☐ |
| R08 | ☐ | ☐ | ☐ |
| R09 | ☐ | ☐ | ☐ |
| R10 | ☐ | ☐ | ☐ |
| R11 | ☐ | ☐ | ☐ |
| R12 | ☐ | ☐ | ☐ |

**Two-pass evaluation:** Before reviewing, consult the private `blind/scene-manifest.csv` file: it identifies only MM1 (grounded) or MM2 (floorless) for each anonymous R01–R12 image. This is necessary to recognize incorrect spatial modes without revealing A/B/C. (1) Blind review: rate hard gates G/C/E/L using only the images and the manifest's scene requirements. Do not read the variant-specific A/B/C prompts. Leave `fidelity_0_2` blank. (2) After all 12 blind visual scores have been recorded, freeze a copy of the scores privately, reveal the A/B/C mapping, and fill `fidelity_0_2` for prompt-scene compliance. Run `node scripts/review-summary-cli.mjs` to summarize both phases. Incomplete visual reviews never disclose arm-level scores in the summary.

After the blind review, join blind IDs to `arm_id + trial` privately. Compare A vs B for structure, then B vs C for extra art direction. Use per-axis results and hard-failure frequency; **do not declare superiority from two images per arm**. Separately record original catalog references and current adopted visual direction because the old prompts use different laptop placements from the latest published MM1-v5/MM2-v3 images.
