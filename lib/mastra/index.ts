import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { unifiedAssistant } from "./agents/unified-assistant";
import { vulgarisationAgent } from "./agents/vulgarisation-agent";
import { searchAgent } from "./agents/search-agent";
import { creatorAgent } from "./agents/creator-agent";
import { resumeAgent } from "./agents/resume-agent";
import { analyseAgent } from "./agents/analyse-agent";
import { scheduleAgent } from "./agents/schedule-agent";
import { tasksAgent } from "./agents/tasks-agent";

export const mastra = new Mastra({
  agents: {
    unifiedAssistant,
    vulgarisationAgent,
    searchAgent,
    creatorAgent,
    resumeAgent,
    analyseAgent,
    scheduleAgent,
    tasksAgent,
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    default: { enabled: false },
  },
});
