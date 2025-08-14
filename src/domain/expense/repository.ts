import { Expense } from "./model";

export interface ExpenseRepository {
    getByBudgetId(budgetId: string): Promise<Expense[]>;
    add(expense: Expense, budgetId: string): Promise<void>;
    remove(id: string, budgetId: string): Promise<void>;
    // Optionally: update, getById, etc.
}
