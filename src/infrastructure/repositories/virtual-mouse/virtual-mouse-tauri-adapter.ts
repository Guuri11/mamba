// Infrastructure adapter: VirtualMouse <-> Tauri (Rust)
import { logger } from "@infrastructure/logger/logger";
import { invoke } from "@tauri-apps/api/core";

import { VIRTUAL_MOUSE_ERRORS, VirtualMouseError } from "../../../domain/virtual-mouse/errors";
import { VirtualMouseRepository } from "../../../domain/virtual-mouse/repository";

export class VirtualMouseTauriAdapter implements VirtualMouseRepository {
    async activate(): Promise<void> {
        try {
            await invoke("activate_virtual_mouse");
        } catch (e) {
            logger.error("Failed to activate virtual mouse:", e);
            throw new VirtualMouseError(VIRTUAL_MOUSE_ERRORS.activation_failed);
        }
    }

    async deactivate(): Promise<void> {
        try {
            await invoke("deactivate_virtual_mouse");
        } catch (e) {
            logger.error("Failed to deactivate virtual mouse:", e);
            throw new VirtualMouseError(VIRTUAL_MOUSE_ERRORS.deactivation_failed);
        }
    }

    async isActive(): Promise<boolean> {
        try {
            return await invoke("is_virtual_mouse_active");
        } catch (e) {
            logger.error("Failed to check if virtual mouse is active:", e);
            return false;
        }
    }
}
