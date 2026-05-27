# Splunk Demo Script

Target duration: 2 minutes 40 seconds to 2 minutes 55 seconds.

## Opening

Most AI security demos try to prove that an agent can investigate faster. AgentGuard for Splunk SOC proves something harder: whether that agent is safe enough to trust before it suppresses alerts, closes cases, or changes production defenses.

## Problem

In a real SOC, an agent can look productive while still being dangerous. It can generate a query, summarize a case, or recommend containment, but still skip the evidence trail, hide the alert sample, or act without approval.

## Product

This is AgentGuard CI in Splunk mode. We evaluate AI-agent behavior with the same seriousness that we evaluate production software.

The command-backed adapter runs 24 real repository scenarios. The enterprise adapter suite now runs 14 live-local scenarios across 12 agent categories, including 3 dedicated Splunk-style SOC routes, 9 review routes, and 5 hard blocks.

## Splunk Fit

This section shows why the product belongs in the Splunk Agentic Ops Hackathon.

We model six official Splunk tool surfaces:

- `splunk_run_query`
- `splunk_get_knowledge_objects`
- `saia_ask_splunk_question`
- `saia_generate_spl`
- `saia_explain_spl`
- `saia_optimize_spl`

And we bind them to three high-risk SOC decisions:

1. containment before blocklist updates,
2. evidence preservation before case closure, and
3. alert suppression before signal is tuned away.

Use the Overview page in `present=1` mode first, then the built-in judge route stepper to jump directly into:

- the SOC route deep link,
- the blocked evidence deep link, and
- the companion app delivery page.

## Evidence Story

The dashboard now makes the decision visible and replayable.

On the SOC Scenarios page, select the alert-suppression route and show that the linked Splunk tool surfaces, command, owner, and approval gate change together.

On the Companion App page, jump directly to the custom alert action delivery view and show that the install path, validation command, and review-envelope proof change together.

On the Evidence page, jump directly to the blocked unsafe-diff case and show that the evidence packet, gate failures, and target issues all move with the selected scenario.

Right now, the live code-repair suite shows **7 of 24** scenarios safe to auto-promote, **17** routed to review, and **106 of 131** risk points stopped before promotion.

The live-local adapter suite shows **14 scenarios**, **3 Splunk-integrated SOC routes**, **12 public framework checks**, and **2 deployment-validated Splunk surfaces** through AppInspect and Packaging Toolkit readiness.

We also ship a Splunk companion app with saved searches, a dashboard, and a custom alert action that writes an AgentGuard review envelope.

## Why It Wins

This project is not another SOC copilot. It is the control layer that decides whether a copilot or autonomous agent can be trusted at all.

Splunk helps the agent see the environment. AgentGuard decides whether the agent's proposed action is safe enough to take.

## Close

That is the core idea: not just smarter agents, but safer deployment decisions for agentic security operations.
