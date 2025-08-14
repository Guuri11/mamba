import { useEffect, useState } from "react";

import { GetMonthlyBudgets } from "../../application/usecases/monthly-budget/get-monthly-budgets";
import { MonthlyBudget } from "../../domain/monthly-budget/model";
import { monthlyBudgetRepo } from "../../infrastructure/repositories/monthly-budget/repo-singleton";

export function useMonthlyBudgets() {
    const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usecase = new GetMonthlyBudgets(monthlyBudgetRepo);
        usecase.execute().then((data) => {
            setBudgets(data);
            setLoading(false);
        });
    }, []);

    return { budgets, loading };
}
