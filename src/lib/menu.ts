export interface MenuItem {
    name: string;
    path: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        name: 'Trades',
        path: '/trades',
    },
    {
        name: 'Watchlist',
        path: '/watchlist',
    },
]
