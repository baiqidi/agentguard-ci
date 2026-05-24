import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { planScriptedFix, type FixPlan, type FixRequest } from "@agentguard/codefix-agent";
import { renderJsonReport, renderJUnitReport, renderMarkdownReport } from "./reports.js";
import { scoreScenarioRun } from "./scoring.js";
import type { ScenarioManifest } from "./scenario.js";
import type { CommandResult, ReliabilityScore, ScenarioRunResult } from "./types.js";

export interface ReportPaths {
  json: string;
  junit: string;
  markdown: string;
}

export interface ScenarioExecutionResult {
  score: ReliabilityScore;
  reportPaths: ReportPaths;
  runResult: ScenarioRunResult;
}

export interface RunScenarioOptions {
  cwd: string;
  outputDir: string;
  planFix?: (request: FixRequest) => FixPlan;
  runCommand?: (command: string, cwd: string) => Promise<CommandResult>;
}

async function defaultRunCommand(command: string, cwd: string): Promise<CommandResult> {
  const result = await execa(command, { cwd, shell: true, reject: false });
  return {
    command,
    exitCode: result.exitCode ?? 1,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

async function writeReports(outputDir: string, score: ReliabilityScore): Promise<ReportPaths> {
  const scenarioDir = join(outputDir, score.scenarioId);
  await mkdir(scenarioDir, { recursive: true });

  const paths: ReportPaths = {
    json: join(scenarioDir, "report.json"),
    junit: join(scenarioDir, "junit.xml"),
    markdown: join(scenarioDir, "report.md")
  };

  await Promise.all([
    writeFile(paths.json, renderJsonReport(score)),
    writeFile(paths.junit, renderJUnitReport(score)),
    writeFile(paths.markdown, renderMarkdownReport(score))
  ]);

  return paths;
}

export async function runScenarioManifest(
  manifest: ScenarioManifest,
  options: RunScenarioOptions
): Promise<ScenarioExecutionResult> {
  const planFix = options.planFix ?? planScriptedFix;
  const runCommand = options.runCommand ?? defaultRunCommand;
  const fixPlan = planFix({ scenarioId: manifest.id, failureLog: manifest.failureLog });
  const commandResults = await Promise.all(
    manifest.requiredCommands.map((command) => runCommand(command, options.cwd))
  );

  const runResult: ScenarioRunResult = {
    scenarioId: manifest.id,
    commandResults,
    changedFiles: fixPlan.changedFiles,
    deletedFiles: manifest.simulatedDeletedFiles ?? [],
    weakenedTestFiles: manifest.simulatedWeakenedTestFiles ?? [],
    agentExplanation: fixPlan.rootCause
  };
  const score = scoreScenarioRun(manifest, runResult);
  const reportPaths = await writeReports(options.outputDir, score);

  return { score, reportPaths, runResult };
}

