// Use case: GetWelcomeMessage
import { User } from "../../domain/user/model";
import { UserRepository } from "../../domain/user/repository";

export interface WelcomeMessage {
    name: string;
    avatarUrl?: string;
}

export class GetWelcomeMessage {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<WelcomeMessage | null> {
        const user: User | null = await this.userRepository.getCurrentUser();
        if (!user) return null;
        return {
            name: user.name,
            avatarUrl: user.avatarUrl,
        };
    }
}
