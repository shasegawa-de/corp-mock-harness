# API experiment security — public repository

**Do not store any real `OPENAI_API_KEY` in this repository, its history, issues, PRs, prompts, screenshots, review artifacts, or ChatGPT.**

GitHub repo `shasegawa-de/corp-mock-harness` is public. A public Actions artifact is readable by anyone with repository read access. Therefore the experimental workflow intentionally blocks `execute=true` on public repos, even if a GitHub Actions secret is configured.

## Approved execution surfaces
1. Use a trusted local checkout and environment variable supplied interactively to the running process; avoid terminal-history commands containing the literal key. Local output defaults to `~/.corp-mock-harness-private-reviews` and is rejected if the path resolves into the git checkout. The directory must have restrictive `0700` permissions; PNG and JSON are `0600`.
2. Alternatively, run in a separately reviewed **private** repository/Actions environment with a repository or environment Secret and protected approvals. Do not simply merge the public workflow and enable artifact upload.
3. Keep the key for a restricted OpenAI API project with spending controls. Rotate it if disclosure is suspected.

Every image request is a single `n=1` call with a fixed prompt file. The key is injected only as the HTTPS Authorization header, never as request prompt, query parameter, CLI argument, output path or metadata. No automatic retry on errors. Forbid redirects to protect Authorization.

## Safe local launch example

From the repository root with a verified Node 22+ environment:

```bash
# Use an interactive hidden-input shell prompt (the API key will not appear in shell history).
read -rsp 'Temporary OpenAI API key: ' OPENAI_API_KEY; echo
export OPENAI_API_KEY

node --test tests/prompt-comparison.test.mjs
node scripts/prompt-comparison-cli.mjs --arm=mm1-a --trial=1 --dry-run
# Billable: explicitly opt in to one image request:
node scripts/prompt-comparison-cli.mjs --arm=mm1-a --trial=1 --execute

unset OPENAI_API_KEY
```

`read -rsp` is shown for Bash. On macOS zsh use the corresponding secure interactive read syntax or switch temporarily to Bash. Avoid `set -x`, screenshots, shell transcript capture, `env` dumps and `echo $OPENAI_API_KEY`.

If you need more runs, select the other arm/trial identifiers individually. The local runner refuses overwriting existing trial outputs before an API request. Review images are never auto-approved or uploaded to the public repo.

## Testable safety invariants

- No paid work on PR events, public repos or default dry-run.
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

The execute command requests a temporary project API key using a masked terminal prompt. No key is accepted from argv, the environment, Git, logs or on-disk files. This differs from the older single-arm runner, which uses an environment variable. The private pilot verifies existing prompt hashes and PNG/JSON image hashes and skips already completed trial pairs. It writes an owner-only .pending marker before each API request and refuses to rerun that trial automatically following a crash or ambiguous failure. Each run makes at most 12 one-image calls, with no retries. The blind-review command requires all 12 verified images and places randomly numbered copies and an empty scores.csv in the owner-only blind folder, with arm mapping stored separately in mapping-private.json. Review images are never uploaded to the public repository.

**Note:** This chat cannot inject a project API key into a user's Mac. The actual paid requests still require the owner to run the command interactively on a trusted machine. The model's private effective prompt remains uninspectable even though the exact outgoing API JSON is verified.
