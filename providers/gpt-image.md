# GPT Image adapter

**Runtime:** an available ChatGPT or GPT Image image-generation interface. This file contains *instructions*, not an API implementation.

1. Read `WORKFLOW.md`, `STYLE.md`, the relevant skill documents, device facts and chosen presets.
2. Generate exactly **one full-frame 16:9 image** per request; ask for true landscape ratio in text and select the corresponding image setting if the interface exposes one. Never form a grid or visual summary.
3. If device-faithful reference images are available and permitted, use image-edit/reference mode to preserve industrial design while changing background, lighting and camera framing.
4. Pass a single composed prompt. Keep constraints explicit: standard iPhone 17 vs Pro, blank white front screen, monochrome architecturally coherent background, no freestanding blocks.
5. Review the resulting image. If the tool returns an unexpected aspect ratio, or if screen/hardware is wrong, mark `reject` or `unverified` and regenerate. Do not claim pixel-accurate 16:9 without checking.

**Do not** use the old Python CLI, assume a specific OpenAI API image model, or infer that a ChatGPT subscription automatically supplies OpenAI API usage.

Reference: https://platform.openai.com/docs/guides/image-generation
