# Changelog

## Unreleased — main (2026-10-19)

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
