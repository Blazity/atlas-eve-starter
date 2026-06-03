import { describe, expect, it } from "vitest";

import { createEchoResponse } from "../agent/tools/echo.js";

describe("createEchoResponse", () => {
  it("returns a deterministic echo response", () => {
    expect(createEchoResponse({ message: "hello" })).toEqual({
      echoedMessage: "hello",
      messageLength: 5,
    });
  });
});
