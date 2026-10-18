# Changelog

## Unreleased — main (2026-10-19)

- Add six product-free architectural wall and floor surface studies under `prompts/architectural-surfaces/` and `configs/presets.json > surface_studies`; distinguish built wall/floor finish, joints and floor-dominant camera angles from macro texture swatches.
- Add six device-free background architecture and lighting reference prompts under `prompts/environment/`; support `environment-only` 0-device layouts alongside normal single/pair photos. Concept-board previews are not final standalone output validation.
- Add iPhone 17 pose-aware single scenes: face-up flat on mineral floor, physically supported tilt on floor, face-up flat on broad table-sized concrete block, integrated-support tilt on block, and floorless solo suspension. Final prompts are complete single-scene text fixtures; image quality remains unverified.
- Add pose-specific camera rules: elevated 40–55-degree **oblique** view reveals a flat phone screen; generic high-view/90-degree bird's-eye remains retired. MacBook Pro remains OPEN with screen raised, never fully flat/closed. Keep current four-file live GitHub preflight.
- Retire high-view/bird's-eye composition and its former C prompt; default C now uses a near-eye-level mineral display block. Add distinct `on-block` spatial mode alongside `grounded`, `hover` and `suspended`. Permits purposeful mineral display plinths only in `on-block` (unrelated props still banned).
- Add four new copy-ready placement prompts: iPhone on block; MacBook Pro directly on floor; MacBook Pro on block; pair on display blocks. Image examples are concept previews, not validated standalone renders.
- Support `single`, `side-by-side`, and `depth-staggered` device layouts with exact device counts; distinguish `grounded`, `hover` and **floorless `suspended`** spatial modes in existing required files (no extra mandatory reads).
- Add reusable MacBook Pro and MacBook Pro + iPhone prompts and record user-accepted iPhone A/B and floorless suspended pair directions; retain D, high-view C and grounded pair as candidates where appropriate. Generated image binaries are not committed.
- Add four isolated, copy-ready standard iPhone 17 render prompts (`prompts/iphone17/a.txt` through `d.txt`) and a strict handoff regression test; keep this optional rather than adding more mandatory reading.
- Distinguish orchestration prompt drift from image-model fidelity by testing one prompt in a fresh image chat, then separately checking effective prompt and rendered image.
- Add frozen single-scene render prompts, outgoing/effective prompt auditing and fail-fast `PROMPT_DRIFT` detection; diagnose prior 4/4 collages as prompt handoff drift, not proof of generator noncompliance.
- Add one-scene regression case under `history/` and separate prompt integrity from visual QA in `templates/review.md`.
- Reduce the mandatory AI context to four live GitHub files: `AGENTS.md`, `STYLE.md`, `configs/devices.json`, `configs/presets.json`. Never use the ZIP as the execution source.
- Introduce explicit PRECHECK and per-image Scene Contracts; select four curated default scenes to avoid premature composition/background guessing.
- Keep one image tool call per standalone image; reject camera, architecture, lighting and device deviations from the actual image.
- Make SKILL/WORKFLOW/provider documents optional, removing redundant mandatory file-reading instructions.
- The `dist/corp-mock-harness-v0.2.0.zip` artifact remains a prior release snapshot, not updated with these changes.

## v0.2.0 — 2026-10-18

- Switch to a provider-neutral skills-first architecture without Python runtime or image API client.
- Add GPT Image and Nano Banana adapters, scene workflow and review/history templates.
- Define README as the single entry point for team prompts and six reusable skills.
- Add a versioned distributable ZIP snapshot under `dist/`.

## v0.1.0

- Initial Python/API-based planner and six skills (superseded by v0.2.0).
