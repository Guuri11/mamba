// VirtualMouse domain errors

export const VIRTUAL_MOUSE_ERRORS = {
    activation_failed: "virtual_mouse.activation_failed",
    deactivation_failed: "virtual_mouse.deactivation_failed",
    handpose_send_failed: "virtual_mouse.handpose_send_failed",
};

export class VirtualMouseError extends Error {
    code: string;
    constructor(code: string, message?: string) {
        super(message || code);
        this.code = code;
        this.name = "VirtualMouseError";
    }
}
