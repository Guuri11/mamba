import { logger } from "@infrastructure/logger/logger";

import { IncomeCategory } from "../../../domain/income-category/model";
import { IncomeCategoryRepository } from "../../../domain/income-category/repository";

export class AddIncomeCategoryUseCase {
    constructor(private readonly repository: IncomeCategoryRepository) {}

    async execute(category: IncomeCategory): Promise<void> {
        logger.info("Adding income category:", category);
        await this.repository.add(category);
    }
}
