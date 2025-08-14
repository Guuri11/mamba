import { create } from "zustand";

import { AddMonthlyBudget } from "../../../application/usecases/monthly-budget/add-monthly-budget";
import { GetMonthlyBudgets } from "../../../application/usecases/monthly-budget/get-monthly-budgets";
import { RemoveMonthlyBudget } from "../../../application/usecases/monthly-budget/remove-monthly-budget";
import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { monthlyBudgetRepo } from "../../../infrastructure/repositories/monthly-budget/repo-singleton";

interface MonthlyBudgetStoreState {
    budgets: MonthlyBudget[];
    fetchBudgets: () => Promise<void>;
    addBudget: (budget: MonthlyBudget) => Promise<void>;
    removeBudget: (id: string) => Promise<void>;
}

const repo = monthlyBudgetRepo;
const addBudgetUseCase = new AddMonthlyBudget(repo);
const removeBudgetUseCase = new RemoveMonthlyBudget(repo);
const getMonthlyBudgets = new GetMonthlyBudgets(repo);

export const useMonthlyBudgetStore = create<MonthlyBudgetStoreState>((set) => ({
    budgets: [],
    fetchBudgets: async () => {
        const budgets = await getMonthlyBudgets.execute();
        set({ budgets });
    },
    addBudget: async (budget) => {
        await addBudgetUseCase.execute(budget);
        // Refresh budgets after add
        const budgets = await getMonthlyBudgets.execute();
        set({ budgets });
    },
    removeBudget: async (id) => {
        await removeBudgetUseCase.execute(id);
        // Refresh budgets after remove
        const budgets = await getMonthlyBudgets.execute();
        set({ budgets });
    },
}));
