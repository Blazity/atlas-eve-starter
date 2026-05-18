import { defineChannel, GET, POST } from "experimental-ash/channels";
import { z } from "zod";

const enrichRequestSchema = z.object({
  leadId: z.string().default("lead-a"),
  message: z.string().optional(),
  token: z.string().optional(),
});

type EnrichRequest = z.infer<typeof enrichRequestSchema>;

function toNdjsonStream<T>(stream: ReadableStream<T>) {
  const encoder = new TextEncoder();

  return stream.pipeThrough(
    new TransformStream<T, Uint8Array>({
      transform(event, controller) {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      },
    }),
  );
}

async function parseEnrichRequest(req: Request): Promise<
  | {
      readonly ok: true;
      readonly value: EnrichRequest;
    }
  | {
      readonly ok: false;
      readonly response: Response;
    }
> {
  const body = await readJsonBody(req);

  if (!body.ok) return body;

  const parsed = enrichRequestSchema.safeParse(body.value);

  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        { error: "Invalid enrichment request body.", issues: parsed.error.issues },
        { status: 400 },
      ),
    };
  }

  return { ok: true, value: parsed.data };
}

async function readJsonBody(req: Request): Promise<
  | {
      readonly ok: true;
      readonly value: unknown;
    }
  | {
      readonly ok: false;
      readonly response: Response;
    }
> {
  const text = await req.text();

  if (text.trim().length === 0) return { ok: true, value: {} };

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Request body must be valid JSON." }, { status: 400 }),
    };
  }
}

export default defineChannel({
  kindHint: "http",
  routes: [
    POST("/enrich", async (req, { send }) => {
      const request = await parseEnrichRequest(req);

      if (!request.ok) return request.response;

      const body = request.value;
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

      return new Response(toNdjsonStream(stream), {
        headers: {
          "content-type": "application/x-ndjson",
        },
      });
    }),
  ],
});
