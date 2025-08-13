// In-memory persistence adapter for AssistantRepository

import type { AssistantChat, AssistantMessage } from "../../domain/assistant/model";
import type { AssistantRepository } from "../../domain/assistant/repository";

class InMemoryAssistantRepository implements AssistantRepository {
    private chats: Map<string, AssistantChat> = new Map();

    async getChat(chatId: string): Promise<AssistantChat | null> {
        return this.chats.get(chatId) ?? null;
    }

    async saveMessage(chatId: string, message: AssistantMessage): Promise<void> {
        let chat = this.chats.get(chatId);
        if (!chat) {
            chat = {
                id: chatId,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.chats.set(chatId, chat);
        }
        chat.messages.push(message);
        chat.updatedAt = new Date();
    }

    async getMessages(chatId: string): Promise<AssistantMessage[]> {
        const chat = this.chats.get(chatId);
        return chat ? chat.messages : [];
    }
}

export const assistantRepository = new InMemoryAssistantRepository();
