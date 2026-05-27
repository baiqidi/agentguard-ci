# Local Validation Report

Date: 2026-05-27

Branch at preparation time: `codex/no-labs-submission-pack`

Public repository: `https://github.com/baiqidi/agentguard-ci`

## Validation Commands

Run these commands from the repository root:

```bash
npm install
npm test
npm run build
npm run agentguard:suite
npm run agentguard:agent-suite
npm run submission:check
npm run splunk:check
```

## Latest Known Local Results

| Check | Expected result |
| --- | --- |
| Unit and model tests | 204 tests pass |
| Build | All workspaces build |
| Code-repair reliability suite | 24 scenarios execute |
| Code-repair gate summary | 7 auto-promote, 17 review/block, 73% gate pass rate |
| Risk summary | 106/131 risk points stopped, 5 critical findings |
| Enterprise adapter suite | 14 live-local scenarios execute |
| Enterprise adapter decision summary | 9 review routes, 5 hard blocks, 45/70 gates pass, 64% gate pass rate |
| Public framework checks | 12 contract-verified checks, 2 deployment-validated Splunk surfaces, 0 hosted credential claims |
| Submission readiness | 32 checks pass for required repository, docs, license, scripts, and evidence files |
| Splunk readiness | Self-generating `npm run splunk:check` passes with 19 companion-app checks and 34 submission checks |
| Official Splunk CLI note | GitHub Actions pins Python 3.9; local Python 3.14 cannot run Splunk Packaging Toolkit 1.0.1 because the tool imports legacy `collections.Mapping` and `imp` APIs |

## Generated Evidence Paths

| Evidence | Path |
| --- | --- |
| Code-repair Markdown summary | `agentguard-runs/suite-summary.md` |
| Code-repair JSON summary | `agentguard-runs/suite-summary.json` |
| Enterprise adapter Markdown summary | `agentguard-runs/agent-adapters/agent-adapter-suite-summary.md` |
| Enterprise adapter JSON summary | `agentguard-runs/agent-adapters/agent-adapter-suite-summary.json` |
| Splunk install smoke report | `agentguard-runs/splunk-app/install-smoke-report.json` |
| Test Cloud import map | `uipath/test-cloud-import.csv` |
| Test Cloud case matrix | `uipath/test-cloud-matrix.md` |
| Studio Web runbook | `uipath/studio-web-runbook.md` |

## Browser Demo Check

The web dashboard can be run with:

```bash
npm run dev -w @agentguard/web
```

The rendered dashboard should show:

- 13 validated agent profiles.
- 12 live-local enterprise adapters.
- 14 live-local scenarios.
- 9 review routes and 5 hard blocks in the enterprise adapter suite.
- Operator runbook command `npm run agentguard:agent-suite`.
- English/Chinese language switching.
- No browser console warning or error during the smoke check.

A local screen-recording preview can be generated from the running dashboard with Playwright or any screen recorder, then uploaded publicly for Devpost. The production shot list is in `docs/submission/demo-video-production-plan.md`.

## GitHub Actions Check

The repository workflow `.github/workflows/agentguard-evidence.yml` runs:

1. `npm ci`
2. `npm test`
3. `npm run build`
4. `npm run agentguard:suite`
5. `npm run agentguard:agent-suite`
6. Upload of `agentguard-runs/`

After this submission pack, the workflow should also run `npm run submission:check` after both evidence suites and `npm run splunk:check` for the Splunk-specific submission gate.
