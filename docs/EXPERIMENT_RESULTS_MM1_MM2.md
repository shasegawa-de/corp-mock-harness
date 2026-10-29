# MM1 / MM2 A–B–C image pilot — 2026-10-29

**Status:** First image pilot completed and assessed. No prompt variant approved or published.

## Evidence and safeguards
- Twelve independent images: six conditions (MM1/2 × A/B/C), two trials per condition.
- Every image SHA-256 matched its private local blind-ID mapping; all twelve arm/trial pairs were unique.
- Pre-unblind four-axis scoring was retained and its recorded fingerprint verified against the private chat-side checkpoint.
- **This public repository does not include source PNGs, the private blind-ID mapping, the private scoring CSV, or any API credentials.** Their records remain with the owner. This report intentionally contains only group aggregates.
- This chat-side checkpoint is **not** proof that the owner's Mac `visual-seal.json` was created; local post-test reconciliation has not been performed.

## Blind visual quality (0 fail, 1 partial, 2 pass; n=2 per arm)

| Arm | Device geometry | Composition | Architecture | Lighting | Hard failures |
| --- | ---: | ---: | ---: | ---: | ---: |
| MM1-A | 2.0 | 1.0 | 1.0 | 1.0 | 0 |
| MM1-B | 2.0 | 1.0 | 1.0 | 1.0 | 0 |
| MM1-C | 2.0 | 1.5 | 1.0 | 1.0 | 0 |
| MM2-A | 2.0 | 2.0 | 0.0 | 0.5 | 0 |
| MM2-B | 2.0 | 2.0 | 0.0 | 0.5 | 0 |
| MM2-C | 2.0 | 2.0 | 0.0 | 1.0 | 0 |

All twelve pictures satisfy the assessed basic two-device and spatial-mode constraints. No result certifies exact 312.6 × 221.2 mm hardware geometry or internal model prompt fidelity.

## Comparisons and interpretation

- **A→B:** Identical observed group scores in both scenes. Organizing unchanged language under headings did not produce a measurable gain in this pilot.
- **B→C, MM1:** +0.5 average composition points; only one of C's two trials received the higher composition score. Left-angled/right-frontal composition remains strongly repeated. Not enough evidence for stable superiority.
- **B→C, MM2:** Composition unchanged at 2/2 (ceiling effect). Light rose from 0.5 to 1.0, but visual light quality is still inadequate and is deferred for a separate art-direction loop.
- **Architecture/background:** MM2's prominent vertical splitting persists throughout A/B/C, including the detailed C instructions; MM1 background remains modest rather than editorial-quality.
- **Second-pass prompt fidelity:** A/B generally follow their narrower contracts. C follows subject and layout but fails some more specific photographic-art-direction expectations. Fidelity marks are interpretive and not directly comparable across variants with differing numbers of constraints.

## Decision

1. Preserve A as the canonical, production-safe baseline.
2. Do **not** adopt B on structural formatting alone.
3. Keep C as an **unapproved experiment**, not a production prompt. A 400-word prompt has not been demonstrated superior to the 140–160-word fixtures.
4. Next test should isolate **MM1 composition/camera variation**, while maintaining two open identical Macs, full screens/keyboards/trackpads, grounded contact, 16:9 and product geometry.
5. **Defer background and lighting redesign** until after the composition decision, per the owner's explicit preference. Do not conflate these variables.
6. Before any adoption, verify reproducibility with more than two trials and complete the catalog integration tests.

The figures are descriptive, not statistically significant, and no additional paid image requests were made while preparing this report.
