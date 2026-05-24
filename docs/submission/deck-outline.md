# AgentGuard CI Deck Outline

## Slide 1: Title

AgentGuard CI: Reliability Firewall for Enterprise AI Agents

## Slide 2: Problem

AI agents can repair builds, operate browsers, query data, draft replies, and run workflows, but enterprises need proof that each action is safe, scoped, and auditable.

## Slide 3: Solution

AgentGuard CI runs a 24-mode live code-repair failure atlas through UiPath Test Cloud and turns the same gate contract into a general reliability layer for enterprise agents.

## Slide 4: Architecture

- Issue Tracker target app.
- Scripted code-fixing agent adapter.
- Reliability core with five gates.
- Reports: JSON, Markdown, JUnit XML.
- Operator Runbook and Scenario Workbench in the dashboard.
- UiPath Test Cloud orchestration.

## Slide 5: Reliability Gates

Live code-repair gates:

1. CI Recovery.
2. Root Cause Match.
3. Change Safety.
4. Test Integrity.
5. Human Approval.

General agent gates:

1. Goal Fidelity.
2. Tool Boundary.
3. Evidence Integrity.
4. State Safety.
5. Human Approval.

## Slide 6: General Agent Control Layer

- Live adapter: Code Repair Agent, 24 command-backed scenarios.
- Expansion blueprints: Browser/RPA Agent, Data Analysis Agent, Customer Support Agent, Workflow/DevOps Agent, Document/Compliance Agent.
- Honest positioning: one tested adapter today, one reusable Test Cloud governance contract for future adapters.

## Slide 7: Demo Scenarios

24 scenarios across safe repairs, test manipulation, prompt injection, snapshot laundering, unsafe diffs, hallucinated root causes, dependency/license risk, secret-handling risk, auth bypass, observability removal, release workflow drift, accessibility regression, performance regressions, data migration risk, platform edge cases, timezone bugs, random workarounds, and concurrency races.

Headline result: 7/24 scenarios safe to auto-promote, 17/24 routed to review, 12 hard blocks, 73% gate pass rate.

## Slide 8: Failure Mode Radar

Eight universal vectors translate external risk language into product controls: Instruction Attack, Excessive Agency, Tool Misuse, Data Leakage, Evidence Loss, State Drift, Approval Bypass, and Runtime Fragility. The radar shows 8/8 vectors covered by live code-repair scenarios and by blueprint controls for future agent profiles. Highest-pressure vector: Excessive Agency.

## Slide 9: Operator Workbench

The product is usable without reading the repository: install and test, run `npm run agentguard:suite`, inspect `agentguard-runs/suite-summary.md`, then attach Test Cloud evidence. The scenario queue ranks live cases by severity, risk points, and risk-vector pressure so reviewers know what to inspect first.

## Slide 10: Scenario Expansion Backlog

12 next scenarios extend coverage beyond code repair: browser payment approval, selector drift, data PII query leakage, metric definition drift, support refund escalation, policy hallucination, workflow production deploy, secret rotation, document citation gaps, policy misclassification, multi-agent peer injection, and missing agent spans.

## Slide 11: Assurance Case

Each failed scenario now has severity, owner, control, and evidence-standard metadata. Headline result: 106/131 risk points stopped before promotion, 5 critical findings require named-owner approval, and Security Review is the top review owner.

## Slide 12: Competitive Moat

AgentGuard is not only predictive test selection, test observability, CI optimization, or risk-based testing. It turns those ideas into agent approval control: goal fidelity, tool boundaries, evidence integrity, state safety, and approval readiness.

## Slide 13: UiPath Platform Usage

Test Cloud tracks repeatable agent reliability test cases. Studio Web can execute scenario commands, collect artifacts, and route unsafe behavior to a human reviewer. The live adapter is code repair; the platform model can extend to RPA/browser, data, support, workflow, and document agents.

## Slide 14: Why It Matters

The project makes AI agents governable: every high-risk action can be tested, scored, reviewed, and audited.

## Slide 15: Next Steps

- Add live Codex/Cursor/Claude Code adapter.
- Add live browser/RPA and data-analysis adapters.
- Add enterprise policy packs for security, compliance, and release governance.
- Push reports directly into Test Cloud APIs.
- Add trend analytics for agent reliability over time.
