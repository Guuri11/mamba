// VirtualMouse repository interface
export interface VirtualMouseRepository {
    activate(): Promise<void>;
    deactivate(): Promise<void>;
    isActive(): Promise<boolean>;
}
