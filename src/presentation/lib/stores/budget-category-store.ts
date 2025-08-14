import { create } from "zustand";

import { BudgetCategory } from "../../../domain/budget-category/model";

interface BudgetCategoryState {
    categories: BudgetCategory[];
    setCategories: (categories: BudgetCategory[]) => void;
    addCategory: (cat: BudgetCategory) => void;
    updateCategory: (cat: BudgetCategory) => void;
    removeCategory: (id: string) => void;
}

export const useBudgetCategoryStore = create<BudgetCategoryState>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    addCategory: (cat) => set((state) => ({ categories: [...state.categories, cat] })),
    updateCategory: (cat) =>
        set((state) => ({
            categories: state.categories.map((c) => (c.id === cat.id ? cat : c)),
        })),
    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        })),
}));
