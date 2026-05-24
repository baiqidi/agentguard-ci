# AgentGuard CI Design

## Competition Target

AgentGuard CI is a UiPath AgentHack Track 3: UiPath Test Cloud entry. The project tests the reliability of code-fixing agents in CI failure workflows. It focuses on enterprise agentic testing: the product under test is not only a web app, but the agent that diagnoses and repairs failures in that app.

## Product Positioning

AgentGuard CI answers a practical enterprise question: "Can we trust a code agent to repair a broken build without hiding failures, touching unrelated files, or skipping human review?"

The demo shows a mixed frontend/backend Issue Tracker with deliberate CI failures. A candidate code-fixing agent attempts repairs. AgentGuard CI runs reliability gates, captures evidence, and emits a report suitable for UiPath Test Cloud orchestration.

## Demo Story

1. A React and Express Issue Tracker fails CI.
2. A code-fixing agent receives the failure log and scenario context.
3. The agent applies a proposed fix.
4. AgentGuard CI reruns targeted tests, scans the diff, checks forbidden edits, and grades the result.
5. UiPath Test Cloud can execute the scenarios as automated test cases and use the generated JUnit/report artifacts for traceability.
6. A human reviewer approves only if the report shows the agent fixed the root cause without unsafe behavior.

## Core Modules

- `apps/api`: Express API for issues, triage, and status updates.
- `apps/web`: React UI for listing issues, creating issues, and viewing triage status.
- `packages/reliability-core`: Scenario definitions, scoring rules, command runner, diff inspection, and report generation.
- `packages/codefix-agent`: A command-driven agent adapter. The default implementation is deterministic for demo repeatability, while the interface supports external coding agents.
- `scenarios`: CI failure scenarios used by AgentGuard and UiPath Test Cloud.
- `uipath`: UiPath-facing documentation, test case matrix, and import/run instructions.

## Reliability Criteria

Each scenario is scored across five gates:

1. CI Recovery: required commands pass after the agent attempt.
2. Root Cause Match: the agent explanation identifies the expected cause.
3. Change Safety: only expected files are changed.
4. Test Integrity: the agent does not delete, skip, or weaken tests.
5. Human Approval Need: high-risk changes are flagged rather than silently accepted.

The output is a JSON report, a Markdown report, and a JUnit XML file so Test Cloud and reviewers can consume the same evidence.

## Track 3 Alignment

The project aligns with UiPath Test Cloud by testing the reliability of agentic software delivery itself. UiPath Test Cloud is positioned as the execution and governance layer that runs scenario test cases, tracks pass/fail evidence, and provides an auditable testing surface for agent behavior.

The submission will show use of Codex as a coding agent in the build process and in the demo narrative, which matches the competition bonus language around UiPath for Coding Agents.

## Completion Definition

The project is submission-ready when:

- The monorepo installs with one command.
- API, web, and reliability-core tests pass.
- At least four CI failure scenarios run through AgentGuard.
- Reports are generated in JSON, Markdown, and JUnit XML.
- UiPath Test Cloud setup docs and test case matrix are written.
- README includes setup, run, demo, and submission instructions.
- A 5-minute demo script and slide outline are prepared.

