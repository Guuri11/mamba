// Repository interface for available AI models

import type { AssistantModel } from "./model";

export interface AssistantModelRepository {
    getAvailableModels(): Promise<AssistantModel[]>;
}
