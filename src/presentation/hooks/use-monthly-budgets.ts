import { useEffect, useState } from "react";

import { GetMonthlyBudgets } from "../../application/usecases/monthly-budget/get-monthly-budgets";
import { MonthlyBudget } from "../../domain/monthly-budget/model";
import { InMemoryMonthlyBudgetRepository } from "../../infrastructure/repositories/monthly-budget/in-memory-monthly-budget-repository";

export function useMonthlyBudgets() {
    const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const repo = new InMemoryMonthlyBudgetRepository();
        const usecase = new GetMonthlyBudgets(repo);
        usecase.execute().then((data) => {
            setBudgets(data);
            setLoading(false);
        });
    }, []);

    return { budgets, loading };
}
