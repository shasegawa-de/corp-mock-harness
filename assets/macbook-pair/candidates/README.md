# Two-Mac layout regeneration — review candidates (2026-10-28)

These images are **review candidates, not user-approved**. The currently published MM1/MM2 catalog cards are not replaced by candidates. Original assets remain at `assets/macbook-pair/mm1-grounded.jpg` and `mm2-suspended.jpg`.

| ID | Candidate | Layout / background | Review status |
| --- | --- | --- | --- |
| MM1 v2 | [mm1-diagonal-depth-v2.jpg](mm1-diagonal-depth-v2.jpg) | Foreground-left Mac, second behind-right, artificial dark background / wall-floor transition | **REJECTED by user — background is broken**. Historical reference only; must not replace catalog image |
| **MM1 v3 (current candidate)** | **[mm1-natural-microcement-v3.jpg](mm1-natural-microcement-v3.jpg)** | Foreground-left and rear-right MacBooks directly grounded on continuous pale half-gray microcement floor; soft, consistent plaster wall with one natural wall-floor junction, no dark gradient or repeating textures | **NEW UNAPPROVED CANDIDATE** — backdrop visually improved; full hardware accuracy, prompt fidelity and user approval pending |
| MM2 v2 | [mm2-offset-float-v2.jpg](mm2-offset-float-v2.jpg) | Staggered pair, repeated linear wall texture | **REJECTED by user — background distorted / unnatural**. Retained only as rejection evidence; do not publish or substitute into the catalog |
| **MM2 v3 (current candidate)** | **[mm2-float-natural-wall-v3.jpg](mm2-float-natural-wall-v3.jpg)** | Lower-left foreground Mac and higher-right Mac; two open white screens, keyboards and trackpads visible; consistent subdued half-gray microcement vertical wall backdrop, no floor, horizontal horizon, ground shadow or support | **NEW UNAPPROVED CANDIDATE**. Background defect visually corrected. Hardware geometry, prompt fidelity and user selection remain unverified |

### Generation and QA notes

- MM1 v2 had a dark artificial backdrop and an implausible wall/floor transition. It was rejected by the user even though two open laptops and their foreground/background positions were visible.
- **MM1 v3** uses a single coherent pale half-gray microcement wall and floor with a restrained wall-floor joint, no raised block or table. The two open laptops remain in left-front/right-rear depth order. The JPEG review rendition is **2688 × 1512 px**, generated independently with Adobe Firefly. User approval and detailed geometry verification are still pending. The underlying PNG generation output is not stored in Git.
- **MM1 acceptance criteria:** realistic architectural-scale wall and directly continuous mineral floor, believable one straight junction (if visible), no severe gradient or wallpaper/repeating noise, 2 distinctly separated open matching 14-inch laptops with both screens/keyboard/trackpads visible and realistic contact shadows.
- MM2 v2 had mechanically repeated vertical bands. It did not satisfy the architectural realism criterion for the background. A visually reasonable device layout alone is not sufficient for approval.
- MM2 v3 is an independent AI-generated revision: precisely **1648 × 927 px (16:9)**. `mm2-float-natural-wall-v3.jpg` is a JPEG rendition transferred from the new generated PNG; the original generated PNG is not committed to this repo.
- MM1 v2 and MM2 v2 are Adobe Firefly JPEG renditions of **2688 × 1512** crops. Do not confuse v3's tool/output provenance with those older assets.
- `PROMPT_UNVERIFIED`: we cannot attest that the tool's effective input exactly matched the canonical text in `prompts/macbookpro14-macbookpro14/`. User approval is still pending.
- **MM2 acceptance criteria:** exactly two individually open MacBook Pro 14-inch devices, entire blank white screens + both keyboards/trackpads visible, purposeful separated height/depth placement, NO floor / floor-wall joint / ground shadow / support, credible large-scale matte architectural wall surface without repetitive wallpaper-like seams, distortions, or excessive decorative lighting.
