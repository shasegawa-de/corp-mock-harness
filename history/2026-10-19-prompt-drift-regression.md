# Regression: batch instruction leaked into image-tool prompt (2026-10-19)

## Observation (previous conversation test)

Requested: 4 independent standard iPhone 17 renders using the four `default_scenes` (one camera, one product, 16:9 per image). Required live files were successfully fetched; four separate image-tool invocations were made.

Actual: **4/4 responses were four-panel collages**, so the batch failed the single-scene and selected-camera/background acceptance criteria. The visible tool-facing descriptions themselves included affirmative phrases such as `four-panel product showcase`, `2x2 product-photography collage` and `four-panel product collage`. Therefore **the outgoing tool prompt differed from the locked single-scene intent**. This is evidence of **prompt handoff drift**, not evidence that a correct per-scene prompt was ignored.

The images themselves were not committed. Do not claim an externally verified image-model defect from these results alone.

## Required regression checks (next run)

1. Fetch the four mandatory live individual files, including JSON. Confirm `default_scenes` IDs exist.
2. Plan A–D, but construct an **isolated final render prompt only for A**, with its single camera, material, architectural planes, light and phone.
3. Record the frozen prompt. Inspect the actual/effective image-tool prompt if exposed. If it affirmatively asks for a montage or substitutes another scene, **STOP on A** and mark `PROMPT_DRIFT`.
4. If the effective prompt is not visible, record `PROMPT_UNVERIFIED`, not a successful transfer; do not treat output appearance alone as proof of prompt match.
5. Verify A's **actual image**: exactly one device and one camera frame, correct hardware, featureless white screen, correct frontal camera, seamless matte microcement architecture, no props. Continue to B–D only after A passes and no prompt drift is observed.
6. Repeat B–D with *independent* frozen prompts. Record per-image failures separately. Use `templates/review.md` when deeper records are needed.

## Expected pass criterion

Four **standalone** photographs, not four standalone collages; each camera, material and lighting matches the chosen default scene. Prompt integrity is verified only when the actual/effective prompt is inspectable.
