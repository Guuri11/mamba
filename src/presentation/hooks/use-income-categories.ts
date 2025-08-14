import { useEffect, useState } from "react";

import { GetIncomeCategoriesByBudget } from "../../application/usecases/income-category/get-income-categories-by-budget";
import { IncomeCategory } from "../../domain/income-category/model";
import { InMemoryIncomeCategoryRepository } from "../../infrastructure/repositories/income-category/in-memory-income-category-repository";

export function useIncomeCategories(budgetId: string) {
    const [categories, setCategories] = useState<IncomeCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const repo = new InMemoryIncomeCategoryRepository();
        const usecase = new GetIncomeCategoriesByBudget(repo);
        usecase.execute(budgetId).then((data) => {
            setCategories(data);
            setLoading(false);
        });
    }, [budgetId]);

    return { categories, loading };
}
