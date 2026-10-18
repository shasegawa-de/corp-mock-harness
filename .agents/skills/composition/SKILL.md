---
name: composition
description: Specify a single 16:9 device mock composition with controlled camera angle, accurate object proportions, generous negative space and an unobstructed white screen.
---
# Composition skill

- Produce a scene description for **one** independent 16:9 camera view; it may show exactly 1 or 2 requested devices. Never request multiple shots in one grid or collage.
- Select a `compositions` entry from `configs/presets.json`; specify camera elevation, front yaw, tilt/roll, hero placement, screen visibility, negative-space strategy.
- For one Mac + one iPhone choose a valid `device_layouts` ID, keep both white screens and the laptop keyboard visible with no collisions. For `suspended`, keep all floor/horizon cues outside the frame. Keep the entire white screen visible. Avoid wide-angle distortion and severe foreshortening. Prefer moderate near-frontal 0–20° yaw unless user overrides.
- Subject should occupy roughly half the image's visual attention, without arbitrary architectural support or clutter. For laptops, prioritize fully visible screen and plausible keyboard proportions.
- For a batch, vary not only pose but framing and spatial logic. A changed crop with the same viewpoint is not a truly novel candidate.
- Ask the selected provider for a 16:9 output if available; **verify actual output aspect ratio separately**, do not claim any universal fixed resolution.
