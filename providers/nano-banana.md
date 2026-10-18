# Nano Banana adapter

**Runtime:** a Gemini/Nano Banana image-generation interface that the operator already has access to. This is a prompt and review adapter, not an API client.

1. Read `WORKFLOW.md`, `STYLE.md`, the six relevant skills, `configs/devices.json` and `configs/presets.json`.
2. For each planned scene send a **separate** image-generation instruction; no 2×2 montage or multi-frame collage.
3. Select 16:9 landscape in generation controls when supported. Google documentation lists 16:9 for supported Nano Banana image variants, but actual settings, size and capabilities vary with interface/model. Check the image output.
4. Provide an approved product reference image when supported and geometry is important. State clearly that the **device shape is locked; only environment, lighting and pose should vary** when editing.
5. Ensure exactly one device, fully visible blank white front display, accurate non-Pro/14-inch device, half-gray background with 0–3 coherent planes, no unrelated blocks and no logo/people/text.
6. Visually review hardware correctness, rendering artifacts, ratio and scene novelty. If inconsistent, revise a single scene with concise edits; log the failure.

No API key, SDK, CLI or fixed model ID is used in this repo.

Google's current product documentation and model support: https://ai.google.dev/gemini-api/docs/image-generation
