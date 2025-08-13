// Value objects for Assistant domain

export class MessageContent {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("assistant.validation_error.message_content_empty");
        }
        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}
