import { useEffect, useState } from "react";

import { GetMonthlyBudgetDetail } from "../../application/usecases/monthly-budget/get-monthly-budget-detail";
import { MonthlyBudget } from "../../domain/monthly-budget/model";
import { InMemoryMonthlyBudgetRepository } from "../../infrastructure/repositories/monthly-budget/in-memory-monthly-budget-repository";

export function useMonthlyBudgetDetail(id: string) {
    const [budget, setBudget] = useState<MonthlyBudget | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const repo = new InMemoryMonthlyBudgetRepository();
        const usecase = new GetMonthlyBudgetDetail(repo);
        usecase.execute(id).then((data) => {
            setBudget(data);
            setLoading(false);
        });
    }, [id]);

    return { budget, loading };
}
