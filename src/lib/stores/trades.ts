import type { Trade } from '$lib/schema';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'trades';

export function loadTrades(): Trade[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse trades from localStorage', e);
        return [];
    }
}

function persistTrades(trades: Trade[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trades));
}

function createTradeStore() {
    const initial = loadTrades();
    const { subscribe, set, update } = writable<Trade[]>(initial);

    return {
        subscribe,

        add(trade: Trade) {
            update((trades) => {
                const updated = [...trades, trade];
                persistTrades(updated);
                return updated;
            });
        },

        remove(id: string) {
            update((trades) => {
                const updated = trades.filter((t) => t.id !== id);
                persistTrades(updated);
                return updated;
            });
        },

        clear() {
            set([]);
            persistTrades([]);
        }
    };
}

export const trades = createTradeStore();
