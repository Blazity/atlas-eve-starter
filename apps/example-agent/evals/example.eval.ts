import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Domain-neutral smoke coverage for the example echo agent.",
  async test(t) {
    await t.send("Echo the message: hello");

    t.completed();
    t.calledTool("echo");
    t.check(t.reply, includes("hello"));
  },
});
