# GPT Image adapter — optional

Use only if GPT Image-specific controls are needed. **AGENTS.md is authoritative; do not re-load WORKFLOW.md or all six SKILL files as a prerequisite.** Complete the mandatory four-file preflight first.

1. Generate **ONE independent landscape 16:9 mock per image-tool call** using ONE Scene Contract and only that scene's concise prompt. Four scenes mean four separate calls, not one grid/collage.
2. Include the selected exact device, blank pure-white front screen, composition/camera, 0–3 coherent gray architectural planes, studio lighting, and a concise no-desk/no-props clause. Preserve the selected background and framing; do not add lifestyle furniture.
3. If an approved product reference is available, use it for image editing/reference to improve device geometry.
4. Inspect the actual output; reject camera, environment, screen or hardware deviations and re-generate only the failed scene. Request 16:9 controls when available and verify dimensions where possible.

No image API client or automatic storage is provided. Reference: https://platform.openai.com/docs/guides/image-generation

**Prompt integrity:** Freeze a single-scene final render prompt before calling the tool. If the interface exposes the effective/generated tool prompt, compare it to the frozen text. If it changes to an affirmative multi-view or four-panel instruction, classify `PROMPT_DRIFT` and STOP the batch; do not infer that the image model ignored a correct prompt. If tool-side prompt rewriting is invisible, mark `PROMPT_UNVERIFIED` and use an explicit-prompt-capable interface when exact control is needed. Do not leak the batch instruction or the other planned scenes into the per-image prompt.
