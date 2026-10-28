# Single-scene prompt fixtures — optional strict handoff test

The prompt files under `prompts/` are **independent, complete render prompts** derived from the live `main` presets. They are *smoke-test fixtures*, not replacements for the mandatory `AGENTS.md`, `STYLE.md` and configuration files.

## Available device configurations and references

**One image = one camera/scene, not necessarily one device.** Select `layout_id` and `spatial_mode_id` from live `configs/presets.json` (after the normal four-file preflight).

| Category | Fixed single-scene prompt | Review status |
|---|---|---|
| iPhone frontal A | [iphone17/a.txt](iphone17/a.txt) | Visual accepted |
| iPhone left three-quarter B | [iphone17/b.txt](iphone17/b.txt) | Visual accepted, material/light refinements |
| iPhone asymmetrical glass D | [iphone17/d.txt](iphone17/d.txt) | Experimental; lighting failure |
| MacBook Pro floating, NO FLOOR | [macbookpro14/suspended.txt](macbookpro14/suspended.txt) | Visual candidate |
| MacBook Pro + iPhone floating, NO FLOOR | [macbookpro14-iphone17/suspended.txt](macbookpro14-iphone17/suspended.txt) | **User-approved art direction** |
| MacBook Pro + iPhone, grounded | [macbookpro14-iphone17/side-by-side.txt](macbookpro14-iphone17/side-by-side.txt) | Feasible candidate |
| **MacBook Pro ×2, side-by-side** | [macbookpro14-macbookpro14/side-by-side.txt](macbookpro14-macbookpro14/side-by-side.txt) | **Visual direction accepted for MM1 v5 image; hardware QA and prompt fidelity unverified** |
| **MacBook Pro ×2, depth-staggered, FLOORLESS** | [macbookpro14-macbookpro14/suspended-depth.txt](macbookpro14-macbookpro14/suspended-depth.txt) | **AI image generated and published; user approval and prompt fidelity unverified** |

**`hover`**: near-floor with visible contact surface. **`suspended`**: weightless in a **floorless** frame, no floor horizon or ground shadow. These are different scenes. Exact Apple hardware fidelity remains unverified. The original image binaries have NOT yet been committed; these are reusable text prompts and documented visual decisions. See [review history](../history/2026-10-19-approved-directions.md).

## Architectural wall and floor surface studies## Marble — architectural surface and block references

- [Honed pale Carrara marble wall and floor](architectural-surfaces/carrara-marble-wall-floor.txt)
- [Honed graphite marble wall and floor](architectural-surfaces/graphite-marble-wall-floor.txt)
- [Broad, table-sized honed Carrara marble display block](environment/carrara-marble-display-block.txt)

All are independent empty architectural scenes with restrained natural veining and no device.

 (6 scenes, no devices)

These are **architectural planes and flooring in use**, not macro swatches or isolated textures. They are separately indexed in `configs/presets.json > surface_studies` with `layout_id=environment-only` and `devices=[]`. The HTML catalog includes visual references; some floor images are crops from earlier scenes, not independent generations of these new exact prompts.

| Type | Complete prompt |
|---|---|
| Wall + floor junction / microcement | [microcement-wall-floor](architectural-surfaces/microcement-wall-floor.txt) |
| Wall panels / fiber cement | [fiber-cement-wall-panels](architectural-surfaces/fiber-cement-wall-panels.txt) |
| Glass wall + mineral wall + floor | [smoked-glass-and-mineral](architectural-surfaces/smoked-glass-and-mineral.txt) |
| Charcoal corner + floor | [charcoal-wall-floor](architectural-surfaces/charcoal-wall-floor.txt) |
| Broad microcement floor (~85% frame) | [microcement-floor-plane](architectural-surfaces/microcement-floor-plane.txt) |
| Broad sandblasted concrete floor (~85% frame) | [sandblasted-concrete-floor](architectural-surfaces/sandblasted-concrete-floor.txt) |

## Empty-stage environment & lighting references

These six prompts render **ZERO devices**: architectural background, material and lighting only. The preview crops in the HTML gallery are **concept-board reference images, not standalone verified renders**.

- [Seamless microcement + frontal softbox](environment/microcement-soft.txt)
- [Fiber-cement corner + left grazing light](environment/fiber-corner-left.txt)
- [Table-sized mineral display block + overhead diffused light](environment/wide-block-soft.txt)
- [Smoked-glass partition + diffused soft light](environment/smoked-glass-soft.txt)
- [Charcoal fiber-cement corner + low-key lighting](environment/charcoal-lowkey.txt)
- [Floorless vertical mineral planes + broad diffusion](environment/suspended-vertical.txt)

Use `layout_id=environment-only`, `devices=[]`, `composition_id=empty-stage`. Select the material/light/spatial mode from `configs/presets.json`. This is a distinct reusable visual library, not a set of product mockups.

## iPhone posture variants — five complete single-scene prompts

The iPhone alone may be **face-up flat, leaning with credible physical support, upright, or fully suspended**. Camera framing tracks the pose. The old generic `high-view` preset is still retired: a flat face-up iPhone specifically needs a **40–55° oblique elevated camera** to keep its screen visible, never a 90° overhead flat lay. MacBook Pro does NOT support a flat device pose: it stays open, with raised display.

| Reference prompt | Physical pose | Surface / camera |
|---|---|---|
| [on-floor-flat.txt](iphone17/on-floor-flat.txt) | Flat, white screen face up | Matte mineral floor, oblique raised camera |
| [on-floor-tilted.txt](iphone17/on-floor-tilted.txt) | Leaning, physically supported by wall | Mineral floor + joined architectural wall, camera aligned to screen |
| [on-block-flat.txt](iphone17/on-block-flat.txt) | Flat face-up | ONE broad table-sized solid mineral block (not desk furniture); oblique raised camera |
| [on-block-tilted.txt](iphone17/on-block-tilted.txt) | Leaning against integral block facet | ONE broad mineral block, camera aligned to screen |
| [suspended.txt](iphone17/suspended.txt) | Unsupported, gently rotated | Floorless architectural airspace; no contact/cast ground shadow |

These five are **new reference prompts, not yet validated production-quality image outputs**; preserve the previous approved A/B compositions independently. Flat iPhone-specific camera elevation is an intentional exception, not a revival of generic high-view.

## Ground placement and intentional display plinths

**The high-view (bird's-eye) composition is retired.** No new image should use it. The former iPhone C concept is archived in Git history only; current default C is an eye-level block display.

- [iPhone on mineral block](iphone17/on-block.txt)
- [MacBook Pro directly on mineral floor](macbookpro14/on-floor.txt)
- [MacBook Pro on block](macbookpro14/on-block.txt)
- [Mac + iPhone on separate integrated mineral display blocks](macbookpro14-iphone17/on-blocks.txt)

Use `grounded` for actual floor contact and `on-block` for a restrained rectilinear concrete/fiber-cement platform supporting a product. This is the **only** plinth exception to the no-irrelevant-props rule. These new images are **proposed scenes / unverified** until independently rendered and reviewed. Do not confuse cropped exploration boards with validated standalone renders.

## Purpose

A previous test loaded the harness correctly but the **effective image-tool prompt** described a collage. That is an instruction-handoff error. The purpose of these files is to distinguish **prompt handoff drift** from **image model compliance** while preserving specific camera, architecture, lighting and device requirements.

## Explicit-input test (no API key or terminal)

1. Open [A prompt](iphone17/a.txt), select **Raw**, and copy **only the complete text**, without a four-scene batch request or repository link.
2. Start a **new, otherwise empty image-generation conversation** with GPT Image or Nano Banana. Paste the text as the **entire user message** and generate **one** image. A fresh chat minimizes contamination from a previous four-scene brief; it does not guarantee the model or tool will preserve the text verbatim.
3. If the app exposes an effective/revised prompt, compare it to the pasted prompt. Record `MATCH`, `PROMPT_DRIFT`, or `PROMPT_UNVERIFIED`. Do not infer `MATCH` from a plausible image alone.
4. Evaluate the actual image: **one standalone frame, exact requested device count/models, pure-white screens, exact camera/position, selected spatial mode and architectural material/planes, specified light, no props**. Record `PASS / REJECT / UNVERIFIED`.
5. **Only after A passes**, repeat with [B](iphone17/b.txt), [the block-placement replacement for C](iphone17/on-block.txt), and [D](iphone17/d.txt), each as a *separate new conversation or standalone input*. Never paste multiple prompts into one generation request.

## Interpretation

- **Collage described by the tool-facing prompt:** prompt handoff failure; fix the orchestration/input route, not just the style guide.
- **One-scene prompt preserved but collage rendered:** a model output-compliance failure.
- **One-scene result, incorrect angle/material/light:** scene fidelity failure; compare the effective prompt and the pixels independently.
- **Effective prompt hidden:** prompt fidelity remains `PROMPT_UNVERIFIED`.

Direct text entry is a **diagnostic workaround**, not a guaranteed controllable API. Fully automated exact-prompt dispatch would require an interface or API that accepts an explicit prompt; no image API is implemented in this repository.

## Scene fixtures

| File | Camera | Architecture | Light |
|---|---|---|---|
| [a.txt](iphone17/a.txt) | frontal-centered | microcement-seamless | broad-softbox |
| [b.txt](iphone17/b.txt) | three-quarter-left | fiber-cement-panels | left-grazing |
| [on-block.txt](iphone17/on-block.txt) | display-on-block | fine-concrete | broad-softbox |
| [d.txt](iphone17/d.txt) | asymmetric-negative-space | smoked-glass | soft-overhead |
