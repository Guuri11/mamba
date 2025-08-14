import { logger } from "@infrastructure/logger/logger";

import { Expense } from "../../../domain/expense/model";
import { ExpenseRepository } from "../../../domain/expense/repository";

export class GetExpensesByBudget {
    constructor(private readonly repo: ExpenseRepository) {}

    async execute(budgetId: string): Promise<Expense[]> {
        logger.info("expense.usecase.get_by_budget_called", { budgetId });
        return this.repo.getByBudgetId(budgetId);
    }
}
