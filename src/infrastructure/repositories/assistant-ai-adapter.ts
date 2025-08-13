// AI integration adapter for ChatGPT

import { invoke } from "@tauri-apps/api/core";
import OpenAI from "openai";

import type { AssistantMessage } from "../../domain/assistant/model";

export interface AssistantAIAdapter {
    generateResponse(messages: AssistantMessage[], model: string): Promise<AssistantMessage>;
}

export class ChatGPTAdapter implements AssistantAIAdapter {
    private client: OpenAI | null = null;
    private apiKeyPromise: Promise<string>;

    constructor() {
        // Fetch the API key from Rust via Tauri command
        this.apiKeyPromise = invoke<string>("get_api_key");
    }

    async generateResponse(messages: AssistantMessage[], model: string): Promise<AssistantMessage> {
        // Ensure OpenAI client is initialized with the API key
        if (!this.client) {
            const apiKey = await this.apiKeyPromise;
            this.client = new OpenAI({
                apiKey,
                dangerouslyAllowBrowser: true,
            });
        }

        // Map domain messages to OpenAI format
        const openAIMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Call OpenAI Chat Completions API
        const response = await this.client!.chat.completions.create({
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
