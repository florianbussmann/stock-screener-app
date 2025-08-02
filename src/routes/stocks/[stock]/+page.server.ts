import { yahooFinance } from "$lib/yahoo";

export async function load({ params }) {
    const symbol = params.stock;

    try {
        const quote = await yahooFinance.quote(symbol);

        const today = new Date();
        const lastYear = new Date(today)
        lastYear.setFullYear(today.getFullYear() - 1);

        const period1 = lastYear.toISOString().split('T')[0];
        const period2 = today.toISOString().split('T')[0];

        const chartData = (await yahooFinance.chart(symbol, {
            period1: period1,
            period2: period2,
            interval: "1d",
        })).quotes
            .filter(q => q.close !== null && q.date)
            .map(q => ({
                time: q.date.toISOString().slice(0, 10), // "YYYY-MM-DD"
                value: q.close!,                         // or q.adjclose if you prefer
            }));

        return {
            props: {
                symbol: params.stock
            },
            stockData: quote,
            chartData: chartData,
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                symbol: params.stock
            },
            stockData: undefined,
            chartData: [],
            error: 'Failed to fetch stock data.'
        };
    }
}
