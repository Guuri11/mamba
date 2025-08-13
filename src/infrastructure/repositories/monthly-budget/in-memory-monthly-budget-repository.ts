import { MonthlyBudget, MonthlyBudgetProps } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

const MOCK_BUDGETS: MonthlyBudgetProps[] = [
    { id: "1", month: "2025-08", name: "August 2025", total: 2000 },
    { id: "2", month: "2025-07", name: "July 2025", total: 1800 },
    { id: "3", month: "2025-06", name: "June 2025", total: 1750 },
];

export class InMemoryMonthlyBudgetRepository implements MonthlyBudgetRepository {
    private budgets: MonthlyBudget[] = MOCK_BUDGETS.map((b) => new MonthlyBudget(b));

    async getAll(): Promise<MonthlyBudget[]> {
        return this.budgets;
    }

    async getById(id: string): Promise<MonthlyBudget | null> {
        return this.budgets.find((b) => b.id === id) ?? null;
    }
}
