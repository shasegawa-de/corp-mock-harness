# Visual directions retained after interactive reviews — 2026-10-19

This is a **human review record of selected directions**, not a machine-verifiable image corpus. Original 1672×941 renders currently reside in the originating ChatGPT conversation; **image binaries are not committed to this repository**. The copy-ready prompts and configuration are committed as links below. **User approval of art direction does not establish exact Apple hardware fidelity or prompt/tool handoff integrity.**

## Reference A — iPhone frontal minimal studio (VISUAL ACCEPTED)

- Prompt: [`prompts/iphone17/a.txt`](../prompts/iphone17/a.txt)
- Scene: `single` + `grounded`; `frontal-centered`, `microcement-seamless`, `broad-softbox`.
- Merits: single centered hero; blank white screen; uninterrupted neutral backdrop; no desks or props.
- QA notes: bezel and physical device dimensions remain unverified against official reference.

## Reference B — iPhone 15-degree three-quarter mineral architecture (VISUAL ACCEPTED WITH NOTES)

- Prompt: [`prompts/iphone17/b.txt`](../prompts/iphone17/b.txt)
- Scene: `single` + `grounded`; `three-quarter-left`, `fiber-cement-panels`, `left-grazing`.
- Merits: credible perspective; coherent two-wall architecture; distinct from frontal A; no props.
- Known improvement: generated texture looked rougher than intended fiber cement; directional lighting somewhat hard.

## Reference D — asymmetric smoked glass (EXPERIMENTAL, NOT PASS)

- Revised prompt: [`prompts/iphone17/d.txt`](../prompts/iphone17/d.txt)
- Scene: `single` + `grounded`; `asymmetric-negative-space`, `smoked-glass`, `soft-overhead`.
- Merit: left-weighted composition and translucent glass improved on second render.
- Known failure: light became strong diagonal daylight rather than soft overhead. Do not silently promote to approved reference.

## Reference S — floorless floating MacBook Pro + iPhone (USER-APPROVED DIRECTION)

- Prompt: [`prompts/macbookpro14-iphone17/suspended.txt`](../prompts/macbookpro14-iphone17/suspended.txt)
- Scene: `side-by-side` + `suspended`; two independent devices, one camera, floorless soft-gray vertical architecture.
- Approval: user liked floating result and explicitly asked to reduce strong floor feeling; then approved the revised floorless suspended render.
- **Keep:** open Mac left, upright iPhone right, screens completely pure white and visible, Mac keyboard/trackpad visible, controlled angles, two subtly differentiated vertical architectural planes, no furniture or props.
- **Avoid:** visible floor, floor-wall seam, floor shadow, support, pedestal, desk and bottom-heavy staged product scene.
- Caveat: exact geometry has not been CAD-/photo-verified; effective image-generator prompt was not proven identical to the intended prompt.

## Additional candidate directions (not master-approved)

- MacBook Pro only, suspended: [`prompts/macbookpro14/suspended.txt`](../prompts/macbookpro14/suspended.txt) — visual candidate, test device count: exactly one laptop.
- MacBook Pro + iPhone, grounded side-by-side: [`prompts/macbookpro14-iphone17/side-by-side.txt`](../prompts/macbookpro14-iphone17/side-by-side.txt) — arrangement was visually feasible, not a user-approved master.
- `hover` mode (floor visible): valid exploration category, but previous examples felt too grounded; **do not substitute it for `suspended`**.
- Previous C iPhone high-view: **retired**; not an active preset or candidate. Replaced by eye-level architectural block placement. The old experiment remains in commit history only.

## Next QA protocol

1. Read four required live GitHub files, resolve `showcase_presets`, and take **one reference prompt at a time**.
2. Audit tool effective prompt when possible; if it drifts to a collage, wrong device count or a floor in a suspended scene, stop.
3. Evaluate actual frame, hardware, blank screens, placement, architecture, correct shadow logic, lighting and intentional absence of props. Record `MATCH / PROMPT_DRIFT / PROMPT_UNVERIFIED` independently from visual QA.
4. Promote new directions only after the user confirms the rendered visual; do not auto-label syntactically valid prompts as aesthetically approved.
