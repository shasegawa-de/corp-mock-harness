# Image-generation providers

This directory documents how to **hand off the same scene specification** to different image products.

- [GPT Image](gpt-image.md) — run using ChatGPT's available image generation feature or a supported GPT Image experience.
- [Nano Banana](nano-banana.md) — run using an available Gemini/Nano Banana image-generation experience.

The six skills, `STYLE.md` and `configs/` are the source of truth. Provider documents only adapt the way instructions/references are delivered.

**Important:** No code in this repository calls either model. This repository is not automatically recognized by either UI. Access, model variants, image size controls, paid usage and permission to submit references vary by product; check the active tool rather than hard-coding an API model identifier.

References: https://platform.openai.com/docs/guides/image-generation and https://ai.google.dev/gemini-api/docs/image-generation
