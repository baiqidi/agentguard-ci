export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueStatus = "open" | "triaged" | "resolved";

export interface IssueSummary {
  id: string;
  title: string;
  priority: IssuePriority;
  status: IssueStatus;
}

export type PriorityTone = "quiet" | "neutral" | "warning" | "danger";

export function formatIssueLabel(issue: IssueSummary): string {
  return `${issue.id} [${issue.priority.toUpperCase()}] ${issue.title}`;
}

export function priorityTone(priority: IssuePriority): PriorityTone {
  const tones: Record<IssuePriority, PriorityTone> = {
    low: "quiet",
    medium: "neutral",
    high: "warning",
    critical: "danger"
  };
  return tones[priority];
}

export function summarizeIssue(issue: IssueSummary): string {
  return `${issue.id} is ${issue.status} with ${issue.priority} priority`;
}

