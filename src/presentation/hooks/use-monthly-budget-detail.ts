import { useEffect, useState } from "react";

import { GetMonthlyBudgetDetail } from "../../application/usecases/monthly-budget/get-monthly-budget-detail";
import { MonthlyBudget } from "../../domain/monthly-budget/model";
import { monthlyBudgetRepo } from "../../infrastructure/repositories/monthly-budget/repo-singleton";

export function useMonthlyBudgetDetail(id: string) {
    const [budget, setBudget] = useState<MonthlyBudget | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usecase = new GetMonthlyBudgetDetail(monthlyBudgetRepo);
        usecase.execute(id).then((data) => {
            setBudget(data);
            setLoading(false);
        });
    }, [id]);

    return { budget, loading };
}
