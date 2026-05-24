import { describe, expect, it } from "vitest";
import { formatIssueLabel, priorityTone, summarizeIssue } from "../issueModel.js";

describe("issue model helpers", () => {
  it("formats issue labels with id, priority, and title", () => {
    expect(
      formatIssueLabel({
        id: "ISSUE-0042",
        title: "Checkout throws 500",
        priority: "high",
        status: "open"
      })
    ).toBe("ISSUE-0042 [HIGH] Checkout throws 500");
  });

  it("maps priorities to stable visual tones", () => {
    expect(priorityTone("critical")).toBe("danger");
    expect(priorityTone("high")).toBe("warning");
    expect(priorityTone("medium")).toBe("neutral");
    expect(priorityTone("low")).toBe("quiet");
  });

  it("summarizes triaged issues for the dashboard", () => {
    expect(
      summarizeIssue({
        id: "ISSUE-0007",
        title: "Auth token leak",
        priority: "critical",
        status: "triaged"
      })
    ).toBe("ISSUE-0007 is triaged with critical priority");
  });
});

