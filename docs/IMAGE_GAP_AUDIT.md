# Image coverage & QA audit — 2026-10-21

## Scope and evidence

- Source of truth: `main` of this repository; **not** an old ZIP or a previous chat snapshot.
- The existing gallery has **30 cards**; there are **30 copy-ready single-scene `prompts/**/*.txt`** (iPhone 9, MacBook Pro 3, pair 3, environment 7, architectural surfaces 8).
- The only files under the separate `assets/` tree currently tracked are **three marble SVGs**. This does **not** imply the HTML has only three visual examples: `catalog/index.html` embeds previews and may reference external images. Image binaries and exact provider requests are not systematically stored as independent auditable files.
- A card, a complete prompt, a composited preview, a cropped board, a user-approved *direction*, and a fully verified standalone generation are **different evidence types**.
- This is a **repository-level metadata audit**, not a full pixel-by-pixel review. The original previews and source images have not been individually validated in this audit; do not mark their visual fidelity as PASS.

## Verified direction-level status

| Reference | Status | Qualification |
| --- | --- | --- |
| iPhone A (`prompts/iphone17/a.txt`) | User-approved visual direction | Device silhouette, proportions, effective tool prompt remain unverified |
| iPhone B (`prompts/iphone17/b.txt`) | User-approved with material/light concerns | Fiber texture somewhat rough and light too hard |
| Mac + iPhone suspended | User-approved floorless direction | No independently committed, geometry-verified original |
| iPhone D / smoked glass | Improving / **not PASS** | Directional light deviated from intended diffusion |
| Other 26 fixture prompts | Not all independently validated | A fixture is not itself a verified production image |

See `history/2026-10-19-approved-directions.md` and `history/2026-10-19-prompt-drift-regression.md` for primary review records. This table does not certify that the other 26 cases each have a missing image; it identifies absence of reliable independent verification.

## Priority gap queue

### P0 — Replace previews with trustworthy standalone results

1. **Empty-stage / architectural surfaces**: microcement wall-floor and fiber-cement wall; generate one 16:9 camera view for each, no device. Existing environment preview crops must not be represented as exact prompt outputs.
2. **Marble / mineral architecture**: pale Carrara wall/floor and graphite marble wall/floor; one scene each, real slab-scale continuity, no device and no material swatches.
3. **Other surfaces**: smoked glass and stone junction, wide sandblasted floor, suspended floorless stage; generate and QA independently when reviewed.
4. **iPhone poses**: horizontal floor, broad slab, naturally supported tilt, floorless suspended. Respect pose-dependent oblique 40–55° camera and `suspended` no-floor rule.

### P1 — Device combinations and quality evidence

5. MacBook Pro 14 standalone / pair floor, plinth, suspended: ensure raised display, keyboard/trackpad, accurate 14-inch geometry and pair scale.
6. Correct iPhone D lighting and B material/light; preserve A/B accepted composition, do not overwrite approved history.
7. Store **original binary + exact frozen prompt + provider/model + generated dimensions + per-image QA + source card ID + commit reference**. Distinguish PASS / REJECT / UNVERIFIED and prompt MATCH / DRIFT / UNVERIFIED independently.

## Proposed first generation batch — awaiting explicit approval

Four **independent** 16:9 environment-only renders from existing source fixtures:

1. `prompts/architectural-surfaces/microcement-wall-floor.txt`
2. `prompts/architectural-surfaces/fiber-cement-wall-panels.txt`
3. `prompts/architectural-surfaces/carrara-marble-wall-floor.txt`
4. `prompts/architectural-surfaces/graphite-marble-wall-floor.txt`

These are candidates, **not generated assets or approved cards**. Before each new image render, re-read in full the four mandatory live files, lock one prompt, inspect its result, and ask for user approval before promoting/committing. Avoid producing a collage or batch prompt. Continue with remaining candidates only after reviewing results.

## Acceptance gates

1. Real output is one independent landscape 16:9 camera photograph, correct device count (zero for batch 1).
2. Materials and geometry are actual walls/floors, not close-up textures or unrelated podiums; architectural planes and lighting are credible.
3. Full prompt fidelity is only MATCH when effective tool prompt is inspectable. If hidden, PROMPT_UNVERIFIED.
4. Existing 30 cards, accepted directions, original `catalog/index.html`, and metadata remain unchanged until their replacements have passed QA.
5. Do not multiply arbitrary combinations as cards without a distinct visual purpose and documented quality threshold.
