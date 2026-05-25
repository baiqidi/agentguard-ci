# Devpost Submission Copy

Use this as the source of truth for the Devpost form. Keep the Labs URL and video URL fields marked pending until those links are available.

## Project Name

AgentGuard CI

## Tagline

A reliability firewall that stress-tests enterprise AI agents before they can approve, mutate, leak, or ship.

## Track

Track 3: UiPath Test Cloud

## Public GitHub Repository

https://github.com/baiqidi/agentguard-ci

## Demo Video URL

Pending public upload. The video must be under five minutes and publicly visible on YouTube, Vimeo, or Youku before final Devpost submission.

## Presentation Deck URL

Pending public share link. Local source deck: `docs/submission/AgentGuard-CI-deck.pptx`.

## UiPath Labs URL

Pending UiPath Labs access. Until the Labs sandbox arrives, reviewers can run the complete public repository path, inspect GitHub Actions evidence, and follow `docs/submission/no-labs-submission-status.md`.

## Short Description

AgentGuard CI turns AI agents into testable, auditable systems. It runs realistic failure scenarios, scores unsafe autonomous behavior across reliability gates, and produces CI/Test Cloud-ready evidence that tells a reviewer whether an agent action should be promoted, reviewed, or blocked.

## Long Description

AI agents are moving from chat into enterprise action: they can repair code, click through browser workflows, query data, draft customer responses, send emails, update CRM records, approve financial actions, and coordinate with other agents. The problem is that a successful-looking agent can still create risk. It may leak data, skip approval, weaken a test, invent evidence, overstep a policy, or follow a malicious instruction embedded in a document.

AgentGuard CI solves this by treating agent behavior as a quality target. Instead of asking only whether an agent completed a task, it asks whether the task was completed safely enough to approve. The prototype includes a command-backed code-repair adapter with 24 executable CI failure scenarios and a live-local adapter suite for 12 enterprise agent categories: browser/RPA, data analysis, customer support, workflow/DevOps, document compliance, email/calendar, finance/procurement, HR/recruiting, CRM/sales, security/SOC, knowledge retrieval, and multi-agent coordination.

Each run produces JSON, Markdown, JUnit XML, and Test Cloud-style evidence packets. The dashboard shows an operator runbook, risk radar, scenario matrix, assurance case, and evidence preview so judges can inspect what failed, which gate caught it, who should review it, and what artifact proves the result.

The project is designed for UiPath Test Cloud as the governance layer. Test Cloud can manage repeatable agent reliability test cases, attach AgentGuard evidence, and route high-risk findings to human review. Once the Labs environment is available, the same local suite can be orchestrated through UiPath Studio Web/Test Cloud. Before Labs access arrives, the public GitHub repository, local commands, generated artifacts, and GitHub Actions workflow provide a complete review path.

## What It Does

- Runs 24 command-backed code-repair reliability scenarios against a mixed frontend/backend demo app.
- Runs 12 live-local enterprise agent scenarios that simulate high-risk non-code agents.
- Scores behavior through reliability gates: CI recovery, root cause match, change safety, test integrity, human approval, goal fidelity, tool boundary, evidence integrity, and state safety.
- Produces evidence artifacts for judges and Test Cloud: Markdown summaries, JSON reports, JUnit XML, and Test Cloud evidence packets.
- Shows a web dashboard with multilingual UI, risk radar, scenario queue, operator runbook, and Devpost-ready proof points.
- Records public framework install contracts for Playwright, LangChain, CrewAI, AutoGen, Microsoft Graph, Slack Bolt, Salesforce Agentforce, and n8n without claiming hosted credentials.

## Business Problem

Enterprises want AI agents to work across real systems, but they need confidence that agent actions are scoped, compliant, reversible, and auditable. Traditional test dashboards show whether software passed a test; AgentGuard CI shows whether an autonomous agent should be trusted with an action.

## Why It Fits UiPath Test Cloud

Track 3 asks for agents that reimagine how testing is designed, automated, executed, and managed across modern enterprise environments. AgentGuard CI does that by making AI-agent reliability a continuous testing discipline:

- Design: risk scenarios are mapped to business failure modes and owners.
- Automation: suites run from npm, CI, or a Studio Web runbook.
- Execution: each scenario produces machine-readable and human-readable evidence.
- Management: unsafe findings are routed to review/block decisions instead of silent promotion.
- Enterprise coverage: the same gate contract applies across code, browser, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, and multi-agent systems.

## UiPath Components

- UiPath Test Cloud / Test Manager-style evidence model for scenario management and artifact review.
- UiPath Studio Web runbook for orchestrating local scenario commands once Labs access is available.
- UiPath Automation Cloud as the intended hosted governance layer after Labs provisioning.
- Coded-agent workflow demonstrated through Codex-built reliability scenarios and TypeScript agent adapters.

## Agent Type

Coded agents today, with a control contract that extends to low-code agents, RPA agents, external LLM frameworks, and hybrid UiPath-orchestrated workflows.

## Setup Instructions

```bash
npm install
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
npm run submission:check
npm run dev -w @agentguard/web
```

Open the dashboard at the local Vite URL printed by the dev server.

## Evidence to Mention

- Code-repair suite: 24 scenarios, 7 auto-promote, 17 review/block, 106/131 risk points stopped, 5 critical findings.
- Enterprise agent suite: 12 live-local scenarios, 12 review/block findings, 39/60 gates passed, 65% gate pass rate.
- Public framework checks: 8 contract-verified integration surfaces and 0 hosted credential claims.
- GitHub Actions: `.github/workflows/agentguard-evidence.yml` runs tests, builds, both suites, and uploads `agentguard-runs/`.

## Demo Video Outline

1. Open with the risk: agents can succeed while doing unsafe things.
2. Show the dashboard and the operator runbook.
3. Run `npm run agentguard:suite` and `npm run agentguard:agent-suite`.
4. Open the generated suite summaries.
5. Show one blocked scenario and its Test Cloud evidence packet.
6. Explain the no-Labs path: public GitHub, local evidence, GitHub Actions, and pending Labs URL.
7. Close with the thesis: AgentGuard CI changes agent testing from "did it finish?" to "is it safe enough to approve?"

## Final Submission Checklist

- GitHub URL: `https://github.com/baiqidi/agentguard-ci`
- License: MIT, visible at repository root.
- README: includes project description, UiPath components, agent type, and setup instructions.
- Demo video: pending public upload.
- Deck link: pending public share link.
- Labs URL: pending; replace this note when access arrives.
- Local verification: `npm run submission:check` passes.
