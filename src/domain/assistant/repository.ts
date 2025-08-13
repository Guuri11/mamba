// Repository interface for Assistant chat

import type { AssistantChat, AssistantMessage } from "./model";

export interface AssistantRepository {
    getChat(chatId: string): Promise<AssistantChat | null>;
    saveMessage(chatId: string, message: AssistantMessage): Promise<void>;
    getMessages(chatId: string): Promise<AssistantMessage[]>;
}
