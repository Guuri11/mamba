import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class GetMonthlyBudgetDetail {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(id: string): Promise<MonthlyBudget | null> {
        return this.repo.getById(id);
    }
}
