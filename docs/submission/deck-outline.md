# AgentGuard CI Deck Outline

## Slide 1: Title

AgentGuard CI: Reliability Testing for Code-Fixing Agents

## Slide 2: Problem

AI coding agents can repair builds, but enterprises need proof that the repair is safe, scoped, and auditable.

## Slide 3: Solution

AgentGuard CI runs agent reliability scenarios through UiPath Test Cloud and produces governance-grade evidence.

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

12 scenarios across safe repairs, test manipulation, unsafe diffs, hallucinated root causes, dependency churn, secret-handling risk, release configuration drift, performance regressions, data migration risk, and concurrency races.

Headline result: 4/12 scenarios safe to auto-promote, 8/12 routed to review, 77% gate pass rate.

## Slide 7: UiPath Platform Usage

Test Cloud tracks repeatable agent reliability test cases. Studio Web can execute scenario commands, collect artifacts, and route unsafe behavior to a human reviewer.

## Slide 8: Why It Matters

The project makes AI coding agents governable: every fix can be tested, scored, reviewed, and audited.

## Slide 9: Next Steps

- Add live Codex/Cursor/Claude Code adapter.
- Expand scenario library.
- Push reports directly into Test Cloud APIs.
- Support enterprise policy packs.
