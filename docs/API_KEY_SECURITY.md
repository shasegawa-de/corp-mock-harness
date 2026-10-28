# API experiment security — public repository

**Do not store any real `OPENAI_API_KEY` in this repository, its history, issues, PRs, prompts, screenshots, review artifacts, or ChatGPT.**

GitHub repo `shasegawa-de/corp-mock-harness` is public. A public Actions artifact is readable by anyone with repository read access. Therefore the experimental GitHub Actions workflow has **no paid execution path, no API credential reference and no artifact upload**. It runs preflight tests only.

## Approved execution surfaces
1. Use the trusted local interactive pilot script. Enter a temporary key only in its masked terminal prompt; never export or paste the secret into a shell command, CLI argument, environment file or GitHub interface. Local output defaults to `~/.corp-mock-harness-private-reviews` and is rejected if the path resolves into the git checkout. The directory must have restrictive `0700` permissions; PNG and JSON are `0600`.
2. A separately reviewed private execution environment may be built later, but is not part of this public repository's experiment. Do not enable cloud artifact upload by relaxing this rule.
3. Keep the key for a restricted OpenAI API project with spending controls. Rotate it if disclosure is suspected.

Every image request is a single `n=1` call with a fixed prompt file. The key is injected only as the HTTPS Authorization header, never as request prompt, query parameter, CLI argument, output path or metadata. No automatic retry on errors. Forbid redirects to protect Authorization.

## Safe local launch

From a verified Node 22+ checkout of this experimental branch, use these commands without supplying credentials in argv, history or environment:

```bash
node scripts/private-pilot-cli.mjs --dry-run
node scripts/private-pilot-cli.mjs --execute --limit=12
node scripts/private-pilot-cli.mjs --prepare-blind
node scripts/review-summary-cli.mjs
```

Only `--execute` requests the temporary API key, using a masked terminal prompt. No key is saved to disk. The older single-arm CLI now intentionally refuses paid execution; it is for free prompt preflight only.

## Testable safety invariants

- No paid work in GitHub Actions at all; no secret interpolation or result artifact uploads.
- No secret values in logs or result JSON.
- No output files under git-controlled paths.
- No Authorization on redirected requests.
- Fixed cost-per-execution cardinality: one image request, `n=1`.
- API model's internal prompt is not verifiable despite the submitted request SHA match.

## Resumable private pilot (no key stored)

Use Node 22+ from a trusted Mac checkout of the experimental branch:

    node scripts/private-pilot-cli.mjs --dry-run
    node scripts/private-pilot-cli.mjs --execute --limit=12
    node scripts/private-pilot-cli.mjs --prepare-blind

The execute command requests a temporary project API key using a masked terminal prompt. No key is accepted from argv, the environment, Git, logs or on-disk files. The older single-arm CLI is dry-run only. The private pilot verifies existing prompt hashes and PNG/JSON image hashes and skips already completed trial pairs. It writes an owner-only .pending marker before each API request and refuses to rerun that trial automatically following a crash or ambiguous failure. Each run makes at most 12 one-image calls, with no retries. The blind-review command requires all 12 verified images and places randomly numbered copies and an empty scores.csv in the owner-only blind folder, with arm mapping stored separately in mapping-private.json. Review images are never uploaded to the public repository.

**Note:** This chat cannot inject a project API key into a user's Mac. The actual paid requests still require the owner to run the command interactively on a trusted machine. The model's private effective prompt remains uninspectable even though the exact outgoing API JSON is verified.
