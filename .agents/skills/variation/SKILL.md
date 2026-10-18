---
name: variation
description: Plan genuinely different product-mock candidates across composition, environment and lighting using documented generation history rather than code-based randomization.
---
# Variation skill

1. Read `history/README.md` and prior logged accepted/rejected outputs if available. If no history exists, state that rather than assuming a known previous result.
2. Select candidate combinations from `configs/presets.json` **before generating**. Record environment ID, composition ID, lighting ID, camera placement, and generation engine per candidate.
3. For each candidate, change at least **two** major dimensions relative to recent candidates: spatial structure, camera/pose/placement, dominant material, light direction/contrast.
4. Never repeat an identical `(environment, composition, lighting)` signature in one batch. A new ID is not proof of a visually different outcome: inspect actual images for similarity.
5. Deliver one render per candidate, not a single multi-panel image. For four candidates, make four separate requests/outputs where the tool permits.
6. Review failures and create a revised new candidate rather than silently relabeling a rejected image. Save prompt, identifiers, subjective reason and preview reference where accessible.
7. **This is a manual/agent-mediated workflow, not an automated deduplication engine.** Do not claim image similarity is algorithmically verified.
