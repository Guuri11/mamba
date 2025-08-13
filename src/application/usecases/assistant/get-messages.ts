// Use case: Get messages for an assistant chat

import type { AssistantMessage } from "../../../domain/assistant/model";
import type { AssistantRepository } from "../../../domain/assistant/repository";

export interface GetMessagesInput {
    chatId: string;
}

export class GetMessagesUseCase {
    constructor(private readonly repository: AssistantRepository) {}

    async execute(input: GetMessagesInput): Promise<AssistantMessage[]> {
        return this.repository.getMessages(input.chatId);
    }
}
