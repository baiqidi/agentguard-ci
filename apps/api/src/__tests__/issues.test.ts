import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { createIssueStore, createIssue, transitionIssue } from "../issues.js";

describe("issue service", () => {
  it("creates issues with normalized fields and an open status", () => {
    const issue = createIssue({
      title: "  Checkout throws 500  ",
      description: "Customers see a production error during checkout",
      reporter: "qa@example.com"
    });

    expect(issue).toMatchObject({
      title: "Checkout throws 500",
      priority: "high",
      status: "open",
      reporter: "qa@example.com"
    });
    expect(issue.id).toMatch(/^ISSUE-/);
    expect(issue.createdAt).toMatch(/T/);
  });

  it("triages security and urgent issues as critical", () => {
    const issue = createIssue({
      title: "Urgent security incident in auth flow",
      description: "Token leak in production",
      reporter: "secops@example.com"
    });

    expect(issue.priority).toBe("critical");
  });

  it("allows only forward status transitions", () => {
    const openIssue = createIssue({
      title: "API validation missing",
      description: "Need better 400s",
      reporter: "qa@example.com"
    });

    const triaged = transitionIssue(openIssue, "triaged");
    expect(triaged.status).toBe("triaged");
    expect(() => transitionIssue(triaged, "open")).toThrow("Invalid issue transition: triaged -> open");
  });
});

describe("issue API", () => {
  it("creates and lists issues over HTTP", async () => {
    const store = createIssueStore();
    const app = createApp(store);

    const createResponse = await request(app)
      .post("/issues")
      .send({
        title: "Production login is down",
        description: "All customers fail to login",
        reporter: "ops@example.com"
      })
      .expect(201);

    expect(createResponse.body.issue).toMatchObject({
      title: "Production login is down",
      priority: "high",
      status: "open"
    });

    const listResponse = await request(app).get("/issues").expect(200);
    expect(listResponse.body.issues).toHaveLength(1);
    expect(listResponse.body.issues[0].id).toBe(createResponse.body.issue.id);
  });
});

