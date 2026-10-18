# Single-scene prompt fixtures — optional strict handoff test

These `prompts/iphone17/*.txt` files are **four independent, complete render prompts** derived from the live `main` presets. They are *smoke-test fixtures*, not replacements for the mandatory `AGENTS.md`, `STYLE.md` and configuration files.

## Purpose

A previous test loaded the harness correctly but the **effective image-tool prompt** described a collage. That is an instruction-handoff error. The purpose of these files is to distinguish **prompt handoff drift** from **image model compliance** while preserving specific camera, architecture, lighting and device requirements.

## Explicit-input test (no API key or terminal)

1. Open [A prompt](iphone17/a.txt), select **Raw**, and copy **only the complete text**, without a four-scene batch request or repository link.
2. Start a **new, otherwise empty image-generation conversation** with GPT Image or Nano Banana. Paste the text as the **entire user message** and generate **one** image. A fresh chat minimizes contamination from a previous four-scene brief; it does not guarantee the model or tool will preserve the text verbatim.
3. If the app exposes an effective/revised prompt, compare it to the pasted prompt. Record `MATCH`, `PROMPT_DRIFT`, or `PROMPT_UNVERIFIED`. Do not infer `MATCH` from a plausible image alone.
4. Evaluate the actual image: **one standalone frame, correct standard iPhone 17, pure-white front screen, exact camera/position, selected architectural material/planes, specified light, no props**. Record `PASS / REJECT / UNVERIFIED`.
5. **Only after A passes**, repeat with [B](iphone17/b.txt), [C](iphone17/c.txt), and [D](iphone17/d.txt), each as a *separate new conversation or standalone input*. Never paste multiple prompts into one generation request.

## Interpretation

- **Collage described by the tool-facing prompt:** prompt handoff failure; fix the orchestration/input route, not just the style guide.
- **One-scene prompt preserved but collage rendered:** a model output-compliance failure.
- **One-scene result, incorrect angle/material/light:** scene fidelity failure; compare the effective prompt and the pixels independently.
- **Effective prompt hidden:** prompt fidelity remains `PROMPT_UNVERIFIED`.

Direct text entry is a **diagnostic workaround**, not a guaranteed controllable API. Fully automated exact-prompt dispatch would require an interface or API that accepts an explicit prompt; no image API is implemented in this repository.

## Scene fixtures

| File | Camera | Architecture | Light |
|---|---|---|---|
| [a.txt](iphone17/a.txt) | frontal-centered | microcement-seamless | broad-softbox |
| [b.txt](iphone17/b.txt) | three-quarter-left | fiber-cement-panels | left-grazing |
| [c.txt](iphone17/c.txt) | high-view | dark-fiber-cement | top-right-daylight |
| [d.txt](iphone17/d.txt) | asymmetric-negative-space | smoked-glass | soft-overhead |
