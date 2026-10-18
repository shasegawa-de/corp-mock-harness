# Corp Mock Harness — mandatory execution contract

**Do not start image generation before PRECHECK.** Instruction harness for GPT Image / Nano Banana, not an image API client.

## 1. PRECHECK — four live files only

Read the COMPLETE individual files `AGENTS.md`, `STYLE.md`, `configs/devices.json`, `configs/presets.json` from `shasegawa-de/corp-mock-harness` GitHub `main`; parse and validate JSON. **Never use the versioned ZIP, excerpts, memory or guessed options.** If required content cannot be read, **STOP** and request it. A pinned commit is allowed only when explicitly requested.

## 2. PLAN — one photograph per Scene Contract

Default: one standard `iphone17`, four independent 16:9 images. Use `default_scenes` for unspecified four-image iPhone batches. Support `device_layouts` in `configs/presets.json`: `single` = **exactly one specified device**; `side-by-side` and `depth-staggered` = **exactly one MacBook Pro 14 and one standard iPhone 17**, unless the user requests another explicitly supported combination. **One image, one camera/scene does NOT mean one device.**

For each scene select valid `devices[]`, device-specific `pose_id`, `layout_id`, `spatial_mode_id`, `composition_id`, `environment_id`, `lighting_id` plus precise camera, positions, scale, 0–3 architectural planes and exclusions. `showcase_presets` are preferred example directions, not compulsory compositions; user instructions override a preset when coherent with hard constraints. Keep screen(s) entirely visible and featureless pure white. For a two-device scene show the Mac screen, keyboard/trackpad and phone screen without obstruction.

**Device pose is separate from placement.** For iPhone 17 in a `single` scene, `upright`, `flat-face-up`, `tilted-supported` or `suspended-angled` are valid `device_pose_rules.iphone17` values. **When the iPhone lies flat on the floor or on a block, raise/reposition the camera to a 40–55° oblique downward view relative to the horizontal support surface** so its ENTIRE pure-white screen is visible. The discontinued `high-view` preset remains forbidden as a generic design direction; this is a narrow pose-dependent exception, **not a vertical 90° bird's-eye shot**. For tilted phones, match the camera to the angled screen and show a plausible integrated point of support.

**MacBook Pro stays open.** Mac-only and paired scenes must show the raised white display, keyboard and trackpad. Its base may lie horizontally on a floor/block, but the **whole laptop must never be laid flat or closed**. A `flat-face-up` pose applies ONLY to iPhone; never mix it with a Mac pose.

Spatial modes: `grounded` = device rests directly on matte mineral floor; `on-block` = device rests on one or two rectilinear mineral presentation blocks (allowed functional supports, NOT decorative clutter). For a flat iPhone, the block must have a BROAD TABLE-SIZED mineral top, not a small cube; no table legs or furniture; `hover` = low above **visible** floor with faint separated shadow; `suspended` = **weightless, no floor, floor-wall seam, horizon, ground shadow or platform**. A `suspended` mode overrides floor references in an environment detail; prefer `suspended-mineral-planes`. Preserve quiet half-gray architectural depth. Never add desks, plants, mugs, hands, furniture, stands, supports, extra devices, logos or UI.

**PRECHECK PASS** only after all four files, preset IDs, correct device count, coherent spatial mode, no generic high-view camera (allow only the specified elevated oblique view for a flat iPhone), camera-angle/screen visibility matching pose, MacBook always open, and non-conflicting Scene Contract are verified. Identify selected IDs briefly before any generation.

## 3. RENDER-PROMPT LOCK

Batch request ≠ image-tool prompt. Freeze a **single-scene ~80–170-word English prompt** containing only that scene's devices, count, pose, relationship, pose-adapted camera, support geometry, architecture, spatial mode, lighting and exclusions. Start **"ONE standalone photorealistic product photograph. ONE camera view. Horizontal 16:9."** Then say **"Exactly one [specified model]"** for a single scene, or **"Exactly two devices: one [Mac] and one [iPhone]"** for a pair. Never send other scene options or a multiple-panel showcase. `prompts/` holds optional copy-ready fixtures.

If the effective tool prompt is inspectable, compare it with the frozen text. If it switches device count, placement, spatial mode, or asks for multiple views/collage, flag **`PROMPT_DRIFT` and STOP the batch**. If the tool hides/reformulates input, record **`PROMPT_UNVERIFIED`** instead of claiming an exact match. Where exact input fidelity is vital, use an explicit-prompt-capable interface.

**One locked prompt → one image-tool call → one standalone photograph.** Do not generate a contact sheet. Inspect the result before the next scene.

## 4. QA — prompt and image separately

Prompt fidelity: `MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED`. Inspect actual output: one camera frame, **exactly N requested devices and no others**, correct device geometry, fully white visible screens, pose and pose-adapted viewpoint (oblique for a flat iPhone; open display for every Mac), physically credible support, specified layout/depth, correct spatial mode (direct floor contact for grounded, an actual mineral support for on-block, and NO floor for suspended), camera, material/architectural planes, light, no props and ~16:9 (pixel verify if available). Hard failure → revise only that scene; prompt drift → repair input route. Mark unseen or unverifiable properties `UNVERIFIED`, never `PASS`.

## OPTIONAL ONLY

`.agents/skills/**/SKILL.md`, `WORKFLOW.md`, `providers/*.md`, `templates/`, `history/` and `prompts/` are **on-demand**, not extra mandatory reads. No automatic image persistence or geometry guarantee.
