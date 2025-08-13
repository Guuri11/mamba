// Infrastructure: In-memory available models for assistant

import type { AssistantModel } from "../../domain/assistant/models/model";
import type { AssistantModelRepository } from "../../domain/assistant/models/repository";

const MODELS: AssistantModel[] = [
    { id: "gpt-5", name: "GPT-5" },
    { id: "gpt-5-mini", name: "GPT-5 Mini" },
    { id: "gpt-5-nano", name: "GPT-5 Nano" },
    { id: "gpt-4.1", name: "GPT-4.1" },
    { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
    { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
];

export class InMemoryAssistantModelRepository implements AssistantModelRepository {
    async getAvailableModels(): Promise<AssistantModel[]> {
        return MODELS;
    }
}

export const assistantModelRepository = new InMemoryAssistantModelRepository();
