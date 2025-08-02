import { yahooFinance } from "$lib/yahoo";

export async function load({ }) {
    const queryOptions = { count: 10, region: 'US' };

    try {
        const gainers = await yahooFinance.dailyGainers(queryOptions, { validateResult: false });
        const losers = await yahooFinance.dailyLosers(queryOptions, { validateResult: false });

        return {
            gainers: gainers,
            losers: losers,
        };
    } catch (error) {
        console.error(error);
        return {
            gainers: undefined,
            losers: undefined,
            error: 'Failed to fetch daily movements.'
        };
    }
}
