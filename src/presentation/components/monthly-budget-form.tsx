import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MonthlyBudgetProps } from "../../domain/monthly-budget/model";
import { Button } from "./ui/button";

interface MonthlyBudgetFormProps {
  initial?: Partial<MonthlyBudgetProps>;
  onSubmit: (data: MonthlyBudgetProps) => void;
  onCancel: () => void;
}

  export function MonthlyBudgetForm({ initial = {}, onSubmit, onCancel }: MonthlyBudgetFormProps) {
    const { t } = useTranslation();
    const [month, setMonth] = useState(initial.month || "");
    const [name, setName] = useState(initial.name || "");
    const [initialBalance, setInitialBalance] = useState(initial.initialBalance?.toString() || "");
    const [error, setError] = useState("");

    // Helper to get month name from YYYY-MM
    function getMonthName(ym: string) {
      if (!ym) return '';
      const [year, month] = ym.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }

    // Auto-set name when month changes
    function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setMonth(value);
      setName(getMonthName(value));
    }

    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={e => {
          e.preventDefault();
          if (!month || !name || !initialBalance) {
            setError(t('form.requiredFields', 'All fields are required'));
            return;
          }
          onSubmit({
            id: initial.id || `b${Date.now()}`,
            month,
            name,
            total: 0, // Will be calculated elsewhere
            initialBalance: Number(initialBalance),
            finalBalance: Number(initialBalance), // Will be recalculated elsewhere
          });
        }}
      >
        <div>
          <label className="block text-sm font-medium mb-1">{t('monthlyBudget.month', 'Month')}</label>
          <input
            type="month"
            className="border rounded px-2 py-1 w-full"
            value={month}
            onChange={handleMonthChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('monthlyBudget.name', 'Name')}</label>
          <input
            className="border rounded px-2 py-1 w-full bg-gray-100"
            value={name}
            readOnly
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('monthlyBudget.initialBalance', 'Initial Balance')}</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full"
            value={initialBalance}
            onChange={e => setInitialBalance(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button type="submit">{t('actions.save', 'Save')}</Button>
        </div>
      </form>
    );
  }
