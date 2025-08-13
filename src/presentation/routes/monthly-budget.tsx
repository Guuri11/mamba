import { createFileRoute } from '@tanstack/react-router';
import { MambaSidebar } from '~/components/mamba-sidebar';
import { useMonthlyBudgets } from '../hooks/use-monthly-budgets';
import { AssistantFAB } from '~/components/assistant-fab';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/monthly-budget')({
  component: RouteComponent,
});

function RouteComponent() {
  const { budgets, loading } = useMonthlyBudgets();
  const { t } = useTranslation();

  if (loading) return <div>{t('monthlyBudget.loading')}</div>;

  return (
    <MambaSidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('monthlyBudget.title')}</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {budgets.map((budget) => (
            <li key={budget.id} className="border rounded p-4 hover:bg-muted cursor-pointer flex flex-col items-start">
              <div className="font-semibold">{budget.name}</div>
              <div className="text-sm text-muted-foreground">{budget.month}</div>
              <div className="text-lg font-mono">${budget.total.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
      <AssistantFAB />
    </MambaSidebar>
  );
}
