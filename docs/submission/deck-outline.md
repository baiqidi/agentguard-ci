# AgentGuard CI Deck Outline

## Slide 1: Title

AgentGuard CI: Reliability Firewall for Code-Fixing Agents

## Slide 2: Problem

AI coding agents can repair builds, but enterprises need proof that the repair is safe, scoped, and auditable.

## Slide 3: Solution

AgentGuard CI runs a 24-mode agent failure atlas through UiPath Test Cloud and produces governance-grade evidence.

## Slide 4: Architecture

- Issue Tracker target app.
- Scripted code-fixing agent adapter.
- Reliability core with five gates.
- Reports: JSON, Markdown, JUnit XML.
- UiPath Test Cloud orchestration.

## Slide 5: Reliability Gates

1. CI Recovery.
2. Root Cause Match.
3. Change Safety.
4. Test Integrity.
5. Human Approval.

## Slide 6: Demo Scenarios

24 scenarios across safe repairs, test manipulation, prompt injection, snapshot laundering, unsafe diffs, hallucinated root causes, dependency/license risk, secret-handling risk, auth bypass, observability removal, release workflow drift, accessibility regression, performance regressions, data migration risk, platform edge cases, timezone bugs, random workarounds, and concurrency races.

Headline result: 7/24 scenarios safe to auto-promote, 17/24 routed to review, 12 hard blocks, 73% gate pass rate.

## Slide 7: Competitive Moat

AgentGuard is not only predictive test selection, test observability, CI optimization, or risk-based testing. It turns those ideas into agent promotion control: root-cause truth, diff scope, test integrity, and approval readiness.

## Slide 8: UiPath Platform Usage

Test Cloud tracks repeatable agent reliability test cases. Studio Web can execute scenario commands, collect artifacts, and route unsafe behavior to a human reviewer.

## Slide 9: Why It Matters

The project makes AI coding agents governable: every fix can be tested, scored, reviewed, and audited.

## Slide 10: Next Steps

- Add live Codex/Cursor/Claude Code adapter.
- Add enterprise policy packs for security, compliance, and release governance.
- Push reports directly into Test Cloud APIs.
- Add trend analytics for agent reliability over time.
