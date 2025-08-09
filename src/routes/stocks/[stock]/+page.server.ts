import { calculateSMA, calculateRSI } from "$lib/indicators";
import { yahooFinance } from "$lib/yahoo";


export async function load({ params }) {
    const symbol = params.stock;

    try {
        const quote = await yahooFinance.quote(symbol);

        const today = new Date();
        const twoYearsAgo = new Date(today)
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        const period1 = twoYearsAgo.toISOString().split('T')[0];
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
        const smaData = calculateSMA(chartData, 200);
        const rsiData = calculateRSI(chartData, 14);

        return {
            props: {
                symbol: params.stock
            },
            stockData: quote,
            chartData: chartData,
            smaData: smaData,
            rsiData: rsiData,
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                symbol: params.stock
            },
            stockData: undefined,
            chartData: [],
            smaData: [],
            rsiData: [],
            error: 'Failed to fetch stock data.'
        };
    }
}
