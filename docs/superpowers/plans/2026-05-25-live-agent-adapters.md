# Live Agent Adapters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote browser, data, support, workflow, and document agents from blueprints into real executable AgentGuard adapter scenarios with evidence.

**Architecture:** Add a focused `@agentguard/agent-adapters` workspace containing deterministic local adapters and fixtures for five non-code agent categories. Extend `reliability-core` with an adapter scenario CLI that scores agent traces through the same universal gates and emits JSON/Markdown/JUnit/Test Cloud evidence into `agentguard-runs/agent-adapters`.

**Tech Stack:** TypeScript, Vitest, Node.js, existing AgentGuard reporting model.

---

### Task 1: Adapter Trace Model

**Files:**
- Create: `packages/agent-adapters/package.json`
- Create: `packages/agent-adapters/tsconfig.json`
- Create: `packages/agent-adapters/src/types.ts`
- Create: `packages/agent-adapters/src/scenarios.ts`
- Create: `packages/agent-adapters/src/scoring.ts`
- Create: `packages/agent-adapters/src/__tests__/scoring.test.ts`

- [x] **Step 1: Write failing tests**

Tests require five scenario ids: `browser-payment-approval`, `data-pii-query-leak`, `support-refund-escalation`, `workflow-production-deploy`, and `document-citation-gap`. Expected result: each scenario is blocked or review-routed with preserved evidence and the correct failed gate.

- [x] **Step 2: Run failing tests**

Run: `npm test -w @agentguard/agent-adapters`

Expected: workspace missing or tests fail.

- [x] **Step 3: Implement adapter traces and scoring**

Implement universal gates: goal fidelity, tool boundary, evidence integrity, state safety, human approval.

- [x] **Step 4: Run tests green**

Run: `npm test -w @agentguard/agent-adapters`

Expected: PASS.

### Task 2: Real Scenario CLI and Reports

**Files:**
- Create: `packages/agent-adapters/src/cli.ts`
- Create: `packages/agent-adapters/src/suite-cli.ts`
- Modify: `packages/agent-adapters/package.json`
- Modify: root `package.json`

- [x] **Step 1: Write CLI tests or executable assertions**

Run individual and suite commands and assert reports exist.

- [x] **Step 2: Implement report writers**

Write `report.json`, `report.md`, `junit.xml`, and `test-cloud-evidence.json` per adapter scenario.

- [x] **Step 3: Add scripts**

Add root scripts:

```json
"agentguard:agent-scenario": "node packages/agent-adapters/dist/cli.js",
"agentguard:agent-suite": "node packages/agent-adapters/dist/suite-cli.js"
```

### Task 3: Product Surface and Docs

**Files:**
- Modify: `apps/web/src/testCloudEvidence.ts`
- Modify: `apps/web/src/__tests__/testCloudEvidence.test.ts`
- Modify: `README.md`
- Modify: `uipath/test-cloud-matrix.md`
- Create: `docs/submission/live-agent-adapter-validation.md`

- [x] **Step 1: Update dashboard data**

Mark five adapter profiles as live-local validated, while keeping external cloud installation claims explicit and truthful.

- [x] **Step 2: Document external-agent validation**

Document that local deterministic adapters mirror installable patterns used by LangChain/CrewAI/AutoGen/Playwright-style agents. If third-party credentials are absent, do not claim hosted installation success.

### Task 4: Final Verification

- [x] Run:

```powershell
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
git diff --check
```

- [ ] Commit, merge to `main`, push, and wait for GitHub Actions.
