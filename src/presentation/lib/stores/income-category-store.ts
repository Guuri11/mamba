import { create } from "zustand";

import { IncomeCategory } from "../../../domain/income-category/model";

interface IncomeCategoryState {
    categories: IncomeCategory[];
    setCategories: (categories: IncomeCategory[]) => void;
    addCategory: (cat: IncomeCategory) => void;
    updateCategory: (cat: IncomeCategory) => void;
    removeCategory: (id: string) => void;
}

export const useIncomeCategoryStore = create<IncomeCategoryState>((set) => ({
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
