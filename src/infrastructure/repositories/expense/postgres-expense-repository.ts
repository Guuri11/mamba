import { logger } from "@infrastructure/logger/logger";
import Database from "@tauri-apps/plugin-sql";

import { Expense } from "../../../domain/expense/model";
import { ExpenseRepository } from "../../../domain/expense/repository";

type ExpenseRow = {
    id: string;
    categoryId: string;
    amount: number;
    date: string;
    description: string | null;
    budgetid: string;
};

export class PostgresExpenseRepository implements ExpenseRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = Database.load("postgres://mamba:mamba@localhost:5432/mamba");
    }

    async getByBudgetId(budgetId: string): Promise<Expense[]> {
        const db = await this.dbPromise;
        const rows = (await db.select(
            "SELECT id, categoryid as categoryId, amount, date, description FROM expenses WHERE budgetid = $1",
            [budgetId],
        )) as Array<ExpenseRow>;
        logger.info("expense.repository.get_by_budget_id_success", { budgetId, rows });
        return rows.map(
            (row) =>
                new Expense({
                    id: row.id,
                    categoryId: row.categoryId,
                    amount: row.amount,
                    date: row.date,
                    description: row.description || "",
                    budgetId: row.budgetid,
                }),
        );
    }

    async add(expense: Expense, budgetId: string): Promise<void> {
        const db = await this.dbPromise;
        await db.execute(
            "INSERT INTO expenses (id, categoryid, amount, date, description, budgetid) VALUES ($1, $2, $3, $4, $5, $6)",
            [
                expense.id,
                expense.categoryId,
                expense.amount,
                expense.date,
                expense.description ?? null,
                budgetId,
            ],
        );
    }

    async remove(id: string, budgetId: string): Promise<void> {
        const db = await this.dbPromise;
        await db.execute("DELETE FROM expenses WHERE id = $1 AND budgetid = $2", [id, budgetId]);
    }
}
