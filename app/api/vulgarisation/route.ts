import { mastra } from "@/lib/mastra";
import { toAISdkFormat } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const agent = mastra.getAgent("vulgarisationAgent");
  const stream = await agent.stream(messages);

  return createUIMessageStreamResponse({
    stream: toAISdkFormat(stream, { from: "agent" }),
  });
}
