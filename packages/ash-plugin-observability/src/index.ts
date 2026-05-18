import { ContextKey } from "experimental-ash/context";
import { defineHook } from "experimental-ash/hooks";

export interface AshEventLike {
  readonly type: string;
  readonly data?: unknown;
  readonly meta?: {
    readonly at?: string;
  };
}

export interface EventContextLike {
  readonly agentName: string;
  readonly channelKind: string | undefined;
  readonly sessionId: string;
}

export interface ObservabilityEvent {
  readonly agent: string;
  readonly channel: string;
  readonly sessionId: string;
  readonly type: string;
  readonly at: string;
  readonly data?: unknown;
}

export interface ObservabilitySink {
  write(event: ObservabilityEvent): void | Promise<void>;
}

export interface ObservabilityOptions {
  readonly sink: "stdout" | ObservabilitySink;
}

export const ObservabilitySinkKey = new ContextKey<ObservabilitySink>(
  "@blazity/ash-plugin-observability.sink",
);

export function formatAshEvent(event: AshEventLike, ctx: EventContextLike): ObservabilityEvent {
  return {
    agent: ctx.agentName,
    channel: ctx.channelKind ?? "unknown",
    sessionId: ctx.sessionId,
    type: event.type,
    at: event.meta?.at ?? new Date().toISOString(),
    ...(event.data === undefined ? {} : { data: event.data }),
  };
}

export function createStdoutSink(
  writeLine: (line: string) => void = console.log,
): ObservabilitySink {
  return {
    write(event) {
      writeLine(JSON.stringify(event));
    },
  };
}

export function resolveSink(options: ObservabilityOptions): ObservabilitySink {
  return options.sink === "stdout" ? createStdoutSink() : options.sink;
}

export function createObservabilityHook(options: ObservabilityOptions) {
  const sink = resolveSink(options);

  return defineHook({
    lifecycle: {
      session(_input, ctx) {
        ctx.ash.set(ObservabilitySinkKey, sink);
      },
    },
    events: {
      async "*"(event, ctx) {
        const currentSink = ctx.ash.get(ObservabilitySinkKey) ?? sink;

        await currentSink.write(
          formatAshEvent(event, {
            agentName: ctx.agent.name,
            channelKind: ctx.channel.kind,
            sessionId: ctx.session.sessionId,
          }),
        );
      },
    },
  });
}

export function observability(options: ObservabilityOptions) {
  return {
    id: "@blazity/ash-plugin-observability",
    hooks: [createObservabilityHook(options)],
    contextKeys: [ObservabilitySinkKey],
  } as const;
}
