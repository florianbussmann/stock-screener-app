import yahooFinance from 'yahoo-finance2';

export async function load({ }) {
    const queryOptions = { count: 10, region: 'US' };

    try {
        const result = await yahooFinance.dailyGainers(queryOptions, { validateResult: false });

        return {
            description: result.description,
            quotes: result.quotes
        };
    } catch (error) {
        console.error(error);
        return {
            description: undefined,
            quotes: undefined,
            error: 'Failed to fetch daily gainers.'
        };
    }
}
