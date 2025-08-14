import { useEffect, useState } from "react";

import { GetBudgetCategoriesByBudget } from "../../application/usecases/budget-category/get-budget-categories-by-budget";
import { BudgetCategory } from "../../domain/budget-category/model";
import { InMemoryBudgetCategoryRepository } from "../../infrastructure/repositories/budget-category/in-memory-budget-category-repository";

export function useBudgetCategories(budgetId: string) {
    const [categories, setCategories] = useState<BudgetCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const repo = new InMemoryBudgetCategoryRepository();
        const usecase = new GetBudgetCategoriesByBudget(repo);
        usecase.execute(budgetId).then((data) => {
            setCategories(data);
            setLoading(false);
        });
    }, [budgetId]);

    return { categories, loading };
}
