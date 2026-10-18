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

## 3. EXECUTE (one scene at a time)

**One Scene Contract → one concise image prompt → one image-generation call → one standalone image.** Four images require four independent calls when supported, **not one prompt describing four scenes**, grids or collages. Pass only the selected scene's device geometry, pure-white screen, exact camera, architectural material/planes, light and short exclusions. Do **not** send all presets, other scenes or the entire harness to the image model. Use approved product reference imagery/editing if available. If the interface cannot produce independent images, say so instead of substituting a montage.

## 4. VISUAL QA (after each output)

Inspect the **actual render**. Reject wrong device or screen, collage, ratio (when measurable), camera/framing, material/architectural background, unrelated props, or lighting. Correct **only failed scenes**; mark uninspectable criteria `UNVERIFIED`, not `PASS`. No automatic image storage or CAD-level accuracy is claimed.

## OPTIONAL ONLY

Six `.agents/skills/**/SKILL.md` files, `WORKFLOW.md`, `providers/*.md`, `templates/` and `history/` are **on-demand references, never mandatory preflight**. They may add detail but cannot override the four-file gate or `STYLE.md`.
