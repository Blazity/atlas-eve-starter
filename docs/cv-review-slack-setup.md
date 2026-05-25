# CV Review Slack Setup

This starter uses one Slack integration stack: Ash `slackChannel()` plus Vercel Connect.

The Slack channel lives at `apps/cv-review-agent/agent/channels/slack.ts`. It handles app mentions,
direct messages, Slack status indicators, completion cards, denied-access cards, and a follow-up
button that prompts the user to continue in the same thread.

## Why This Stack

- `slackChannel()` is the Ash-native transport.
- Vercel Connect stores and rotates the Slack bot token.
- Vercel Connect verifies inbound Slack webhooks with Vercel OIDC.
- Slack thread state maps cleanly to Ash continuation tokens.
- Status indicators and cards are authored through the Ash Slack channel API.

## Environment

Copy the app env example:

```bash
cp apps/cv-review-agent/.env.example apps/cv-review-agent/.env.local
```

Set:

```bash
OPENAI_API_KEY=...
VERCEL_CONNECT_SLACK_CLIENT_UID=slack/cv-review-agent
ALLOWED_SLACK_TEAM_IDS=
ALLOWED_SLACK_CHANNEL_IDS=
```

Use the exact Slack connector UID/key from Vercel Connect for
`VERCEL_CONNECT_SLACK_CLIENT_UID`. The value can be a human-readable UID such as
`slack/cv-review-agent` or an opaque `scl_...` key.

Leave the allowlists empty for a private demo workspace. Set them before real usage:

```bash
ALLOWED_SLACK_TEAM_IDS=T0123456789
ALLOWED_SLACK_CHANNEL_IDS=C0123456789,C9876543210
```

## Vercel Project

Create one Vercel project for the CV app.

Recommended monorepo settings:

- Root directory: `apps/cv-review-agent`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm ash:build`
- Node.js version: `24.x`

If your Vercel team prefers the repository root as the project root, use this build command instead:

```bash
pnpm --filter @blazity/cv-review-agent ash:build
```

After deployment, the Slack webhook route is:

```text
https://<your-cv-agent-domain>/ash/v1/slack
```

## Create The Slack Connector

Use the Vercel dashboard path unless your team has the Connect CLI allowlisted.

1. Open Vercel Dashboard.
2. Go to Connect.
3. Create a Slack client.
4. Install it into the target Slack workspace.
5. Copy the connector UID/key.
6. Set it as `VERCEL_CONNECT_SLACK_CLIENT_UID` on the CV Review Agent project.

Local CLI path, when enabled:

```bash
cd apps/cv-review-agent
vercel link
vercel env pull
export FF_CONNECT_ENABLED=1
vercel connect create slack
```

## Slack App Configuration

Use the deployed route for both Events and Interactivity:

```text
https://<your-cv-agent-domain>/ash/v1/slack
```

Bot token scopes:

```text
chat:write
app_mentions:read
```

For direct messages, also add:

```text
im:history
```

Slack status indicators are implemented through `ctx.thread.startTyping(...)`, which calls Slack's
assistant thread status API through Ash. Slack currently accepts `chat:write` for this method.

Subscribe to bot events:

```text
app_mention
message.im
```

`message.im` is only required if you want direct messages. Reinstall the Slack app after changing
scopes or event subscriptions.

## Test In Slack

Invite the bot to a private test channel:

```text
/invite @CV Review
```

Mention it:

```text
@CV Review review candidate-a for frontend-engineer. Return evidence, scorecard, risks, and limitations.
```

Expected flow:

1. The bot posts a "CV review started" card in the thread.
2. Slack shows status text such as "Reading CV review request" and "Running load role rubric".
3. The Ash agent loads the candidate profile and role rubric.
4. The final answer is posted as a "CV review complete" card.
5. The "Request deeper review" button returns an ephemeral instruction to continue in the same
   thread.

## Production Notes

- Keep real candidate data outside this repository.
- Replace synthetic candidate fixtures with deterministic ATS or storage tools before real usage.
- Use Slack allowlists before connecting a company workspace.
- Treat cards as the Slack presentation layer only; required CV review steps should stay in tools.
- Add persistent review state only when there is a real destination, such as ATS, Lever, Greenhouse,
  Ashby, Linear, or an internal database.

## Local Verification

Run:

```bash
pnpm --filter @blazity/cv-review-agent test -- agent/lib/slack-review.test.ts
pnpm --filter @blazity/cv-review-agent typecheck
pnpm --filter @blazity/cv-review-agent ash:build
```

End-to-end Slack verification requires a deployed Vercel project and a Vercel Connect Slack
connector. Local tests cover the channel helpers, cards, allowlists, and status text.
