// Infrastructure: UserRepository implementation (mock)
import { User } from "../../domain/user/model";
import { UserRepository } from "../../domain/user/repository";

export class MockUserRepository implements UserRepository {
    async getCurrentUser(): Promise<User | null> {
        // In a real app, fetch from storage, API, or session
        return new User({
            id: "1",
            name: "Sergio",
            avatarUrl: undefined, // or provide a URL
        });
    }
}
