# Multi-Hackathon Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package AgentGuard CI for multiple realistic hackathons while filtering out targets where eligibility or fit makes prize pursuit weak.

**Architecture:** Add a machine-readable hackathon target catalog, one Markdown submission pack per contest, and a verifier script that guards against missing eligibility notes or empty submission fields. Keep the current UiPath submission pack unchanged and add this as a parallel strategy layer.

**Tech Stack:** Markdown, JSON, Node.js verification script, npm scripts.

---

### Task 1: Target Catalog

**Files:**
- Create: `docs/hackathons/targets.json`
- Create: `docs/hackathons/multi-hackathon-strategy.md`

- [x] **Step 1: Create scored target catalog**

Add contest metadata for UiPath, SANS, Tencent Cloud, Hack-Nation, DevNetwork, and Google Cloud Rapid Agent. Include eligibility status and strategy tier.

- [x] **Step 2: Create portfolio strategy**

Summarize which contests to pursue, which to avoid, and why.

### Task 2: Contest-Specific Packs

**Files:**
- Create: `docs/hackathons/sans-find-evil-pack.md`
- Create: `docs/hackathons/tencent-ai-agent-pack.md`
- Create: `docs/hackathons/devnetwork-ai-ml-pack.md`
- Create: `docs/hackathons/hack-nation-global-ai-pack.md`
- Create: `docs/hackathons/google-rapid-agent-pack.md`

- [x] **Step 1: Create active target packs**

Each active pack includes title, tagline, adapted description, demo emphasis, build delta, and submission checklist.

- [x] **Step 2: Create Google caution pack**

Mark Google Cloud Rapid Agent as not a current prize target for a China-resident solo submission unless eligibility changes.

### Task 3: Verification

**Files:**
- Create: `scripts/verify-hackathon-pack.mjs`
- Modify: `package.json`

- [x] **Step 1: Add verifier**

Check required files, parse `targets.json`, enforce at least four active targets, and ensure disqualified targets contain an eligibility warning.

- [x] **Step 2: Add npm script**

Add `hackathons:check`.

- [x] **Step 3: Run validation**

Run `npm run hackathons:check`, `npm test`, and `git diff --check`.

### Task 4: Publish

- [x] **Step 1: Commit and push**

Commit the pack, push the branch, merge to `main`, and confirm GitHub Actions.
