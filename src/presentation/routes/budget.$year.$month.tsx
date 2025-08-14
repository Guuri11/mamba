import { useIncomeCategoryStore } from "../lib/stores/income-category-store";
import { useIncomeStore } from "../lib/stores/income-store";
import { Income } from "../../domain/income/model";
import { AddIncomeUseCase } from "../../application/usecases/income/add-income";
import { GetIncomesByBudget } from "../../application/usecases/income/get-incomes-by-budget";
import { PostgresIncomeRepository } from "@infrastructure/repositories/income/postgres-income-repository";
import { IncomeCategory } from "../../domain/income-category/model";
import { Button } from "../components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { BudgetCategory } from "../../domain/budget-category/model";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { BudgetCategoryForm } from "../components/budget-category-form";
import { useBudgetCategoryStore } from "../lib/stores/budget-category-store";
import { useExpenseStore } from "../lib/stores/expense-store";
import { Expense } from "../../domain/expense/model";
import { AddExpenseUseCase } from "../../application/usecases/expense/add-expense";
import { GetExpensesByBudget } from "../../application/usecases/expense/get-expenses-by-budget";
import { GetMonthlyBudgetByYearMonth } from "../../application/usecases/monthly-budget/get-monthly-budget-by-year-month";
import { useDeviationThresholdStore } from "../lib/stores/deviation-threshold-store";
import { DeviationAlertIcon } from "../components/ui/deviation-alert-icon";
import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { GetBudgetCategoriesByBudget } from "../../application/usecases/budget-category/get-budget-categories-by-budget";
import { GetIncomeCategoriesByBudget } from "../../application/usecases/income-category/get-income-categories-by-budget";

import { MambaSidebar } from "~/components/mamba-sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { MonthlyBudget } from "../../domain/monthly-budget/model";

import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
} from "../components/ui/table";
import { monthlyBudgetRepo } from "@infrastructure/repositories/monthly-budget/repo-singleton";
import { PostgresBudgetCategoryRepository } from "@infrastructure/repositories/budget-category/postgres-budget-category-repository";
import { PostgresExpenseRepository } from "@infrastructure/repositories/expense/postgres-expense-repository";
import { PostgresIncomeCategoryRepository } from "@infrastructure/repositories/income-category/postgres-income-category-repository";

export const Route = createFileRoute("/budget/$year/$month")({
    component: RouteComponent,
});

// Singleton repository instances
const expenseRepo = new PostgresExpenseRepository();
const categoryRepo = new PostgresBudgetCategoryRepository();
const incomeCategoryRepo = new PostgresIncomeCategoryRepository();
const incomeRepo = new PostgresIncomeRepository();

// Use case instances
const addExpenseUseCase = new AddExpenseUseCase(expenseRepo, categoryRepo);
const getBudgetCategoriesUseCase = new GetBudgetCategoriesByBudget(categoryRepo);
const getIncomeCategoriesUseCase = new GetIncomeCategoriesByBudget(incomeCategoryRepo);
const getMonthlyBudgetByYearMonthUseCase = new GetMonthlyBudgetByYearMonth(monthlyBudgetRepo);
const getExpensesByBudgetUseCase = new GetExpensesByBudget(expenseRepo);
const addIncomeUseCase = new AddIncomeUseCase(incomeRepo, incomeCategoryRepo);
const getIncomesByBudgetUseCase = new GetIncomesByBudget(incomeRepo);

function RouteComponent() {
    // State for register expense modal and form
    const [openRegisterExpense, setOpenRegisterExpense] = useState(false);
    const [registerDate, setRegisterDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [registerAmount, setRegisterAmount] = useState("");
    const [registerDescription, setRegisterDescription] = useState("");
    const [registerCategory, setRegisterCategory] = useState("");
    const [registerError, setRegisterError] = useState("");
    // Income register state
    const [openRegisterIncome, setOpenRegisterIncome] = useState(false);
    const [registerIncomeDate, setRegisterIncomeDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [registerIncomeAmount, setRegisterIncomeAmount] = useState("");
    const [registerIncomeDescription, setRegisterIncomeDescription] = useState("");
    const [registerIncomeCategory, setRegisterIncomeCategory] = useState("");
    const [registerIncomeError, setRegisterIncomeError] = useState("");
    // Removed duplicate destructuring of income category store (now handled below)
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [editIncome, setEditIncome] = useState<IncomeCategory | null>(null);
    const [editExpense, setEditExpense] = useState<BudgetCategory | null>(null);
    const {
        categories,
        setCategories: setBudgetCategories,
        addCategory: addBudgetCategory,
        updateCategory,
        removeCategory: removeBudgetCategory,
    } = useBudgetCategoryStore();
    const { expenses, setExpenses } = useExpenseStore();
    const {
        categories: incomeCategories,
        setCategories: setIncomeCategories,
        addCategory: addIncomeCategory,
        updateCategory: updateIncomeCategory,
        removeCategory: removeIncomeCategory,
    } = useIncomeCategoryStore();
    const { incomes, setIncomes } = useIncomeStore();
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const { threshold, setThreshold } = useDeviationThresholdStore();
    const [showOnlyDeviations, setShowOnlyDeviations] = useState(false);
    // Helper to calculate deviation percent
    function getDeviationPercent(actual: number, planned: number) {
        if (planned === 0) return 0;
        return Math.abs((actual - planned) / planned) * 100;
    }
    const { t } = useTranslation();
    const { year, month } = useParams({ from: "/budget/$year/$month" });
    const [budget, setBudget] = useState<MonthlyBudget | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBudget() {
            setLoading(true);
            const data = await getMonthlyBudgetByYearMonthUseCase.execute(year, month);
            setBudget(data);
            setLoading(false);
        }
        fetchBudget();
    }, [year, month]);

    useEffect(() => {
        if (!budget) return;
        async function fetchData() {
            const budgetId = budget!.id;
            if (categories.length === 0) {
                const data = await getBudgetCategoriesUseCase.execute(budgetId);
                setBudgetCategories(data);
            }
            if (incomeCategories.length === 0) {
                const data = await getIncomeCategoriesUseCase.execute(budgetId);
                setIncomeCategories(data);
            }
            // Expenses
            const expensesData = await getExpensesByBudgetUseCase.execute(budgetId);
            setExpenses(expensesData);
            // Incomes
            const incomesData = await getIncomesByBudgetUseCase.execute(budgetId);
            setIncomes(incomesData);
        }
        fetchData();
    }, [budget, categories.length, incomeCategories.length]);

    if (loading || !budget) return <div>{t("monthlyBudget.loading")}</div>;

    // Totals for expense categories
    const totalPlanned = categories.reduce((sum, c) => sum + c.planned, 0);
    // Actual is now sum of all expenses for this budget
    const totalActual = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDiff = totalActual - totalPlanned;

    // Totals for income categories
    const totalIncomePlanned = incomeCategories.reduce((sum, c) => sum + c.planned, 0);
    const totalIncomeActual = incomeCategories.reduce((sum, c) => sum + c.actual, 0);
    const totalIncomeDiff = totalIncomeActual - totalIncomePlanned;

    const filteredCategories = showOnlyDeviations
        ? categories.filter((cat) => getDeviationPercent(cat.actual, cat.planned) > threshold)
        : categories;
    const filteredIncomeCategories = showOnlyDeviations
        ? incomeCategories.filter((cat) => getDeviationPercent(cat.actual, cat.planned) > threshold)
        : incomeCategories;

    // --- Register Table helpers for incomes ---
    const sortedIncomes = incomes
        .slice()
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });

    return (
        <MambaSidebar>
            <div className="w-full p-6">
                <Tabs defaultValue="summary" className="w-full">
                    <TabsList>
                        <TabsTrigger value="summary">{t("budget.summaryTab")}</TabsTrigger>
                        <TabsTrigger value="register">{t("budget.registerTab")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="w-full">
                        {/* --- Summary View (existing content) --- */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm">
                        {t("deviation.deviationThreshold")}
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="border rounded px-2 py-1 w-16 text-right"
                        />
                        %
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showOnlyDeviations}
                            onChange={(e) => setShowOnlyDeviations(e.target.checked)}
                        />
                        {t("deviation.showOnlyDeviations")}
                    </label>
                </div>
                        <h1 className="text-2xl font-bold mb-6">
                            {t("monthlyBudget.detailTitle", { month: budget.name })}
                        </h1>
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                </div>
                        <div className="mb-4">
                </div>
                        <div className="flex gap-8 w-full justify-between">
                    <div className="mb-8 flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold">
                                {t("budgetCategory.comparisonTitle")}
                            </h2>
                            <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        + {t("budgetCategory.addCategory")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("budgetCategory.addExpenseCategory")}</DialogTitle>
                                    </DialogHeader>
                                    <BudgetCategoryForm
                                        initial={{ type: "expense", name: "", planned: 0 }}
                                        onSubmit={(data) => {
                                            addBudgetCategory(
                                                new BudgetCategory({
                                                    id: `c${Date.now()}`,
                                                    name: data.name,
                                                    planned: data.planned,
                                                    actual: 0,
                                                    budgetId: budget.id,
                                                })
                                            );
                                            setOpenExpenseDialog(false);
                                        }}
                                        onCancel={() => setOpenExpenseDialog(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted">
                                        <TableHead className="text-left">
                                            {t("budgetCategory.category")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("budgetCategory.planned")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("budgetCategory.actual")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("budgetCategory.difference")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("actions.title")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((cat) => {
                                        const diff = cat.actual - cat.planned;
                                        // For expenses: overspending (diff > 0) is bad (red), underspending (diff < 0) is good (green)
                                        const diffClass =
                                            diff > 0
                                                ? "text-red-600"
                                                : diff < 0
                                                    ? "text-green-600"
                                                    : "";
                                        const deviation = getDeviationPercent(
                                            cat.actual,
                                            cat.planned,
                                        );
                                        const highlight = deviation > threshold;
                                        return (
                                            <TableRow
                                                key={cat.id}
                                                className={highlight ? "bg-yellow-100/60" : ""}
                                            >
                                                <TableCell>
                                                    {highlight && <DeviationAlertIcon />}
                                                    {cat.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{cat.planned.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{cat.actual.toLocaleString()}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-semibold ${diffClass}`}
                                                >
                                                    {diff > 0 ? "+" : ""}
                                                    {diff.toLocaleString("es-ES", {
                                                        minimumFractionDigits: 0,
                                                    })}
                                                    €
                                                    {highlight && (
                                                        <span className="ml-2 text-yellow-600 font-bold">
                                                            {deviation.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right flex gap-1 justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setEditExpense(new BudgetCategory(cat))}
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeBudgetCategory(cat.id)}
                                                    >
                                                        <Trash2Icon className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {/* Edit Dialog for Expense */}
                                    <Dialog
                                        open={!!editExpense}
                                        onOpenChange={(open) => !open && setEditExpense(null)}
                                    >
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{t("budgetCategory.editExpenseCategory")}</DialogTitle>
                                            </DialogHeader>
                                            {editExpense && (
                                                <BudgetCategoryForm
                                                    initial={{
                                                        name: editExpense.name,
                                                        planned: editExpense.planned,
                                                        type: "expense",
                                                    }}
                                                    onSubmit={(data) => {
                                                        updateCategory(
                                                            new BudgetCategory({
                                                                ...editExpense,
                                                                name: data.name,
                                                                planned: data.planned,
                                                            }),
                                                        );
                                                        setEditExpense(null);
                                                    }}
                                                    onCancel={() => setEditExpense(null)}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold border-t">
                                        <TableCell>{t("budgetCategory.total")}</TableCell>
                                        <TableCell className="text-right">
                                            €{totalPlanned.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            €{totalActual.toLocaleString()}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${totalDiff > 0 ? "text-red-600" : totalDiff < 0 ? "text-green-600" : ""}`}
                                        >
                                            {totalDiff > 0 ? "+" : totalDiff < 0 ? "-" : ""}
                                            {Math.abs(totalDiff).toLocaleString("es-ES", {
                                                minimumFractionDigits: 0,
                                            })}
                                            €
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                    <div className="mb-8 flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold mb-2">
                                {t("incomeCategory.comparisonTitle")}
                            </h2>
                            <Dialog open={openIncomeDialog} onOpenChange={setOpenIncomeDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        + {t("incomeCategory.addCategory")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("incomeCategory.addIncomeCategory")}</DialogTitle>
                                    </DialogHeader>
                                    <BudgetCategoryForm
                                        initial={{ type: "income", name: "", planned: 0 }}
                                        onSubmit={(data) => {
                                            addIncomeCategory(
                                                new IncomeCategory({
                                                    id: `i${Date.now()}`,
                                                    name: data.name,
                                                    planned: data.planned,
                                                    actual: 0,
                                                    budgetId: budget.id,
                                                }),
                                            );
                                            setOpenIncomeDialog(false);
                                        }}
                                        onCancel={() => setOpenIncomeDialog(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted">
                                        <TableHead className="text-left">
                                            {t("incomeCategory.category")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("incomeCategory.planned")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("incomeCategory.actual")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("incomeCategory.difference")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("actions.title")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIncomeCategories.map((cat) => {
                                        const diff = cat.actual - cat.planned;
                                        const diffClass =
                                            diff < 0
                                                ? "text-red-600"
                                                : diff > 0
                                                  ? "text-green-600"
                                                  : "";
                                        const deviation = getDeviationPercent(
                                            cat.actual,
                                            cat.planned,
                                        );
                                        const highlight = deviation > threshold;
                                        return (
                                            <TableRow
                                                key={cat.id}
                                                className={highlight ? "bg-yellow-100/60" : ""}
                                            >
                                                <TableCell>
                                                    {highlight && <DeviationAlertIcon />}
                                                    {cat.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{cat.planned.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{cat.actual.toLocaleString()}
                                                </TableCell>
                                                <TableCell
                                                    className={`text-right font-semibold ${diffClass}`}
                                                >
                                                    {diff > 0 ? "+" : ""}
                                                    {diff.toLocaleString("es-ES", {
                                                        minimumFractionDigits: 0,
                                                    })}
                                                    €
                                                    {highlight && (
                                                        <span className="ml-2 text-yellow-600 font-bold">
                                                            {deviation.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right flex gap-1 justify-end">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setEditIncome(cat)}
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeIncomeCategory(cat.id)}
                                                    >
                                                        <Trash2Icon className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {/* Edit Dialog for Income */}
                                    <Dialog
                                        open={!!editIncome}
                                        onOpenChange={(open) => !open && setEditIncome(null)}
                                    >
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {t("incomeCategory.editIncomeCategory")}
                                                </DialogTitle>
                                            </DialogHeader>
                                            {editIncome && (
                                                <BudgetCategoryForm
                                                    initial={{
                                                        name: editIncome.name,
                                                        planned: editIncome.planned,
                                                        type: "income",
                                                    }}
                                                    onSubmit={(data) => {
                                                        updateIncomeCategory(
                                                            new IncomeCategory({
                                                                ...editIncome,
                                                                name: data.name,
                                                                planned: data.planned,
                                                            }),
                                                        );
                                                        setEditIncome(null);
                                                    }}
                                                    onCancel={() => setEditIncome(null)}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="font-bold border-t">
                                        <TableCell>{t("incomeCategory.total")}</TableCell>
                                        <TableCell className="text-right">
                                            €{totalIncomePlanned.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            €{totalIncomeActual.toLocaleString()}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${totalIncomeDiff < 0 ? "text-red-600" : totalIncomeDiff > 0 ? "text-green-600" : ""}`}
                                        >
                                            {totalIncomeDiff > 0 ? "+" : ""}
                                            {totalIncomeDiff.toLocaleString("es-ES", {
                                                minimumFractionDigits: 0,
                                            })}
                                            €
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                </div>
                            </TabsContent>
                    <TabsContent value="register" className="w-full">
                        {/* --- Register View (list of all transactions) --- */}
                        <h2 className="text-xl font-bold mb-4">{t("budget.registerTab")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Expenses Register Column */}
                            <div>
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => setOpenRegisterExpense(true)}>{t("budget.registerExpense")}</Button>
                                </div>
                                <Dialog open={openRegisterExpense} onOpenChange={setOpenRegisterExpense}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t("budget.registerTitle")}</DialogTitle>
                                        </DialogHeader>
                                        <form
                                            className="flex flex-col gap-4"
                                            onSubmit={async e => {
                                                e.preventDefault();
                                                if (!registerAmount || isNaN(Number(registerAmount)) || Number(registerAmount) <= 0) {
                                                    setRegisterError(t("budget.amountPositive"));
                                                    return;
                                                }
                                                if (!registerCategory) {
                                                    setRegisterError(t("budget.selectCategory"));
                                                    return;
                                                }
                                                // Find category by name
                                                const cat = categories.find(c => c.name === registerCategory);
                                                if (!cat) {
                                                    setRegisterError(t("budget.selectValidCategory"));
                                                    return;
                                                }
                                                const expense = new Expense({
                                                    id: `e${Date.now()}`,
                                                    categoryId: cat.id,
                                                    amount: Number(registerAmount),
                                                    date: registerDate,
                                                    description: registerDescription,
                                                    budgetId: budget.id,
                                                });
                                                if (!budget) return;
                                                await addExpenseUseCase.execute(expense, budget.id);
                                                // Update stores from repo
                                                const updatedExpenses = await getExpensesByBudgetUseCase.execute(budget.id);
                                                setExpenses(updatedExpenses);
                                                const updatedCategories = await getBudgetCategoriesUseCase.execute(budget.id);
                                                setBudgetCategories(updatedCategories);
                                                setOpenRegisterExpense(false);
                                                setRegisterAmount("");
                                                setRegisterDescription("");
                                                setRegisterCategory("");
                                                setRegisterDate(new Date().toISOString().slice(0, 10));
                                                setRegisterError("");
                                            }}
                                        >
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.date")}</label>
                                                <input
                                                    type="date"
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerDate}
                                                    onChange={e => setRegisterDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.amount")}</label>
                                                <input
                                                    type="number"
                                                    min={0.01}
                                                    step="0.01"
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerAmount}
                                                    onChange={e => setRegisterAmount(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.description")}</label>
                                                <input
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerDescription}
                                                    onChange={e => setRegisterDescription(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.category")}</label>
                                                <select
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerCategory}
                                                    onChange={e => setRegisterCategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="">{t("budget.selectCategoryOption")}</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {registerError && <div className="text-red-600 text-sm">{registerError}</div>}
                                            <div className="flex gap-2 justify-end">
                                                <Button type="button" variant="outline" onClick={() => setOpenRegisterExpense(false)}>
                                                    {t("budget.cancel")}
                                                </Button>
                                                <Button type="submit">{t("budget.save")}</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted">
                                                <TableHead>{t("budget.date")}</TableHead>
                                                <TableHead>{t("budget.expense")}</TableHead>
                                                <TableHead>{t("budget.category")}</TableHead>
                                                <TableHead>{t("budget.description")}</TableHead>
                                                <TableHead className="text-right">{t("budget.amount")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {expenses
                                                .sort((a, b) => {
                                                    const dateA = a.date ? new Date(a.date).getTime() : 0;
                                                    const dateB = b.date ? new Date(b.date).getTime() : 0;
                                                    return dateB - dateA;
                                                })
                                                .map((item) => {
                                                    const cat = categories.find(c => c.id === item.categoryId);
                                                    return (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</TableCell>
                                                            <TableCell>{t("budget.expense")}</TableCell>
                                                            <TableCell>{cat ? cat.name : '-'}</TableCell>
                                                            <TableCell>{item.description || '-'}</TableCell>
                                                            <TableCell className="text-right">
                                                                €{item.amount.toLocaleString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            {/* Incomes Register Column */}
                            <div>
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => setOpenRegisterIncome(true)}>{t("budget.registerIncome")}</Button>
                                </div>
                                <Dialog open={openRegisterIncome} onOpenChange={setOpenRegisterIncome}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t("budget.registerIncomeTitle")}</DialogTitle>
                                        </DialogHeader>
                                        <form
                                            className="flex flex-col gap-4"
                                            onSubmit={async e => {
                                                e.preventDefault();
                                                if (!registerIncomeAmount || isNaN(Number(registerIncomeAmount)) || Number(registerIncomeAmount) <= 0) {
                                                    setRegisterIncomeError(t("budget.amountPositive"));
                                                    return;
                                                }
                                                if (!registerIncomeCategory) {
                                                    setRegisterIncomeError(t("budget.selectCategory"));
                                                    return;
                                                }
                                                // Find category by name
                                                const cat = incomeCategories.find(c => c.name === registerIncomeCategory);
                                                if (!cat) {
                                                    setRegisterIncomeError(t("budget.selectValidCategory"));
                                                    return;
                                                }
                                                const income = new Income({
                                                    id: `i${Date.now()}`,
                                                    categoryId: cat.id,
                                                    amount: Number(registerIncomeAmount),
                                                    date: registerIncomeDate,
                                                    description: registerIncomeDescription,
                                                    budgetId: budget.id,
                                                });
                                                if (!budget) return;
                                                await addIncomeUseCase.execute(income, budget.id);
                                                // Update stores from repo
                                                const updatedIncomes = await getIncomesByBudgetUseCase.execute(budget.id);
                                                setIncomes(updatedIncomes);
                                                const updatedCategories = await getIncomeCategoriesUseCase.execute(budget.id);
                                                setIncomeCategories(updatedCategories);
                                                setOpenRegisterIncome(false);
                                                setRegisterIncomeAmount("");
                                                setRegisterIncomeDescription("");
                                                setRegisterIncomeCategory("");
                                                setRegisterIncomeDate(new Date().toISOString().slice(0, 10));
                                                setRegisterIncomeError("");
                                            }}
                                        >
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.date")}</label>
                                                <input
                                                    type="date"
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerIncomeDate}
                                                    onChange={e => setRegisterIncomeDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.amount")}</label>
                                                <input
                                                    type="number"
                                                    min={0.01}
                                                    step="0.01"
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerIncomeAmount}
                                                    onChange={e => setRegisterIncomeAmount(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.description")}</label>
                                                <input
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerIncomeDescription}
                                                    onChange={e => setRegisterIncomeDescription(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">{t("budget.category")}</label>
                                                <select
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={registerIncomeCategory}
                                                    onChange={e => setRegisterIncomeCategory(e.target.value)}
                                                    required
                                                >
                                                    <option value="">{t("budget.selectCategoryOption")}</option>
                                                    {incomeCategories.map(cat => (
                                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {registerIncomeError && <div className="text-red-600 text-sm">{registerIncomeError}</div>}
                                            <div className="flex gap-2 justify-end">
                                                <Button type="button" variant="outline" onClick={() => setOpenRegisterIncome(false)}>
                                                    {t("budget.cancel")}
                                                </Button>
                                                <Button type="submit">{t("budget.save")}</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted">
                                                <TableHead>{t("budget.date")}</TableHead>
                                                <TableHead>{t("budget.income")}</TableHead>
                                                <TableHead>{t("budget.category")}</TableHead>
                                                <TableHead>{t("budget.description")}</TableHead>
                                                <TableHead className="text-right">{t("budget.amount")}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedIncomes.map((item) => {
                                                const cat = incomeCategories.find(c => c.id === item.categoryId);
                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</TableCell>
                                                        <TableCell>{t("budget.income")}</TableCell>
                                                        <TableCell>{cat ? cat.name : '-'}</TableCell>
                                                        <TableCell>{item.description || '-'}</TableCell>
                                                        <TableCell className="text-right">
                                                            €{item.amount.toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MambaSidebar>
    );
}


