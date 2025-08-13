// Domain model for Assistant chat

export type AssistantMessageRole = "user" | "assistant";

export interface AssistantMessage {
    id: string;
    role: AssistantMessageRole;
    content: string;
    createdAt: Date;
}

export interface AssistantChat {
    id: string;
    messages: AssistantMessage[];
    createdAt: Date;
    updatedAt: Date;
}
