// Domain errors for Assistant

export class AssistantError extends Error {
    code: string;
    constructor(code: string, message?: string) {
        super(message ?? code);
        this.code = code;
        this.name = "AssistantError";
    }
}

export const ASSISTANT_ERRORS = {
    MESSAGE_CONTENT_EMPTY: "assistant.validation_error.message_content_empty",
    INVALID_ROLE: "assistant.validation_error.invalid_role",
};
