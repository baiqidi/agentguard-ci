# SANS Find Evil IR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn AgentGuard CI into a credible FIND EVIL submission by adding SIFT/Protocol SIFT-oriented incident-response scenarios, execution logs, accuracy evidence, documentation, and a SANS-specific dashboard mode.

**Architecture:** Keep the existing AgentGuard scoring core and add a SANS adapter layer around it. The new layer must prove self-correction, artifact-level traceability, terminal-style execution, and judge-readable setup instructions without claiming unavailable hosted credentials.

**Tech Stack:** TypeScript, Vitest, React/Vite, Node.js scripts, Markdown submission assets, deterministic local evidence fixtures.

---

### Task 1: SANS Evidence Model

**Files:**
- Modify: `packages/agent-adapters/src/types.ts`
- Modify: `packages/agent-adapters/src/scenarios.ts`
- Modify: `packages/agent-adapters/src/reports.ts`
- Test: `packages/agent-adapters/src/__tests__/scoring.test.ts`
- Test: `packages/agent-adapters/src/__tests__/reports.test.ts`

- [ ] **Step 1: Write failing tests**

Add tests expecting SANS incident-response scenarios, self-correction records, artifact locators, and SANS evidence packets.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- packages/agent-adapters/src/__tests__/scoring.test.ts packages/agent-adapters/src/__tests__/reports.test.ts`

Expected: FAIL because SANS scenario ids, metadata, and evidence output do not exist yet.

- [ ] **Step 3: Implement minimal evidence model**

Add optional `selfCorrections`, `findings`, and `executionProfile` fields to adapter scenarios, add SANS scenarios, and include those fields in evidence reports.

- [ ] **Step 4: Verify green**

Run the same targeted tests and confirm PASS.

### Task 2: SANS Local Runner And Submission Artifacts

**Files:**
- Create: `scripts/run-sans-sift-ir-demo.mjs`
- Create: `scripts/verify-sans-find-evil-submission.mjs`
- Create: `scripts/__tests__/sans-find-evil.test.ts`
- Create: `sans-fixtures/case-001/README.md`
- Create: `sans-fixtures/case-001/timeline.body`
- Create: `sans-fixtures/case-001/auth.log`
- Create: `sans-fixtures/case-001/registry-run-key.txt`
- Modify: `package.json`

- [ ] **Step 1: Write failing test**

Add a script test that expects the runner to create `agent-execution-log.jsonl`, `accuracy-report.json`, `evidence-dataset.md`, and `investigative-narrative.md`.

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- scripts/__tests__/sans-find-evil.test.ts`

Expected: FAIL because the runner and verifier do not exist.

- [ ] **Step 3: Implement runner and verifier**

Build deterministic fixture-backed execution that records timestamped tool calls, one self-correction event, artifact locators, and an honest fallback when SIFT binaries are not installed locally.

- [ ] **Step 4: Verify green**

Run: `npm test -- scripts/__tests__/sans-find-evil.test.ts && npm run sans:check`.

### Task 3: SANS Dashboard And Docs

**Files:**
- Modify: `apps/web/src/contestMode.ts`
- Modify: `apps/web/src/appNavigation.ts`
- Modify: `apps/web/src/CompetitionPanels.tsx`
- Test: `apps/web/src/__tests__/contestMode.test.ts`
- Test: `apps/web/src/__tests__/appNavigation.test.ts`
- Modify: `README.md`
- Create: `architecture_diagram_sans.md`
- Create: `docs/submission/sans-find-evil-submission-copy.md`
- Create: `docs/submission/sans-find-evil-judge-readiness.md`

- [ ] **Step 1: Write failing tests**

Add tests expecting `?contest=sans`, `Protocol SIFT / SIFT Workstation`, and `sift-ir-evidence.json`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- apps/web/src/__tests__/contestMode.test.ts apps/web/src/__tests__/appNavigation.test.ts`

Expected: FAIL because SANS mode does not exist.

- [ ] **Step 3: Implement dashboard mode and documentation**

Add SANS labels, setup instructions, architecture diagram, submission copy, and judge readiness mapping.

- [ ] **Step 4: Verify final readiness**

Run: `npm test && npm run build && npm run sans:check`.

### Confidence Loop

- [ ] Check official FIND EVIL rules against the implementation.
- [ ] Identify gaps that would weaken Stage One viability.
- [ ] Patch any gap with a test, script, or documentation artifact.
- [ ] Repeat until the remaining limitations are clearly documented instead of hidden.
