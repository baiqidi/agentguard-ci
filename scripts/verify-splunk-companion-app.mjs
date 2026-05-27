import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const appRoot = join(root, "splunk-apps", "agentguard_ci_for_splunk");
const outputDir = join(root, "agentguard-runs", "splunk-app");
const envelopePath = join(outputDir, "agentguard-review-envelope.json");
const installSmokeDir = join(outputDir, "install-smoke");
const installSmokeReportPath = join(outputDir, "install-smoke-report.json");
const packagePath = join(outputDir, "agentguard_ci_for_splunk.tgz");
const checks = [];

function pass(name, detail = "") {
  checks.push({ status: "PASS", name, detail });
}

function fail(name, detail) {
  checks.push({ status: "FAIL", name, detail });
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
    ...options
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || result.stdout?.trim() || "Command failed.";
    throw new Error(`${command} ${args.join(" ")} -> ${stderr}`);
  }

  return result.stdout?.trim() ?? "";
}

const requiredFiles = [
  "splunk-apps/agentguard_ci_for_splunk/default/app.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/savedsearches.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/alert_actions.conf",
  "splunk-apps/agentguard_ci_for_splunk/default/data/ui/views/agentguard_overview.xml",
  "splunk-apps/agentguard_ci_for_splunk/lookups/agentguard_ci_soc_demo.csv",
  "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py",
  "splunk-apps/agentguard_ci_for_splunk/README.md",
  "splunk-apps/agentguard_ci_for_splunk/README/alert_actions.conf.spec",
  "tools/splunk/fixtures/alert_payload.json",
  ".github/workflows/splunk-companion-app.yml"
];

for (const file of requiredFiles) {
  if (existsSync(join(root, file))) {
    pass(`file:${file}`);
  } else {
    fail(`file:${file}`, "Required Splunk companion-app asset is missing.");
  }
}

if (existsSync(join(root, ".github/workflows/splunk-companion-app.yml"))) {
  const workflow = read(".github/workflows/splunk-companion-app.yml");
  if (
    workflow.includes("actions/checkout@v4") &&
    workflow.includes("actions/setup-node@v4") &&
    workflow.includes("actions/setup-python@v5") &&
    workflow.includes("actions/upload-artifact@v4") &&
    workflow.includes('python-version: "3.12"') &&
    workflow.includes("splunk-appinspect") &&
    workflow.includes("splunk-packaging-toolkit")
  ) {
    pass("workflow:official-splunk-tools");
  } else {
    fail(
      "workflow:official-splunk-tools",
      "Workflow must use stable GitHub Actions, pin Python 3.12, and install Splunk AppInspect and Packaging Toolkit."
    );
  }
}

if (existsSync(join(appRoot, "default", "savedsearches.conf"))) {
  const savedSearches = read("splunk-apps/agentguard_ci_for_splunk/default/savedsearches.conf");
  if (savedSearches.includes("AGCI Suppression Review Gate") && savedSearches.includes("action.agentguard_review_gate = 1")) {
    pass("savedsearches:review-gate-alert");
  } else {
    fail("savedsearches:review-gate-alert", "Saved searches must wire the AgentGuard alert action.");
  }
}

if (existsSync(join(appRoot, "default", "alert_actions.conf"))) {
  const alertAction = read("splunk-apps/agentguard_ci_for_splunk/default/alert_actions.conf");
  if (alertAction.includes("payload_format = json") && alertAction.includes("alert.execute.cmd = agentguard_review_gate.py")) {
    pass("alert-action:json-python3");
  } else {
    fail("alert-action:json-python3", "Alert action must declare JSON payload delivery and the Python entry point.");
  }
}

mkdirSync(outputDir, { recursive: true });
rmSync(envelopePath, { force: true });

try {
  run("python", [
    "splunk-apps/agentguard_ci_for_splunk/bin/agentguard_review_gate.py",
    "--payload-file",
    "tools/splunk/fixtures/alert_payload.json",
    "--output",
    envelopePath
  ]);
  pass("alert-action:executed", "Fixture payload converted into a review envelope.");
} catch (error) {
  fail("alert-action:executed", error instanceof Error ? error.message : String(error));
}

if (existsSync(envelopePath)) {
  const envelope = JSON.parse(readFileSync(envelopePath, "utf8"));
  if (
    envelope.reviewStatus === "needs_review" &&
    envelope.reviewOwner === "Security Review" &&
    envelope.requiredEvidence?.length === 3 &&
    envelope.missingEvidence?.includes("alert-sample")
  ) {
    pass("alert-action:envelope-shape", "Review envelope captures missing evidence and named owner routing.");
  } else {
    fail("alert-action:envelope-shape", "Unexpected review envelope contents.");
  }
}

try {
  run("python", [
    "-c",
    [
      "import tarfile, pathlib",
      `root = pathlib.Path(r'''${root.replace(/\\/g, "\\\\")}''')`,
      "app_dir = root / 'splunk-apps' / 'agentguard_ci_for_splunk'",
      "package_path = root / 'agentguard-runs' / 'splunk-app' / 'agentguard_ci_for_splunk.tgz'",
      "package_path.parent.mkdir(parents=True, exist_ok=True)",
      "archive = tarfile.open(package_path, 'w:gz')",
      "archive.add(app_dir, arcname='agentguard_ci_for_splunk')",
      "archive.close()",
      "print(package_path)"
    ].join("\n")
  ]);
  pass("package:tgz-built", "Packaged the companion app into a distributable tgz.");
} catch (error) {
  fail("package:tgz-built", error instanceof Error ? error.message : String(error));
}

if (existsSync(packagePath)) {
  pass("package:artifact-exists", packagePath);
} else {
  fail("package:artifact-exists", "Expected packaged app artifact is missing.");
}

rmSync(installSmokeDir, { force: true, recursive: true });
rmSync(installSmokeReportPath, { force: true });

try {
  run("python", [
    "-c",
    [
      "import configparser, json, pathlib, tarfile",
      `package_path = pathlib.Path(r'''${packagePath.replace(/\\/g, "\\\\")}''')`,
      `extract_dir = pathlib.Path(r'''${installSmokeDir.replace(/\\/g, "\\\\")}''')`,
      `report_path = pathlib.Path(r'''${installSmokeReportPath.replace(/\\/g, "\\\\")}''')`,
      "extract_dir.mkdir(parents=True, exist_ok=True)",
      "with tarfile.open(package_path, 'r:gz') as archive:",
      "    archive.extractall(extract_dir)",
      "app_dir = extract_dir / 'agentguard_ci_for_splunk'",
      "required = [",
      "    'default/app.conf',",
      "    'default/savedsearches.conf',",
      "    'default/alert_actions.conf',",
      "    'default/data/ui/views/agentguard_overview.xml',",
      "    'default/data/ui/nav/default.xml',",
      "    'lookups/agentguard_ci_soc_demo.csv',",
      "    'bin/agentguard_review_gate.py',",
      "    'README.md',",
      "    'README/alert_actions.conf.spec'",
      "]",
      "missing = [path for path in required if not (app_dir / path).exists()]",
      "parser = configparser.ConfigParser()",
      "parser.read(app_dir / 'default/app.conf', encoding='utf-8')",
      "savedsearches = (app_dir / 'default/savedsearches.conf').read_text(encoding='utf-8') if not missing else ''",
      "alert_actions = (app_dir / 'default/alert_actions.conf').read_text(encoding='utf-8') if not missing else ''",
      "report = {",
      "    'packagePath': str(package_path),",
      "    'extractDir': str(extract_dir),",
      "    'appId': parser.get('package', 'id', fallback=''),",
      "    'appName': parser.get('id', 'name', fallback=''),",
      "    'appVersion': parser.get('id', 'version', fallback=''),",
      "    'missingFiles': missing,",
      "    'savedSearchCount': savedsearches.count('[AGCI '),",
      "    'alertActionCommand': 'agentguard_review_gate.py' if 'alert.execute.cmd = agentguard_review_gate.py' in alert_actions else '',",
      "    'payloadFormat': 'json' if 'payload_format = json' in alert_actions else '',",
      "    'containsMacosArtifacts': any(part.name == '__MACOSX' for part in app_dir.rglob('*'))",
      "}",
      "report_path.write_text(json.dumps(report, indent=2), encoding='utf-8')",
      "if missing or report['appId'] != 'agentguard_ci_for_splunk' or report['savedSearchCount'] < 4 or not report['alertActionCommand'] or report['containsMacosArtifacts']:",
      "    raise SystemExit(json.dumps(report, ensure_ascii=False))"
    ].join("\n")
  ]);
  pass("package:clean-install-smoke", "Package extracts cleanly with expected Splunk app structure.");
} catch (error) {
  fail("package:clean-install-smoke", error instanceof Error ? error.message : String(error));
}

if (existsSync(installSmokeReportPath)) {
  const installReport = JSON.parse(readFileSync(installSmokeReportPath, "utf8"));
  if (
    installReport.appId === "agentguard_ci_for_splunk" &&
    installReport.missingFiles?.length === 0 &&
    installReport.savedSearchCount >= 4 &&
    installReport.alertActionCommand === "agentguard_review_gate.py" &&
    installReport.payloadFormat === "json"
  ) {
    pass("package:install-smoke-report", "Install report captures app id, saved searches, and alert action.");
  } else {
    fail("package:install-smoke-report", "Install smoke report is missing required validation details.");
  }
} else {
  fail("package:install-smoke-report", "Expected install smoke report is missing.");
}

const failures = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const suffix = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.status} ${check.name}${suffix}`);
}

if (failures.length > 0) {
  console.error(`\nSplunk companion app verification failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(`\nSplunk companion app verification passed: ${checks.length} checks.`);
