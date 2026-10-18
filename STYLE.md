# STYLE — mandatory visual contract

Premium, photorealistic architectural product imagery; restrained half-gray monochrome. Never a desk setup, decorated workspace or lifestyle interior.

## HARD RULES — every photograph

- **Device count:** Exactly the devices requested by `layout_id` in `configs/presets.json`. `single`: exactly one iPhone 17 OR one MacBook Pro 14. `side-by-side` / `depth-staggered`: exactly ONE of EACH; never duplicate, omit or substitute. No 2×2 collage, split scene, contact sheet or multiple camera angles.
- **Geometry and screen:** Faithful device silhouette/proportions, MacBook hinge, keyboard/trackpad and screen; standard iPhone 17 (NOT Pro), bezel and centered Dynamic Island. **Every requested display completely visible and featureless pure white**, with no UI, text or prominent reflections. Do not obscure either screen or Mac keyboard in a pair.
- **Composition:** ONE standalone landscape **16:9** photograph with one coherent camera and scene. Respect `composition_id` plus `layout_id` for camera elevation/yaw, product size, relative placement, spacing, depth/occlusion and intentional negative space. No arbitrary crop or severe distortion.
- **Background:** Quiet grayscale industrial/mineral architecture, with 0–3 physically coherent architectural planes; minimal fiber-cement, microcement, plaster, slate, steel or integrated smoked glass. Spatial mode overrides generic floor cues.
- **Spatial modes:** `grounded`: continuous mineral floor and natural contact shadow. `hover`: visible floor, slight elevation, delicate detached shadow. `suspended`: devices visibly unsupported in a **floorless image**. NO visible floor, horizon, wall-floor seam, podium, ground shadow, large cast shadow below devices or bottom-heavy platform. Use subtle vertical wall planes, tonal depth and light on the devices; never invent a floor just to establish scale.
- **Exclusions:** NO wood/woodgrain, desk, tabletop, furniture, hands/people, plants, coffee mugs, books, stationery, signage, stands, supports, plinths, decorative blocks, logos, watermarks, unrelated objects or extra devices. Empty space stays empty.
- **Lighting:** Natural soft studio/daylight with restrained metallic and glass reflections, coherent gentle shadows; avoid theatrical directional beams unless specifically selected.

## VARIATION and QA

Across candidates vary at least two material axes (layout/camera, architecture/material, lighting or spatial mode). Do not confuse a novel spatial arrangement with a collage.

**Hard reject**: wrong device number/models, cropped/colored/overlaid screen, incorrect layout or occlusion, floor in `suspended`, missing shadow cue in `hover`, wrong specified architecture/light, wood desk, unrelated props, or multiple independent views. Evaluate actual images separately from prompt integrity. CAD-perfect body geometry and pixel-perfect white are unverified without reference/measurement.

## VISUAL REFERENCE STATUS

Successful directions have copy-ready prompts in `prompts/` and optional metadata in `configs/presets.json > showcase_presets`. `user-approved-direction` means the art direction was liked, **not** proof of exact device geometry or perfect prompt handoff.
