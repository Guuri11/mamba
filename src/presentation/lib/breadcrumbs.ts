import { NavigationBar, NavigationMenuItem } from "../../domain/navigation/model";

/**
 * Recursively finds the breadcrumb path for a given pathname in the navigation tree.
 * Returns an array of { label, href } for each breadcrumb segment.
 */
export function getBreadcrumbsForPath(
    navigation: NavigationBar,
    pathname: string,
): { label: string; href?: string }[] {
    // Helper to recursively search
    function search(
        items: NavigationMenuItem[],
        segments: string[],
        pathSoFar: string[],
    ): { label: string; href?: string }[] | null {
        for (const item of items) {
            const itemPath = item.url.startsWith("/") ? item.url : `/${item.url}`;
            const itemSegments = itemPath.split("/").filter(Boolean);
            const isMatch =
                segments.slice(0, itemSegments.length).join("/") === itemSegments.join("/");
            if (isMatch) {
                const crumb = { label: item.title, href: item.url };
                if (itemPath === pathname) {
                    return [crumb];
                }
                if (item.subItems) {
                    const rest = search(item.subItems, segments, pathSoFar.concat(itemSegments));
                    if (rest) return [crumb, ...rest];
                }
                if (itemPath === `/${segments.join("/")}`) {
                    return [crumb];
                }
            }
        }
        return null;
    }

    const segments = pathname.split("/").filter(Boolean);
    const result = search(navigation.menu, segments, []);
    if (!result) return [{ label: navigation.title }];
    return [{ label: navigation.title, href: "/" }, ...result];
}
