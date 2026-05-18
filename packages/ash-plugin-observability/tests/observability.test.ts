import { describe, expect, it } from "vitest";
import { createStdoutSink, formatAshEvent, observability } from "../src/index.js";

describe("observability plugin", () => {
  it("formats expected event objects", () => {
    expect(
      formatAshEvent(
        {
          type: "tool.completed",
          data: { toolName: "load_role_rubric" },
          meta: { at: "2026-05-18T10:00:00.000Z" },
        },
        {
          agentName: "cv-review-agent",
          channelKind: "http",
          sessionId: "session-1",
        },
      ),
    ).toEqual({
      agent: "cv-review-agent",
      channel: "http",
      sessionId: "session-1",
      type: "tool.completed",
      at: "2026-05-18T10:00:00.000Z",
      data: { toolName: "load_role_rubric" },
    });
  });

  it("logs JSON lines through the stdout sink", () => {
    const writes: string[] = [];
    const sink = createStdoutSink((line) => writes.push(line));

    sink.write({
      agent: "lead-enrichment-agent",
      channel: "http",
      sessionId: "session-2",
      type: "session.completed",
      at: "2026-05-18T10:05:00.000Z",
      data: { ok: true },
    });

    expect(writes).toEqual([
      '{"agent":"lead-enrichment-agent","channel":"http","sessionId":"session-2","type":"session.completed","at":"2026-05-18T10:05:00.000Z","data":{"ok":true}}',
    ]);
  });

  it("returns an Ash plugin factory result", () => {
    expect(observability({ sink: "stdout" })).toBeDefined();
  });
});
