# AgentGuard CI Research Brief

## Question

How should a UiPath Test Cloud submission evaluate AI code-fixing agents in a way that is convincing to enterprise software-testing judges?

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
- Google SRE, embracing risk: https://sre.google/sre-book/embracing-risk/
