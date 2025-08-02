import { json } from '@sveltejs/kit';
import yahooFinance from 'yahoo-finance2';

export async function GET({ url }) {
    const query = url.searchParams.get('q');

    if (!query || query.length < 1) {
        return json([]);
    }

    try {
        const results = await yahooFinance.search(query);

        return json(results.quotes.filter(
            (item) => item.quoteType === 'EQUITY'
        ) ?? []);
    } catch (err) {
        console.error(err);
        return json([], { status: 500 });
    }
}
