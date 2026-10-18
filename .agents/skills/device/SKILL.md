---
name: device
description: Lock down iPhone 17 or MacBook Pro 14-inch geometry, visible blank white display, product identity and reference-image requirements.
---
# Device skill

1. Select `iphone17` or `macbookpro14` from `configs/devices.json`. It contains links to primary Apple specification pages; verify uncertainties at source.
2. Exactly the requested devices: one device in `single`, or one 14-inch MacBook Pro plus one standard iPhone 17 in a supported pair layout. Do not substitute a Pro phone or 16-inch MacBook, and never invent an extra device.
3. Front screen fully visible and featureless white. Correctly proportion the chassis, bezels, corner radii, hinge, camera island/notch, keyboard and ports where visible.
4. Avoid logos, brands printed on device, text and figures; in pair scenes preserve both white screens and the Mac keyboard without occlusion.
5. Text prompts **cannot guarantee** accurate geometry. When fidelity is critical, pass a licensed/approved official-style reference image into a supported image editor and preserve the device body while varying only background/light; do not imply the model can reconstruct exact hardware from numbers alone.
6. Record geometric authenticity as `pass`, `fail` or `unverified` after inspecting the actual output.
