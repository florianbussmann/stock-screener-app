import { yahooFinance } from "$lib/yahoo";

export async function load({ params }) {
    const symbol = params.stock;

    try {
        const quote = await yahooFinance.quote(symbol);

        return {
            props: {
                symbol: params.stock
            },
            stockData: quote
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                symbol: params.stock
            },
            stockData: undefined,
            error: 'Failed to fetch stock data.'
        };
    }
}
