# Corp Mock Harness — mandatory execution contract

**STOP before image generation.** This is a prompt harness for GPT Image or Nano Banana, not an image API service.

## 1. PRECHECK — four live files only

Fetch and read in full the individual `AGENTS.md`, `STYLE.md`, `configs/devices.json` and `configs/presets.json` from `shasegawa-de/corp-mock-harness` **GitHub `main`**. Validate JSON. Never use ZIP archives, remembered excerpts or guessed presets. A pinned commit is allowed only if the user requests it. **If a required file is missing, incomplete or unreadable, STOP** and request access/the individual file.

## 2. PLAN — one Scene Contract per image

Default: standard `iphone17`, four separate images, 16:9, available GPT Image unless another supported engine is requested. For each scene choose existing `device_id | composition_id | environment_id | lighting_id` plus **specific camera/placement/negative space, 0–3 architectural planes/material, lighting and exclusions**. For four unspecified images, use `default_scenes` in `presets.json`, varying at least two major axes.

Before rendering, verify each scene against `STYLE.md`: **one correct device, entire pure-white empty screen, one horizontal frame, correct camera and half-gray architectural environment; NO wood/desks, lifestyle furniture, unrelated props/stands, plants, mugs, hands, text, logos or UI**. Incomplete/conflicting scenes are **NO-GO**. Report a brief `PRECHECK PASS: 4/4 files; scene IDs ...` only after the real checks.

## 3. RENDER-PROMPT LOCK — the critical handoff

**Batch instructions are not render prompts.** Freeze one **80–150-word final render prompt** for the CURRENT scene only. Begin exactly: **"ONE standalone photorealistic product photograph. ONE camera view. ONE device. Horizontal 16:9."** Include its exact product, camera, architecture, light, white screen and exclusions. Do not mention batch size, other scenes, alternative angles or positively describe a multi-panel image; never pass whole repository text to the image tool.

**Audit tool handoff:** Compare the actual/effective image-tool prompt with the frozen text **if inspectable**. If it changes to an affirmative four-panel, 2×2, montage, multiple-view or different-scene instruction, flag `PROMPT_DRIFT` and **STOP the batch immediately**. If the effective prompt is hidden/rewritten, label `PROMPT_UNVERIFIED`; never claim a verified match. For inference-only tools, keep the immediate handoff about this ONE scene. Use an explicit-prompt-capable interface where exact delivery is essential.

**ONE locked prompt → ONE independent tool call → ONE standalone image.** Proceed to the next scene only after inspecting the current prompt audit and render; do not replace separate images with a collage.

## 4. QA — prompt and image separately

Record prompt fidelity `MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED`. Inspect the **actual image** for device, white screen, single view, camera/framing, 16:9 when measurable, selected background planes/material, lighting and props. Hard failures require correction of only that scene; prompt drift requires **pipeline repair before any further generation**. Never mark unseen images or uninspectable properties `PASS`.

## OPTIONAL (never prerequisites)

`.agents/skills/**/SKILL.md`, `WORKFLOW.md`, `providers/*.md`, `templates/` and `history/` are on-demand references. No automatic history persistence or CAD-level fidelity guarantee.
