# DeveloperWeek New York 2026 Devpost Copy

## Project Name

AgentGuard CI

## Tagline

A reliability firewall that turns AI-agent behavior into a CI gate before agents touch production workflows.

## Built With

TypeScript, React, Vite, Node.js, Vitest, GitHub Actions, Playwright, Markdown/JSON evidence packets.

## Inspiration

Teams are quickly moving from AI copilots to agents that can call tools, edit code, query data, update tickets, summarize incidents, approve workflows, and interact with business systems. That creates a new release problem: a model can sound confident while still taking the wrong action.

AgentGuard CI was built around a simple question: before an AI agent is promoted into a real workflow, can we prove that its action is evidence-backed, bounded, reversible, and approved when needed?

## What It Does

AgentGuard CI is a reliability firewall for enterprise AI agents. It runs repeatable scenarios, records the agent's behavior, and classifies the result as:

- **Promote:** the action is evidence-backed and safe enough to continue.
- **Review:** the action may be useful, but needs a human decision.
- **Block:** the action is unsafe, overconfident, destructive, or missing approval.

The current prototype includes:

- A command-backed code-repair reliability suite.
- A live-local enterprise agent adapter suite with 17 scenarios across 13 agent categories.
- Safety gates for goal fidelity, tool boundaries, evidence integrity, state safety, and human approval.
- Markdown and JSON evidence summaries that can be reviewed by developers, judges, or CI systems.
- Contest-specific packaging for SOC, incident response, and broader enterprise-agent governance.

## How I Built It

The core is a TypeScript monorepo with React/Vite for the dashboard and Node.js packages for reliability scenarios. The system separates the execution surface from the control contract:

- Scenario runners generate deterministic local evidence.
- Adapters normalize different agent categories into a common decision model.
- The dashboard shows scenario coverage, risk categories, decision outcomes, and evidence summaries.
- Verification scripts make each contest package reproducible from the command line.

For DeveloperWeek, the product is positioned as a practical developer tool: a CI-ready safety layer for teams that want to ship agentic applications without relying on one-off demos or trust-me summaries.

## Challenges I Ran Into

The hardest part was keeping the product honest. It would be easy to claim support for every agent platform, but that would not be useful to developers or judges. Instead, AgentGuard CI distinguishes between command-backed scenarios and live-local deterministic traces, then makes the evidence visible.

Another challenge was making the product broad enough for enterprise AI agents while still concrete enough to verify. The solution was to keep a common promote / review / block contract and prove it across multiple domains: code repair, browser/RPA, data analysis, support, workflows, documents, finance, HR, CRM, SOC, knowledge retrieval, and multi-agent coordination.

## Accomplishments That I Am Proud Of

- A working TypeScript/React product with repeatable local verification.
- 17 live-local enterprise agent scenarios across 13 agent categories.
- A command-backed code-repair reliability suite.
- A reusable evidence model for promote / review / block decisions.
- GitHub-ready documentation for judges and developers.
- Security and incident-response editions that demonstrate the same core reliability layer in realistic high-stakes domains.

## What I Learned

Agent safety is not only a model-quality problem. It is a systems problem. A useful enterprise agent needs evidence boundaries, state boundaries, approval boundaries, and a way for teams to inspect what happened after the run.

The main lesson is that agent governance should be built into the development workflow, not bolted on after deployment.

## What's Next

- Add a GitHub App or CI integration that comments on pull requests when an agent action should be reviewed or blocked.
- Add a hosted dashboard for team-level agent risk history.
- Add richer sponsor-specific integrations, especially data-to-AI and live-web agent scenarios.
- Benchmark multiple agent frameworks under the same reliability contract.

## Try It Out

GitHub branch:

https://github.com/baiqidi/agentguard-ci/tree/codex/developerweek-ny

Current public demo video:

https://youtu.be/RQFx5FuB3nY

Local verification:

```bash
npm install
npm run developerweek:check
npm run video:check:developerweek
```
