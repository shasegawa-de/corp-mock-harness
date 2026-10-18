# Workflow — optional debugging reference

The **only mandatory** files are `AGENTS.md`, `STYLE.md`, `configs/devices.json` and `configs/presets.json` on live GitHub `main`. This file is optional.

## Where the old harness failed

Previous tests successfully loaded the harness, but effective tool prompts described a **four-panel product collage**, even though the intended Scene Contracts required one photograph each. This is **prompt handoff drift**, not proof that the image generator ignored a correct prompt. The fix is to freeze and audit each outgoing prompt.

## Scene Contract → exact final prompt

Internally plan the full batch, but expose **only the current scene** to the image tool. Convert selected JSON IDs to concrete prose: do not send raw preset tables, alternates, previous candidate prompts or a four-scene briefing. Target a concise English prompt of approximately 80–150 words.

**Example: ONLY default Scene A, iPhone 17**

```text
ONE standalone photorealistic product photograph. ONE camera view. ONE device.
Horizontal 16:9. A single standard iPhone 17 in black, with accurate flat
aluminum edges, slim bezel, rounded screen corners and a small central
Dynamic Island. Its ENTIRE front display is pure featureless white.

Camera square-on at eye level; phone upright and centered, with generous
negative space on both sides. The setting is an empty, continuous half-gray
matte microcement cyclorama: one seamless floor and backdrop with an
almost invisible junction, fine mineral grain and no decorative geometry.
A broad frontal softbox produces delicate realistic edge highlights and
a gentle shadow. Only this phone and those gray architectural surfaces.
No desk, wood, furniture, plants, cups, hands, stands, blocks, logos,
text, screen UI, extra phones or additional views.
```

This is **one complete image prompt**, not one part of a set. B, C and D must each have their own different **standalone** prompt with exactly one camera and environment.

## Tool prompt audit — fail fast

1. Record the **frozen outgoing text** for the current scene.
2. If the tool exposes the outgoing arguments or effective/revised prompt, inspect them **before interpreting the image**. A positive instruction for a multi-view layout or a different scene means `PROMPT_DRIFT`; stop the batch, do not continue B–D.
3. Some interfaces infer or rewrite the prompt from the conversation. When exact delivery cannot be inspected, report `PROMPT_UNVERIFIED`, not `MATCH`; keep the immediate handoff limited to the single scene. Where controllability is essential, use an interface accepting explicit prompt text.
4. Inspect the resulting **actual image** independently for hardware, camera, framing, gray architectural material, props and single-frame layout. A good prompt does not guarantee a good image.
5. Reject and revise only the failed scene. Save audit details only if repository write access and explicit approval exist.
