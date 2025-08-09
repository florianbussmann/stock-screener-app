import { yahooFinance } from "$lib/yahoo";
import { calculateRSI } from "$lib/indicators";

export async function GET({ url }) {
    const symbol = url.searchParams.get('symbol');

    const today = new Date();
    const twoYearsAgo = new Date(today)
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    const period1 = twoYearsAgo.toISOString().split('T')[0];
    const period2 = today.toISOString().split('T')[0];

    const result = await yahooFinance.chart(symbol, {
        period1,
        period2,
        interval: '1d'
    });

    const rsi = calculateRSI(result.quotes
        .filter(q => q.close !== null && q.date)
        .map(q => ({
            time: q.date.toISOString().slice(0, 10), // "YYYY-MM-DD"
            value: q.close!,                         // or q.adjclose if you prefer
        })), 14).at(-1)?.value;

    return new Response(JSON.stringify({ symbol, rsi }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
