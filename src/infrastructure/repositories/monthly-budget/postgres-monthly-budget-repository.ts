import Database from "@tauri-apps/plugin-sql";

import { MonthlyBudget } from "../../../domain/monthly-budget/model";
import { MonthlyBudgetRepository } from "../../../domain/monthly-budget/repository";

type MonthlyBudgetRow = {
    id: string;
    name: string;
    month: string;
    initialbalance: number;
    finalbalance: number;
};

export class PostgresMonthlyBudgetRepository implements MonthlyBudgetRepository {
    private dbPromise: Promise<Database>;

    constructor() {
        this.dbPromise = Database.load("postgres://mamba:mamba@localhost:5432/mamba");
    }

    async getAll() {
        const db = await this.dbPromise;
        const rows = (await db.select(
            "SELECT id, name, month, initialbalance as initialBalance, finalbalance as finalBalance FROM monthly_budgets",
        )) as Array<MonthlyBudgetRow>;
        return rows.map(
            (row) =>
                new MonthlyBudget({
                    id: row.id,
                    name: row.name,
                    month: row.month,
                    total: 0,
                    initialBalance: row.initialbalance,
                    finalBalance: row.finalbalance,
                }),
        );
    }

    async getById(id: string) {
        const db = await this.dbPromise;
        const row = (await db.select(
            "SELECT id, name, month, initialbalance as initialBalance, finalbalance as finalBalance FROM monthly_budgets WHERE id = $1",
            [id],
        )) as Array<MonthlyBudgetRow>;
        if (!Array.isArray(row) || row.length === 0) return null;
        return new MonthlyBudget({
            id: row[0].id,
            name: row[0].name,
            month: row[0].month,
            total: 0,
            initialBalance: row[0].initialbalance,
            finalBalance: row[0].finalbalance,
        });
    }

    async getByMonthAndYear(year: string, month: string) {
        const db = await this.dbPromise;
        const monthStr = `${year}-${month.padStart(2, "0")}`;
        const row = (await db.select(
            "SELECT id, name, month, initialbalance as initialBalance, finalbalance as finalBalance FROM monthly_budgets WHERE month = $1",
            [monthStr],
        )) as Array<MonthlyBudgetRow>;
        if (!Array.isArray(row) || row.length === 0) return null;
        return new MonthlyBudget({
            id: row[0].id,
            name: row[0].name,
            month: row[0].month,
            total: 0,
            initialBalance: row[0].initialbalance,
            finalBalance: row[0].finalbalance,
        });
    }

    async add(budget: MonthlyBudget) {
        const db = await this.dbPromise;
        await db.execute(
            "INSERT INTO monthly_budgets (id, name, month, initialBalance, finalBalance) VALUES ($1, $2, $3, $4, $5)",
            [budget.id, budget.name, budget.month, budget.initialBalance, budget.finalBalance],
        );
    }

    async remove(id: string) {
        const db = await this.dbPromise;
        await db.execute("DELETE FROM monthly_budgets WHERE id = $1", [id]);
    }
}
