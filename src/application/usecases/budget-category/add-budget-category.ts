import { logger } from "@infrastructure/logger/logger";

import { BudgetCategory } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";

export class AddBudgetCategoryUseCase {
    constructor(private readonly repository: BudgetCategoryRepository) {}

    async execute(category: BudgetCategory): Promise<void> {
        logger.info("Adding budget category:", category);
        await this.repository.add(category);
    }
}
