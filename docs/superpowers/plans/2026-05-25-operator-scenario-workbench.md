# Operator Scenario Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AgentGuard easier to use and more convincing by adding an operator quick-start runbook, live scenario prioritization, and a truthful expansion backlog for future non-code agents.

**Architecture:** Extend the existing `testCloudEvidence` view model with operator workflow steps, scenario analysis items, and expansion candidates. Render these as compact Apple-style dashboard panels before the dense evidence matrix so a new user knows what to run, what to inspect, and which risky scenarios matter most.

**Tech Stack:** TypeScript, React, Vitest, Vite, CSS, Markdown docs.

---

### Task 1: Operator and Scenario Analysis View Model

**Files:**
- Modify: `apps/web/src/testCloudEvidence.ts`
- Modify: `apps/web/src/__tests__/testCloudEvidence.test.ts`

- [x] **Step 1: Write failing tests**

Add tests for:

```ts
expect(operatorWorkflowSteps.map((step) => step.id)).toEqual([
  "install",
  "run-suite",
  "review-evidence",
  "import-test-cloud"
]);
expect(buildScenarioAnalysis(judgeScenarioEvidence, scenarioRiskProfiles, agentRiskVectors)[0]).toMatchObject({
  scenarioId: "auth-bypass-shortcut",
  owner: "Security Review",
  riskVectorId: "excessive-agency",
  riskPoints: 8
});
expect(scenarioExpansionCandidates).toHaveLength(12);
expect(summarizeScenarioWorkbench(buildScenarioAnalysis(...), scenarioExpansionCandidates)).toMatchObject({
  liveScenarioCount: 24,
  criticalLiveScenarios: 5,
  expansionCandidateCount: 12,
  criticalExpansionCandidates: 6,
  firstRunCommand: "npm run agentguard:suite"
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: FAIL because the exports do not exist.

- [x] **Step 3: Implement minimal model**

Add operator workflow, scenario analysis, expansion candidates, and summary functions. Sort live scenario analysis by severity, risk points, vector pressure, then original scenario order.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: PASS.

### Task 2: Dashboard and Localization

**Files:**
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/App.css`
- Modify: `apps/web/src/i18n.ts`
- Modify: `apps/web/src/__tests__/i18n.test.ts`

- [x] **Step 1: Write failing i18n tests**

Add tests for `runbook.kicker`, `workbench.kicker`, and Chinese formatting for an expansion candidate.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- i18n`

Expected: FAIL because messages and formatters do not exist.

- [x] **Step 3: Implement UI**

Add `OperatorRunbookPanel` after the release decision panel. Add `ScenarioWorkbenchPanel` after the risk radar. Both panels must be responsive, compact, and avoid text overflow on mobile.

- [x] **Step 4: Run affected verification**

Run:

```powershell
npm test -w @agentguard/web -- i18n testCloudEvidence
npm run build -w @agentguard/web
```

Expected: PASS.

### Task 3: Docs, Visual QA, and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/deck-outline.md`
- Modify: `uipath/test-cloud-matrix.md`

- [x] **Step 1: Update docs**

Document the quick-start workflow, live scenario priority queue, and 12 scenario expansion candidates.

- [x] **Step 2: Browser QA**

Capture desktop and mobile screenshots with Playwright CLI and inspect that the runbook/workbench panels are visible without layout breakage.

- [x] **Step 3: Full verification**

Run:

```powershell
npm test
npm run build
npm run agentguard:suite
git diff --check
```

Expected: tests/build/suite exit 0; `git diff --check` may only report Windows line-ending warnings.

- [x] **Step 4: Commit, merge to main, push, wait for CI**

Commit the branch, fast-forward `main`, push, and wait for `AgentGuard Evidence` to complete successfully.
