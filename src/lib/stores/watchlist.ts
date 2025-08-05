import { get, writable, type Writable } from 'svelte/store';

function createWatchlist(): Writable<string[]> {
    const isBrowser = typeof window !== 'undefined';

    let initial: string[] = [];
    if (isBrowser) {
        const stored = localStorage.getItem('watchlist');
        initial = stored ? JSON.parse(stored) : [];
    }

    const store = writable<string[]>(initial);

    if (isBrowser) {
        store.subscribe((value) => {
            localStorage.setItem('watchlist', JSON.stringify(value));
        });
    }

    return store;
}

export function addToWatchlist(newSymbol: string) {
    if (newSymbol && !isInWatchlist(newSymbol)) {
        watchlist.update((list) => [...list, newSymbol]);
        newSymbol = "";
    }
}

export function isInWatchlist(symbol: string) {
    return get(watchlist).includes(symbol);
}

export const watchlist = createWatchlist();
