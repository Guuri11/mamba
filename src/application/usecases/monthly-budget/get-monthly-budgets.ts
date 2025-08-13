import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

export class GetMonthlyBudgets {
    constructor(private readonly repo: MonthlyBudgetRepository) {}

    async execute(): Promise<MonthlyBudget[]> {
        return this.repo.getAll();
    }
}
