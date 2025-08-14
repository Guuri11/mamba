export interface ExpenseProps {
    id: string;
    categoryId: string;
    amount: number;
    date: string; // ISO
    description?: string;
}

export class Expense {
    readonly id: string;
    readonly categoryId: string;
    readonly amount: number;
    readonly date: string;
    readonly description?: string;

    constructor(props: ExpenseProps) {
        this.id = props.id;
        this.categoryId = props.categoryId;
        this.amount = props.amount;
        this.date = props.date;
        this.description = props.description;
    }
}
