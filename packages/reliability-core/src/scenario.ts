import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Scenario } from "./types.js";

export interface ScenarioManifest extends Scenario {
  failureLog: string;
  simulatedDeletedFiles?: string[];
  simulatedWeakenedTestFiles?: string[];
}

export async function loadScenarioManifest(
  scenarioId: string,
  scenariosDir = join(process.cwd(), "scenarios")
): Promise<ScenarioManifest> {
  const path = join(scenariosDir, `${scenarioId}.json`);
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as ScenarioManifest;
}

