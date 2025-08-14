import { BudgetCategory } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";

export class GetBudgetCategoriesByBudget {
    constructor(private readonly repo: BudgetCategoryRepository) {}

    async execute(budgetId: string): Promise<BudgetCategory[]> {
        return this.repo.getByBudgetId(budgetId);
    }
}
