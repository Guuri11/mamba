// Removed duplicate interface declaration
export interface BudgetCategoryProps {
    id: string;
    name: string;
    planned: number;
    actual: number;
    date?: string; // ISO string
    description?: string;
}

export class BudgetCategory {
    readonly id: string;
    readonly name: string;
    readonly planned: number;
    readonly actual: number;
    readonly date?: string;
    readonly description?: string;

    constructor(props: BudgetCategoryProps) {
        this.id = props.id;
        this.name = props.name;
        this.planned = props.planned;
        this.actual = props.actual;
        this.date = props.date;
        this.description = props.description;
    }

    get difference(): number {
        return this.actual - this.planned;
    }
}
