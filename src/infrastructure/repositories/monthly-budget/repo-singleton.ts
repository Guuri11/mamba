// src/infrastructure/repositories/monthly-budget/repo-singleton.ts
// Export a singleton instance of the in-memory monthly budget repository
import { PostgresMonthlyBudgetRepository } from "./postgres-monthly-budget-repository";

export const monthlyBudgetRepo = new PostgresMonthlyBudgetRepository();
