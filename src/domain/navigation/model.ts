// Domain model for navigation structure

export interface NavigationMenuItem {
    title: string;
    url: string;
    subItems?: NavigationMenuItem[];
}

export interface NavigationBar {
    title: string;
    menu: NavigationMenuItem[];
}
