import { createFileRoute, Link } from '@tanstack/react-router';

import { useEffect, useState } from 'react';
import { useMonthlyBudgetStore } from '../lib/stores/monthly-budget-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { MonthlyBudgetForm } from '../components/monthly-budget-form';
import { MonthlyBudget } from '../../domain/monthly-budget/model';
import { Button } from '../components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { AssistantFAB } from '~/components/assistant-fab';
import { useTranslation } from 'react-i18next';
import { MambaSidebar } from '~/components/mamba-sidebar';


export const Route = createFileRoute('/monthly-budget')({
  component: RouteComponent,
});


function RouteComponent() {
  const { t } = useTranslation();
  const { budgets, fetchBudgets, addBudget, removeBudget } = useMonthlyBudgetStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return (
    <MambaSidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{t('monthlyBudget.title')}</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">+ {t('monthlyBudget.add')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('monthlyBudget.addTitle')}</DialogTitle>
              </DialogHeader>
              <MonthlyBudgetForm
                onSubmit={async (data) => {
                  await addBudget(new MonthlyBudget(data));
                  setOpenDialog(false);
                }}
                onCancel={() => setOpenDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {budgets.map((budget) => {
            const [year, month] = budget.month.split('-');
            return (
              <li key={budget.id} className="border rounded p-4 hover:bg-muted cursor-pointer flex flex-col items-start relative group">
                <Link
                  to="/budget/$year/$month"
                  params={{ year, month }}
                  className="flex flex-col gap-1 w-full h-full no-underline text-inherit"
                >
                  <div className="font-semibold">{budget.name}</div>
                  <div className="text-sm text-muted-foreground">{budget.month}</div>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                  onClick={async (e) => {
                    e.preventDefault();
                    setDeletingId(budget.id);
                    await removeBudget(budget.id);
                    setDeletingId(null);
                  }}
                  disabled={deletingId === budget.id}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
      <AssistantFAB />
    </MambaSidebar>
  );
}
