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

## 2026-10-21 — First generation attempt, STOPPED: prompt drift

- Attempted source scene: `surface-microcement-wall-floor`; fixture: `prompts/architectural-surfaces/microcement-wall-floor.txt`.
- Mandatory four live files re-read completely and JSON validated on `main` at `47fa2acd18fa195fb13b0992b2e4535b4810d6de`. Requested scene: `devices=[]`, `layout_id=environment-only`, `spatial_mode_id=grounded`, `composition_id=empty-stage`, `environment_id=microcement-seamless`, `lighting_id=broad-softbox`.
- Image-generation provider reported effective scene description: "Minimalist studio product shot of a modern black smartphone standing slightly tilted on a textured gray concrete floor, shown in three-quarter view against geometric architectural planes and a rectangular ledge." The remainder of the returned description describes a pure-white phone display.
- **PROMPT_DRIFT**: an unintended smartphone was added despite the required zero-device scene. **IMAGE_QA: REJECT**. The image is **NOT approved** and **NOT cataloged**. This is independent of photographic aesthetics or image resolution.
- Tool generation ID: `2ef1b40f-854b-49cc-894e-dbe34fac7b92`. The response did not provide a usable verbatim prompt-lock interface for enforcing the frozen prompt.
- Per `AGENTS.md`, stop the remainder of this batch when device count changes in the effective tool prompt. Reattempt only using a route that guarantees a single effective prompt containing **NO products or devices**, followed by independent prompt-fidelity and image QA. Do not silently replace the rejected image or mark it PASS.

## 2026-10-21 — GPT Image retry loop and repeat failure (five renders)

Per user instruction, Firefly was **not** used. All five attempts in this iteration used the ChatGPT GPT Image tool, one image per invocation. Before initial generation, the four mandatory live `main` files were read and JSON validated. The scene fixtures and IDs were checked again before trying Carrara.

| Attempt | Intended reference | Visual result and blocking issue | Image QA | Generation ID |
| --- | --- | --- | --- | --- |
| 1 | Microcement wall/floor | Zero devices and 16:9, but coarse stone-like surfaces, strong diagonal light, extra right-hand slab | REJECT | `59ce4cc7-3e99-4d0a-abbf-493d7a9f3fa2` |
| 2 | Microcement revision | Large right-hand veined slab and strong diagonal light persisted | REJECT | `0eabcf11-7523-4ab4-9fd7-07b6bd5e34f9` |
| 3 | Microcement simplification | Same recessed architectural corner and right-hand partition persisted | REJECT | `97d492a9-b492-4fcd-ae46-8d0aa4787211` |
| 4 | Attempted correction of prior microcement render | Same right-hand slab and coarse texture persisted | REJECT | `6fa167ab-7d12-4a67-8d54-30e41c747014` |
| 5 | Carrara marble wall/floor | Repeated gray concrete composition instead of Carrara marble; requested material not present | REJECT | `eb4be426-e37b-4a96-a5c7-51bd5c4c5799` |

The image tool did not expose a reliable effective frozen prompt in generation metadata (`prompt` field empty), and its generated English scene descriptions repeatedly included a rectangular slab/partition in conflict with the requested plain architecture. Prompt fidelity is **PROMPT_UNVERIFIED**, with strong **apparent scene carryover** across calls. Do not claim an exact `MATCH`, and do not call these images accepted. No image was added to GitHub, approved or registered to the HTML catalog. The existing 30 gallery cards remain unchanged.

**Blocker:** The currently exposed GPT Image control does not guarantee verbatim prompting, and repeated calls in this same conversation kept virtually the same architectural arrangement despite changing the target material. More identical calls would spend generations without resolving the control error. Complete the work only after obtaining a reliable GPT Image prompt path (for example a fresh, isolated GPT Image conversation with a single explicit fixture and zero prior image context, or a GPT Image API with a directly supplied prompt); then re-run visual QA and register independently. This is an environment/control issue, not evidence that GPT Image cannot generate architectural scenes.

### Sixth GPT Image retry — same structural scene despite a new isolated request

- New mandatory four-file read and JSON precheck: `main` at `2c7bda38a931836b6c2c69a1c658f66dc7de5aa4`.
- Target: `surface-microcement-wall-floor`, original 16:9 no-device fixture, broad diffused illumination, no block.
- Generation ID: `1d2c237a-0b0a-409f-a2ea-e2f209ebf64f`.
- Returned image again showed essentially the same left-lit corner and a thick right-hand projecting rectangular slab. **IMAGE_QA REJECT; PROMPT_UNVERIFIED**. No approved image, no catalog change.
- Six attempts across different surface targets did not resolve composition carryover. Stop uncontrolled repeated regeneration and preserve only the review evidence, not the rejected assets.


## 2026-10-21 — Chat GPT Image resumed: six material-control failures

User requested to continue using the **in-chat GPT Image generator**, without Firefly and without the separate API execution path. Re-read all four mandatory harness files from live `main` at `acdb5b9d77e897a671eab1a68401c031f2358b69` and parsed both JSON files. Checked all four environment-only scene contracts and source fixtures. Generated one frame at a time, requiring zero devices and 16:9. None is approved.

| Target scene | Gen ID | Observed output; reason for rejection |
| --- | --- | --- |
| Microcement wall/floor | `ad692e82-ae8a-48d1-bce5-163856cb01ae` | Empty wall/floor at near-16:9, but warm plaster, strong diagonal lighting and right-side recess instead of the intended seamless cool microcement, soft broad illumination |
| Fiber-cement wall panels | `df9495d7-e6f0-4feb-a42e-40a925813396` | Plaster-like continuous wall, no clear construction joint near center-right, too much floor and strong diagonal sun |
| Carrara marble wall/floor | `5236267e-99f4-4a09-b814-3dd48ba93c68` | Plaster room without Carrara veining, external window and visible foliage |
| Graphite marble wall/floor | `b3599b5c-a30c-46a9-8041-8c12bada704d` | Pale plaster room rather than dark graphite marble, large window and greenery |
| Graphite targeted retry | `75ee0326-1c70-4b0b-b44a-8c42ea7695a8` | Light-gray generic room with window and greenery, no dark marble or low-key lighting |
| Graphite retry after additional scene instruction | `e8c76f6b-7a2b-4bda-b359-bf5681edc125` | Warm pale plaster, outdoor foliage and strong light, no graphite or marble veins |

**QA:** 6 REJECT, 0 PASS, 0 registered images. No changes to 30 canonical cards or vNext gallery assets. The in-chat generator did not provide a verifiably exact prompt submission; its returned scene descriptions repeatedly diverged from the fixture targets. Prompt transport remains **PROMPT_UNVERIFIED**, and material fidelity **REJECT**. Do not infer that the images satisfy their fixtures just because they have the expected zero-device count and near-16:9 output.

The separate explicit-request GPT Image API path exists but was not executed, respecting the user's choice to stay in Chat. Repeating the same in-chat image-generation route has not established reliable material/geometry compliance. The next GPT Image-only path worth testing is a **new isolated image-generation conversation** containing exactly one raw fixture prompt and no previous generated image history. Human approval is still required before promoting images to a catalog card.
