// Domain model for User

export interface UserProps {
    id: string;
    name: string;
    avatarUrl?: string;
}

export class User {
    readonly id: string;
    readonly name: string;
    readonly avatarUrl?: string;

    constructor(props: UserProps) {
        this.id = props.id;
        this.name = props.name;
        this.avatarUrl = props.avatarUrl;
    }
}
