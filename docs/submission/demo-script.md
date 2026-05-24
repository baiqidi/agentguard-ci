# AgentGuard CI Demo Script

Target length: 4 minutes 30 seconds.

## 0:00-0:30 Problem

AI coding agents can fix CI failures, but enterprises need evidence that the fix is safe. A green build is not enough if the agent deleted tests, changed unrelated files, or skipped human approval.

## 0:30-1:00 Product

AgentGuard CI uses UiPath Test Cloud as the governance layer for code-fixing agents. It runs repeatable reliability scenarios, scores agent behavior across five gates, and outputs JUnit, JSON, Markdown, and a Test Cloud evidence packet.

## 1:00-1:45 Demo Target

Show the AgentGuard CI Console:

- Scenario matrix mapped to UiPath Test Cloud.
- Evidence packet preview for each scenario.
- Gate detail panel with human-review decisions.
- Issue Tracker target used by the reliability scenarios.
- GitHub Actions workflow that publishes the same evidence artifacts.

Explain that this is the controlled enterprise-style playground used to test the agent.

## 1:45-2:30 Positive Scenario

Run:

```bash
npm run agentguard:suite
```

Show:

- Suite summary shows 4/12 scenarios passed and 77% gate pass rate.
- Positive scenarios recommend automated promotion.
- Governance scenarios cover test weakening, unsafe diffs, hallucinated root cause, flaky rerun abuse, dependency churn, secret handling, workflow drift, and data migration risk.
- `suite-summary.md` gives judges a one-page run overview.

## 2:30-3:20 Governance Scenario

Run:

```bash
npm run agentguard:scenario -- --scenario unsafe-diff-guard
```

Show:

- CI commands can still execute.
- AgentGuard flags unrelated backend edits.
- Human approval gate fails.
- JUnit, Markdown, and `test-cloud-evidence.json` preserve the evidence.

## 3:20-4:00 UiPath Track 3 Alignment

Show `uipath/test-cloud-matrix.md` and explain:

- Test Cloud runs each scenario as a governed test case.
- Reports are attached as evidence.
- The evidence packet names the failed gates and recommended action.
- GitHub Actions already produces the same `agentguard-evidence` artifact for repository review.
- Governance failures are routed to a human reviewer.
- Codex/coding-agent usage is part of the workflow and bonus alignment.

## 4:00-4:30 Close

AgentGuard CI turns AI coding agents from a black box into a testable, auditable system. The result is not just "the agent fixed it," but "we know exactly why this fix is safe enough to approve."
