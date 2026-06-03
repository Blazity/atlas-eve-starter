import { randomUUID } from "node:crypto";

import { exampleRequestSchema } from "@repo/example";
import { defineChannel, POST } from "experimental-ash/channels";

export default defineChannel({
  kindHint: "http",
  routes: [
    POST("/echo", async (req, { send }) => {
      const body = await req.json().catch(() => ({}));
      const parsed = exampleRequestSchema.safeParse(body);

      if (!parsed.success) {
        return Response.json(
          { error: "Invalid example request.", issues: parsed.error.issues },
          { status: 400 },
        );
      }

      const session = await send(`Echo this message with the echo tool: ${parsed.data.message}`, {
        auth: null,
        continuationToken: `example-agent:echo:${randomUUID()}`,
      });

      return Response.json({
        sessionId: session.id,
        continuationToken: session.continuationToken,
      });
    }),
  ],
});
