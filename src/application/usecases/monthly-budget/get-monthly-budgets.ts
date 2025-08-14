import { logger } from "@infrastructure/logger/logger";

import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class GetMonthlyBudgets {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(): Promise<MonthlyBudget[]> {
        logger.info("monthly_budget.usecase.get_all_called");
        const budgets = await this.repo.getAll();

        logger.info("monthly_budget.usecase.get_all_success", { budgets });
        return budgets;
    }
}
