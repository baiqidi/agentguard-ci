# AgentGuard CI Demo Script

Target length: 4 minutes 30 seconds.

## 0:00-0:30 Problem

AI agents can complete tasks, click through systems, query data, draft support replies, or fix CI failures, but enterprises need evidence that the action is safe. A green build, successful automation run, or plausible answer is not enough if the agent crossed a tool boundary, changed protected state, invented evidence, or skipped human approval.

## 0:30-1:00 Product

AgentGuard CI uses UiPath Test Cloud as the governance layer for enterprise AI agents. The command-backed adapter is a code-repair agent benchmark: it runs a 24-mode failure atlas, scores agent behavior across five gates, and outputs JUnit, JSON, Markdown, and a Test Cloud evidence packet.

The general platform layer now shows one command-backed adapter plus five live-local adapters for browser/RPA, data-analysis, customer-support, workflow/DevOps, and document/compliance agents. The new failure-mode radar maps eight universal risk vectors across live and live-local controls: instruction attack, excessive agency, tool misuse, data leakage, evidence loss, state drift, approval bypass, and runtime fragility. The assurance layer also gives each scenario a severity, named owner, control, and evidence standard. That lets the demo say exactly what risk was stopped and who must review it.

## 1:00-1:45 Demo Target

Show the AgentGuard CI Console:

- Operator Runbook showing the four commands/artifacts needed to use the product.
- Scenario matrix mapped to UiPath Test Cloud.
- General Agent Control Layer showing 1 command-backed adapter, 5 live-local adapters, and the universal gate contract.
- Failure Mode Radar showing eight general agent risk vectors and the highest-pressure vector, Excessive Agency.
- Scenario Workbench ranking the most dangerous live scenarios and listing the next non-code agent scenarios to add.
- Failure Atlas covering 24 agent failure modes across 6 reliability domains.
- Assurance Case showing blocked risk points, critical findings, and owner queue.
- Reliability Moat panel showing why AgentGuard is more than test visibility or test selection.
- Evidence packet preview for each scenario.
- Gate detail panel with human-review decisions.
- Issue Tracker target used by the reliability scenarios.
- GitHub Actions workflow that publishes the same evidence artifacts.

Explain that this is the controlled enterprise-style playground used to test one command-backed agent adapter plus five live-local agent traces, and that the same gate contract can govern hosted RPA, data, support, workflow, and document agents once credentials are connected.

## 1:45-2:30 Positive Scenario

Run:

```bash
npm run agentguard:suite
npm run agentguard:agent-suite
```

Show:

- Suite summary shows 7/24 scenarios passed and 73% gate pass rate.
- Suite summary shows 106/131 risk points stopped before promotion.
- Security Review is the top owner, with 24 blocked risk points across 3 findings.
- Scenario Workbench recommends starting review with `auth-bypass-shortcut`, `large-refactor-drift`, `secret-handling-guard`, and `data-migration-risk`.
- Positive scenarios recommend automated promotion.
- Governance scenarios cover prompt injection, snapshot laundering, test weakening, unsafe diffs, hallucinated root cause, flaky rerun abuse, auth bypass, dependency/license risk, secret handling, workflow drift, accessibility regression, data migration risk, and random workarounds.
- `suite-summary.md` gives judges a one-page run overview.
- `agent-adapter-suite-summary.md` gives judges five non-code agent traces and a public framework install-contract summary.

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
- The code-repair adapter is command-backed evidence; the other agent profiles are live-local evidence using the same Test Cloud control model.
- The radar ties the pitch to recognized risk language: NIST AI RMF governance, OWASP GenAI security categories, OpenTelemetry-style agent traces, and production reliability controls.
- The live-local adapter suite already runs browser payment approval, data PII leakage, support refund escalation, workflow production deploy, and document citation gaps; the remaining backlog adds selector drift, metric drift, policy hallucination, secret rotation, policy misclassification, multi-agent peer injection, and missing agent spans.

## 4:00-4:30 Close

AgentGuard CI turns AI agents from black boxes into testable, auditable systems. The result is not just "the agent did it," but "we know exactly why this action is safe enough to approve."
