# STYLE — mandatory visual contract

Photorealistic premium architectural studio product imagery. This is NOT a desk, office, home or lifestyle scene.

## HARD RULES — every image

- **Device:** Exactly ONE standard iPhone 17 or 14-inch MacBook Pro as defined in `configs/devices.json`. Correct chassis, camera, bezel, keyboard and proportions; never substitute a Pro phone. Prefer approved device reference imagery when available.
- **Screen:** Entire front display unobscured, featureless pure white. No graphics, UI, text or screen reflections that obscure white.
- **Composition:** ONE standalone horizontal 16:9 scene, never a collage or grid. Respect the chosen `composition_id`: camera position and angle, pose, framing, device scale and negative space. No wrong angle, exaggerated perspective or cropping.
- **Environment:** Respect `environment_id`. Half-gray monochrome, matte mineral/industrial texture; coherent 0–3 architectural planes (cyclorama, wall/floor, simple corner or integrated partition). No arbitrary shapes or unsupported blocks.
- **Exclude ALL unrelated objects:** No wooden or woodgrain desk, table, office or home interior, props, plants, mugs, books, furniture, hands, people, stands, pedestals, signage, brand logos, watermarks or UI. Empty space must stay empty.
- **Lighting:** Respect `lighting_id`; soft believable studio light, restrained reflections and natural shadows; no theatrical beams or colored light.

## VARIATION

For each batch, vary at least two substantial axes across composition/camera, architectural layout/material and lighting. Distinct preset IDs alone are insufficient: ensure the scene structure really changes. Do not fall back to the same wall + diagonal light composition for every image.

## QA — HARD REJECT

Wrong hardware; non-white/hidden screen; collage; wrong camera/framing; incorrect material or number of architectural planes; wood desks, props or stands; inconsistent lighting or visibly incorrect aspect ratio. Reject and regenerate the failed image, regardless of aesthetic quality. Do not claim exact pixel ratio or product precision without checking the output. Image models may require approved reference photos or later compositing for high geometric fidelity.
