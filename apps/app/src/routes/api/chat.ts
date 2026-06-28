import { createFileRoute } from "@tanstack/react-router";
import { toAISdkStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";

import { buildContextPrompt, type AppContext } from "@/lib/ai/context-builder";
import { mastra } from "@/lib/mastra";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const { messages, context } = body as {
          messages: Array<{ role: string; content: string }>;
          context?: AppContext;
        };
        const agent = mastra.getAgent("unifiedAssistant");
        let enrichedMessages = messages;

        if (context) {
          const contextPrompt = buildContextPrompt(context);
          if (contextPrompt) {
            const hasSystemMessage =
              messages.length > 0 && messages[0].role === "system";

            enrichedMessages = hasSystemMessage
              ? [
                  {
                    ...messages[0],
                    content: `${messages[0].content}\n\n${contextPrompt}`,
                  },
                  ...messages.slice(1),
                ]
              : [{ role: "system", content: contextPrompt }, ...messages];
          }
        }

        const stream = await agent.stream(enrichedMessages as never);

        return createUIMessageStreamResponse({
          stream: toAISdkStream(stream, { from: "agent", version: "v6" }),
        });
      },
    },
  },
});
