import { type Trade } from "./schema";

export async function computeTradeReturn(trade: Trade) {
    const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade)
    });

    if (!res.ok) {
        throw new Error('Failed to fetch performance');
    }

    const result = await res.json();
    return { ...trade, ...result };
}