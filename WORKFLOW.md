# Mock generation workflow — provider-neutral

This is a *manual/agent-mediated image-generation harness*, not an executable image API application. An assistant or operator needs to load this repository's instructions and run the selected image tool.

## Step 1: Define
Fill `templates/request.md`. Confirm subject, provider (GPT Image or Nano Banana), number of independent outputs, expected white screen and 16:9. Default: half-gray monochrome photorealistic product photography.

## Step 2: Design a plan
Read `STYLE.md`, `configs/devices.json`, `configs/presets.json`. Apply six `SKILL.md` instructions:
- Device = lock subject.
- Composition = viewpoint/pose/negative space.
- Environment = physically coherent material/spatial planes.
- Lighting = realistic illumination/reflections/shadows.
- Variation = create distinct signatures; compare recent history.
- Quality Check = criteria for final inspection.

Record a scene selection table with one row per **independent image**: `device | composition_id | environment_id | lighting_id | spatial note | camera note`. Four images should have noticeably different environments and camera/illumination logic.

## Step 3: Compose prompt (one per image)

```text
Produce exactly ONE independent landscape 16:9 photorealistic product studio photograph. No collage, grid, multi-panel, montage or contact sheet.

DEVICE: [from configs/devices.json; precisely one subject; front display fully visible, blank white, correct physical proportions].
COMPOSITION: [one independent composition preset + camera position, hero scale, negative space].
ENVIRONMENT: [one material + 0–3 coherent architectural planes; no unrelated blocks or supports].
LIGHTING: [one illumination preset + physical shadow/glass reflection].
TONE: Half-gray monochrome, modern, calm, premium; photorealistic material microtexture.

CONSTRAINTS: One device only, entire screen visible and white, no text/UI/logos/people/hands/watermarks/stands/decorative blocks/props; no geometrical distortion. Do not output multiple scenes in one image.
```

Avoid over-specifying multiple conflicting perspectives or material types.

## Step 4: Generate
Choose `providers/gpt-image.md` or `providers/nano-banana.md`; pass the per-image prompt and approved references into the corresponding product's image feature. Request landscape 16:9 using whichever setting the current UI exposes. **Do not assume access to a tool or claim that generation occurred unless an image was returned.** Prompt and tool controls are separate.

## Step 5: Review
Inspect each image at normal and enlarged scale with `templates/review.md`. Hard failures => reject; aesthetic mismatches => revise. For exact dimensions, inspect image metadata when possible. Model text output isn't proof of visual correctness.

## Step 6: Log and iterate
Keep a concise record of provider, model (if known), ratio, selected preset IDs, prompt, output location, QA result, and corrective change using `history/README.md` as guidance. Do not upload proprietary imagery without approval. Unrecorded history means best-effort, not guaranteed deduplication.

## Model-independent constraints
Do not silently substitute the wrong iPhone generation or Pro body; maintain one subject; no decorative stands or marble-by-default. If exact product shape/UI masking is a hard requirement, request reference imagery or use external perspective-aware compositing after generation.
