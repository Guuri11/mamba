import { logger } from "@infrastructure/logger/logger";
import Database from "@tauri-apps/plugin-sql";

import { Income } from "../../../domain/income/model";
import { IncomeRepository } from "../../../domain/income/repository";

type IncomeRow = {
    id: string;
    categoryId: string;
    amount: number;
    date: string;
    description: string | null;
    budgetId: string;
};

export class PostgresIncomeRepository implements IncomeRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = Database.load("postgres://mamba:mamba@localhost:5432/mamba");
    }

    async getByBudgetId(budgetId: string): Promise<Income[]> {
        const db = await this.dbPromise;
        const rows = (await db.select(
            "SELECT id, categoryid as categoryId, amount, date, description, budgetid as budgetId FROM incomes WHERE budgetid = $1",
            [budgetId],
        )) as Array<IncomeRow>;
        logger.info("income.repository.get_by_budget_id_success", { budgetId, rows });
        return rows.map(
            (row) =>
                new Income({
                    id: row.id,
                    categoryId: row.categoryId,
                    amount: row.amount,
                    date: row.date,
                    description: row.description || "",
                    budgetId: row.budgetId,
                }),
        );
    }

    async add(income: Income, budgetId: string): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "INSERT INTO incomes (id, categoryid, amount, date, description, budgetid) VALUES ($1, $2, $3, $4, $5, $6)",
            [
                income.id,
                income.categoryId,
                income.amount,
                income.date,
                income.description ?? null,
                budgetId,
            ],
        );
    }

    async remove(id: string, budgetId: string): Promise<void> {
        const db = await this.dbPromise;
        await db.execute("DELETE FROM incomes WHERE id = $1 AND budgetid = $2", [id, budgetId]);
    }
}
