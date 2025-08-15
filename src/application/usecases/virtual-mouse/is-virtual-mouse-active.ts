// Use case: Check if Virtual Mouse is Active
import { VirtualMouseRepository } from "../../../domain/virtual-mouse/repository";

export class IsVirtualMouseActiveUseCase {
    constructor(private repository: VirtualMouseRepository) {}

    async execute(): Promise<boolean> {
        return this.repository.isActive();
    }
}
