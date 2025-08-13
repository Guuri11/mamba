// Repository interface for navigation data

import { NavigationBar } from "./model";

export interface NavigationRepository {
    getNavigation(): Promise<NavigationBar>;
}
