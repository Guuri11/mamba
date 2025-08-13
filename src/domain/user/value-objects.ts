// Value objects for User domain

export class UserName {
    constructor(public readonly value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("user.validation_error.name_empty");
        }
    }
}

export class AvatarUrl {
    constructor(public readonly value: string) {
        // Optionally validate URL format
    }
}
