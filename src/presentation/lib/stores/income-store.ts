import { create } from "zustand";

import { Income } from "../../../domain/income/model";

export interface IncomeState {
    incomes: Income[];
    setIncomes: (incomes: Income[]) => void;
    addIncome: (income: Income) => void;
    removeIncome: (id: string) => void;
}

export const useIncomeStore = create<IncomeState>((set) => ({
    incomes: [],
    setIncomes: (incomes: Income[]) => set({ incomes }),
    addIncome: (income: Income) =>
        set((state: IncomeState) => ({ incomes: [...state.incomes, income] })),
    removeIncome: (id: string) =>
        set((state: IncomeState) => ({
            incomes: state.incomes.filter((i: Income) => i.id !== id),
        })),
}));
