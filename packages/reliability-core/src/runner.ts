import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { renderJsonReport, renderJUnitReport, renderMarkdownReport } from "./reports.js";
import { scoreScenarioRun } from "./scoring.js";
import type { ScenarioManifest } from "./scenario.js";
import type { CommandResult, ReliabilityScore, ScenarioRunResult } from "./types.js";

export interface FixRequest {
  scenarioId: string;
  failureLog: string;
}

export interface FixPlan {
  status: "proposed" | "refused";
  rootCause: string;
  changedFiles: string[];
  patchSummary: string;
  riskLevel: "low" | "medium" | "high";
}

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

function defaultPlanFix(_request: FixRequest): FixPlan {
  return {
    status: "refused",
    rootCause: "No agent planner was configured",
    changedFiles: [],
    patchSummary: "Provide a planFix adapter to run an agent.",
    riskLevel: "high"
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
  const planFix = options.planFix ?? defaultPlanFix;
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
