import { Income } from "./model";

export interface IncomeRepository {
    getByBudgetId(budgetId: string): Promise<Income[]>;
    add(income: Income, budgetId: string): Promise<void>;
    remove(id: string, budgetId: string): Promise<void>;
}
