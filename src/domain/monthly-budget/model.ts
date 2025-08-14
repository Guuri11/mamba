// Domain model for MonthlyBudget

export interface MonthlyBudgetProps {
    id: string;
    month: string; // Format: YYYY-MM
    name: string;
    total: number;
    initialBalance: number;
    finalBalance: number;
}

export class MonthlyBudget {
    readonly id: string;
    readonly month: string;
    readonly name: string;
    readonly total: number;
    readonly initialBalance: number;
    readonly finalBalance: number;

    constructor(props: MonthlyBudgetProps) {
        this.id = props.id;
        this.month = props.month;
        this.name = props.name;
        this.total = props.total;
        this.initialBalance = props.initialBalance;
        this.finalBalance = props.finalBalance;
    }
}
