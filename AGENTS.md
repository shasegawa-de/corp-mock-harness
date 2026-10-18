# Corp Mock Harness — mandatory execution contract

**Do not start image generation before PRECHECK.** Instruction harness for GPT Image / Nano Banana, not an image API client.

## 1. PRECHECK — four live files only

Read the COMPLETE individual files `AGENTS.md`, `STYLE.md`, `configs/devices.json`, `configs/presets.json` from `shasegawa-de/corp-mock-harness` GitHub `main`; parse and validate JSON. **Never use the versioned ZIP, excerpts, memory or guessed options.** If required content cannot be read, **STOP** and request it. A pinned commit is allowed only when explicitly requested.

## 2. PLAN — one photograph per Scene Contract

Default: one standard `iphone17`, four independent 16:9 images. Use `default_scenes` for unspecified four-image iPhone batches. Support `device_layouts` in `configs/presets.json`: `single` = **exactly one specified device**; `side-by-side` and `depth-staggered` = **exactly one MacBook Pro 14 and one standard iPhone 17**, unless the user requests another explicitly supported combination. **One image, one camera/scene does NOT mean one device.**

For each scene select valid `devices[]`, `layout_id`, `spatial_mode_id`, `composition_id`, `environment_id`, `lighting_id` plus precise camera, positions, scale, 0–3 architectural planes and exclusions. `showcase_presets` are preferred example directions, not compulsory compositions; user instructions override a preset when coherent with hard constraints. Keep screen(s) entirely visible and featureless pure white. For a two-device scene show the Mac screen, keyboard/trackpad and phone screen without obstruction.

Spatial modes: `grounded` = contact on mineral floor; `hover` = low above **visible** floor with faint separated shadow; `suspended` = **weightless, no floor, floor-wall seam, horizon, ground shadow or platform**. A `suspended` mode overrides floor references in an environment detail; prefer `suspended-mineral-planes`. Preserve quiet half-gray architectural depth. Never add desks, plants, mugs, hands, furniture, stands, supports, extra devices, logos or UI.

**PRECHECK PASS** only after all four files, preset IDs, correct device count, coherent spatial mode and non-conflicting Scene Contract are verified. Identify selected IDs briefly before any generation.

## 3. RENDER-PROMPT LOCK

Batch request ≠ image-tool prompt. Freeze a **single-scene ~80–170-word English prompt** containing only that scene's devices, count, relationship, camera, architecture, spatial mode, lighting and exclusions. Start **"ONE standalone photorealistic product photograph. ONE camera view. Horizontal 16:9."** Then say **"Exactly one [specified model]"** for a single scene, or **"Exactly two devices: one [Mac] and one [iPhone]"** for a pair. Never send other scene options or a multiple-panel showcase. `prompts/` holds optional copy-ready fixtures.

If the effective tool prompt is inspectable, compare it with the frozen text. If it switches device count, placement, spatial mode, or asks for multiple views/collage, flag **`PROMPT_DRIFT` and STOP the batch**. If the tool hides/reformulates input, record **`PROMPT_UNVERIFIED`** instead of claiming an exact match. Where exact input fidelity is vital, use an explicit-prompt-capable interface.

**One locked prompt → one image-tool call → one standalone photograph.** Do not generate a contact sheet. Inspect the result before the next scene.

## 4. QA — prompt and image separately

Prompt fidelity: `MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED`. Inspect actual output: one camera frame, **exactly N requested devices and no others**, correct device geometry, fully white visible screens, specified layout/depth, correct spatial mode (especially no floor for suspended), camera, material/architectural planes, light, no props and ~16:9 (pixel verify if available). Hard failure → revise only that scene; prompt drift → repair input route. Mark unseen or unverifiable properties `UNVERIFIED`, never `PASS`.

## OPTIONAL ONLY

`.agents/skills/**/SKILL.md`, `WORKFLOW.md`, `providers/*.md`, `templates/`, `history/` and `prompts/` are **on-demand**, not extra mandatory reads. No automatic image persistence or geometry guarantee.
