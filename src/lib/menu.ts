export interface MenuItem {
    name: string;
    path: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        name: 'Watchlist',
        path: '/watchlist',
    },
]
