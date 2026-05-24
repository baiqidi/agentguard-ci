# AgentGuard CI

AgentGuard CI is a UiPath AgentHack Track 3 prototype for testing the reliability of code-fixing agents. It uses a mixed frontend/backend Issue Tracker as a CI failure playground, then scores whether an agent repaired the failure safely.

## Competition Focus

- Track: UiPath Test Cloud
- Project: CI failure triage and repair reliability testing for code/DevOps agents
- UiPath role: Test Cloud orchestration and governance for repeatable agent reliability scenarios
- Bonus alignment: demonstrates Codex/coding-agent use in the build and demo workflow

## Project Description

AgentGuard CI addresses a reliability gap in AI-assisted software delivery: a coding agent can make CI pass while still producing a risky fix. The prototype treats AI agent behavior as a test target. It replays 12 controlled CI failure scenarios, lets a code-fixing agent repair them, then scores the repair for root cause quality, test preservation, diff safety, CI health, and human approval readiness.

The result is a repeatable evidence loop for teams that want to adopt code-fixing agents without trusting a one-off demo.

The 12-scenario benchmark covers safe localized repairs, test manipulation, unsafe diffs, hallucinated root causes, dependency churn, secret-handling risk, release configuration drift, performance regressions, data migration risk, and concurrency races.

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

Run the Judge Demo Console locally:

```bash
npm run dev
```

Run reliability scenarios:

```bash
npm run agentguard:suite
```

Or run individual scenarios:

```bash
npm run agentguard:scenario -- --scenario frontend-contract
npm run agentguard:scenario -- --scenario backend-triage
npm run agentguard:scenario -- --scenario test-integrity-guard
npm run agentguard:scenario -- --scenario unsafe-diff-guard
npm run agentguard:scenario -- --scenario hallucinated-root-cause
npm run agentguard:scenario -- --scenario flaky-rerun-abuse
npm run agentguard:scenario -- --scenario dependency-upgrade-risk
npm run agentguard:scenario -- --scenario secret-handling-guard
npm run agentguard:scenario -- --scenario config-env-drift
npm run agentguard:scenario -- --scenario performance-regression
npm run agentguard:scenario -- --scenario data-migration-risk
npm run agentguard:scenario -- --scenario concurrency-race
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
npm run agentguard:suite
```

Reports are written to `agentguard-runs/<scenario-id>/`.
Each run includes:

- `report.json`: machine-readable AgentGuard score.
- `report.md`: human reviewer summary.
- `junit.xml`: CI/Test Cloud-compatible pass/fail evidence.
- `test-cloud-evidence.json`: UiPath Test Cloud evidence packet with gate status, recommended action, and attachment names.
- `suite-summary.json` and `suite-summary.md`: one-command overview for judges and CI artifacts.

## Continuous Evidence

The public repository includes a GitHub Actions workflow, `.github/workflows/agentguard-evidence.yml`, that runs on pushes, pull requests, and manual dispatch. It installs dependencies, runs all tests, builds the workspaces, executes `npm run agentguard:suite`, and uploads `agentguard-runs/` as the `agentguard-evidence` artifact.

This makes the submission reviewable from GitHub even before UiPath Labs access arrives: judges can inspect the same JSON, Markdown, JUnit, and Test Cloud evidence packets produced by the local demo.

## Research Backing

The design rationale is summarized in `docs/research/agentguard-research-brief.md`. It translates UiPath Test Cloud/Test Manager documentation and recent agent-evaluation research into AgentGuard's product principles: realistic repository-level scenarios, interactive execution evidence, traceable artifacts, structured feedback, and human review for high-risk repairs.

## UiPath Submission Assets

- `uipath/test-cloud-matrix.md`: Test Cloud case mapping.
- `uipath/studio-web-runbook.md`: orchestration runbook.
- `uipath/test-cloud-import.csv`: import-friendly case list.
- `docs/submission/demo-script.md`: five-minute demo script.
- `docs/submission/deck-outline.md`: presentation outline.

## Project Layout

- `apps/api`: Express Issue Tracker API
- `apps/web`: React Judge Demo Console and Issue Tracker target UI
- `packages/reliability-core`: Agent reliability scoring and reporting
- `packages/codefix-agent`: Demo code-fixing agent adapter
- `scenarios`: CI failure scenario manifests
- `uipath`: Test Cloud mapping and runbook
- `docs/submission`: demo script and deck outline
