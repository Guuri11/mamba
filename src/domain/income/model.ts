export interface IncomeProps {
    id: string;
    categoryId: string;
    amount: number;
    date: string; // ISO
    description?: string;
    budgetId: string;
}

export class Income {
    readonly id: string;
    readonly categoryId: string;
    readonly amount: number;
    readonly date: string;
    readonly description?: string;
    readonly budgetId: string;

    constructor(props: IncomeProps) {
        this.id = props.id;
        this.categoryId = props.categoryId;
        this.amount = props.amount;
        this.date = props.date;
        this.description = props.description;
        this.budgetId = props.budgetId;
    }
}
