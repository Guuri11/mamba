// AI integration adapter for ChatGPT

import OpenAI from "openai";

import type { AssistantMessage } from "../../domain/assistant/model";

export interface AssistantAIAdapter {
    generateResponse(messages: AssistantMessage[], model: string): Promise<AssistantMessage>;
}

export class ChatGPTAdapter implements AssistantAIAdapter {
    private readonly client = new OpenAI({
        dangerouslyAllowBrowser: true,
    });

    constructor() {}

    async generateResponse(messages: AssistantMessage[], model: string): Promise<AssistantMessage> {
        // Map domain messages to OpenAI format
        const openAIMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Call OpenAI Chat Completions API
        const response = await this.client.chat.completions.create({
            model,
            messages: openAIMessages,
        });

        const aiMessage = response.choices?.[0]?.message;
        return {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiMessage?.content ?? "",
            createdAt: new Date(),
        };
    }
}
