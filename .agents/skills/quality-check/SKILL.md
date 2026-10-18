---
name: quality-check
description: Visually assess a generated mock for device fidelity, white screen, independent 16:9 frame, no props and sufficient variation; issue actionable revisions.
---
# Quality check skill

Optional deep review. Compare the **actual generated image** against its **Scene Contract** and `STYLE.md`, not only its text prompt. Use `templates/review.md` as rubric. This skill is not a mandatory file read before generation.

## Hard failures
1. More than one image composition within a frame; grid, panel collage, contact sheet, extra device.
2. Not approximately 16:9 (verify exact pixel width/height when image metadata is available); cropped or hidden display.
3. Non-white UI/screen, prominent reflections masking screen or distorted product chassis.
4. Person, hands, text, watermark, printed brand logo, unsupported accessory, decorative block, support stand or unrelated prop.
5. Wrong device model (e.g., Pro triple-camera design in standard iPhone 17).
6. Wrong prescribed composition: camera angle, framing, device placement/size or negative space differs from the Scene Contract.
7. Wrong prescribed environment: desk/woodgrain or lifestyle room, incorrect material, incoherent architectural geometry or more than three planes.
8. Lighting selection visibly ignored or inconsistent with the defined spatial structure.

## Aesthetic failures
9. Unnatural microtextures, unrealistic shadows/reflections, excessive contrast or ornate detail.
10. Cosmetic-only variation of an existing candidate.

Classify `pass`, `reject` or `unverified` per check, with concrete evidence and an edit direction. If image bytes or references are unavailable, mark the visual check `unverified`—never report success from prompt compliance alone. Re-generate only the failed image; don't overwrite accepted assets without direction. Note that automated pixel checks and CAD-level fidelity validation are NOT implemented.
