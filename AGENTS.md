# Corp Mock Harness — execution contract

**Purpose:** Produce independent, photorealistic device mock images with GPT Image or Nano Banana. This is an instruction harness, not an image API or executable service.

## 0. HARD GATE — read before any image generation

**Do not call any image tool until this gate passes.** Fetch and read these **four individual files in full** from the current `main` branch of `shasegawa-de/corp-mock-harness`:

1. `AGENTS.md` (this execution contract)
2. `STYLE.md` (all visual invariants and rejection criteria)
3. `configs/devices.json` (exact device identity)
4. `configs/presets.json` (allowed scene options and default scenes)

Use live GitHub files (raw/Contents API or verified current checkout), **never `dist/*.zip`, cached excerpts or an old chat**. Use a pinned commit only if explicitly requested. If any required file is missing, truncated, or its JSON cannot be parsed, **STOP and ask for the individual file/access**. Do not guess, substitute ZIP contents, or generate a generic product photo.

## 1. PLAN — one Scene Contract per output

Default: `iphone17`, **4 independent images**, **16:9**, available GPT Image (or requested Nano Banana). User-specified options take precedence unless they violate an explicitly retained hard constraint.

For each image, select valid `device_id`, `composition_id`, `environment_id`, `lighting_id` from the loaded JSON; add **camera angle, subject placement/negative space, 0–3 coherent architectural planes/material, light direction**, and **exclusions**. Use `default_scenes` when available for an unspecified four-image batch; otherwise choose valid distinct combinations.

Make each scene visually different on **at least two axes** (composition, spatial geometry/material, lighting). Do not invent preset IDs. Resolve unclear choices before calling the generator.

**Preflight PASS only if all four files were actually read AND every scene has a complete contract matching `STYLE.md`.** Check device/body, entire featureless pure-white front screen, exactly one device, 16:9 frame, restrained half-gray architecture and **zero desks/woodgrain, furniture, plants, mugs, hands, props, pedestals, logos or UI**. If a condition fails, fix the plan first. Never claim a pass without completing these checks.

## 2. GENERATE — isolate the scenes

**One scene = one image-generation call = one standalone image.** For four images, make **four separate calls**, where the interface permits; **never** send all four scenes to one image prompt or request a 2×2 grid/contact sheet. If independent calls are unavailable, explain the limitation rather than substituting a collage.

Compose a **concise, complete prompt per scene** from its contract: exact device geometry + fully visible white screen; specific camera/framing; specific architectural material and planes; lighting; a short explicit prohibition of wood desks, lifestyle objects, supports, extra devices, text/UI. Pass only that scene's instructions to the image tool. Do not send the entire harness, other scenes or competing options. Use an approved device reference image/edit mode if available for geometry fidelity.

## 3. VERIFY — reject failures, not just bad prompts

Inspect **each rendered image**, not merely the prompt. A wrong device, non-white/obscured display, composite/multiple devices, wrong framing or camera, non-16:9 ratio (when verifiable), lifestyle/desk background, unrelated props/supports or incoherent architectural planes is a **hard reject**. Revise and regenerate **only the failed scene**. Record `PASS / REJECT / UNVERIFIED`; never claim visual compliance if the image cannot be inspected or exact dimensions cannot be verified.

## Optional references — NOT part of the mandatory gate

`.agents/skills/**/SKILL.md`, `WORKFLOW.md`, `providers/*.md`, `templates/` and `history/` are **on-demand only** for special design decisions, provider controls or logging. Reading all six skills or the workflow is **not required** for ordinary generation. They cannot override this contract or `STYLE.md`. No API client, automatic history persistence or guaranteed pixel-perfect rendering is included.
