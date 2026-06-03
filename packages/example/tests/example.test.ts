import { describe, expect, it } from "vitest";

import { exampleRequestSchema, exampleResponseSchema } from "../src/index.js";

describe("example contracts", () => {
  it("normalizes an example request", () => {
    const request = exampleRequestSchema.parse({ message: " hello " });

    expect(request.message).toBe("hello");
  });

  it("accepts the example response shape", () => {
    const response = exampleResponseSchema.parse({
      echoedMessage: "hello",
      messageLength: 5,
    });

    expect(response).toEqual({
      echoedMessage: "hello",
      messageLength: 5,
    });
  });
});
