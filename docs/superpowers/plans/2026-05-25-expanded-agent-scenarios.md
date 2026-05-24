# Expanded Agent Scenarios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand AgentGuard's live-local adapter suite from 5 non-code scenarios to 12 scenarios across 12 agent types.

**Architecture:** Extend the `@agentguard/agent-adapters` trace schema with policy-pattern checks and richer action metadata, then add seven new deterministic enterprise-agent scenarios. Keep reports and Test Cloud evidence compatible with the current CLI while updating the dashboard and docs to show the larger live-local coverage truthfully.

**Tech Stack:** TypeScript, Vitest, Node.js CLI, React dashboard view model.

---

### Task 1: Expanded Adapter Taxonomy

**Files:**
- Modify: `packages/agent-adapters/src/types.ts`
- Modify: `packages/agent-adapters/src/scenarios.ts`
- Modify: `packages/agent-adapters/src/scoring.ts`
- Modify: `packages/agent-adapters/src/__tests__/scoring.test.ts`

- [x] **Step 1: Write failing tests**

Require scenario ids in this exact order:

```ts
[
  "browser-payment-approval",
  "data-pii-query-leak",
  "support-refund-escalation",
  "workflow-production-deploy",
  "document-citation-gap",
  "email-confidential-attachment",
  "finance-po-over-budget",
  "hr-protected-attribute-ranking",
  "crm-discount-commitment",
  "security-soc-blocklist",
  "knowledge-base-prompt-injection",
  "multi-agent-peer-override"
]
```

Require 12 unique agent types and a suite summary of 12 scenarios, 0 passed, 12 review/block findings, 39 passed gates, 60 total gates, 65% gate pass rate, and 12 live agent types.

- [x] **Step 2: Verify RED**

Run: `npm test -w @agentguard/agent-adapters`

Expected: FAIL because the seven new scenarios, agent types, and summary counts do not exist.

- [x] **Step 3: Implement minimal taxonomy and scoring**

Add these agent types: `email-calendar`, `finance-procurement`, `hr-recruiting`, `crm-sales`, `security-soc`, `knowledge-retrieval`, and `multi-agent-coordination`.

Add scenario-level `forbiddenAnswerPatterns` and action-level `policyViolation` support so goal fidelity and tool-boundary failures are not hard-coded to one domain.

- [x] **Step 4: Verify GREEN**

Run: `npm test -w @agentguard/agent-adapters`

Expected: PASS.

### Task 2: Report and Public Install Evidence

**Files:**
- Modify: `packages/agent-adapters/src/integrations.ts`
- Modify: `packages/agent-adapters/src/__tests__/integrations.test.ts`
- Modify: `packages/agent-adapters/src/__tests__/reports.test.ts`

- [x] **Step 1: Write failing tests**

Require public framework install checks to cover 8 frameworks or agent surfaces: Playwright, LangChain, CrewAI, AutoGen, Microsoft Graph, Slack Bolt, Salesforce Agentforce, and n8n.

- [x] **Step 2: Verify RED**

Run: `npm test -w @agentguard/agent-adapters`

Expected: FAIL because the new install checks do not exist.

- [x] **Step 3: Implement install checks**

Add contract-verified, no-credential-claim checks for email/calendar, support, CRM, and workflow automation surfaces.

- [x] **Step 4: Verify GREEN**

Run: `npm test -w @agentguard/agent-adapters`

Expected: PASS.

### Task 3: Dashboard and Submission Docs

**Files:**
- Modify: `apps/web/src/testCloudEvidence.ts`
- Modify: `apps/web/src/__tests__/testCloudEvidence.test.ts`
- Modify: `apps/web/src/i18n.ts`
- Modify: `apps/web/src/__tests__/i18n.test.ts`
- Modify: `README.md`
- Modify: `uipath/test-cloud-matrix.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/deck-outline.md`
- Modify: `docs/submission/live-agent-adapter-validation.md`

- [x] **Step 1: Write failing tests**

Update dashboard tests to expect 13 total profiles, 12 live-local profiles, 12 total local scenarios, and a coverage label of `1 live adapter + 12 live-local adapters`.

- [x] **Step 2: Verify RED**

Run: `npm test -w @agentguard/web -- testCloudEvidence i18n`

Expected: FAIL because dashboard data still shows 6 profiles and 5 local scenarios.

- [x] **Step 3: Update product surface**

Add seven profile cards and localized labels while keeping hosted installation claims explicit and truthful.

- [x] **Step 4: Verify GREEN**

Run: `npm test -w @agentguard/web -- testCloudEvidence i18n`

Expected: PASS.

### Task 4: Final Verification

- [x] Run:

```powershell
npm test
npm run build
npm run agentguard:agent-suite
npm run agentguard:suite
git diff --check
```

- [x] Browser QA:

Open the dashboard and verify it shows 13 validated adapters, 12 live-local adapters, and no console errors.

- [x] Commit and push:

```powershell
git add .
git commit -m "Expand live local agent scenarios"
git push -u origin codex/expanded-agent-scenarios
git checkout main
git merge --no-ff codex/expanded-agent-scenarios -m "Merge expanded agent scenarios"
git push origin main
```
