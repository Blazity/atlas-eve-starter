import { defineChannel, GET, POST } from "experimental-ash/channels";
import { z } from "zod";

const reviewRequestSchema = z.object({
  candidateId: z.string().default("candidate-a"),
  roleId: z.string().default("frontend-engineer"),
  message: z.string().optional(),
  token: z.string().optional(),
});

export default defineChannel({
  kindHint: "http",
  routes: [
    POST("/review", async (req, { send }) => {
      const body = reviewRequestSchema.parse(await req.json().catch(() => ({})));
      const prompt =
        body.message ??
        `Review candidate "${body.candidateId}" for role "${body.roleId}". Use the rubric-backed path and return evidence, scorecard, risks, and limitations.`;
      const session = await send(prompt, {
        auth: null,
        continuationToken: body.token ?? `cv-review:${body.candidateId}:${body.roleId}`,
      });

      return Response.json({
        sessionId: session.id,
        continuationToken: session.continuationToken,
      });
    }),
    GET("/sessions/:sessionId/stream", async (_req, { getSession, params }) => {
      const sessionId = params.sessionId;

      if (sessionId === undefined) {
        return Response.json({ error: "Missing sessionId route parameter." }, { status: 400 });
      }

      const stream = await getSession(sessionId).getEventStream();

      return new Response(stream as unknown as ReadableStream<Uint8Array>, {
        headers: {
          "content-type": "application/x-ndjson",
        },
      });
    }),
  ],
});
