export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueStatus = "open" | "triaged" | "resolved";

export interface NewIssueInput {
  title: string;
  description: string;
  reporter: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  reporter: string;
  priority: IssuePriority;
  status: IssueStatus;
  createdAt: string;
}

export interface IssueStore {
  create(input: NewIssueInput): Issue;
  list(): Issue[];
  updateStatus(id: string, status: IssueStatus): Issue;
}

let nextIssueNumber = 1;

export function classifyPriority(input: Pick<NewIssueInput, "title" | "description">): IssuePriority {
  const haystack = `${input.title} ${input.description}`.toLowerCase();
  if (/\b(security|token leak|incident|breach)\b/.test(haystack)) {
    return "critical";
  }
  if (/\b(production|customers|checkout|login|500|down)\b/.test(haystack)) {
    return "high";
  }
  if (/\b(css|typo|copy|minor)\b/.test(haystack)) {
    return "low";
  }
  return "medium";
}

export function createIssue(input: NewIssueInput): Issue {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Issue title is required");
  }
  if (!input.reporter.trim()) {
    throw new Error("Issue reporter is required");
  }

  return {
    id: `ISSUE-${String(nextIssueNumber++).padStart(4, "0")}`,
    title,
    description: input.description.trim(),
    reporter: input.reporter.trim(),
    priority: classifyPriority(input),
    status: "open",
    createdAt: new Date().toISOString()
  };
}

export function transitionIssue(issue: Issue, nextStatus: IssueStatus): Issue {
  const allowed: Record<IssueStatus, IssueStatus[]> = {
    open: ["triaged", "resolved"],
    triaged: ["resolved"],
    resolved: []
  };

  if (!allowed[issue.status].includes(nextStatus)) {
    throw new Error(`Invalid issue transition: ${issue.status} -> ${nextStatus}`);
  }

  return { ...issue, status: nextStatus };
}

export function createIssueStore(): IssueStore {
  const issues = new Map<string, Issue>();

  return {
    create(input) {
      const issue = createIssue(input);
      issues.set(issue.id, issue);
      return issue;
    },
    list() {
      return [...issues.values()];
    },
    updateStatus(id, status) {
      const issue = issues.get(id);
      if (!issue) {
        throw new Error(`Issue not found: ${id}`);
      }
      const updated = transitionIssue(issue, status);
      issues.set(id, updated);
      return updated;
    }
  };
}

