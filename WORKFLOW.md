# Workflow — optional execution notes

**The mandatory gate and sequence live in [AGENTS.md](AGENTS.md).** This document is optional guidance, not an extra prerequisite. Before any image call, load only the four mandatory live files named there; never load the ZIP as execution context.

## Scene Contract (one per image)

```text
device_id: [valid key from configs/devices.json]
composition_id: [valid id from configs/presets.json]
environment_id: [valid id from configs/presets.json]
lighting_id: [valid id from configs/presets.json]
camera/framing: [angle, height, orientation, size, negative space]
architecture: [material and 0–3 coherent planes]
exclusions: [no desks, props, stands, logos or UI]
```

For an unqualified four-image request, use `default_scenes` from `configs/presets.json`, adapted to the selected device. Four scenes require four independent tool invocations, not one request containing four scenes.

## Prompt per image

```text
ONE photorealistic 16:9 landscape image, not a collage.
[Exact single device, correct housing and fully visible pure-white display].
[Chosen camera, orientation, framing and negative space].
[Specific monochrome architectural environment/material/planes].
[Specific soft studio lighting].
No wood desk, furniture, lifestyle setting, decorative blocks, stands,
plants, mugs, hands, extra device, text, logos, UI or watermark.
```

**Only pass that scene's concrete instructions**, not every preset or the whole harness. Review the actual output against `STYLE.md`; reject wrong device, screen, viewpoint, environment, props or layout. Revise only failed scenes. Exact dimensions and history persistence must be verified rather than presumed.
