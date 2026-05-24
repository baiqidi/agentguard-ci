# AgentGuard CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a submission-ready UiPath AgentHack Track 3 prototype that tests code-fixing agent reliability in CI failure workflows.

**Architecture:** A TypeScript npm workspace contains a sample Issue Tracker, a deterministic code-fixing agent adapter, and an AgentGuard reliability harness. The harness runs scenarios, checks test recovery and diff safety, and emits JSON, Markdown, and JUnit outputs that can be orchestrated by UiPath Test Cloud.

**Tech Stack:** Node.js, TypeScript, npm workspaces, Vitest, Express, React, Vite, JUnit XML output, Markdown documentation.

---

## File Structure

- `package.json`: root workspace scripts.
- `tsconfig.base.json`: shared TypeScript settings.
- `apps/api`: Express issue tracker API with tests.
- `apps/web`: React issue tracker UI with tests.
- `packages/reliability-core`: scenario engine, scoring, reports, and tests.
- `packages/codefix-agent`: deterministic demo code-fixing agent and tests.
- `scenarios`: scenario manifests and failure logs.
- `uipath`: Test Cloud matrix, setup notes, and runbook.
- `docs/submission`: demo script and deck outline.

## Task 1: Workspace Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `vitest.workspace.ts`
- Create: `README.md`

- [ ] Write root workspace files with scripts for install, test, build, and scenario runs.
- [ ] Run `npm install`.
- [ ] Run `npm test` and expect no test files or an initial controlled failure before package tests are added.
- [ ] Commit workspace foundation.

## Task 2: Reliability Core TDD

**Files:**
- Create: `packages/reliability-core/package.json`
- Create: `packages/reliability-core/src/index.ts`
- Create: `packages/reliability-core/src/types.ts`
- Create: `packages/reliability-core/src/scenario.ts`
- Create: `packages/reliability-core/src/scoring.ts`
- Create: `packages/reliability-core/src/reports.ts`
- Create: `packages/reliability-core/src/__tests__/scoring.test.ts`
- Create: `packages/reliability-core/src/__tests__/reports.test.ts`

- [ ] Write failing tests for score calculation when CI passes, unsafe files change, and test files are weakened.
- [ ] Run `npm test -w @agentguard/reliability-core` and verify the tests fail for missing implementation.
- [ ] Implement scenario types and scoring.
- [ ] Run the package tests and verify they pass.
- [ ] Add report rendering tests for JSON, Markdown, and JUnit XML.
- [ ] Implement report rendering.
- [ ] Run package tests and commit reliability core.

## Task 3: Sample API TDD

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/issues.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/__tests__/issues.test.ts`

- [ ] Write failing tests for issue creation, priority triage, and status transitions.
- [ ] Run `npm test -w @agentguard/api` and verify tests fail for missing implementation.
- [ ] Implement Express app and pure issue service.
- [ ] Run API tests and commit.

## Task 4: Sample Web TDD

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/index.html`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/issueModel.ts`
- Create: `apps/web/src/__tests__/issueModel.test.ts`

- [ ] Write failing tests for issue label formatting and severity display.
- [ ] Run `npm test -w @agentguard/web` and verify tests fail for missing implementation.
- [ ] Implement React UI and issue model helpers.
- [ ] Run web tests and commit.

## Task 5: Code-Fix Agent Adapter TDD

**Files:**
- Create: `packages/codefix-agent/package.json`
- Create: `packages/codefix-agent/src/index.ts`
- Create: `packages/codefix-agent/src/scriptedAgent.ts`
- Create: `packages/codefix-agent/src/__tests__/scriptedAgent.test.ts`

- [ ] Write failing tests showing the adapter maps known failure signatures to safe patches and refuses unknown failures.
- [ ] Run `npm test -w @agentguard/codefix-agent` and verify tests fail for missing implementation.
- [ ] Implement deterministic scripted agent for repeatable demo runs.
- [ ] Run package tests and commit.

## Task 6: Scenario Runner

**Files:**
- Create: `packages/reliability-core/src/runner.ts`
- Create: `packages/reliability-core/src/cli.ts`
- Create: `packages/reliability-core/src/__tests__/runner.test.ts`
- Create: `scenarios/frontend-contract.json`
- Create: `scenarios/backend-triage.json`
- Create: `scenarios/test-integrity-guard.json`
- Create: `scenarios/unsafe-diff-guard.json`

- [ ] Write failing tests for loading scenarios and producing a report artifact.
- [ ] Implement runner and CLI.
- [ ] Add root script `npm run agentguard:scenario -- --scenario frontend-contract`.
- [ ] Run runner tests and one scenario command.
- [ ] Commit scenario runner.

## Task 7: UiPath and Submission Assets

**Files:**
- Create: `uipath/test-cloud-matrix.md`
- Create: `uipath/studio-web-runbook.md`
- Create: `uipath/test-cloud-import.csv`
- Create: `docs/submission/demo-script.md`
- Create: `docs/submission/deck-outline.md`

- [ ] Document four UiPath Test Cloud test cases mapped to AgentGuard scenarios.
- [ ] Write Studio Web runbook showing how to execute CLI/API test steps and collect reports.
- [ ] Write a 5-minute demo script and deck outline.
- [ ] Commit submission assets.

## Task 8: Verification and Packaging

**Files:**
- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`

- [ ] Run `npm install`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run all scenario commands.
- [ ] Update README with exact passing commands and generated report paths.
- [ ] Commit final packaging changes.

## Self-Review

- Spec coverage: tasks cover workspace setup, app, agent adapter, reliability harness, UiPath mapping, and submission docs.
- Placeholder scan: no TBD/TODO/implement later language is used as a deliverable.
- Scope check: the project is focused on one Track 3 prototype and does not include live Devpost submission or UiPath account setup because those require user-owned accounts.

