# General Agent Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand AgentGuard from a code-repair-specific reliability demo into a general enterprise AI-agent reliability control layer while keeping code repair as the truthful live adapter.

**Architecture:** Add a focused Agent Profile model in `apps/web/src/testCloudEvidence.ts` that classifies live and blueprint agent categories, maps universal reliability gates across them, and keeps the current 24 code-repair scenarios as the only live evidence. Render this in the React dashboard as a first-class "Agent Coverage" and "Universal Gate" story, then update i18n and docs so the positioning is consistent.

**Tech Stack:** TypeScript, React, Vite, Vitest, existing AgentGuard view-model tests, existing CSS design system.

---

### Task 1: Add Agent Profile Model

**Files:**
- Modify: `apps/web/src/__tests__/testCloudEvidence.test.ts`
- Modify: `apps/web/src/testCloudEvidence.ts`

- [ ] **Step 1: Write the failing test**

Add imports and tests that expect:

```ts
import {
  agentProfiles,
  summarizeAgentCoverage,
  universalReliabilityGates
} from "../testCloudEvidence.js";

it("frames AgentGuard as a general agent reliability platform with truthful live coverage", () => {
  expect(agentProfiles.map((profile) => profile.id)).toEqual([
    "code-repair",
    "browser-rpa",
    "data-analysis",
    "customer-support",
    "workflow-devops",
    "document-compliance"
  ]);
  expect(summarizeAgentCoverage(agentProfiles)).toEqual({
    totalProfiles: 6,
    liveProfiles: 1,
    blueprintProfiles: 5,
    liveScenarioCount: 24,
    blueprintScenarioCount: 36,
    coverageLabel: "1 live adapter + 5 expansion blueprints"
  });
});

it("defines universal reliability gates that apply beyond code repair", () => {
  expect(universalReliabilityGates.map((gate) => gate.id)).toEqual([
    "goal-fidelity",
    "tool-boundary",
    "evidence-integrity",
    "state-safety",
    "human-approval"
  ]);
  expect(universalReliabilityGates[1].appliesTo).toContain("browser-rpa");
  expect(universalReliabilityGates[2].appliesTo).toContain("data-analysis");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: FAIL because `agentProfiles`, `summarizeAgentCoverage`, and `universalReliabilityGates` are not exported yet.

- [ ] **Step 3: Implement the minimal model**

Add these exports to `apps/web/src/testCloudEvidence.ts`:

```ts
export type AgentProfileStatus = "live" | "blueprint";

export interface AgentProfile {
  id: string;
  name: string;
  status: AgentProfileStatus;
  scenarioCount: number;
  primaryRisk: string;
  testCloudFit: string;
  proof: string;
}

export interface AgentCoverageSummary {
  totalProfiles: number;
  liveProfiles: number;
  blueprintProfiles: number;
  liveScenarioCount: number;
  blueprintScenarioCount: number;
  coverageLabel: string;
}

export interface UniversalReliabilityGate {
  id: string;
  name: string;
  question: string;
  appliesTo: string[];
}
```

Then create six profiles and five universal gates. Set `code-repair` to `live` with `scenarioCount: 24`; set the other five to `blueprint` with scenario counts that sum to 36.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -w @agentguard/web -- testCloudEvidence`

Expected: PASS.

### Task 2: Render General Agent Coverage

**Files:**
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/App.css`
- Modify: `apps/web/src/i18n.ts`
- Modify: `apps/web/src/__tests__/i18n.test.ts`

- [ ] **Step 1: Write the failing i18n test**

Add expectations:

```ts
expect(t("en", "platform.kicker")).toBe("General Agent Control Layer");
expect(t("zh", "platform.kicker")).toBe("通用 Agent 控制层");
expect(formatAgentProfileStatus("live", "en")).toBe("Live adapter");
expect(formatAgentProfileStatus("blueprint", "zh")).toBe("扩展蓝图");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w @agentguard/web -- i18n`

Expected: FAIL because the new keys and formatter do not exist.

- [ ] **Step 3: Implement i18n support**

Add message keys for platform and universal-gate sections, plus:

```ts
export function formatAgentProfileStatus(status: "live" | "blueprint", locale: Locale): string {
  if (locale === "zh") {
    return status === "live" ? "真实适配器" : "扩展蓝图";
  }
  return status === "live" ? "Live adapter" : "Expansion blueprint";
}
```

- [ ] **Step 4: Render panels**

Import `agentProfiles`, `summarizeAgentCoverage`, and `universalReliabilityGates` in `App.tsx`. Add:

```tsx
<AgentCoveragePanel coverageSummary={agentCoverageSummary} locale={locale} />
<UniversalGatePanel locale={locale} />
```

Place the coverage panel after the release decision hero so judges see the broadened platform position before the code-repair details.

- [ ] **Step 5: Style panels**

Add CSS classes:

```css
.agent-platform-panel,
.universal-gate-panel {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 62px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(28px);
}
```

Use responsive grids that collapse to one column below 560px.

- [ ] **Step 6: Verify web tests**

Run: `npm test -w @agentguard/web`

Expected: PASS.

### Task 3: Update Submission Positioning

**Files:**
- Modify: `README.md`
- Modify: `docs/submission/demo-script.md`
- Modify: `docs/submission/deck-outline.md`

- [ ] **Step 1: Update README positioning**

Change the intro from code-fixing-only positioning to: AgentGuard is a general AI-agent reliability firewall, with code repair as the first live adapter.

- [ ] **Step 2: Update demo script**

Add a line that says the demo proves one live adapter and shows the same reliability gate contract can extend to RPA, data, support, workflow, and document agents.

- [ ] **Step 3: Update deck outline**

Add a slide or bullet titled "General Agent Control Layer" with the six agent profiles and the five universal gates.

### Task 4: Full Verification And Shipping

**Files:**
- No new source files.

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run full build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Run reliability suite**

Run: `npm run agentguard:suite`

Expected: PASS with the known live adapter result: 7/24 scenarios passed, 73% gate pass rate, 106/131 risk points blocked.

- [ ] **Step 4: Browser QA**

Open `http://localhost:5197/?lang=en` and `http://localhost:5197/?lang=zh`. Verify the platform panel is visible, the language switch still works, console logs have no app errors, and mobile screenshot has no horizontal overflow.

- [ ] **Step 5: Commit and push**

Run:

```bash
git add README.md docs/submission/demo-script.md docs/submission/deck-outline.md apps/web/src/App.tsx apps/web/src/App.css apps/web/src/i18n.ts apps/web/src/__tests__/i18n.test.ts apps/web/src/testCloudEvidence.ts apps/web/src/__tests__/testCloudEvidence.test.ts docs/superpowers/plans/2026-05-25-general-agent-platform.md
git commit -m "feat: generalize agent reliability platform"
git switch main
git merge --ff-only codex/general-agent-platform
git push origin main
```

Expected: Push succeeds and GitHub Actions passes.

---

## Self-Review

- Spec coverage: The plan covers model, front-end, i18n, docs, verification, and shipping.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: `AgentProfileStatus`, `AgentProfile`, `AgentCoverageSummary`, and `UniversalReliabilityGate` are defined before use.
