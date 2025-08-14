import { logger } from "@infrastructure/logger/logger";

import { BudgetCategory } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";
import { Expense } from "../../../domain/expense/model";
import { ExpenseRepository } from "../../../domain/expense/repository";

export class AddExpenseUseCase {
    constructor(
        private expenseRepo: ExpenseRepository,
        private categoryRepo: BudgetCategoryRepository,
    ) {}

    async execute(expense: Expense, budgetId: string): Promise<void> {
        logger.info("expense.usecase.add_called", { budgetId, expense });
        await this.expenseRepo.add(expense, budgetId);
        // Update the actual of the category
        const categories: BudgetCategory[] = await this.categoryRepo.getByBudgetId(budgetId);
        const cat = categories.find((c: BudgetCategory) => c.id === expense.categoryId);
        if (cat) {
            logger.info("expense.usecase.add_to_category_called", {
                budgetId,
                expense,
                category: cat,
            });
            // Add to actual
            const updated = new BudgetCategory({
                ...cat,
                actual: cat.actual + expense.amount,
            });
            await this.categoryRepo.update(updated);
        }
    }
}
