import { create } from "zustand";

interface DeviationThresholdState {
    threshold: number; // percent, e.g. 20 for 20%
    setThreshold: (value: number) => void;
}

export const useDeviationThresholdStore = create<DeviationThresholdState>((set) => ({
    threshold: 20,
    setThreshold: (value) => set({ threshold: value }),
}));
