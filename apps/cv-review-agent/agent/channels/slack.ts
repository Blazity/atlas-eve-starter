import { connectSlackCredentials } from "@vercel/connect/ash";
import type { SlackMessage } from "experimental-ash/channels/slack";
import { type SlackContext, slackChannel } from "experimental-ash/channels/slack";

import {
  buildAccessDeniedPost,
  buildInteractionHelpPost,
  buildReviewCompletedPost,
  buildReviewFailedPost,
  buildReviewStartedPost,
  createSlackAuth,
  formatSlackActionStatus,
  isSlackIngressAllowed,
  type SlackReviewSurface,
} from "../lib/slack-review.js";

const slackClientUid = process.env.VERCEL_CONNECT_SLACK_CLIENT_UID ?? "slack/cv-review-agent";

export default slackChannel({
  credentials: connectSlackCredentials(slackClientUid),

  async onAppMention(ctx, message) {
    return handleInboundMessage(ctx, message, "mention");
  },

  async onDirectMessage(ctx, message) {
    return handleInboundMessage(ctx, message, "dm");
  },

  async onInteraction(action, ctx) {
    if (action.actionId !== "cv_review:request_deeper_review") return;

    const post = buildInteractionHelpPost();
    await ctx.thread.postEphemeral(action.user.id, {
      card: post.card,
      fallbackText: post.fallbackText,
    });
  },

  events: {
    async "turn.started"(_event, ctx) {
      await ctx.thread.startTyping("Working on CV review...");
    },

    async "actions.requested"(event, ctx) {
      await ctx.thread.startTyping(formatSlackActionStatus(event.actions));
    },

    async "message.completed"(event, ctx) {
      if (event.finishReason === "tool-calls" || !event.message) return;

      const post = buildReviewCompletedPost(event.message);
      await ctx.thread.post({
        card: post.card,
        fallbackText: post.fallbackText,
      });
    },

    async "session.failed"(_event, ctx) {
      const post = buildReviewFailedPost();
      await ctx.thread.post({
        card: post.card,
        fallbackText: post.fallbackText,
      });
    },
  },
});

async function handleInboundMessage(
  ctx: SlackContext,
  message: SlackMessage,
  surface: SlackReviewSurface,
) {
  if (!message.author) return null;

  const ingress = isSlackIngressAllowed({
    channelId: message.channelId,
    teamId: message.teamId,
    allowedChannelIds: process.env.ALLOWED_SLACK_CHANNEL_IDS,
    allowedTeamIds: process.env.ALLOWED_SLACK_TEAM_IDS,
  });

  if (!ingress.ok) {
    const post = buildAccessDeniedPost(ingress.reason);
    await ctx.thread.postEphemeral(message.author.userId, {
      card: post.card,
      fallbackText: post.fallbackText,
    });
    return null;
  }

  await ctx.thread.startTyping("Reading CV review request...");

  const post = buildReviewStartedPost({
    requestMarkdown: message.markdown,
    surface,
    userId: message.author.userId,
  });
  await ctx.thread.post({
    card: post.card,
    fallbackText: post.fallbackText,
  });

  return {
    auth: createSlackAuth({
      channelId: message.channelId,
      surface,
      teamId: message.teamId,
      userId: message.author.userId,
    }),
  };
}
