import { json } from '@sveltejs/kit';
import { yahooFinance } from "$lib/yahoo";

import { type Trade } from '$lib/schema.js';

export async function POST({ request }) {
    const trade: Trade = await request.json();
    try {
        const currentPrice = (await yahooFinance.quote(trade.symbol)).regularMarketPrice;

        if (currentPrice) {
            const capitalGain = (currentPrice - trade.price) * trade.shares;
            const capitalReturnPercent = (capitalGain / (trade.price * trade.shares)) * 100;

            return json({
                capitalGain,
                capitalReturnPercent,
            });
        }
    } catch (err) {
        return json({ error: err }, { status: 500 });
    }
}
