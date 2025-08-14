import { create } from "zustand";

import { Expense } from "../../../domain/expense/model";

interface ExpenseStoreState {
    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
}

export const useExpenseStore = create<ExpenseStoreState>((set) => ({
    expenses: [],
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
}));
