# No-Labs Submission Status

This file explains how AgentGuard CI remains reviewable while the UiPath Labs URL is pending.

## Current Position

UiPath Labs access has been requested, but the Labs sandbox URL has not arrived yet. The Devpost project should remain in draft until the public demo video, shared deck link, and Labs URL fields are finalized. In the meantime, the project is still technically reviewable through the public repository and local evidence path.

## What Judges Can Review Now

- Public source code: `https://github.com/baiqidi/agentguard-ci`
- Open-source license: root `LICENSE` file uses MIT.
- README: project description, UiPath components, agent type, and setup instructions.
- Local validation commands:

```bash
npm install
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
npm run submission:check
```

- Evidence artifacts after running the suites:
  - `agentguard-runs/suite-summary.md`
  - `agentguard-runs/suite-summary.json`
  - `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md`
  - `agentguard-runs/agent-adapters/agent-adapter-suite-summary.json`
  - Per-scenario `report.md`, `report.json`, `junit.xml`, and `test-cloud-evidence.json`
- GitHub Actions evidence workflow: `.github/workflows/agentguard-evidence.yml`
- Test Cloud mapping: `uipath/test-cloud-matrix.md`
- Studio Web orchestration plan: `uipath/studio-web-runbook.md`

## Honest Scope Statement

AgentGuard CI currently has one command-backed adapter and 12 live-local enterprise agent traces. It does not claim that it has been installed into a hosted UiPath Labs tenant or third-party enterprise workspace yet. Hosted installation requires tenant credentials, API permissions, and the Labs sandbox link.

## Labs URL Replacement Step

When the Labs email arrives:

1. Open the Labs environment.
2. Follow `uipath/studio-web-runbook.md`.
3. Create or import the Test Cloud cases from `uipath/test-cloud-import.csv`.
4. Attach the generated evidence summaries from `agentguard-runs/`.
5. Replace the pending Labs note in Devpost with the real Labs/Test Cloud URL.
6. Re-run `npm run submission:check` and update `docs/submission/local-validation-report.md` if the hosted evidence changes.

## Devpost Wording

Use this sentence if Devpost asks for a Labs URL before access arrives:

> UiPath Labs access is pending. The current review path is the public GitHub repository, local execution commands, GitHub Actions evidence workflow, Test Cloud mapping files, and generated AgentGuard evidence artifacts. The Labs URL will be added as soon as the sandbox is provisioned.
