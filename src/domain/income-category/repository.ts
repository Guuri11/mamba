import { IncomeCategory } from "./model";

export interface IncomeCategoryRepository {
    getByBudgetId(budgetId: string): Promise<IncomeCategory[]>;
    update(category: IncomeCategory): Promise<void>;
    add(category: IncomeCategory): Promise<void>;
}
