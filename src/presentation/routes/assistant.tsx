import { createFileRoute } from "@tanstack/react-router";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton,
} from "../components/ui/shadcn-io/ai/conversation";
import { AIMessage, AIMessageContent } from "../components/ui/shadcn-io/ai/message";
import { AIResponse } from "../components/ui/shadcn-io/ai/response";
import { assistantRepository } from "../../infrastructure/repositories/assistant-repository";
import { ChatGPTAdapter } from "../../infrastructure/repositories/assistant-ai-adapter";
import { SendMessageUseCase } from "../../application/usecases/assistant/send-message";
import { StartChatUseCase } from "../../application/usecases/assistant/start-chat";
import { GetModelsUseCase } from "../../application/usecases/assistant/get-models";
import { assistantModelRepository } from "../../infrastructure/repositories/assistant-model-repository";
import {
    AIInput,
    AIInputButton,
    AIInputModelSelect,
    AIInputModelSelectContent,
    AIInputModelSelectItem,
    AIInputModelSelectTrigger,
    AIInputModelSelectValue,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools,
} from "../components/ui/shadcn-io/ai/input";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";
import { MambaSidebar } from "~/components/mamba-sidebar";

export const Route = createFileRoute("/assistant")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [models, setModels] = useState<{ id: string; name: string }[]>([]);
    const [model, setModel] = useState<string>("");
    const [status, setStatus] = useState<"submitted" | "streaming" | "ready" | "error">("ready");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        async function init() {
            // Fetch models from infrastructure
            const getModels = new GetModelsUseCase(assistantModelRepository);
            const availableModels = await getModels.execute();
            setModels(availableModels);
            setModel(availableModels[0]?.id || "");

            // Start chat
            const startChat = new StartChatUseCase(assistantRepository);
            const chat = await startChat.execute();
            setChatId(chat.id);
            setMessages([]);
        }
        init();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || !chatId) return;
        setStatus("submitted");
        const sendMessage = new SendMessageUseCase(assistantRepository);
        const userMsg = await sendMessage.execute({ chatId, content: input, role: "user" });
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        setTimeout(() => setStatus("streaming"), 200);

        // Get AI response with selected model
        const aiAdapter = new ChatGPTAdapter();
        const aiMsg = await aiAdapter.generateResponse([...messages, userMsg], model);
        await sendMessage.execute({ chatId, content: aiMsg.content, role: "assistant" });
        setMessages((prev) => [...prev, aiMsg]);
        setStatus("ready");
    };

    return (
        <MambaSidebar>
            <div className="flex justify-center flex-col h-full w-full">
                <AIConversation className="relative size-full rounded-lg border">
                    <AIConversationContent>
                        {messages.map((msg) => (
                            <AIMessage key={msg.id} from={msg.role}>
                                {msg.role === "assistant" ? (
                                    <AIMessageContent>
                                        <AIResponse>{msg.content}</AIResponse>
                                    </AIMessageContent>
                                ) : (
                                    <AIMessageContent>{msg.content}</AIMessageContent>
                                )}
                            </AIMessage>
                        ))}
                    </AIConversationContent>
                    <AIConversationScrollButton />
                </AIConversation>
                <AIInput onSubmit={handleSubmit} className="border-t">
                    <AIInputTextarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("assistant.input.placeholder")}
                        disabled={status === "submitted" || status === "streaming"}
                        className="flex-1"
                    />
                    <AIInputToolbar>
                        <AIInputTools>
                            <AIInputButton>
                                <PlusIcon size={16} />
                            </AIInputButton>
                            <AIInputButton>
                                <MicIcon size={16} />
                            </AIInputButton>
                            <AIInputButton>
                                <GlobeIcon size={16} />
                                <span>{t("assistant.input.search")}</span>
                            </AIInputButton>
                            <AIInputModelSelect onValueChange={setModel} value={model}>
                                <AIInputModelSelectTrigger>
                                    <AIInputModelSelectValue />
                                </AIInputModelSelectTrigger>
                                <AIInputModelSelectContent>
                                    {models.map((model) => (
                                        <AIInputModelSelectItem key={model.id} value={model.id}>
                                            {model.name}
                                        </AIInputModelSelectItem>
                                    ))}
                                </AIInputModelSelectContent>
                            </AIInputModelSelect>
                        </AIInputTools>
                        <AIInputSubmit disabled={!input} status={status} />
                    </AIInputToolbar>
                </AIInput>
            </div>
        </MambaSidebar>
    );
}
