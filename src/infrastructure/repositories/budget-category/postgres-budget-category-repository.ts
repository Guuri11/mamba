import { logger } from "@infrastructure/logger/logger";
import Database from "@tauri-apps/plugin-sql";

import { BudgetCategory } from "../../../domain/budget-category/model";
import { BudgetCategoryRepository } from "../../../domain/budget-category/repository";

type BudgetCategoryRow = {
    id: string;
    name: string;
    planned: number;
    actual: number;
    date: string | null;
    description: string | null;
    budgetid: string;
};

export class PostgresBudgetCategoryRepository implements BudgetCategoryRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = Database.load("postgres://mamba:mamba@localhost:5432/mamba");
    }

    async getByBudgetId(budgetId: string): Promise<BudgetCategory[]> {
        const db = await this.dbPromise;
        const rows = (await db.select(
            "SELECT id, name, planned, actual, date, description FROM budget_categories WHERE budgetid = $1",
            [budgetId],
        )) as Array<BudgetCategoryRow>;
        logger.info("budget_category.repository.get_by_budget_id_success", { budgetId, rows });
        return rows.map(
            (row) =>
                new BudgetCategory({
                    id: row.id,
                    name: row.name,
                    planned: row.planned,
                    actual: row.actual,
                    date: row.date || "",
                    description: row.description || "",
                    budgetId: row.budgetid,
                }),
        );
    }

    async update(category: BudgetCategory): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "UPDATE budget_categories SET name = $1, planned = $2, actual = $3, date = $4, description = $5 WHERE id = $6",
            [
                category.name,
                category.planned,
                category.actual,
                category.date ?? null,
                category.description ?? null,
                category.id,
            ],
        );
    }

    async add(category: BudgetCategory): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "INSERT INTO budget_categories (id, name, planned, actual, date, description, budgetid) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                category.id,
                category.name,
                category.planned,
                category.actual,
                category.date ?? null,
                category.description ?? null,
                category.budgetId,
            ],
        );
    }
}
