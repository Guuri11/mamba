// Removed duplicate interface declaration
export interface IncomeCategoryProps {
    id: string;
    name: string;
    planned: number;
    actual: number;
    date?: string; // ISO string
    description?: string;
    budgetId: string;
}

export class IncomeCategory {
    readonly id: string;
    readonly name: string;
    readonly planned: number;
    readonly actual: number;
    readonly date?: string;
    readonly description?: string;
    readonly budgetId: string;

    constructor(props: IncomeCategoryProps) {
        this.id = props.id;
        this.name = props.name;
        this.planned = props.planned;
        this.actual = props.actual;
        this.date = props.date;
        this.description = props.description;
        this.budgetId = props.budgetId;
    }

    get difference(): number {
        return this.actual - this.planned;
    }
}
