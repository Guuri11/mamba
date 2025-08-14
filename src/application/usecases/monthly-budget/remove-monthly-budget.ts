import { logger } from "@infrastructure/logger/logger";

import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class RemoveMonthlyBudget {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(id: string): Promise<void> {
        logger.info("monthly_budget.usecase.remove_called", { id });
        await this.repo.remove(id);
    }
}
