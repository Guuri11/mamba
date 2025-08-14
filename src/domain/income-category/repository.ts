import { IncomeCategory } from "./model";

export interface IncomeCategoryRepository {
    getByBudgetId(budgetId: string): Promise<IncomeCategory[]>;
}
