// Use case: Deactivate Virtual Mouse
import { VirtualMouseRepository } from "../../../domain/virtual-mouse/repository";

export class DeactivateVirtualMouseUseCase {
    constructor(private repository: VirtualMouseRepository) {}

    async execute(): Promise<void> {
        await this.repository.deactivate();
    }
}
