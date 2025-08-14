import { BudgetCategory } from "./model";

export interface BudgetCategoryRepository {
    getByBudgetId(budgetId: string): Promise<BudgetCategory[]>;
    update(category: BudgetCategory): Promise<void>;
}
