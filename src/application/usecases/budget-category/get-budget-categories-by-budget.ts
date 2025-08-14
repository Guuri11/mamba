import { logger } from "@infrastructure/logger/logger";

import { BudgetCategory } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";

export class GetBudgetCategoriesByBudget {
    constructor(private readonly repo: BudgetCategoryRepository) {}

    async execute(budgetId: string): Promise<BudgetCategory[]> {
        logger.info("get_budget_categories_by_budget.use_case.execute_called", { budgetId });
        return this.repo.getByBudgetId(budgetId);
    }
}
