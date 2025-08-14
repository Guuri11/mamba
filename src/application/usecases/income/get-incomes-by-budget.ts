import { Income } from "../../../domain/income/model";
import { IncomeRepository } from "../../../domain/income/repository";

export class GetIncomesByBudget {
    constructor(private readonly repository: IncomeRepository) {}

    async execute(budgetId: string): Promise<Income[]> {
        return this.repository.getByBudgetId(budgetId);
    }
}
