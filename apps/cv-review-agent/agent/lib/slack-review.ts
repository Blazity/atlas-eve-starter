import {
  Actions,
  Button,
  Card,
  type CardElement,
  CardText,
  Divider,
  Field,
  Fields,
} from "experimental-ash/channels/slack";
import type { SessionAuthContext } from "experimental-ash/context";

export type SlackReviewSurface = "dm" | "mention";

export interface SlackIngressPolicy {
  readonly allowedChannelIds?: string | undefined;
  readonly allowedTeamIds?: string | undefined;
  readonly channelId: string;
  readonly teamId?: string | undefined;
}

export type SlackIngressDecision =
  | {
      readonly ok: true;
    }
  | {
      readonly ok: false;
      readonly reason: string;
    };

export interface SlackAuthInput {
  readonly channelId: string;
  readonly surface: SlackReviewSurface;
  readonly teamId?: string | undefined;
  readonly userId: string;
}

export interface SlackCardPost {
  readonly card: CardElement;
  readonly fallbackText: string;
}

export interface ReviewStartedPostInput {
  readonly requestMarkdown: string;
  readonly surface: SlackReviewSurface;
  readonly userId: string;
}

type SlackAction =
  | {
      readonly kind: "tool-call";
      readonly toolName: string;
    }
  | {
      readonly kind: "subagent-call";
      readonly subagentName: string;
    }
  | {
      readonly kind: "load-skill";
    };

const maxPreviewLength = 1_800;

export function isSlackIngressAllowed(policy: SlackIngressPolicy): SlackIngressDecision {
  const allowedTeamIds = parseCsvSet(policy.allowedTeamIds);

  if (allowedTeamIds.size > 0 && (!policy.teamId || !allowedTeamIds.has(policy.teamId))) {
    return {
      ok: false,
      reason: "This Slack workspace is not allowed to use the CV review agent.",
    };
  }

  const allowedChannelIds = parseCsvSet(policy.allowedChannelIds);

  if (allowedChannelIds.size > 0 && !allowedChannelIds.has(policy.channelId)) {
    return {
      ok: false,
      reason: "This Slack channel is not allowed to use the CV review agent.",
    };
  }

  return { ok: true };
}

export function createSlackAuth(input: SlackAuthInput): SessionAuthContext {
  return {
    principalId: input.userId,
    principalType: "user",
    authenticator: "slack",
    attributes: {
      channelId: input.channelId,
      surface: input.surface,
      teamId: input.teamId ?? "",
    },
  };
}

export function formatSlackActionStatus(actions: readonly SlackAction[]): string {
  if (actions.length === 0) return "Working on CV review...";

  const labels = actions.map((action) => {
    if (action.kind === "tool-call") return humanizeActionName(action.toolName);
    if (action.kind === "subagent-call") return humanizeActionName(action.subagentName);

    return "loading skill";
  });

  return `Running ${labels.join(", ")}...`;
}

export function buildReviewStartedPost(input: ReviewStartedPostInput): SlackCardPost {
  return {
    fallbackText: "CV review started.",
    card: Card({
      title: "CV review started",
      subtitle: "Rubric-backed candidate assessment",
      children: [
        Fields([
          Field({ label: "Requested by", value: `<@${input.userId}>` }),
          Field({
            label: "Surface",
            value: input.surface === "dm" ? "Direct message" : "Channel mention",
          }),
        ]),
        Divider(),
        CardText(compactPreview(input.requestMarkdown)),
      ],
    }),
  };
}

export function buildReviewCompletedPost(message: string): SlackCardPost {
  return {
    fallbackText: "CV review complete.",
    card: Card({
      title: "CV review complete",
      subtitle: "Evidence, scorecard, risks, and limitations",
      children: [
        CardText(compactPreview(message)),
        Divider(),
        Actions([
          Button({
            id: "cv_review:request_deeper_review",
            label: "Request deeper review",
            style: "primary",
            value: "request_deeper_review",
          }),
        ]),
      ],
    }),
  };
}

export function buildReviewFailedPost(): SlackCardPost {
  return {
    fallbackText: "CV review failed.",
    card: Card({
      title: "CV review failed",
      subtitle: "The agent could not complete this request",
      children: [
        CardText(
          "Check that the request includes a valid candidate id and role id, then try again in this thread.",
        ),
      ],
    }),
  };
}

export function buildAccessDeniedPost(reason: string): SlackCardPost {
  return {
    fallbackText: "CV review request denied.",
    card: Card({
      title: "CV review request denied",
      subtitle: "Workspace or channel access policy blocked this request",
      children: [CardText(reason)],
    }),
  };
}

export function buildInteractionHelpPost(): SlackCardPost {
  return {
    fallbackText: "Reply in the thread with the follow-up you want reviewed.",
    card: Card({
      title: "Ask a follow-up",
      subtitle: "Continue in this Slack thread",
      children: [
        CardText(
          "Reply in this thread with the exact follow-up you want reviewed. The existing Ash session will continue from the same Slack thread.",
        ),
      ],
    }),
  };
}

function parseCsvSet(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
}

function humanizeActionName(value: string): string {
  return value.replace(/[_-]+/g, " ");
}

function compactPreview(value: string): string {
  const trimmed = value.trim();

  if (trimmed.length <= maxPreviewLength) return trimmed;

  return `${trimmed.slice(0, maxPreviewLength - 1).trimEnd()}...`;
}
