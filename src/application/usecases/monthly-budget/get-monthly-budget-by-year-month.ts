import { logger } from "@infrastructure/logger/logger";

import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class GetMonthlyBudgetByYearMonth {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(year: string, month: string): Promise<MonthlyBudget | null> {
        logger.info("monthly_budget.usecase.get_by_month_and_year_called", { year, month });
        return this.repo.getByMonthAndYear(year, month);
    }
}
