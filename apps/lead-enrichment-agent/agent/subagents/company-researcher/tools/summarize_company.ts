import { defineTool } from "experimental-ash/tools";
import { z } from "zod";

export default defineTool({
  description: "Summarize a synthetic company fixture into factual bullets.",
  inputSchema: z.object({
    leadContent: z.string(),
  }),
  execute({ leadContent }) {
    const bullets = leadContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, ""));

    return { bullets };
  },
});
