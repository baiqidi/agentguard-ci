# AgentGuard CI

AgentGuard CI is a UiPath AgentHack Track 3 prototype for testing the reliability of code-fixing agents. It uses a mixed frontend/backend Issue Tracker as a CI failure playground, then scores whether an agent repaired the failure safely.

## Competition Focus

- Track: UiPath Test Cloud
- Project: CI failure triage and repair reliability testing for code/DevOps agents
- UiPath role: Test Cloud orchestration and governance for repeatable agent reliability scenarios
- Bonus alignment: demonstrates Codex/coding-agent use in the build and demo workflow

## Project Description

AgentGuard CI addresses a reliability gap in AI-assisted software delivery: a coding agent can make CI pass while still producing a risky fix. The prototype treats AI agent behavior as a test target. It replays controlled CI failure scenarios, lets a code-fixing agent repair them, then scores the repair for root cause quality, test preservation, diff safety, CI health, and human approval readiness.

The result is a repeatable evidence loop for teams that want to adopt code-fixing agents without trusting a one-off demo.

## UiPath Components

- UiPath Test Cloud: target governance layer for importing and running AgentGuard scenarios as test cases.
- UiPath Test Manager-style evidence model: AgentGuard emits JUnit XML, Markdown, and JSON reports that can be attached to scenario executions.
- UiPath Studio Web / Orchestrator runbook: `uipath/studio-web-runbook.md` describes how the scenario runner can be orchestrated as a governed workflow.
- UiPath Labs environment: expected hosted environment for the final hackathon submission once access is provisioned.

## Agent Type

This solution demonstrates a coded-agent reliability workflow. The prototype includes a scripted TypeScript code-fixing agent adapter in `packages/codefix-agent`, and the Test Cloud layer governs the behavior of that agent through repeatable reliability scenarios. It does not depend on low-code agents in the current prototype, but the same scenario runner can be extended to low-code or hybrid agents.

## Setup Instructions

Prerequisites:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Build all packages:

```bash
npm run build
```

Run the sample app locally:

```bash
npm run dev
```

Run reliability scenarios:

```bash
npm run agentguard:scenario -- --scenario frontend-contract
npm run agentguard:scenario -- --scenario backend-triage
npm run agentguard:scenario -- --scenario test-integrity-guard
npm run agentguard:scenario -- --scenario unsafe-diff-guard
```

Scenario reports are written to `agentguard-runs/<scenario-id>/`.

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
Each run includes:

- `report.json`: machine-readable AgentGuard score.
- `report.md`: human reviewer summary.
- `junit.xml`: CI/Test Cloud-compatible pass/fail evidence.
- `test-cloud-evidence.json`: UiPath Test Cloud evidence packet with gate status, recommended action, and attachment names.

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
