import { IncomeCategory } from "@domain/income-category/model";
import { IncomeCategoryRepository } from "@domain/income-category/repository";
import { logger } from "@infrastructure/logger/logger";

import { Income } from "../../../domain/income/model";
import { IncomeRepository } from "../../../domain/income/repository";

export class AddIncomeUseCase {
    constructor(
        private readonly repository: IncomeRepository,
        private readonly categoryRepository: IncomeCategoryRepository,
    ) {}

    async execute(income: Income, budgetId: string): Promise<void> {
        logger.info("income.usecase.add_called", { budgetId, income });
        await this.repository.add(income, budgetId);
        // Update the actual of the category
        const categories: IncomeCategory[] = await this.categoryRepository.getByBudgetId(budgetId);
        const cat = categories.find((c: IncomeCategory) => c.id === income.categoryId);
        if (cat) {
            logger.info("income.usecase.add_to_category_called", {
                budgetId,
                income,
                category: cat,
            });
            // Add to actual
            const updated = new IncomeCategory({
                ...cat,
                actual: cat.actual + income.amount,
            });
            await this.categoryRepository.update(updated);
        }
    }
}
