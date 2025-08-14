import { logger } from "@infrastructure/logger/logger";
import Database from "@tauri-apps/plugin-sql";

import { IncomeCategory } from "../../../domain/income-category/model";
import { IncomeCategoryRepository } from "../../../domain/income-category/repository";

type IncomeCategoryRow = {
    id: string;
    name: string;
    planned: number;
    actual: number;
    date: string | null;
    description: string | null;
    budgetid: string;
};

export class PostgresIncomeCategoryRepository implements IncomeCategoryRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = Database.load("postgres://mamba:mamba@localhost:5432/mamba");
    }
    async update(category: IncomeCategory): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "UPDATE income_categories SET name = $1, planned = $2, actual = $3, date = $4, description = $5 WHERE id = $6",
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

    async getByBudgetId(budgetId: string): Promise<IncomeCategory[]> {
        const db = await this.dbPromise;
        const rows = (await db.select(
            "SELECT id, name, planned, actual, date, description FROM income_categories WHERE budgetid = $1",
            [budgetId],
        )) as Array<IncomeCategoryRow>;
        logger.info("income_category.repository.get_by_budget_id_success", { budgetId, rows });
        return rows.map(
            (row) =>
                new IncomeCategory({
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

    async add(category: IncomeCategory): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "INSERT INTO income_categories (id, name, planned, actual, date, description, budgetid) VALUES ($1, $2, $3, $4, $5, $6, $7)",
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
