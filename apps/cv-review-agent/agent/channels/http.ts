import { defineChannel, GET, POST } from "experimental-ash/channels";
import { z } from "zod";

const reviewRequestSchema = z.object({
  candidateId: z.string().default("candidate-a"),
  roleId: z.string().default("frontend-engineer"),
  message: z.string().optional(),
  token: z.string().optional(),
});

type ReviewRequest = z.infer<typeof reviewRequestSchema>;

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

async function parseReviewRequest(req: Request): Promise<
  | {
      readonly ok: true;
      readonly value: ReviewRequest;
    }
  | {
      readonly ok: false;
      readonly response: Response;
    }
> {
  const body = await readJsonBody(req);

  if (!body.ok) return body;

  const parsed = reviewRequestSchema.safeParse(body.value);

  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        { error: "Invalid review request body.", issues: parsed.error.issues },
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
    POST("/review", async (req, { send }) => {
      const request = await parseReviewRequest(req);

      if (!request.ok) return request.response;

      const body = request.value;
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

      return new Response(toNdjsonStream(stream), {
        headers: {
          "content-type": "application/x-ndjson",
        },
      });
    }),
  ],
});
