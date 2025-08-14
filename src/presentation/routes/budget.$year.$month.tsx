import { useIncomeCategoryStore } from "../lib/stores/income-category-store";
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
import { InMemoryExpenseRepository } from "../../infrastructure/repositories/expense/in-memory-expense-repository";
import { AddExpenseUseCase } from "../../application/usecases/expense/add-expense";
import { useDeviationThresholdStore } from "../lib/stores/deviation-threshold-store";
import { DeviationAlertIcon } from "../components/ui/deviation-alert-icon";
import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMonthlyBudgetDetail } from "../hooks/use-monthly-budget-detail";
import { useEffect } from "react";
import { InMemoryBudgetCategoryRepository } from "../../infrastructure/repositories/budget-category/in-memory-budget-category-repository";
import { InMemoryIncomeCategoryRepository } from "../../infrastructure/repositories/income-category/in-memory-income-category-repository";
import { MambaSidebar } from "~/components/mamba-sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
} from "../components/ui/table";

export const Route = createFileRoute("/budget/$year/$month")({
    component: RouteComponent,
});

function RouteComponent() {
    // State for register expense modal and form
    const [openRegisterExpense, setOpenRegisterExpense] = useState(false);
    const [registerDate, setRegisterDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [registerAmount, setRegisterAmount] = useState("");
    const [registerDescription, setRegisterDescription] = useState("");
    const [registerCategory, setRegisterCategory] = useState("");
    const [registerError, setRegisterError] = useState("");
    // Removed duplicate destructuring of income category store (now handled below)
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [editIncome, setEditIncome] = useState<IncomeCategory | null>(null);
    const [editExpense, setEditExpense] = useState<BudgetCategory | null>(null);
    const {
        categories,
        setCategories: setBudgetCategories,
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
    const budgetId = getBudgetIdByYearMonth(year, month);

    const { budget, loading } = useMonthlyBudgetDetail(budgetId);
    // Initial data load from repo to store (if empty)
    // In-memory singletons for demo (would be DI in real app)
    const expenseRepo = new InMemoryExpenseRepository();
    const categoryRepo = new InMemoryBudgetCategoryRepository();
    const addExpenseUseCase = new AddExpenseUseCase(expenseRepo, categoryRepo);

    useEffect(() => {
        // Only load if store is empty
        if (categories.length === 0) {
            categoryRepo.getByBudgetId(budgetId).then((data) => setBudgetCategories(data));
        }
        if (incomeCategories.length === 0) {
            const repo = new InMemoryIncomeCategoryRepository();
            repo.getByBudgetId(budgetId).then((data) => setIncomeCategories(data));
        }
        // Load expenses
        expenseRepo.getByBudgetId(budgetId).then((data) => setExpenses(data));
    }, [budgetId]);

    if (loading || !budget) return <div>{t("monthlyBudget.loading")}</div>;

    const initialBalance = budget.initialBalance;
    const finalBalance = budget.finalBalance;
    const savings = finalBalance - initialBalance;
    const isPositive = savings >= 0;
    const percent = (Math.abs(savings) / (initialBalance || 1)) * 100;

    // Totals for expense categories
    const totalPlanned = categories.reduce((sum, c) => sum + c.planned, 0);
    // Actual is now sum of all expenses for this budget
    const totalActual = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDiff = totalActual - totalPlanned;

    // Totals for income categories
    const totalIncomePlanned = incomeCategories.reduce((sum, c) => sum + c.planned, 0);
    const totalIncomeActual = incomeCategories.reduce((sum, c) => sum + c.actual, 0);
    const totalIncomeDiff = totalIncomeActual - totalIncomePlanned;

    // Filtered lists for toggle
    // For summary, still use categories, but actual is sum of expenses per category
    const categoriesWithActual = categories.map((cat) => {
        const actual = expenses.filter((e) => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0);
        return { ...cat, actual };
    });
    const filteredCategories = showOnlyDeviations
        ? categoriesWithActual.filter((cat) => getDeviationPercent(cat.actual, cat.planned) > threshold)
        : categoriesWithActual;
    const filteredIncomeCategories = showOnlyDeviations
        ? incomeCategories.filter((cat) => getDeviationPercent(cat.actual, cat.planned) > threshold)
        : incomeCategories;

    return (
        <MambaSidebar>
            <div className="w-full p-6">
                <Tabs defaultValue="summary" className="w-full">
                    <TabsList>
                        <TabsTrigger value="summary">{t("Resumen")}</TabsTrigger>
                        <TabsTrigger value="register">{t("Registro")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="w-full">
                        {/* --- Summary View (existing content) --- */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm">
                        {t("deviationThreshold")}
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
                        {t("showOnlyDeviations")}
                    </label>
                </div>
                        <h1 className="text-2xl font-bold mb-6">
                            {t("monthlyBudget.detailTitle", { month: budget.name })}
                        </h1>
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-muted-foreground text-sm mb-1">
                            {t("monthlyBudget.initialBalance")}
                        </span>
                        <span className="text-xl font-semibold">
                            €{initialBalance.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-muted-foreground text-sm mb-1">
                            {t("monthlyBudget.finalBalance")}
                        </span>
                        <span className="text-xl font-semibold">
                            €{finalBalance.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-muted-foreground text-sm mb-1">
                            {t("monthlyBudget.savings")}
                        </span>
                        <span
                            className={`text-xl font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
                        >
                            {isPositive ? "+" : "-"}€{Math.abs(savings).toLocaleString()}
                        </span>
                    </div>
                </div>
                        <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>{t("monthlyBudget.initialBalance")}</span>
                        <span>{t("monthlyBudget.finalBalance")}</span>
                    </div>
                    <div className="relative h-6 bg-muted rounded overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
                            {isPositive ? `+${percent.toFixed(1)}%` : `-${percent.toFixed(1)}%`}
                        </div>
                    </div>
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
                                        + {t("addCategory")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("addExpenseCategory")}</DialogTitle>
                                    </DialogHeader>
                                    <BudgetCategoryForm
                                        initial={{ type: "expense", name: "", planned: 0 }}
                                        onSubmit={(data) => {
                                            setBudgetCategories([
                                                ...categories,
                                                new BudgetCategory({
                                                    id: `c${Date.now()}`,
                                                    name: data.name,
                                                    planned: data.planned,
                                                    actual: 0,
                                                })
                                            ]);
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
                                            {t("actions")}
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
                                                        aria-label={t("edit")}
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeBudgetCategory(cat.id)}
                                                        aria-label={t("delete")}
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
                                                <DialogTitle>{t("editExpenseCategory")}</DialogTitle>
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
                                        + {t("addCategory")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("addIncomeCategory")}</DialogTitle>
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
                                            {t("actions")}
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
                                                        aria-label={t("edit")}
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => removeIncomeCategory(cat.id)}
                                                        aria-label={t("delete")}
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
                                                    {t("editIncomeCategory")}
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
                        <h2 className="text-xl font-bold mb-4">{t("Registro")}</h2>
                        <div className="flex justify-end mb-4">
                            <Button onClick={() => setOpenRegisterExpense(true)}>{t("Registrar gasto")}</Button>
                        </div>
                        <Dialog open={openRegisterExpense} onOpenChange={setOpenRegisterExpense}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t("Registrar gasto")}</DialogTitle>
                                </DialogHeader>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={async e => {
                                        e.preventDefault();
                                        if (!registerAmount || isNaN(Number(registerAmount)) || Number(registerAmount) <= 0) {
                                            setRegisterError(t("El importe debe ser un número positivo"));
                                            return;
                                        }
                                        if (!registerCategory) {
                                            setRegisterError(t("Debe seleccionar una categoría"));
                                            return;
                                        }
                                        // Find category by name
                                        const cat = categories.find(c => c.name === registerCategory);
                                        if (!cat) {
                                            setRegisterError(t("Debe seleccionar una categoría válida"));
                                            return;
                                        }
                                        const expense = new Expense({
                                            id: `e${Date.now()}`,
                                            categoryId: cat.id,
                                            amount: Number(registerAmount),
                                            date: registerDate,
                                            description: registerDescription,
                                        });
                                        await addExpenseUseCase.execute(expense, budgetId);
                                        // Update stores from repo
                                        const updatedExpenses = await expenseRepo.getByBudgetId(budgetId);
                                        setExpenses(updatedExpenses);
                                        const updatedCategories = await categoryRepo.getByBudgetId(budgetId);
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
                                        <label className="block text-sm font-medium mb-1">{t("Fecha")}</label>
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full"
                                            value={registerDate}
                                            onChange={e => setRegisterDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t("Importe")}</label>
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
                                        <label className="block text-sm font-medium mb-1">{t("Descripción")}</label>
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            value={registerDescription}
                                            onChange={e => setRegisterDescription(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t("Categoría")}</label>
                                        <select
                                            className="border rounded px-2 py-1 w-full"
                                            value={registerCategory}
                                            onChange={e => setRegisterCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">{t("Seleccione una categoría")}</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {registerError && <div className="text-red-600 text-sm">{registerError}</div>}
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setOpenRegisterExpense(false)}>
                                            {t("Cancelar")}
                                        </Button>
                                        <Button type="submit">{t("Guardar")}</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted">
                                        <TableHead>{t("Fecha")}</TableHead>
                                        <TableHead>{t("Tipo")}</TableHead>
                                        <TableHead>{t("Categoría")}</TableHead>
                                        <TableHead>{t("Descripción")}</TableHead>
                                        <TableHead className="text-right">{t("Importe")}</TableHead>
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
                                                    <TableCell>{t("Gasto")}</TableCell>
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
                    </TabsContent>
                </Tabs>
            </div>
        </MambaSidebar>
    );
}

// Helper to map year/month to budget id (for demo/mock only)
function getBudgetIdByYearMonth(year: string, month: string): string {
    // This should be replaced by a real lookup in a real app
    if (year === "2025" && month === "08") return "1";
    if (year === "2025" && month === "07") return "2";
    if (year === "2025" && month === "06") return "3";
    return "1";
}
