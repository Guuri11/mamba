import { IncomeCategory, IncomeCategoryProps } from "../../../domain/income-category/model";
import { IncomeCategoryRepository } from "../../../domain/income-category/repository";

const MOCK_INCOME_CATEGORIES: Record<string, IncomeCategoryProps[]> = {
    "1": [
        { id: "i1", name: "Salary", planned: 2500, actual: 2500 },
        { id: "i2", name: "Freelance", planned: 500, actual: 400 },
        { id: "i3", name: "Investments", planned: 200, actual: 250 },
    ],
    "2": [
        { id: "i1", name: "Salary", planned: 2500, actual: 2500 },
        { id: "i2", name: "Freelance", planned: 400, actual: 500 },
        { id: "i3", name: "Investments", planned: 150, actual: 100 },
    ],
    "3": [
        { id: "i1", name: "Salary", planned: 2500, actual: 2500 },
        { id: "i2", name: "Freelance", planned: 600, actual: 600 },
        { id: "i3", name: "Investments", planned: 100, actual: 120 },
    ],
};

export class InMemoryIncomeCategoryRepository implements IncomeCategoryRepository {
    async getByBudgetId(budgetId: string): Promise<IncomeCategory[]> {
        const categories = MOCK_INCOME_CATEGORIES[budgetId] || [];
        return categories.map((c) => new IncomeCategory(c));
    }
}
