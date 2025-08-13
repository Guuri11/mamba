// Use case for fetching navigation data

import { NavigationBar } from "../../domain/navigation/model";
import { NavigationRepository } from "../../domain/navigation/repository";

export class GetNavigation {
    constructor(private readonly navigationRepository: NavigationRepository) {}

    async execute(): Promise<NavigationBar> {
        return this.navigationRepository.getNavigation();
    }
}
