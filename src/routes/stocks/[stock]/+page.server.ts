import { yahooFinance } from "$lib/yahoo";

function calculateSMA(data: {
    time: string; value: number
}[], windowSize: number) {
    const sma = [];
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        sum += data[i].value;
        if (i >= windowSize - 1) {
            if (i >= windowSize) {
                sum -= data[i - windowSize].value;
            }
            sma.push({
                time: data[i].time,
                value: sum / windowSize,
            });
        }
    }

    return sma;
}

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

        return {
            props: {
                symbol: params.stock
            },
            stockData: quote,
            chartData: chartData,
            smaData: smaData,
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
            error: 'Failed to fetch stock data.'
        };
    }
}
