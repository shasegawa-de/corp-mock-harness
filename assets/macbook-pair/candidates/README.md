# Two-Mac layout regeneration — review candidates (2026-10-28)

These images are **review candidates, not user-approved**. The currently published MM1/MM2 catalog cards are not replaced by candidates. Original assets remain at `assets/macbook-pair/mm1-grounded.jpg` and `mm2-suspended.jpg`.

| ID | Candidate | Layout / background | Review status |
| --- | --- | --- | --- |
| MM1 v2 | [mm1-diagonal-depth-v2.jpg](mm1-diagonal-depth-v2.jpg) | Foreground-left Mac, second behind-right, artificial dark background / wall-floor transition | **REJECTED by user — background is broken**. Historical reference only; must not replace catalog image |
| MM1 v3 | [mm1-natural-microcement-v3.jpg](mm1-natural-microcement-v3.jpg) | Foreground-left and rear-right laptops, seamless natural mineral floor/wall, BUT overly even and flat illumination | Background reference only; **not approved** as final art direction |
| **MM1 v4 (current candidate)** | **[mm1-directional-light-v4.jpg](mm1-directional-light-v4.jpg)** | Same two Macs and natural wall/floor; diagonal soft daylight from upper left, more dimensional contrast and grounded shadows | **NEW UNAPPROVED CANDIDATE** — light improved over v3; user and exact hardware QA pending |
| MM2 v2 | [mm2-offset-float-v2.jpg](mm2-offset-float-v2.jpg) | Staggered pair, repeated linear wall texture | **REJECTED by user — background distorted / unnatural**. Retained only as rejection evidence; do not publish or substitute into the catalog |
| **MM2 v3 (current candidate)** | **[mm2-float-natural-wall-v3.jpg](mm2-float-natural-wall-v3.jpg)** | Lower-left foreground Mac and higher-right Mac; two open white screens, keyboards and trackpads visible; consistent subdued half-gray microcement vertical wall backdrop, no floor, horizontal horizon, ground shadow or support | **NEW UNAPPROVED CANDIDATE**. Background defect visually corrected. Hardware geometry, prompt fidelity and user selection remain unverified |

### Generation and QA notes

- MM1 v4 keeps the relatively coherent v3 architecture and adds directed natural light to restore v2's dimensional highlights. A first independent generated v4 image had an unnatural repeated wallpaper-like wall texture and was **rejected before archiving**; this stored v4 instead comes from editing v3's lighting while preserving the original scene.
- **MM1 v4 source provenance:** Adobe Firefly image-instruction edit using the earlier v3 image; editing downscaled the source from 2688×1512 to approximately 2048×1152, then the saved review JPEG rendition is **2048 × 1149 px** (approximately 16:9). This is NOT an original 2688-pixel photograph. Prompt fidelity unverified, user approval pending.
- MM1 v2 had a dark artificial backdrop and an implausible wall/floor transition. It was rejected by the user even though two open laptops and their foreground/background positions were visible.
- **MM1 v3** uses a single coherent pale half-gray microcement wall and floor with a restrained wall-floor joint, no raised block or table. The two open laptops remain in left-front/right-rear depth order. The JPEG review rendition is **2688 × 1512 px**, generated independently with Adobe Firefly. User approval and detailed geometry verification are still pending. The underlying PNG generation output is not stored in Git.
- **MM1 acceptance criteria:** realistic architectural-scale wall and directly continuous mineral floor, believable one straight junction (if visible), no severe gradient or wallpaper/repeating noise, 2 distinctly separated open matching 14-inch laptops with both screens/keyboard/trackpads visible and realistic contact shadows.
- MM2 v2 had mechanically repeated vertical bands. It did not satisfy the architectural realism criterion for the background. A visually reasonable device layout alone is not sufficient for approval.
- MM2 v3 is an independent AI-generated revision: precisely **1648 × 927 px (16:9)**. `mm2-float-natural-wall-v3.jpg` is a JPEG rendition transferred from the new generated PNG; the original generated PNG is not committed to this repo.
- MM1 v2 and MM2 v2 are Adobe Firefly JPEG renditions of **2688 × 1512** crops. Do not confuse v3's tool/output provenance with those older assets.
- `PROMPT_UNVERIFIED`: we cannot attest that the tool's effective input exactly matched the canonical text in `prompts/macbookpro14-macbookpro14/`. User approval is still pending.
- **MM2 acceptance criteria:** exactly two individually open MacBook Pro 14-inch devices, entire blank white screens + both keyboards/trackpads visible, purposeful separated height/depth placement, NO floor / floor-wall joint / ground shadow / support, credible large-scale matte architectural wall surface without repetitive wallpaper-like seams, distortions, or excessive decorative lighting.

## MM1 v5 — visual direction accepted, published in catalog

- **Current displayed photo**: [mm1-adopted-v5.jpg](../mm1-adopted-v5.jpg). Original image was independently generated with OpenAI image generation. The user accepted the visual direction after iterative adjustments to laptop angles, directional sunlight and removal of foliage shadows.
- **Published**: The vNext MM1 card loads the versioned JPEG; the previous original [mm1-grounded.jpg](../mm1-grounded.jpg) remains intact. Earlier v2-v4 files remain review history.
- **Image provenance**: Original PNG 1672×941; its SHA-256 is `3ed27c2064f90a1b8acad8f5c0aa39ebdf29e1750d5b8e564c024b5f440ce430`. The Git-tracked image is a 1672×941 JPEG rendition; **do not claim it is the original PNG**. See [manifest](../generation-manifest.json).
- **Approval scope**: Only composition, varied laptop orientation and lighting received informal visual acceptance. True device dimensions, product-specific geometry and exact effective text sent to the generation engine remain unverified. `PROMPT_UNVERIFIED`.
- **MM2 remains pending**. No MM2 image or catalog status changed.
