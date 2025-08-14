import { Expense } from "./model";

export interface ExpenseRepository {
    getByBudgetId(budgetId: string): Promise<Expense[]>;
    add(expense: Expense): Promise<void>;
    remove(id: string): Promise<void>;
    // Optionally: update, getById, etc.
}
