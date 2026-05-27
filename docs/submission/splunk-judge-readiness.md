# Splunk Judge Readiness Map

Last checked against the public Devpost rules on 2026-05-27.

Source: https://splunk.devpost.com/rules

## Submission Gate

| Rule requirement | Current answer | Evidence in repo |
| --- | --- | --- |
| Track selected | Security | `docs/submission/splunk-submission-copy.md` |
| Bonus target | Best Use of Splunk MCP Server | `docs/submission/splunk-submission-copy.md` |
| Public code repository | Public GitHub repository before final submit | `README.md`, `LICENSE` |
| Open source license | MIT license present | `LICENSE` |
| Root architecture diagram | `architecture_diagram.md` at repository root | `architecture_diagram.md` |
| Video under three minutes | Planned 2:55 max, with no judge-critical content after 3:00 | `docs/submission/splunk-demo-video-plan.md` |
| Video shows the product running | Four presentation-mode URLs are mapped to the recording flow | `docs/submission/splunk-demo-video-plan.md` |
| Video explains AI use | Agent scoring, Splunk MCP context, review-gate logic | `docs/submission/splunk-demo-script.md` |
| Video explains the problem | Unsafe SOC agent actions before live mutation | `docs/submission/splunk-demo-script.md` |
| Video highlights value | Promote, review, or block with named-owner evidence | `docs/submission/splunk-demo-script.md` |
| Installable Splunk artifact | Companion app package extracts cleanly with no missing files | `agentguard-runs/splunk-app/install-smoke-report.json` |
| English materials | Splunk submission copy, README, testing instructions, and video plan are in English | `README.md`, `docs/submission/` |
| Significant update after submission period start | Splunk SOC routes, companion app, CI checks, and presentation UI added after May 18, 2026 | `docs/submission/splunk-significant-updates.md` |
| Official Splunk tooling | GitHub Actions pins Python 3.12 before installing Splunk Packaging Toolkit and AppInspect | `.github/workflows/splunk-companion-app.yml` |

## Judging Score Map

| Judging criterion | What we emphasize | Strong proof |
| --- | --- | --- |
| Technological Implementation | Command-backed reliability suite, Splunk companion app, alert action, clean-install smoke test, packaging, and CI validation | `npm test`, `npm run build`, `npm run splunk:check`, `splunk-apps/agentguard_ci_for_splunk/`, `agentguard-runs/splunk-app/install-smoke-report.json` |
| Design | Multi-page judge route, presentation mode, interactive SOC mission desk, companion delivery desk, evidence review desk | `http://localhost:5190/?contest=splunk&lang=en&page=overview&present=1` |
| Potential Impact | SOC teams can keep AI agents useful while blocking unsafe mutation, alert suppression, and evidence loss | `docs/hackathons/splunk-agentic-ops-pack.md`, `docs/submission/splunk-submission-copy.md` |
| Quality of the Idea | The project is not another SOC copilot; it is a release and governance gate for SOC copilots | `architecture_diagram.md`, `docs/submission/splunk-demo-script.md` |

## First-Place Vulnerability Sweep

| Risk | Why it could cost points | Current mitigation |
| --- | --- | --- |
| Looks like a generic AI wrapper | Judges may discount it if Splunk is only in the copy | Companion app, saved searches, alert action, Splunk MCP flow, Splunk-specific SOC scenarios |
| Existing project reuse concern | Rules require significant updates after the submission period if a project existed before | Dedicated significant-updates note with concrete post-May-18 changes |
| Video loses judges after 3 minutes | Judges are not required to watch beyond three minutes | 2:55 plan, required message in first 2:35 |
| Claims are hard to verify | Judges may rely on text/video only and skip local setup | Presentation deep links, machine-readable evidence, root architecture diagram, verifier script |
| UI feels like a report instead of a product | Design is an equally weighted criterion | Presentation mode, compact judge route, interactive review desk, mobile QA |
| Splunk app feels aspirational | A mock app would weaken technical implementation | Packaged companion app tgz, clean extraction report, and alert-action fixture execution |
| Official Splunk tools fail locally on Python 3.14 | Packaging Toolkit 1.0.1 imports Python's removed `imp` module | CI pins Python 3.12; local smoke test still validates package structure and alert action |

## Final Submit Stop List

Do not click final submit until all are true:

- `npm test` passes.
- `npm run build` passes.
- `npm run splunk:check` passes.
- `agentguard-runs/splunk-app/install-smoke-report.json` has `missingFiles: []`.
- GitHub Actions uses Python 3.12 for official Splunk Packaging Toolkit and AppInspect.
- Public GitHub repository is updated with the Splunk-specific version.
- Demo video is public and under three minutes.
- Devpost text uses `docs/submission/splunk-submission-copy.md` as the source of truth.
- Devpost includes the architecture diagram and repository URL.
- Submission explicitly says the project was significantly updated after May 18, 2026.
