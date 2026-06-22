# claude.md — Anthropic Claude / OpenCode integration guide

Purpose
-------
Practical, repo-specific guidance for using Anthropic Claude (and related OpenCode integrations) with this static landing-site repository. Includes quick-start steps, minimal examples (curl + Node), CI tips, prompt templates, and security/cost notes.

Quick start (local)
-------------------
1. Sign up for Anthropic and create an API key for Claude/OpenCode.
2. Store the key locally and in CI as an environment variable named `ANTHROPIC_API_KEY`.
   - Linux/macOS: export ANTHROPIC_API_KEY="/your/key"
   - Windows PowerShell: $env:ANTHROPIC_API_KEY = 'YOUR_KEY'
3. Optionally install the official SDK (if available) or use fetch/curl for lightweight scripts.

Minimal curl example (quick test)
---------------------------------
Replace `MODEL_NAME` with a current Claude model (e.g., `claude-2`, `claude-3`). Check Anthropic docs for exact names and parameters.

curl -s -X POST "https://api.anthropic.com/v1/complete" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -d '{
    "model": "MODEL_NAME",
    "prompt": "Write a short hero headline for the JAECOO J5EV landing page. Return only the headline.",
    "max_tokens_to_sample": 64,
    "temperature": 0.1
  }'

Node.js example (simple, local)
------------------------------
This example uses fetch (Node 18+ has global fetch). Install node-fetch for older Node versions.

const fetch = require('node-fetch'); // optional on Node <18

(async () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.error('Set ANTHROPIC_API_KEY'); process.exit(1); }

  const res = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      model: 'MODEL_NAME',
      prompt: 'Write a short hero headline for the JAECOO J5EV landing page. Return only the headline.',
      max_tokens_to_sample: 64,
      temperature: 0.1
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
})();

CI / GitHub Actions snippet
---------------------------
- Store your Anthropic API key as a repository secret `ANTHROPIC_API_KEY` (do NOT commit keys).
- Example workflow step to run a generator script:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude generator
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node scripts/generate-claude-headline.js

Design & repo integration patterns (how to use in this project)
---------------------------------------------------------------
- Common uses for this static landing repo:
  - Generate marketing copy (hero headlines, meta descriptions, CTAs).
  - Create image alt text and short summaries for accessibility.
  - Produce mock data for Playwright E2E tests.

- Where to place generated artifacts:
  - Prefer a `generated/` or `data/generated/` folder at repo root for ephemeral outputs.
  - If generated content is intended to be committed, review and sanitize before committing.
  - If generated artifacts are runtime-only, add them to `.gitignore`.

- Build pipeline note: `minify.js` contains explicit arrays (`jsFiles`, `cssFiles`) of assets to minify. If automation writes new assets, update `minify.js` accordingly or write into existing files already listed.

Prompting guidance and templates
--------------------------------
- Keep prompts explicit, request structured output when the script will parse responses.

Examples:
- Simple headline:
  "Write a short hero headline (6–12 words) for an EV landing page selling the JAECOO J5EV. Tone: confident and friendly. Return only the headline string."

- JSON-structured output for programmatic use:
  "Return a JSON object with keys: title, subtitle, bullets (array of 3). Title ≤ 60 chars. Output only the JSON."

- Variants for A/B testing:
  "Generate 6 CTA variations (each ≤ 10 words) that encourage booking a test drive. Tone: urgent but polite. Return as a JSON array of strings."

Safety, security, and cost
-------------------------
- Never commit API keys or secrets. Use environment variables or CI secrets.
- Monitor Anthropic usage and set budgets/quotas to avoid surprise charges.
- Treat generated content as untrusted — always human-review for legal, brand, and privacy compliance.
- Sanitize any generated content before embedding into HTML to prevent XSS or injection risks.

Notes for Copilot and local sessions
-----------------------------------
- When asking Copilot to add generator code, reference this file and the repo paths so assistants follow project patterns (`minify.js`, `generated/` placement, Playwright tests).
- Prefer small, testable steps: generate copy for one page, write to `generated/`, run any local checks, and verify before committing.

Related files to check when integrating
--------------------------------------
- `minify.js` — explicit lists for minified assets
- `playwright.config.js` and `tests/` — if generating E2E test data
- `tailwind-input.css` / `tailwind-purged.css` — if generation affects styling classes

Last updated: 2026-06-22
