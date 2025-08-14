import { IncomeCategory } from "../../../domain/income-category/model";
import { IncomeCategoryRepository } from "../../../domain/income-category/repository";

export class GetIncomeCategoriesByBudget {
    constructor(private readonly repo: IncomeCategoryRepository) {}

    async execute(budgetId: string): Promise<IncomeCategory[]> {
        return this.repo.getByBudgetId(budgetId);
    }
}
