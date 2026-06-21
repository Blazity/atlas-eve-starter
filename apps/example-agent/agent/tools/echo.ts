import { type ExampleRequest, type ExampleResponse, exampleRequestSchema } from "@repo/example";
import { defineTool } from "eve/tools";

export function createEchoResponse(request: ExampleRequest): ExampleResponse {
  return {
    echoedMessage: request.message,
    messageLength: request.message.length,
  };
}

export default defineTool({
  description: "Echo a non-empty message using the shared example request and response contracts.",
  inputSchema: exampleRequestSchema,
  execute(input) {
    return createEchoResponse(input);
  },
});
