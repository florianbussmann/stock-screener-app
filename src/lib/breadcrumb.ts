import type { MenuItem } from '$lib/menu';

export function findBreadcrumb(
    path: string,
    items: MenuItem[],
    trail: MenuItem[] = []
): MenuItem[] | null {
    for (const item of items) {
        const newTrail = [...trail, item];
        if (item.path === path) return newTrail;

        if (item.children) {
            const result = findBreadcrumb(path, item.children, newTrail);
            if (result) return result;
        }
    }
    return null;
}