import { isCardElement } from "experimental-ash/channels/slack";
import { describe, expect, test } from "vitest";

import {
  buildReviewCompletedPost,
  createSlackAuth,
  formatSlackActionStatus,
  isSlackIngressAllowed,
} from "./slack-review.js";

describe("CV Slack review helpers", () => {
  test("allows Slack ingress when no allowlists are configured", () => {
    expect(
      isSlackIngressAllowed({
        channelId: "C123",
        teamId: "T123",
        allowedChannelIds: "",
        allowedTeamIds: "",
      }),
    ).toEqual({ ok: true });
  });

  test("rejects Slack ingress outside configured team and channel allowlists", () => {
    expect(
      isSlackIngressAllowed({
        channelId: "C999",
        teamId: "T999",
        allowedChannelIds: "C123,C456",
        allowedTeamIds: "T123",
      }),
    ).toEqual({
      ok: false,
      reason: "This Slack workspace is not allowed to use the CV review agent.",
    });

    expect(
      isSlackIngressAllowed({
        channelId: "C999",
        teamId: "T123",
        allowedChannelIds: "C123,C456",
        allowedTeamIds: "T123",
      }),
    ).toEqual({
      ok: false,
      reason: "This Slack channel is not allowed to use the CV review agent.",
    });
  });

  test("creates Slack auth with explicit surface and team attributes", () => {
    expect(
      createSlackAuth({
        channelId: "C123",
        surface: "mention",
        teamId: "T123",
        userId: "U123",
      }),
    ).toEqual({
      principalId: "U123",
      principalType: "user",
      authenticator: "slack",
      attributes: {
        channelId: "C123",
        surface: "mention",
        teamId: "T123",
      },
    });
  });

  test("formats Slack status text from requested runtime actions", () => {
    expect(
      formatSlackActionStatus([
        { kind: "tool-call", toolName: "load_role_rubric" },
        { kind: "subagent-call", subagentName: "compliance-reviewer" },
        { kind: "load-skill" },
      ]),
    ).toBe("Running load role rubric, compliance reviewer, loading skill...");
  });

  test("builds a visual completion card with fallback text", () => {
    const post = buildReviewCompletedPost(
      [
        "Recommendation: advance",
        "",
        "Evidence:",
        "- React delivery",
        "- TypeScript quality",
        "",
        "Risks:",
        "- Needs deeper architecture review",
      ].join("\n"),
    );

    expect(post.fallbackText).toBe("CV review complete.");
    expect(isCardElement(post.card)).toBe(true);
  });
});
