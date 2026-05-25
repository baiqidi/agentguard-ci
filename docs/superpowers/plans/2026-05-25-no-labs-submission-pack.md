# No Labs Submission Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AgentGuard CI ready for Devpost review without a UiPath Labs URL by packaging public repository evidence, local validation, video material, and submission copy.

**Architecture:** Add a submission-readiness script that checks the artifacts Devpost judges need, then add human-facing submission files that explain the no-Labs path honestly. Keep Labs-specific fields explicit placeholders so they can be filled once UiPath access arrives.

**Tech Stack:** Node.js, TypeScript/Vitest project scripts, Markdown submission assets, GitHub Actions evidence.

---

### Task 1: Submission Readiness Gate

**Files:**
- Create: `scripts/verify-submission-readiness.mjs`
- Modify: `package.json`

- [x] **Step 1: Add the readiness script**

Create a Node script that checks for `README.md`, `LICENSE`, demo/deck/submission docs, Test Cloud mapping files, generated suite summaries, and required package scripts.

- [x] **Step 2: Add npm command**

Add `submission:check` to `package.json` so judges and the maintainer can run one command.

- [x] **Step 3: Run the command**

Run: `npm run submission:check`

Expected: PASS after all required files exist and suites have been generated.

### Task 2: Devpost Submission Assets

**Files:**
- Create: `LICENSE`
- Create: `docs/submission/devpost-submission-copy.md`
- Create: `docs/submission/no-labs-submission-status.md`
- Create: `docs/submission/local-validation-report.md`
- Modify: `README.md`

- [x] **Step 1: Add MIT license**

Add an MIT license so the public repository satisfies the hackathon open-source requirement.

- [x] **Step 2: Add ready-to-paste Devpost copy**

Include project tagline, short pitch, long description, feature list, setup instructions, track alignment, video/deck fields, GitHub URL, and Labs URL placeholder.

- [x] **Step 3: Add no-Labs status note**

Explain that the project is publicly reviewable through GitHub, local evidence, and CI while the Labs URL is pending.

- [x] **Step 4: Add local validation report**

Summarize the latest local test/build/suite/browser evidence and expected artifact paths.

- [x] **Step 5: Update README submission checklist**

Point judges to the Devpost copy, no-Labs note, validation report, and readiness command.

### Task 3: Verification and Publish

- [x] **Step 1: Run full validation**

Run:

```powershell
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
npm run submission:check
git diff --check
```

- [x] **Step 2: Commit and push**

Commit the pack, push the branch, merge to `main`, and confirm GitHub Actions.
