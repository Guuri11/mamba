// Infrastructure: NavigationRepository implementation using a local JSON file

import { NavigationBar } from "../../domain/navigation/model";
import { NavigationRepository } from "../../domain/navigation/repository";

export class JsonNavigationRepository implements NavigationRepository {
    constructor(private readonly data: NavigationBar) {}

    async getNavigation(): Promise<NavigationBar> {
        return this.data;
    }
}
