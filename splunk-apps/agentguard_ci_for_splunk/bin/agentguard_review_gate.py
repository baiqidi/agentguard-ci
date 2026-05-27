#!/usr/bin/env python3
"""Generate a reviewable AgentGuard evidence envelope from a Splunk alert payload."""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _read_payload(args: argparse.Namespace) -> dict[str, Any]:
    if args.payload_file:
        return json.loads(Path(args.payload_file).read_text(encoding="utf-8"))
    raw = os.sys.stdin.read().strip()
    if not raw:
        raise ValueError("Expected JSON payload from stdin or --payload-file.")
    return json.loads(raw)


def _normalize_required_evidence(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if value is None:
        return []
    return [item.strip() for item in str(value).split(",") if item.strip()]


def _pick_result(payload: dict[str, Any]) -> dict[str, Any]:
    if isinstance(payload.get("result"), dict):
        return payload["result"]
    if isinstance(payload.get("results"), list) and payload["results"]:
        first = payload["results"][0]
        if isinstance(first, dict):
            return first
    return {}


def _resolve_output_path(args: argparse.Namespace, payload: dict[str, Any]) -> str | None:
    configuration = payload.get("configuration", {})
    for candidate in (
        args.output,
        configuration.get("output_path"),
        os.environ.get("AGENTGUARD_REVIEW_OUTPUT"),
    ):
        if candidate:
            return os.path.expandvars(str(candidate))
    return None


def build_review_envelope(payload: dict[str, Any]) -> dict[str, Any]:
    configuration = payload.get("configuration", {})
    result = _pick_result(payload)
    required_evidence = _normalize_required_evidence(configuration.get("required_evidence"))
    missing_evidence = [
        evidence
        for evidence in required_evidence
        if evidence.replace("-", "_") not in {str(key).replace("-", "_") for key in result.keys()}
    ]
    review_status = "ready_for_review" if not missing_evidence else "needs_review"

    return {
        "reviewId": payload.get("sid") or payload.get("search_name") or "splunk-review-envelope",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": {
          "surface": "splunk-alert-action",
          "app": "agentguard_ci_for_splunk",
          "searchName": payload.get("search_name"),
          "sid": payload.get("sid"),
          "sourceSurface": result.get("source_surface", "splunk_mcp"),
        },
        "reviewOwner": configuration.get("review_owner") or result.get("review_owner") or "Security Review",
        "riskLabel": configuration.get("risk_label", "splunk-risk"),
        "scenarioId": result.get("scenario_id"),
        "action": result.get("action"),
        "resultCount": payload.get("result_count", 1),
        "requiredEvidence": required_evidence,
        "missingEvidence": missing_evidence,
        "approvalRequired": str(result.get("approval_required", "")).lower() == "true",
        "evidence": {
            "alertId": result.get("alert_id"),
            "searchJobId": result.get("search_job_id"),
            "evidenceStatus": result.get("evidence_status"),
            "riskPoints": result.get("risk_points"),
        },
        "reviewStatus": review_status,
        "promoteRule": "Only promote when all required evidence is present and the named reviewer approves.",
        "rawPayload": payload,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--payload-file", help="Read alert payload JSON from a file instead of stdin.")
    parser.add_argument("--output", help="Where to write the generated review envelope JSON.")
    args = parser.parse_args()

    payload = _read_payload(args)
    envelope = build_review_envelope(payload)
    serialized = json.dumps(envelope, indent=2, ensure_ascii=False)

    output_path = _resolve_output_path(args, payload)
    if output_path:
        target = Path(output_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(serialized + "\n", encoding="utf-8")

    print(serialized)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
