// Use case: Get available AI models

import type { AssistantModel } from "../../../domain/assistant/models/model";
import type { AssistantModelRepository } from "../../../domain/assistant/models/repository";

export class GetModelsUseCase {
    constructor(private readonly repository: AssistantModelRepository) {}

    async execute(): Promise<AssistantModel[]> {
        return this.repository.getAvailableModels();
    }
}
