# Corp Mock Harness — mandatory execution contract

**STOP: no image-generation call before PRECHECK passes.** This is a GPT Image / Nano Banana instruction harness, not an image API service.

## 1. PRECHECK (mandatory; no shortcuts)

Read these **FOUR complete, individual files** from the live GitHub `main` branch of `shasegawa-de/corp-mock-harness`:
`AGENTS.md`, `STYLE.md`, `configs/devices.json`, `configs/presets.json`.

**If any file is missing, truncated, inaccessible, or its JSON is invalid: STOP and request access / the individual file.** Never use `dist/*.zip`, old chat excerpts, memory or guessed presets as substitutes. Use a pinned commit only if explicitly requested. Do not claim to have read a file without fetching it.

## 2. SCENE CONTRACT (before first image call)

Default to `iphone17`, 4 separate images, 16:9; use GPT Image unless the user requests Nano Banana or another supported engine. Build **one complete Scene Contract per image**:

`device_id | composition_id | environment_id | lighting_id | camera angle/framing/negative space | architectural planes/material | exclusions`

IDs must exist in the loaded JSON. For an unspecified four-image batch, use `configs/presets.json > default_scenes`. Different images must vary on **at least two substantive axes** (composition, architectural geometry/material, lighting), not just texture or crop.

**Before generation verify for EVERY contract:** correct single device, fully visible featureless white front screen, one independent 16:9 frame, chosen camera/placement, half-gray 0–3 coherent architectural planes, chosen lighting, **zero wooden desks, woodgrain, furniture, lifestyle rooms, blocks/stands, plants, mugs, hands, props, logos or UI**. `STYLE.md` is the hard design standard. An incomplete or conflicting contract means **NO generation**.

**Before the first image call, show a one-line PRECHECK receipt listing the four file names actually read and the selected scene IDs (e.g. `PRECHECK PASS: 4/4 files; scenes: A/B/C/D`). Do not print PASS or generate if any step failed.**

## 3. RENDER-PROMPT LOCK — prevent prompt drift

**A Scene Contract is NOT the image tool prompt.** For each selected scene, create exactly ONE **final render prompt** (about 80–150 English words) containing ONLY that scene's device, exact framing/camera, architectural material/planes, lighting and exclusions. **Freeze that text before the tool call.**

Start the prompt with: **"ONE standalone photorealistic product photograph. ONE camera view. ONE device. Horizontal 16:9."** Describe the selected camera angle and setting positively and concretely. Do **not** put a batch size, other scenes, alternative angles or words describing an affirmative multi-panel layout into the image tool input. Do not give the model the entire harness or scene table.

**OUTGOING PROMPT AUDIT (hard gate):** Compare the actual image-tool input, if inspectable, with the frozen prompt. Reject BEFORE dispatch if it adds or substitutes an instruction for a four-panel showcase, 2×2 grid, contact sheet, multiple views or a different scene. If the tool internally rewrites prompts or does not expose the effective prompt, **do not claim prompt integrity was verified**; use the exact frozen text through an explicit-prompt-capable interface when available. For an inference-only image tool, keep the immediate handoff strictly about this ONE scene and check any returned effective prompt. A mismatched effective prompt is `PROMPT_DRIFT`: **STOP the batch immediately** and correct the handoff/provider before generating other images.

**One Scene Contract → one locked prompt → one image-tool call → one standalone image.** Continue to the next scene ONLY when the previous image and available prompt audit have been evaluated. If the interface cannot perform separate outputs, explain the limitation, never substitute a composite.

## 4. OUTPUT QA — two independent checks

**Prompt QA:** record `MATCH / DRIFT / UNVERIFIED` for frozen prompt versus actual effective tool prompt (when exposed). `DRIFT` is a **pipeline failure**; stop the batch. Never claim a prompt was faithfully transferred based only on the Scene Contract.

**Visual QA:** inspect the actual image. Reject an incorrect device/screen, extra views, wrong aspect ratio (when measurable), camera/framing, architectural planes/material, lighting or any desk/prop. Regenerate only the failed scene **after prompt QA passes**. Mark uninspectable items `UNVERIFIED`; do not claim a visual `PASS` from the prompt alone.

## OPTIONAL ONLY

Six `.agents/skills/**/SKILL.md` files, `WORKFLOW.md`, `providers/*.md`, `templates/` and `history/` are **on-demand references, never mandatory preflight**. They may add detail but cannot override the four-file gate or `STYLE.md`.
