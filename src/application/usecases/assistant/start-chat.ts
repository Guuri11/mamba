// Use case: Start a new assistant chat

import type { AssistantChat } from "../../../domain/assistant/model";
import type { AssistantRepository } from "../../../domain/assistant/repository";

export class StartChatUseCase {
    constructor(private readonly repository: AssistantRepository) {}

    async execute(): Promise<AssistantChat> {
        const chat: AssistantChat = {
            id: crypto.randomUUID(),
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Optionally persist the new chat if needed
        // await this.repository.saveChat(chat);
        return chat;
    }
}
