import { Expense } from "../../../domain/expense/model";
import { ExpenseRepository } from "../../../domain/expense/repository";

export class InMemoryExpenseRepository implements ExpenseRepository {
    private expenses: Expense[] = [];

    async getByBudgetId(budgetId: string): Promise<Expense[]> {
        // For now, all expenses are global; extend with budgetId if needed
        return this.expenses;
    }

    async add(expense: Expense): Promise<void> {
        this.expenses.push(expense);
    }

    async remove(id: string): Promise<void> {
        this.expenses = this.expenses.filter((e) => e.id !== id);
    }
}
