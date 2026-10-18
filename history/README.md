# Review and variation history

Keep history for preventing near-repetitions and learning which directions were accepted. **No generated image is automatically persisted to GitHub by this harness**; the operator/agent must explicitly record it when access is available.

Suggested per-batch structure (manual Markdown entries or JSON accepted):

```text
history/
  YYYY-MM-DD-batch-id.md
```

Each entry should state:
- Date / provider / model if known / device / approximate or verified output dimensions.
- Each candidate's `environment_id`, `composition_id`, `lighting_id`, camera placement and material.
- Per-image prompt or saved prompt link and approved output link (if available).
- PASS / REJECT / UNVERIFIED against `templates/review.md`, with specific rejection reason.
- Next-generation change. Distinguish decisions from hypotheses and unknowns.

Before another batch, compare the latest accepted and rejected outputs. Vary at least two major design dimensions and avoid repeated signatures. **Metadata alone does not prove perceptual uniqueness**. Do not commit licensed/copyrighted references or confidential company assets unless authorized.
