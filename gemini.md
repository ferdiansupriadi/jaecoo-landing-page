# gemini.md — Google Gemini (Vertex AI) integration guide

Purpose
-------
Practical, repo-specific guidance for using Google Gemini (Vertex AI / Generative AI) with this static landing-site repo. Includes quick-start steps, minimal examples (curl + Node), CI tips, prompt templates, and security/cost notes.

Quick start (local)
-------------------
1. Create a Google Cloud project and enable Vertex AI / Generative AI APIs.
2. Create a service account with appropriate roles (Vertex AI access + Service Account User). Create and download a JSON key.
3. Set credentials locally:
   - macOS / Linux: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
   - Windows PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\key.json'
4. Install tooling for quick tests (optional):
   - gcloud SDK (for obtaining access tokens interactively)
   - Node: npm install @google-cloud/aiplatform --save (recommended for production scripts)

Minimal curl example (quick test)
---------------------------------
# get an access token (requires gcloud SDK)
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

curl -s -X POST "https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT/locations/LOCATION/models/MODEL_ID:predict" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{"content": "Write a short hero headline for the JAECOO J5EV landing page."}],
    "parameters": {"temperature": 0.1}
  }'

Replace PROJECT, LOCATION, and MODEL_ID with your values (e.g., text-bison or a Gemini model name).

Node.js example (simple, local)
------------------------------
This example uses the local gcloud access token approach (fast for ad-hoc scripts):

const { execSync } = require('child_process');
const fetch = require('node-fetch'); // or global fetch in newer Node versions

(async () => {
  const token = execSync('gcloud auth application-default print-access-token').toString().trim();
  const project = 'YOUR_PROJECT';
  const location = 'us-central1';
  const model = 'MODEL_ID';
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/models/${model}:predict`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ instances: [{ content: 'Write a 12-word hero headline for JAECOO J5EV.' }], parameters: { temperature: 0.1 } })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
})();

CI / GitHub Actions snippet
---------------------------
- Store your service account JSON as a repository secret (e.g., `GCP_SA_KEY`). Do NOT store raw keys in repo files.
- Use the official Google auth action to authenticate and run a generator script:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Authenticate to GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - name: Run generator script
        run: node scripts/generate-content.js

Design & repo integration patterns (how to use in this project)
---------------------------------------------------------------
- Common uses for this static landing repo:
  - Generate hero headlines, meta descriptions, and short marketing copy variations.
  - Produce image alt text for accessibility.
  - Generate Playwright test data (form inputs, example emails) for E2E tests.
  - Draft commit message suggestions or content updates (human-reviewed).

- Where to place generated artifacts:
  - Consider a dedicated folder `generated/` or `data/generated/` at repo root.
  - Generated HTML snippets or CSS should be reviewed before committing. Add generated files to `.gitignore` if produced at runtime and not intended for the repo.

- Build pipeline note: `minify.js` contains explicit lists of JS/CSS files to minify. If automation writes new assets, update `minify.js` arrays or write generated content into existing files the minifier already lists.

Prompting guidance and templates
--------------------------------
- Keep prompts explicit and include desired format. Prefer structured outputs when consuming programmatically.

Examples:
- Simple hero headline:
  "Write a short hero headline (6–12 words) for an EV landing page selling the JAECOO J5EV. Tone: confident and friendly. Return only the headline string."

- JSON-structured output (for safe parsing):
  "Return JSON with keys: title, subtitle, bullets (array). Title ≤ 60 chars. Output only the JSON object."

- Variants for A/B testing:
  "Generate 6 CTA variations (each ≤ 10 words) that encourage booking a test drive. Tone: urgent but polite. Return as a JSON array of strings."

Safety, security, and cost
-------------------------
- Never commit service account keys or secrets. Use environment variables or CI secrets.
- Monitor Vertex AI usage and set quotas/budgets in GCP to avoid surprise charges.
- Treat generated content as untrusted: always human-review before publishing (legal, privacy, or brand compliance).
- Sanitize or validate any outputs used directly in HTML to avoid injection/XSS risks.

Notes for Copilot and local sessions
-----------------------------------
- When asking Copilot to edit or add generator code, reference this file (gemini.md) and the repo path so the assistant uses correct patterns (minify.js, generated/ placement, and Playwright tests).
- Prefer small, testable steps: generate content for one page, add to `generated/`, run `node minify.js` locally (or update minify lists) and inspect before committing.

Related files to check when integrating
--------------------------------------
- `minify.js` — explicit lists for minified assets
- `tailwind-input.css` / `tailwind-purged.css` — if generating CSS classes for content-area styling
- `.github/workflows/playwright.yml` — CI example (E2E); can be extended to run generation then tests

Last updated: 2026-06-22
