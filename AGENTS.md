# Mock Generation Harness — instructions

## SOURCE OF TRUTH — LIVE REPOSITORY FILES, NOT ZIP

**The authoritative instructions are the individual Markdown/JSON files on the `main` branch of `shasegawa-de/corp-mock-harness`. Fetch and read those live files directly before any image generation.** This includes `AGENTS.md`, `STYLE.md`, `configs/devices.json`, `configs/presets.json`, relevant `.agents/skills/**/SKILL.md` files and the selected provider guide.

- Source priority: **(1) latest individual files on `main`** via repository file reads, raw URLs, Contents API or a verified up-to-date checkout; **(2) individual files at a specific commit only if the user explicitly requests that revision**.
- **NEVER use `dist/*.zip`, downloaded ZIP archives, uploaded archive copies or remembered excerpts as the execution source of truth.** They are versioned distribution snapshots, potentially older than `main`, and do not satisfy the mandatory read-first gate.
- If an archive conflicts with live files, **follow the live files**. Do not unzip an archive as a shortcut for reading the required configuration or skills.
- If the live required files cannot be fetched fully, **STOP before invoking any image-generation tool** and request access or the required individual files. Do not substitute cached or archived content.

## ⛔️ CRITICAL GATEKEEPER FOR AI — STOP BEFORE IMAGE GENERATION

**Do NOT trigger image generation APIs or tools immediately upon receiving a prompt.** A user request such as “generate four iPhone mockups” is **not** permission to skip the harness preflight.

1. **MUST read and process the complete contents** of `STYLE.md`, `configs/devices.json`, and `configs/presets.json` **before the first image-generation tool call**. Also apply `AGENTS.md`, relevant `SKILL.md` instructions, and the selected provider guide. Do not assume these files have been read based on names, prior knowledge, or a partial excerpt.
2. **MUST prepare one concrete scene plan per image first**: exact device, composition/camera, one architectural material and coherent 0–3 planes, lighting, negative constraints. For multiple images, vary at least two substantive design axes and generate independent frames, not a collage.
3. **MUST enforce ALL hard constraints in every scene**: exactly one correctly shaped device; front display fully visible and **featureless pure white**; one independent **16:9** horizontal frame; **half-gray monochrome architectural planes**; **absolute zero unrelated props**. In particular: **NO wooden or wood-grain desks, tabletops, office/home interiors, plants, coffee mugs, books, stationery, hands, furniture, stands, pedestals, decorative blocks, logos, watermarks or UI**. Never add lifestyle objects to make the scene look “premium” or to fill negative space.
4. **If any required source is inaccessible, unreadable, or only partially retrieved, STOP.** Do not invent missing preset information or generate a generic lifestyle/product image. Ask for access or the missing file.
5. **ONLY AFTER steps 1–4 are satisfied may an available GPT Image or Nano Banana tool be invoked.** After generation inspect the actual image, reject violations and correct the prompt/scene; do not rationalize an unwanted desk or prop as part of the environment.

**Default scene bias to suppress:** this is **architectural studio product photography**, **not** a desk setup, home office, lifestyle flat-lay or decorated workspace. Favor an empty restrained grayscale backdrop over any guessed environmental object.

**Purpose:** Generate and refine independent, art-directed photorealistic device mock images using **GPT Image or Nano Banana**. This repository provides an instruction harness, not a code-based image generation service.

## Sources (priority)

1. `STYLE.md` — invariants and precedence.
2. `configs/devices.json` — verified device identity and hardware references.
3. `configs/presets.json` — architectural environment, composition and lighting options.
4. `.agents/skills/{device,composition,environment,lighting,variation,quality-check}/SKILL.md` — reusable instructions.
5. `providers/gpt-image.md` or `providers/nano-banana.md` — execution-specific advice.
6. `history/` — accepted/rejected recent results, only if populated.

## Procedure

1. Parse device, engine, count, 16:9, screen treatment and style from request. Do not infer a different engine.
2. Compose one scene specification **per output image**: Device + Composition + Environment + Lighting + negative constraints.
3. Diversify the scenes using Variation: vary at least two major axes per new candidate, check past history and previous images. Do not equate different preset IDs with genuine visual differences.
4. Select provider instructions; ask for authorization before actual image generation only if required by the user's request/context. For paid API usage, obtain explicit authorization; no API is used by this repository itself.
5. **Generate separate images, never grids, collages or contact sheets.** One device per frame, front screen fully visible and blank white.
6. Evaluate each rendered image with Quality Check, not just its prompt. Rejected images should have a concrete diagnosis and a revised scene specification.
7. Record the provider, model if known, configuration if known, prompt, presets, status and reasons in a history entry when repository writes are available. Never claim automatic persistence when not available.

## Limits

The GitHub repository is not auto-loaded in ChatGPT, Gemini, or a generic image tool. An orchestrating environment must read these instructions and explicitly pass prompts/references to the selected image generator. **No Python CLI or programmatic API integration is included.** Image identity and exact screen geometry are visual QA items, not guaranteed by text alone.
