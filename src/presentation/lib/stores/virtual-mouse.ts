import { create } from "zustand";

interface VirtualMouseStore {
    isActive: boolean;
    setActive: (active: boolean) => void;
}

export const useVirtualMouseStore = create<VirtualMouseStore>((set) => ({
    isActive: false,
    setActive: (active) => set({ isActive: active }),
}));
