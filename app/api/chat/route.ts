import { mastra } from "@/lib/mastra";
import { buildContextPrompt, type AppContext } from "@/lib/ai/context-builder";
import { toAISdkFormat } from "@mastra/ai-sdk"
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, context } = body as {
    messages: any[];
    context?: AppContext;
  };

  const myAgent = mastra.getAgent("unifiedAssistant");

  // Enrichir les messages avec le contexte si disponible
  let enrichedMessages = messages;
  if (context) {
    const contextPrompt = buildContextPrompt(context);
    if (contextPrompt) {
      // Ajouter le contexte comme message système au début (si pas déjà un message système)
      const hasSystemMessage = messages.length > 0 && messages[0].role === "system";

      if (hasSystemMessage) {
        // Enrichir le message système existant
        enrichedMessages = [
          {
            ...messages[0],
            content: `${messages[0].content}\n\n${contextPrompt}`,
          },
          ...messages.slice(1),
        ];
      } else {
        // Ajouter un nouveau message système au début
        enrichedMessages = [
          {
            role: "system",
            content: contextPrompt,
          },
          ...messages,
        ];
      }
    }
  }

  // Démarre le flux de l'agent (texte + tools)
  const agentStream = await myAgent.stream(enrichedMessages);

  return createUIMessageStreamResponse({
    stream: toAISdkFormat(agentStream, { from: "agent" }),
  })
}