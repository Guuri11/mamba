import { AddBudgetCategoryUseCase } from "@application/usecases/budget-category/add-budget-category";
import { PostgresBudgetCategoryRepository } from "@infrastructure/repositories/budget-category/postgres-budget-category-repository";
import { create } from "zustand";

import { BudgetCategory } from "../../../domain/budget-category/model";

export const addBudgetCategoryUseCase = new AddBudgetCategoryUseCase(
    new PostgresBudgetCategoryRepository(),
);

export interface BudgetCategoryState {
    categories: BudgetCategory[];
    setCategories: (categories: BudgetCategory[]) => void;
    addCategory: (cat: BudgetCategory) => Promise<void>;
    updateCategory: (cat: BudgetCategory) => void;
    removeCategory: (id: string) => void;
}

export const useBudgetCategoryStore = create<BudgetCategoryState>((set) => ({
    categories: [],
    setCategories: (categories: BudgetCategory[]) => set({ categories }),
    addCategory: async (cat: BudgetCategory) => {
        await addBudgetCategoryUseCase.execute(cat);
        set((state: BudgetCategoryState) => ({ categories: [...state.categories, cat] }));
    },
    updateCategory: (cat: BudgetCategory) =>
        set((state: BudgetCategoryState) => ({
            categories: state.categories.map((c: BudgetCategory) => (c.id === cat.id ? cat : c)),
        })),
    removeCategory: (id: string) =>
        set((state: BudgetCategoryState) => ({
            categories: state.categories.filter((c: BudgetCategory) => c.id !== id),
        })),
}));
