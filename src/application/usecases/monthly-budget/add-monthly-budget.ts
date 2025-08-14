import { logger } from "@infrastructure/logger/logger";

import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class AddMonthlyBudget {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(budget: MonthlyBudget): Promise<void> {
        logger.info("monthly_budget.usecase.add_called", { budget });
        await this.repo.add(budget);
    }
}
