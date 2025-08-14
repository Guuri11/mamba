import { logger } from "@infrastructure/logger/logger";

import { IncomeCategory } from "../../../domain/income-category/model";
import { IncomeCategoryRepository } from "../../../domain/income-category/repository";

export class GetIncomeCategoriesByBudget {
    constructor(private readonly repo: IncomeCategoryRepository) {}

    async execute(budgetId: string): Promise<IncomeCategory[]> {
        logger.info("get_income_categories_by_budget.use_case.execute_called", { budgetId });
        return this.repo.getByBudgetId(budgetId);
    }
}
