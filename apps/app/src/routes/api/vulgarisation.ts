import { createFileRoute } from "@tanstack/react-router";
import { toAISdkStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";

import { mastra } from "@/lib/mastra";

export const Route = createFileRoute("/api/vulgarisation")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json();
        const agent = mastra.getAgent("vulgarisationAgent");
        const stream = await agent.stream(messages);

        return createUIMessageStreamResponse({
          stream: toAISdkStream(stream, { from: "agent", version: "v6" }),
        });
      },
    },
  },
});
