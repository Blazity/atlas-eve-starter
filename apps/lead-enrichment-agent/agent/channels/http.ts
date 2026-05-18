import { defineChannel, GET, POST } from "experimental-ash/channels";
import { z } from "zod";

const enrichRequestSchema = z.object({
  leadId: z.string().default("lead-a"),
  message: z.string().optional(),
  token: z.string().optional(),
});

export default defineChannel({
  kindHint: "http",
  routes: [
    POST("/enrich", async (req, { send }) => {
      const body = enrichRequestSchema.parse(await req.json().catch(() => ({})));
      const prompt =
        body.message ??
        `Enrich synthetic lead "${body.leadId}" using explicit shared company context and produce a fit score.`;
      const session = await send(prompt, {
        auth: null,
        continuationToken: body.token ?? `lead-enrichment:${body.leadId}`,
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
