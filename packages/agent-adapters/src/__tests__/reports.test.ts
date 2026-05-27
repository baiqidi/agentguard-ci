import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { adapterScenarios } from "../scenarios.js";
import { scoreAdapterScenario } from "../scoring.js";
import {
  renderAdapterMarkdownReport,
  renderAdapterTestCloudEvidence,
  writeAdapterScenarioReports,
  writeAdapterSuiteReports
} from "../reports.js";

let tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
  tempDirs = [];
});

describe("agent adapter reporting", () => {
  it("renders Test Cloud evidence for local non-code agent validation", () => {
    const scenario = adapterScenarios[0];
    const score = scoreAdapterScenario(scenario);
    const evidence = JSON.parse(renderAdapterTestCloudEvidence(scenario, score));

    expect(evidence).toMatchObject({
      sourceSystem: "AgentGuard Agent Adapters",
      targetPlatform: "UiPath Test Cloud",
      scenarioId: "browser-payment-approval",
      agentType: "browser-rpa",
      validationMode: "live-local",
      decision: "review",
      status: "failed",
      recommendedAction: "Route to human review before external execution"
    });
    expect(evidence.method.strategy).toBe("universal-agent-reliability-gates");
    expect(evidence.attachments).toEqual([
      "report.json",
      "report.md",
      "junit.xml",
      "test-cloud-evidence.json"
    ]);
  });

  it("renders Splunk evidence for local non-code agent validation when contest mode is set", () => {
    process.env.AGENTGUARD_CONTEST = "splunk";

    try {
      const scenario = adapterScenarios[0];
      const score = scoreAdapterScenario(scenario);
      const evidence = JSON.parse(renderAdapterTestCloudEvidence(scenario, score));

      expect(evidence.targetPlatform).toBe("Splunk MCP Server");
      expect(evidence.attachments).toEqual([
        "report.json",
        "report.md",
        "junit.xml",
        "splunk-mcp-evidence.json"
      ]);
    } finally {
      delete process.env.AGENTGUARD_CONTEST;
    }
  });

  it("embeds Splunk integration context inside SOC evidence packets", () => {
    const scenario = adapterScenarios[9];
    const score = scoreAdapterScenario(scenario);
    const evidence = JSON.parse(renderAdapterTestCloudEvidence(scenario, score));

    expect(evidence.integrationContext).toEqual({
      platform: "Splunk MCP Server",
      connector: "mcp_tool_execute capability",
      tools: ["splunk_run_query", "splunk_get_knowledge_objects", "saia_generate_spl"],
      observedObjects: ["notable event AG-77", "IOC packet capture", "containment approval route"],
      decisionFocus: "Allow the agent to investigate, but keep network enforcement behind incident commander approval."
    });
  });

  it("writes single-scenario reports into an installable evidence folder", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-adapters-"));
    tempDirs.push(outputDir);

    const scenario = adapterScenarios[2];
    const score = scoreAdapterScenario(scenario);
    const paths = await writeAdapterScenarioReports(scenario, score, outputDir);

    expect(paths.markdown).toBe(join(outputDir, "support-refund-escalation", "report.md"));
    await expect(readFile(paths.json, "utf8")).resolves.toContain('"agentType": "customer-support"');
    await expect(readFile(paths.junit, "utf8")).resolves.toContain('<testsuite name="AgentGuard Agent Adapters"');
    await expect(readFile(paths.testCloudEvidence, "utf8")).resolves.toContain('"validationMode": "live-local"');
  });

  it("writes a suite summary that names all covered agent categories", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "agentguard-adapters-"));
    tempDirs.push(outputDir);

    const paths = await writeAdapterSuiteReports(adapterScenarios, outputDir);
    const markdown = await readFile(paths.markdown, "utf8");
    const json = await readFile(paths.json, "utf8");

    expect(markdown).toContain("# AgentGuard Agent Adapter Suite");
    expect(markdown).toContain("| browser-rpa | REVIEW | 3/5 |");
    expect(markdown).toContain("| knowledge-retrieval | BLOCK | 4/5 |");
    expect(markdown).toContain("Decision mix: **0 promote / 9 review / 5 block**");
    expect(markdown).toContain("Gate pass rate: **64%**");
    expect(markdown).toContain("Security / SOC scenarios: **3**");
    expect(markdown).toContain("Splunk-integrated scenarios: **3**");
    expect(markdown).toContain("12 public frameworks checked across 22 scenario links");
    expect(json).toContain('"liveAgentTypes": 12');
    expect(json).toContain('"blockedScenarios": 5');
    expect(json).toContain('"splunkIntegratedScenarios": 3');
  });

  it("keeps Markdown reports judge-readable", () => {
    const report = renderAdapterMarkdownReport(adapterScenarios[4], scoreAdapterScenario(adapterScenarios[4]));

    expect(report).toContain("Document agent summarizes without source citations");
    expect(report).toContain("Decision: **REVIEW**");
    expect(report).toContain("| evidenceIntegrity | FAIL | Missing evidence: source-spans, citation-check |");
  });

  it("makes Splunk scenario reports explain the MCP integration context", () => {
    const report = renderAdapterMarkdownReport(adapterScenarios[11], scoreAdapterScenario(adapterScenarios[11]));

    expect(report).toContain("## Integration Context");
    expect(report).toContain("Platform: Splunk MCP Server");
    expect(report).toContain("Tools: saia_generate_spl, saia_optimize_spl, splunk_run_query, splunk_get_knowledge_objects");
  });
});
