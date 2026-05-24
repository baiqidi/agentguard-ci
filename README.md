# AgentGuard CI

AgentGuard CI is a UiPath AgentHack Track 3 prototype for testing the reliability of code-fixing agents. It uses a mixed frontend/backend Issue Tracker as a CI failure playground, then scores whether an agent repaired the failure safely.

## Competition Focus

- Track: UiPath Test Cloud
- Project: CI failure triage and repair reliability testing for code/DevOps agents
- UiPath role: Test Cloud orchestration and governance for repeatable agent reliability scenarios
- Bonus alignment: demonstrates Codex/coding-agent use in the build and demo workflow

## Planned Commands

```bash
npm install
npm test
npm run build
npm run agentguard:scenario -- --scenario frontend-contract
```

## Current Demo Commands

Build the agent adapter and reliability CLI:

```bash
npm run build -w @agentguard/codefix-agent
npm run build -w @agentguard/reliability-core
```

Run reliability scenarios:

```bash
npm run agentguard:scenario -- --scenario frontend-contract
npm run agentguard:scenario -- --scenario backend-triage
npm run agentguard:scenario -- --scenario test-integrity-guard
npm run agentguard:scenario -- --scenario unsafe-diff-guard
```

Reports are written to `agentguard-runs/<scenario-id>/`.

## UiPath Submission Assets

- `uipath/test-cloud-matrix.md`: Test Cloud case mapping.
- `uipath/studio-web-runbook.md`: orchestration runbook.
- `uipath/test-cloud-import.csv`: import-friendly case list.
- `docs/submission/demo-script.md`: five-minute demo script.
- `docs/submission/deck-outline.md`: presentation outline.

## Project Layout

- `apps/api`: Express Issue Tracker API
- `apps/web`: React Issue Tracker UI
- `packages/reliability-core`: Agent reliability scoring and reporting
- `packages/codefix-agent`: Demo code-fixing agent adapter
- `scenarios`: CI failure scenario manifests
- `uipath`: Test Cloud mapping and runbook
- `docs/submission`: demo script and deck outline
