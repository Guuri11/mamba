import { MonthlyBudget } from "./model";

export interface MonthlyBudgetRepository {
    getAll(): Promise<MonthlyBudget[]>;
    getById(id: string): Promise<MonthlyBudget | null>;
    getByMonthAndYear(year: string, month: string): Promise<MonthlyBudget | null>;
    add(budget: MonthlyBudget): Promise<void>;
    remove(id: string): Promise<void>;
}
