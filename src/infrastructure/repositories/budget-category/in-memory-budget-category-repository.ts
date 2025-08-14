import { BudgetCategory, BudgetCategoryProps } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";

const MOCK_CATEGORIES: Record<string, BudgetCategoryProps[]> = {
    "1": [
        { id: "c1", name: "Food", planned: 400, actual: 450 },
        { id: "c2", name: "Transport", planned: 100, actual: 80 },
        { id: "c3", name: "Leisure", planned: 200, actual: 250 },
        { id: "c4", name: "Health", planned: 150, actual: 120 },
        { id: "c5", name: "Utilities", planned: 200, actual: 210 },
    ],
    "2": [
        { id: "c1", name: "Food", planned: 350, actual: 340 },
        { id: "c2", name: "Transport", planned: 120, actual: 130 },
        { id: "c3", name: "Leisure", planned: 180, actual: 200 },
        { id: "c4", name: "Health", planned: 100, actual: 90 },
        { id: "c5", name: "Utilities", planned: 180, actual: 170 },
    ],
    "3": [
        { id: "c1", name: "Food", planned: 300, actual: 320 },
        { id: "c2", name: "Transport", planned: 110, actual: 100 },
        { id: "c3", name: "Leisure", planned: 150, actual: 180 },
        { id: "c4", name: "Health", planned: 120, actual: 110 },
        { id: "c5", name: "Utilities", planned: 160, actual: 150 },
    ],
};

export class InMemoryBudgetCategoryRepository implements BudgetCategoryRepository {
    async getByBudgetId(budgetId: string): Promise<BudgetCategory[]> {
        const categories = MOCK_CATEGORIES[budgetId] || [];
        return categories.map((c) => new BudgetCategory(c));
    }

    async update(category: BudgetCategory): Promise<void> {
        for (const key of Object.keys(MOCK_CATEGORIES)) {
            const idx = MOCK_CATEGORIES[key].findIndex((c) => c.id === category.id);
            if (idx !== -1) {
                MOCK_CATEGORIES[key][idx] = { ...MOCK_CATEGORIES[key][idx], ...category };
                break;
            }
        }
    }
}
