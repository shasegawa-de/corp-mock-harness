---
name: device
description: Lock down iPhone 17 or MacBook Pro 14-inch geometry, visible blank white display, product identity and reference-image requirements.
---
# Device skill

1. Select `iphone17` or `macbookpro14` from `configs/devices.json`. It contains links to primary Apple specification pages; verify uncertainties at source.
2. Exactly one device in the scene. Never silently substitute iPhone 17 Pro for the standard device or 16-inch MacBook for 14-inch.
3. Front screen fully visible and featureless white. Correctly proportion the chassis, bezels, corner radii, hinge, camera island/notch, keyboard and ports where visible.
4. Avoid all logos, brands printed on device, text, figures and extra devices.
5. Text prompts **cannot guarantee** accurate geometry. When fidelity is critical, pass a licensed/approved official-style reference image into a supported image editor and preserve the device body while varying only background/light; do not imply the model can reconstruct exact hardware from numbers alone.
6. Record geometric authenticity as `pass`, `fail` or `unverified` after inspecting the actual output.
