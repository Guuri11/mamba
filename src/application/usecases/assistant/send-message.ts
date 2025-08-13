// Use case: Send a message in the assistant chat

import { ASSISTANT_ERRORS, AssistantError } from "../../../domain/assistant/errors";
import type { AssistantMessage, AssistantMessageRole } from "../../../domain/assistant/model";
import type { AssistantRepository } from "../../../domain/assistant/repository";
import { MessageContent } from "../../../domain/assistant/value-objects";

export interface SendMessageInput {
    chatId: string;
    content: string;
    role: AssistantMessageRole;
}

export class SendMessageUseCase {
    constructor(private readonly repository: AssistantRepository) {}

    async execute(input: SendMessageInput): Promise<AssistantMessage> {
        if (!input.content || input.content.trim().length === 0) {
            throw new AssistantError(ASSISTANT_ERRORS.MESSAGE_CONTENT_EMPTY);
        }
        if (input.role !== "user" && input.role !== "assistant") {
            throw new AssistantError(ASSISTANT_ERRORS.INVALID_ROLE);
        }
        const message: AssistantMessage = {
            id: crypto.randomUUID(),
            role: input.role,
            content: new MessageContent(input.content).getValue(),
            createdAt: new Date(),
        };
        await this.repository.saveMessage(input.chatId, message);
        return message;
    }
}
