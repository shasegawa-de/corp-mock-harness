# MM1/MM2 prompt-structure and direction experiment

**Experimental only.** No change to the published 32-card catalog, adopted images or canonical four-file harness.

## Arms

| Group | A: original prompt, unchanged | B: seven headings | C: seven headings + art direction |
| --- | --- | --- | --- |
| MM1 | [Original](../prompts/macbookpro14-macbookpro14/side-by-side.txt) | [MM1-B](../prompts/experiments/mm1-b-structured.txt) | [MM1-C](../prompts/experiments/mm1-c-directed.txt) |
| MM2 | [Original](../prompts/macbookpro14-macbookpro14/suspended-depth.txt) | [MM2-B](../prompts/experiments/mm2-b-structured.txt) | [MM2-C](../prompts/experiments/mm2-c-directed.txt) |

B preserves every word from A, including lexical counts and technical conditions, but changes sectional organization and order. C changes only scene-specific art-direction details while preserving device count, layout, camera and spatial mode. All six prompts are 80–170 words, and the four original harness files are still read and validated for every request.

**Critical caveat:** the original MM1 and MM2 reference prompts do **not** reproduce the exact positions in the later MM1-v5 / MM2-v3 reference images. This is a controlled test of the prompt texts and direction clauses, not a pixel-matched recreation of those images.

## Reproducible evaluation

Use one model (`gpt-image-2.5-flare`), fixed `1536x864`, `quality=high`, and `n=1`, same exact image API. Run each arm independently at least twice (12 images total), shuffle and blindly evaluate images before revealing variants.

Rate each axis as 0=fail, 1=partial, 2=pass: device count and open state; fully visible white screens, keyboards and trackpads; plausible Mac dimensions; requested depth/placement and camera; physically correct ground contact for MM1 versus fully floorless MM2; nonrepeating architectural background; natural lighting, dimensionality and metal reflections. Hard failures must be reported separately; averaging does not override an invalid device count or spatial mode. Final hardware accuracy and the model's hidden effective prompt cannot be certified visually.

## Execution

This is an **isolated experimental workflow**, not the existing image workflow. GitHub Actions workflow **MM1/MM2 A-B-C prompt comparison** supports `execute=false` (six local checks; zero image-API calls), or `execute=true` (exactly one paid image per manual run, **main branch only**). Use repository secret `OPENAI_API_KEY` for paid execution. Outputs are unapproved PNG + metadata in Actions Artifacts, kept 14 days; never automatically added to the catalog.

```sh
node --test tests/prompt-comparison.test.mjs
for arm in mm1-a mm1-b mm1-c mm2-a mm2-b mm2-c; do
  node scripts/prompt-comparison-cli.mjs --arm="$arm" --dry-run
done
```

The API request uses the unchanged fixture bytes and records `prompt_sha256` and `prompt_transport=EXACT_REQUEST_SUBMITTED`. Its internal effective prompt remains `UNVERIFIED`. Existing [transport rules](GPT_IMAGE_TRANSPORT.md) and [art decisions](DESIGN_DECISIONS.md) remain authoritative.
