import { z } from "zod";

export const exampleRequestSchema = z.object({
  message: z.string().trim().min(1, "Message must not be empty."),
});

export type ExampleRequest = z.infer<typeof exampleRequestSchema>;

export const exampleResponseSchema = z.object({
  echoedMessage: z.string(),
  messageLength: z.number().int().nonnegative(),
});

export type ExampleResponse = z.infer<typeof exampleResponseSchema>;
