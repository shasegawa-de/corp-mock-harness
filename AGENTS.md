# Mock Generation Harness — instructions

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
