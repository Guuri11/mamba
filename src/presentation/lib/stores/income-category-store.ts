import { AddIncomeCategoryUseCase } from "@application/usecases/income-category/add-income-category";
import { PostgresIncomeCategoryRepository } from "@infrastructure/repositories/income-category/postgres-income-category-repository";
import { create } from "zustand";

import { IncomeCategory } from "../../../domain/income-category/model";

export const addIncomeCategoryUseCase = new AddIncomeCategoryUseCase(
    new PostgresIncomeCategoryRepository(),
);

export interface IncomeCategoryState {
    categories: IncomeCategory[];
    setCategories: (categories: IncomeCategory[]) => void;
    addCategory: (cat: IncomeCategory) => Promise<void>;
    updateCategory: (cat: IncomeCategory) => void;
    removeCategory: (id: string) => void;
}

export const useIncomeCategoryStore = create<IncomeCategoryState>((set) => ({
    categories: [],
    setCategories: (categories: IncomeCategory[]) => set({ categories }),
    addCategory: async (cat: IncomeCategory) => {
        await addIncomeCategoryUseCase.execute(cat);
        set((state: IncomeCategoryState) => ({ categories: [...state.categories, cat] }));
    },
    updateCategory: (cat: IncomeCategory) =>
        set((state: IncomeCategoryState) => ({
            categories: state.categories.map((c: IncomeCategory) => (c.id === cat.id ? cat : c)),
        })),
    removeCategory: (id: string) =>
        set((state: IncomeCategoryState) => ({
            categories: state.categories.filter((c: IncomeCategory) => c.id !== id),
        })),
}));
