import { UIMessage } from "ai";

export type AgentType = "vulgarisation" | "scheduling" | "followup";

export interface VulgarisationRequest {
  technicalText: string;
  reportId?: string;
}

export interface SchedulingRequest {
  request: string;
  appointmentId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface FollowupRequest {
  query: string;
  petId: string;
}

export interface AgentMessage extends UIMessage {
  data?: {
    reportId?: string;
    appointmentId?: string;
    petId?: string;
  };
}



