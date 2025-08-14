// Domain model for MonthlyBudget

export interface MonthlyBudgetProps {
    id: string;
    month: string; // Format: YYYY-MM
    name: string;
}

export class MonthlyBudget {
    readonly id: string;
    readonly month: string;
    readonly name: string;

    constructor(props: MonthlyBudgetProps) {
        this.id = props.id;
        this.month = props.month;
        this.name = props.name;
    }
}
