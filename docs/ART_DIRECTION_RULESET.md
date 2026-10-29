# Art-direction criteria — MM1/MM2 experiment

This is a review-to-prompt translation, not a claim of model fidelity. It describes **observable photographic properties**. The formal four-file harness remains the technical contract; [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) preserves decision provenance.

| ID | Applies | Rule used in experimental C | Evidence / status | Evaluation |
| --- | --- | --- | --- | --- |
| G1 | MM1/MM2 | Exactly two identical, separately open 14-inch MacBook Pro; both white displays, keyboards and trackpads entirely visible | `AGENTS.md`, `STYLE.md`, `configs/devices.json`; mandatory | Device count/occlusion: hard reject |
| G2 | MM1/MM2 | Keep realistic aluminum footprint/hinge and credible perspective; no third or mis-sized laptop | `configs/devices.json`; mandatory but exact pixel accuracy unverified | Visual geometry QA, not millimeter certification |
| S1 | MM1 | Side-by-side scene and directly grounded on a continuous mineral floor, natural contact shadows | Canonical MM1 prompt and `grounded` rule; baseline preserved for controlled comparison | Layout and contact |
| S2 | MM2 | Left-rear/higher Mac and right-front/lower Mac, both floating; **no floor, horizon or ground shadow** | Canonical MM2 prompt and `suspended` rule; baseline preserved | Placement and floorless hard gate |
| D1 | MM1 | Nonmechanical angular variation, readable silhouettes and breathing room | MM1-v5 art direction; **adapted to original side-by-side test layout** | Natural composition / no occlusion |
| D2 | MM1/MM2 | Architectural-scale nonrepeating half-gray microcement, no wallpaper stripes, repeated seams or artificial dark gradients | [MM1-v2/MM2-v2 rejections](DESIGN_DECISIONS.md); validated review history | Background separate from lighting |
| D3 | MM1 | Restore soft upper-left directional light, satin metallic reflection and grounded shadows without foliage silhouette | MM1-v5 accepted direction; photometric fidelity not confirmed | Light and product volume |
| D4 | MM2 | Floorless natural backdrop with gentle tonal depth, subtle metal reflections, and no fake shadow/support | MM2-v3 published as **review-only**, not approved | Floorless QA + atmospheric visual review |
| D5 | MM1/MM2 | Improve background without erasing directional light/three-dimensionality | MM1 v3 vs v4 review history; inference from comparisons | Independent background + lighting scores |
| R1 | MM1/MM2 | Geometry/visibility and spatial mode take priority over decorative visual changes | `STYLE.md` hard constraints; implementation priority | Hard failures veto visual appeal |

**State note:** MM1-v5 was visually accepted for composition/light only; Mac body precision and prompt fidelity are unverified. MM2-v3 is publicly displayed for review, not final image QA. The resulting C prompts are **experimental drafts**, not retrospective copies of the prompts that produced those images.

**Known limitation:** The archived MM1-v5 / MM2-v3 layouts and the original A fixtures differ. Preserve the original A/B scene IDs for causal evaluation; plan a separate reference-matched comparison after judging whether extra direction improves the images.
