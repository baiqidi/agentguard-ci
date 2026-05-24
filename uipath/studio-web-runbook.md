# UiPath Studio Web Runbook

## Goal

Use UiPath as the orchestration layer for AgentGuard CI reliability checks. Studio Web or a UiPath process can run scenario commands, collect generated JUnit/Markdown reports, and expose the results in Test Cloud.

## Prerequisites

1. Join UiPath AgentHack on Devpost.
2. Request UiPath Labs access through the competition access form.
3. Provision a Windows or Linux runner with Node.js 24+ and Git.
4. Clone this repository.
5. Run `npm install`.
6. Run `npm run build`.

## Process Outline

1. Start AgentGuard reliability run.
2. For each scenario id, execute:

   ```bash
   npm run agentguard:scenario -- --scenario <scenario-id>
   ```

3. Upload or attach:
   - `agentguard-runs/<scenario-id>/junit.xml`
   - `agentguard-runs/<scenario-id>/report.md`
   - `agentguard-runs/<scenario-id>/report.json`
   - `agentguard-runs/<scenario-id>/test-cloud-evidence.json`
4. Route failed governance scenarios to a human reviewer.
5. Store final approval status with the test run.

## Suggested UiPath Activities

- Use a command-line execution activity to invoke npm commands.
- Use file activities to collect report artifacts.
- Use Test Cloud to track the four test cases in `uipath/test-cloud-import.csv`.
- Use `test-cloud-evidence.json` as the structured evidence packet for gate status, attachments, and recommended action.
- Use an approval step when AgentGuard reports `Passed: false` for a governance scenario.

## Demo Notes

In the video, show:

1. Test Cloud matrix with the four cases.
2. A scenario run for `frontend-contract`.
3. The Markdown reliability report.
4. The `test-cloud-evidence.json` packet that Test Cloud can attach to the run.
5. A governance failure such as `unsafe-diff-guard`.
6. Human approval routing for unsafe agent behavior.
