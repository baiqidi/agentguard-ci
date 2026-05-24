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

## Project Layout

- `apps/api`: Express Issue Tracker API
- `apps/web`: React Issue Tracker UI
- `packages/reliability-core`: Agent reliability scoring and reporting
- `packages/codefix-agent`: Demo code-fixing agent adapter
- `scenarios`: CI failure scenario manifests
- `uipath`: Test Cloud mapping and runbook
- `docs/submission`: demo script and deck outline

