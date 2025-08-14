import { useState } from "react";
import { Button } from "./ui/button";

export interface BudgetCategoryFormProps {
  initial?: { name: string; planned: number; type: "expense" | "income" };
  onSubmit: (data: { name: string; planned: number; type: "expense" | "income" }) => void;
  onCancel?: () => void;
}

export function BudgetCategoryForm({ initial, onSubmit, onCancel }: BudgetCategoryFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [planned, setPlanned] = useState(initial?.planned?.toString() || "");
  const [type, setType] = useState<"expense" | "income">(initial?.type || "expense");

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ name, planned: Number(planned), type });
      }}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          className="border rounded px-2 py-1 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={type}
          onChange={e => setType(e.target.value as any)}
        >
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monto previsto (€)</label>
        <input
          className="border rounded px-2 py-1 w-full"
          type="number"
          min={0}
          value={planned}
          onChange={e => setPlanned(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
