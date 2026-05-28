# SANS FIND EVIL Judge Readiness

## Rule Fit

AgentGuard IR is designed for the FIND EVIL requirement that projects extend Protocol SIFT's autonomous incident-response capability with an agentic execution engine.

Current implementation:

- Uses a Claude Code-compatible Protocol SIFT runner contract.
- Runs on local safe evidence fixtures and documents the SIFT migration path.
- Generates `sift-readiness.json` with SIFT tool availability, Protocol SIFT install guidance, and fixture-local vs SIFT-live mode.
- Produces terminal-style execution logs with timestamps, tool calls, and token usage.
- Demonstrates self-correction.
- Produces an accuracy report with artifact locators.
- Includes a SANS architecture diagram.

## Judging Criteria Map

### Autonomous Execution Quality

Evidence:

- `agentguard-runs/sans-find-evil/agent-execution-log.jsonl`
- self-correction event in the run log
- `scripts/run-sans-sift-ir-demo.mjs`

Why it matters:

The agent corrects an unsupported PowerShell/persistence claim before the final narrative, instead of simply producing a confident but weak conclusion.

### IR Accuracy

Evidence:

- `agentguard-runs/sans-find-evil/accuracy-report.json`
- `agentguard-runs/sans-find-evil/sift-readiness.json`
- confirmed, rejected, and inferred finding statuses
- locators such as `NTUSER.DAT:Software\Microsoft\Windows\CurrentVersion\Run@0x1f4a`

Why it matters:

Judges can trace findings back to specific artifacts and see where the agent refused to overclaim.

### Breadth And Depth Of Analysis

Evidence:

- `sift-disk-persistence-self-correction`
- `sift-auth-log-accuracy-validation`
- `sift-containment-approval`

Why it matters:

The scenarios cover disk persistence, Linux authentication logs, and network/endpoint containment decisions.

### Audit Trail Quality

Evidence:

- `agent-execution-log.jsonl`
- `sift-readiness.json`
- `evidence-dataset.md`
- `investigative-narrative.md`
- SANS-mode `sift-ir-evidence.json` files from the adapter suite

Why it matters:

Each claim can be traced to a tool execution and artifact locator.

### Usability And Documentation

Evidence:

- `README.md`
- `architecture_diagram_sans.md`
- `sans-fixtures/case-001/README.md`
- `npm run sans:check`

Why it matters:

Judges can clone the repository, run one command, and inspect generated evidence.

## Current Limitations

- The default local run uses safe fixture data when SIFT binaries are not installed.
- The SIFT path is represented as a command contract and can be mapped to a real SIFT Workstation.
- Full external Protocol SIFT endpoint credentials are not assumed.

These limitations are intentionally documented so the submission stays honest and testable.

## Verification

```bash
npm install
npm run sans:check
```

Expected generated artifacts:

- `agentguard-runs/sans-find-evil/agent-execution-log.jsonl`
- `agentguard-runs/sans-find-evil/accuracy-report.json`
- `agentguard-runs/sans-find-evil/sift-readiness.json`
- `agentguard-runs/sans-find-evil/evidence-dataset.md`
- `agentguard-runs/sans-find-evil/investigative-narrative.md`
- `agentguard-runs/sans-agent-adapters/agent-adapter-suite-summary.json`
