# Nano Banana adapter — optional

Use only for Gemini/Nano Banana-specific controls. **The mandatory four-file gate is in AGENTS.md; do not load WORKFLOW.md and all six SKILL files automatically.**

1. Send **one independent Scene Contract in each image generation request**. No 2×2, split frame, multi-view grid or collage.
2. Request landscape 16:9 in the supported interface controls; confirm dimensions after rendering when possible.
3. Include the exact device, fully visible featureless white screen, selected camera framing, 0–3 coherent half-gray architectural planes and lighting; exclude wooden desks, props and supports.
4. Use approved device references where supported and needed for fidelity; lock the shape while varying camera, environment and illumination.
5. Visually assess the actual image and regenerate only failed scenes. Do not claim verified accuracy without inspection.

This repository is a prompt harness, not a Nano Banana API client. Reference: https://ai.google.dev/gemini-api/docs/image-generation

**Prompt integrity:** For each call, freeze one complete single-scene render prompt and inspect the actual/effective tool prompt when available. A rewritten multi-view or four-panel instruction is `PROMPT_DRIFT`: STOP the batch. If effective prompt text is not inspectable, mark `PROMPT_UNVERIFIED`. Never send the batch brief or the other three scenes to the image engine.
