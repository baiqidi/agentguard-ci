# AgentGuard CI Research Brief

## Question

How should a UiPath Test Cloud submission evaluate enterprise AI agents in a way that is convincing to software-testing, automation, and governance judges?

## Findings Translated Into Product Decisions

| Source | Relevant finding | AgentGuard decision |
| --- | --- | --- |
| UiPath Test Cloud / Test Manager | Test management should provide requirements traceability, visual logging, continuous execution, and fast defect triage. Test Manager supports documents on requirements, test cases, and test sets. | AgentGuard emits JUnit, Markdown, JSON, and `test-cloud-evidence.json` so Test Cloud can attach evidence to each case. |
| SWE-bench | Real software engineering evaluation should use repository-level issues and executable tests, not isolated coding puzzles. | Scenarios model frontend/backend failures, required commands, changed files, and test-integrity constraints. |
| AgentBench | Agent evaluation should measure behavior in interactive environments, including reasoning, decision-making, and instruction following. | AgentGuard scores command recovery, explanation quality, diff safety, test preservation, and approval routing. |
| SWE-agent | Agent-computer interface design affects software-engineering agent performance. | The runbook and CLI constrain how the agent is invoked, tested, and reviewed. |
| Reflexion | Feedback can be scalar or natural language, and failed attempts should become reusable guidance. | Failed gates produce reviewer-facing reasons and recommended actions. |
| SWE agent traceability research | Execution traces can expose agent decision pathways and explain reliability differences. | AgentGuard packages scenario outputs as traceable evidence rather than only a final pass/fail label. |
| Launchable Predictive Test Selection | Modern CI testing products reduce feedback time by selecting high-signal tests from change and history data. | AgentGuard adds a targeted-vs-full-regression optimization model for agent-risk scenarios. |
| BrowserStack Test Observability | Test observability products group failures, expose quality signals, and help teams prioritize triage. | AgentGuard labels failure class, selection signal, and highest-risk area for each scenario. |
| Datadog CI Visibility | CI visibility products combine flaky test management, failure analysis, and performance trends. | AgentGuard reports the reliability decision and the time cost of collecting evidence. |
| Tricentis risk-based testing | Enterprise testing suites prioritize test effort around business and release risk. | AgentGuard treats unsafe diffs and test weakening as promotion blockers even when CI can be made green. |
| NIST AI RMF | AI systems need governance, mapping, measurement, and risk management across their lifecycle. | AgentGuard turns agent repairs into govern/map/measure/manage evidence: scenario taxonomy, five gates, and review actions. |
| OWASP GenAI / LLM security categories | LLM and agentic systems create risks such as prompt injection, excessive agency, sensitive information disclosure, insecure tool/plugin behavior, and overreliance. | AgentGuard turns those risks into concrete failure vectors, gated scenarios, and owner-routed actions. |
| OpenTelemetry GenAI semantic conventions | GenAI and agent operations need traceable spans, events, metrics, and exceptions so behavior can be observed consistently. | AgentGuard treats commands, artifacts, gate reasons, and future tool traces as evidence that can be attached to Test Cloud cases. |
| Google SRE | Reliability practice uses objective budgets and risk tradeoffs instead of chasing perfect uptime. | AgentGuard treats agent autonomy as a reliability budget: only all-gate repairs auto-promote; the rest consume review budget. |
| High Reliability Organization theory | Reliable operations cultivate preoccupation with failure, reluctance to simplify, and deference to expertise. | AgentGuard intentionally includes failed-by-design cases and routes trust-boundary changes to expert review. |

## Product Principles

1. **Evaluate realistic repair behavior.** A useful reliability test must exercise repository context, commands, and file-level changes.
2. **Separate green CI from safe repair.** Passing tests is not enough if the agent weakens tests or edits unrelated files.
3. **Make every run attachable.** Each scenario should produce artifacts that Test Cloud can store with a test case.
4. **Keep humans accountable for high-risk cases.** Guardrail failures should route to review instead of silently blocking or approving.
5. **Show research-backed credibility in the UI.** Judges should see why these gates exist, not only that the dashboard looks polished.
6. **Optimize feedback time without hiding risk.** The product should explain how targeted scenarios save time while still escalating blocked paths to deeper review.
7. **Quantify prevented risk.** A mature agent gate should report severity, owner, control, and evidence standard so blocked findings become auditable action queues.
8. **Separate command-backed adapters from live-local adapters.** The code-repair adapter is the real repository-command proof; non-code agent types run deterministic local traces without pretending hosted credentials are connected.
9. **Name the pressure points in general agent language.** A judge should see that AgentGuard covers instruction attack, excessive agency, tool misuse, data leakage, evidence loss, state drift, approval bypass, and runtime fragility.
10. **Make the first run obvious.** A useful governance product should tell operators what command to run, which artifact to inspect, and which risky scenario deserves review first.

## General Agent Control Contract

AgentGuard generalizes the live code-repair benchmark into five universal gates:

| Universal gate | What it asks | Example agent types |
| --- | --- | --- |
| Goal Fidelity | Did the agent solve the stated user or business goal without inventing a different task? | Code, RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, multi-agent |
| Tool Boundary | Did the agent stay within approved tools, permissions, systems, and ownership boundaries? | Code, RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, multi-agent |
| Evidence Integrity | Is the decision backed by preserved traces, outputs, citations, screenshots, or test artifacts? | Code, RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, multi-agent |
| State Safety | Did the agent avoid unsafe external state changes or provide a reversible path? | Code, RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, multi-agent |
| Human Approval | Are high-risk actions routed to a named owner before promotion or execution? | Code, RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, knowledge, multi-agent |

The current implementation proves the contract with a command-backed Code Repair Agent adapter and 12 live-local non-code adapter traces. Hosted third-party installation remains a credentialed follow-up step rather than a claimed result.

## Universal Failure Mode Radar

The latest dashboard layer converts security, observability, and reliability frameworks into eight judge-facing risk vectors:

| Vector | What it catches | Example live scenarios | Control idea |
| --- | --- | --- | --- |
| Instruction Attack | Untrusted text overrides policy, goals, or reviewer boundaries. | `prompt-injection-override`, `hallucinated-root-cause`, `secret-handling-guard` | Separate user content from trusted policy and require goal-fidelity evidence. |
| Excessive Agency | The agent acts beyond the approved task, owner, or release scope. | `unsafe-diff-guard`, `dependency-upgrade-risk`, `auth-bypass-shortcut`, `rollback-flag-missing`, `large-refactor-drift` | Convert autonomy into scoped gates, owner routing, and hard promotion blocks. |
| Tool Misuse | The agent uses the wrong tool, unsafe command, brittle selector, or hidden workflow path. | `config-env-drift`, `observability-removal`, `cross-platform-path-case` | Record tool boundaries, command traces, and allowed surfaces before promotion. |
| Data Leakage | The agent exposes secrets, private data, regulated records, or license-sensitive metadata. | `secret-handling-guard`, `data-migration-risk`, `license-policy-risk` | Gate sensitive flows with evidence integrity, owner approval, and data-boundary review. |
| Evidence Loss | The agent weakens tests, launders snapshots, removes telemetry, or loses audit proof. | `test-integrity-guard`, `snapshot-blessing-abuse`, `observability-removal` | Preserve artifacts and reviewer-readable reasons as first-class outputs. |
| State Drift | The agent changes migrations, caches, time boundaries, external state, or release flags unsafely. | `data-migration-risk`, `concurrency-race`, `timezone-edge-case`, `config-env-drift` | Require reversible paths and state-safety gates. |
| Approval Bypass | The agent promotes high-risk work without a named human owner. | `dependency-upgrade-risk`, `secret-handling-guard`, `auth-bypass-shortcut`, `rollback-flag-missing`, `license-policy-risk` | Route decisions to named owners and block until approval evidence exists. |
| Runtime Fragility | The agent passes the happy path but fails under platform, time, performance, or accessibility edges. | `performance-regression`, `input-validation-gap`, `cross-platform-path-case`, `timezone-edge-case`, `accessibility-regression` | Run targeted edge-case scenarios before full regression expansion. |

Current radar summary: **8/8 universal vectors covered by live and local adapter controls**. The highest-pressure vector is **Excessive Agency**, because it is the place where autonomous agents most visibly cross from assistance into unsafe execution.

## Operator and Scenario Workbench

The latest usability layer adds two practical affordances:

| Layer | What it does | Why it matters |
| --- | --- | --- |
| Operator Runbook | Shows the five-step path from install to Test Cloud evidence: install/test, run code suite, run agent adapter suite, review summaries, attach evidence. | Reduces judge and teammate friction; the product can be used without reading the whole repository. The install/test command is PowerShell-friendly for the current Windows workspace. |
| Live Scenario Priority Queue | Sorts the 24 live scenarios by severity, risk points, and risk-vector pressure. | Makes the suite more actionable: reviewers can start with `auth-bypass-shortcut`, `large-refactor-drift`, `secret-handling-guard`, and `data-migration-risk`. |
| Expansion Backlog | Names 13 deeper future non-code agent scenarios across browser/RPA, data, support, workflow, document, email, finance, HR, CRM, SOC, and multi-agent cases. | Shows a credible path from the command-backed code-repair adapter to a broader enterprise-agent control platform. |

## Failure Atlas

The current benchmark covers 24 AI coding-agent failure modes across 6 reliability domains:

| Domain | Principle | Scenario examples |
| --- | --- |
| Intent and truthfulness | Do not trust a green build until the explanation matches the failure. | `frontend-contract`, `backend-triage`, `hallucinated-root-cause`, `nondeterministic-random-fix` |
| Test integrity | The test suite is evidence, not something the agent may bargain with. | `test-integrity-guard`, `flaky-rerun-abuse`, `snapshot-blessing-abuse`, `accessibility-regression` |
| Change containment | Small, reversible patches beat impressive but unbounded repairs. | `unsafe-diff-guard`, `dependency-upgrade-risk`, `large-refactor-drift`, `license-policy-risk` |
| Security and governance | Any agent that crosses a trust boundary must stop at a human gate. | `secret-handling-guard`, `prompt-injection-override`, `auth-bypass-shortcut`, `observability-removal` |
| Release operations | CI fixes must preserve the operator's ability to detect, reverse, and explain releases. | `config-env-drift`, `performance-regression`, `rollback-flag-missing`, `data-migration-risk` |
| Runtime edge cases | Agents must survive the boring boundary conditions where production actually breaks. | `concurrency-race`, `input-validation-gap`, `cross-platform-path-case`, `timezone-edge-case` |

## Competitive Positioning

AgentGuard deliberately sits above adjacent product categories:

| Category | What it usually optimizes | AgentGuard extension |
| --- | --- | --- |
| Predictive test selection | Run fewer relevant tests faster. | Adds agent behavior gates before promotion. |
| Test observability | Explain test health and flaky failures. | Converts evidence into promote, review, or hard-block decisions. |
| CI test optimization | Reduce pipeline duration and failure triage cost. | Optimizes the evidence loop around autonomous-code risk. |
| Risk-based testing | Prioritize high-business-risk test cases. | Specializes the risk taxonomy for AI coding-agent failure modes. |

## Assurance Case Layer

The latest product layer adds a lightweight safety-case model on top of the 24 scenarios:

| Assurance field | Why it matters |
| --- | --- |
| Severity | Separates critical trust-boundary failures from routine product defects. |
| Risk points | Gives the suite an executive summary beyond pass/fail counts. |
| Owner | Routes blocked repairs to Security Review, Test Governance, Release Owner, Architecture Review, and other accountable reviewers. |
| Control | States the policy that prevented unsafe promotion. |
| Evidence standard | Describes what artifact must exist before review can close. |

Current full-suite result: **106/131 risk points stopped before promotion**, including **5 critical findings** requiring named-owner approval.

## Sources

- UiPath Test Cloud product page: https://www.uipath.com/product/test-cloud
- UiPath Test Manager documents: https://docs.uipath.com/test-manager/automation-cloud/latest/user-guide/test-manager-managing-documents
- UiPath Test Manager test cases: https://docs.uipath.com/test-manager/standalone/2023.10/user-guide/managing-test-cases
- SWE-bench: https://openreview.net/pdf/c2a76eb44300a738cbd7cb95f5bc04df621f4d25.pdf
- AgentBench: https://arxiv.org/abs/2308.03688
- SWE-agent: https://arxiv.org/abs/2405.15793
- Reflexion: https://arxiv.org/abs/2303.11366
- SWE agent traceability: https://arxiv.org/abs/2506.08311
- CloudBees Smart Tests / Launchable: https://www.cloudbees.com/capabilities/cloudbees-smart-tests
- BrowserStack Test Observability: https://www.browserstack.com/test-observability
- Datadog CI Visibility: https://docs.datadoghq.com/tests/
- Tricentis risk-based test optimization: https://www.tricentis.com/products/automate-continuous-testing-tosca/risk-based-testing
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- OWASP Top 10 for Large Language Model Applications / GenAI Security Project: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- OpenTelemetry semantic conventions for generative AI systems: https://opentelemetry.io/docs/specs/semconv/gen-ai/
- MITRE ATLAS: https://atlas.mitre.org/
- Google SRE, embracing risk: https://sre.google/sre-book/embracing-risk/
