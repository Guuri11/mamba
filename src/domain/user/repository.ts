// User repository interface
import { User } from "./model";

export interface UserRepository {
    getCurrentUser(): Promise<User | null>;
}
