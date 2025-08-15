// Use case: Activate Virtual Mouse
import { VirtualMouseRepository } from "../../../domain/virtual-mouse/repository";

export class ActivateVirtualMouseUseCase {
    constructor(private repository: VirtualMouseRepository) {}

    async execute(): Promise<void> {
        await this.repository.activate();
    }
}
