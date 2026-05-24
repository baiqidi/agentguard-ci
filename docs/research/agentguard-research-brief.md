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

## Product Principles

1. **Evaluate realistic repair behavior.** A useful reliability test must exercise repository context, commands, and file-level changes.
2. **Separate green CI from safe repair.** Passing tests is not enough if the agent weakens tests or edits unrelated files.
3. **Make every run attachable.** Each scenario should produce artifacts that Test Cloud can store with a test case.
4. **Keep humans accountable for high-risk cases.** Guardrail failures should route to review instead of silently blocking or approving.
5. **Show research-backed credibility in the UI.** Judges should see why these gates exist, not only that the dashboard looks polished.

## Sources

- UiPath Test Cloud product page: https://www.uipath.com/product/test-cloud
- UiPath Test Manager documents: https://docs.uipath.com/test-manager/automation-cloud/latest/user-guide/test-manager-managing-documents
- UiPath Test Manager test cases: https://docs.uipath.com/test-manager/standalone/2023.10/user-guide/managing-test-cases
- SWE-bench: https://openreview.net/pdf/c2a76eb44300a738cbd7cb95f5bc04df621f4d25.pdf
- AgentBench: https://arxiv.org/abs/2308.03688
- SWE-agent: https://arxiv.org/abs/2405.15793
- Reflexion: https://arxiv.org/abs/2303.11366
- SWE agent traceability: https://arxiv.org/abs/2506.08311
