import { MonthlyBudget } from "./model";

export interface MonthlyBudgetRepository {
    getAll(): Promise<MonthlyBudget[]>;
    getById(id: string): Promise<MonthlyBudget | null>;
}
