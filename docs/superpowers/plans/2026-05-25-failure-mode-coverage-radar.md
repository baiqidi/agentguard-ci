# Failure Mode Coverage Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a judge-facing risk radar that proves AgentGuard covers general AI-agent failure modes, not only code-repair cases.

**Architecture:** Extend the existing `testCloudEvidence` view model with a small `AgentRiskVector` taxonomy and a summarizer. Reuse the React dashboard's existing panel/card pattern and i18n helpers so the new section appears between the universal gates and risk-assurance panels.

**Tech Stack:** TypeScript, React, Vitest, Vite, CSS.

---

### Task 1: Risk Radar View Model

**Files:**
- Modify: `apps/web/src/testCloudEvidence.ts`
- Modify: `apps/web/src/__tests__/testCloudEvidence.test.ts`

- [x] **Step 1: Write the failing test**

Add a test that imports `agentRiskVectors` and `summarizeAgentRiskRadar`, then asserts:

```ts
expect(agentRiskVectors.map((vector) => vector.id)).toEqual([
  "instruction-attack",
  "excessive-agency",
  "tool-misuse",
  "data-leakage",
  "evidence-loss",
  "state-drift",
  "approval-bypass",
  "runtime-fragility"
]);
expect(summarizeAgentRiskRadar(agentRiskVectors)).toEqual({
  totalVectors: 8,
  liveVectors: 8,
  blueprintVectors: 8,
  highestPressureVector: "Excessive Agency",
  coverageLabel: "8/8 universal vectors covered by live and blueprint controls"
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: FAIL because the risk radar exports do not exist.

- [x] **Step 3: Write minimal implementation**

Add `AgentRiskVector`, `AgentRiskRadarSummary`, `agentRiskVectors`, and `summarizeAgentRiskRadar`. Each vector should include a source hint, live coverage count, blueprint coverage count, control, and product payoff.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: PASS.

### Task 2: Dashboard and Localization

**Files:**
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/App.css`
- Modify: `apps/web/src/i18n.ts`
- Modify: `apps/web/src/__tests__/i18n.test.ts`

- [x] **Step 1: Write the failing i18n test**

Assert that `t("en", "radar.kicker")` returns `Failure Mode Radar`, `t("zh", "radar.kicker")` returns `失败模式雷达`, and that a Chinese formatter localizes the `excessive-agency` vector name.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- i18n`

Expected: FAIL because the radar messages and formatter do not exist.

- [x] **Step 3: Implement UI and i18n**

Add a `RiskRadarPanel` after `UniversalGatePanel`. It should show four summary metrics and eight compact vector cards with an Apple-like glass panel style.

- [x] **Step 4: Run affected tests**

Run: `npm test -w @agentguard/web -- i18n testCloudEvidence`

Expected: PASS.

### Task 3: Submission Materials and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/deck-outline.md`
- Modify: `docs/research/agentguard-research-brief.md`
- Modify: `uipath/test-cloud-matrix.md`

- [x] **Step 1: Update docs**

Mention the eight-vector risk radar, name the external inspirations as NIST AI RMF, OWASP GenAI/LLM security categories, MITRE ATLAS-style adversarial taxonomy, and OpenTelemetry GenAI/agent spans.

- [x] **Step 2: Run full verification**

Run:

```powershell
npm test
npm run build
npm run agentguard:suite
git diff --check
```

Expected: all commands exit 0; `git diff --check` may only show Windows line-ending warnings.

- [ ] **Step 3: Commit and push**

Run:

```powershell
git add README.md apps/web/src/App.css apps/web/src/App.tsx apps/web/src/__tests__/i18n.test.ts apps/web/src/__tests__/testCloudEvidence.test.ts apps/web/src/i18n.ts apps/web/src/testCloudEvidence.ts docs/research/agentguard-research-brief.md docs/submission/deck-outline.md docs/submission/demo-script.md docs/superpowers/plans/2026-05-25-failure-mode-coverage-radar.md uipath/test-cloud-matrix.md
git commit -m "Add agent failure mode coverage radar"
git push origin codex/failure-mode-coverage-radar
```
