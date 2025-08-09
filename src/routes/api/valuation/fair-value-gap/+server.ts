import { getCurrentPrice } from "$lib/performance";
import { yahooFinance } from "$lib/yahoo";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
    const symbol: string = url.searchParams.get('symbol') || '';

    const [quoteSummary, quote] = await Promise.all([
        yahooFinance.quoteSummary(symbol, { modules: ['defaultKeyStatistics', 'earningsTrend'] }),
        yahooFinance.quote(symbol)
    ]);

    const currency = quote.currency;

    if (!quoteSummary.defaultKeyStatistics) {
        return json([], { status: 500 });
    }

    const EPS = quoteSummary.defaultKeyStatistics.trailingEps;
    const earningsTrend = quoteSummary.earningsTrend?.trend || [];
    let growthRateFraction = earningsTrend.find(t => t.period === '+5y')?.growth;
    if (!growthRateFraction) {
        growthRateFraction = earningsTrend.find(t => t.period === '+1y')?.growth;
    }
    const growthRatePercent = growthRateFraction != null ? growthRateFraction * 100 : null;

    const bondYield = 5.45; // TODO fetch from https://fred.stlouisfed.org/series/AAA
    const bondYieldAverage = 3.87 // average from 10 year monthly value

    if (EPS == null || growthRatePercent == null || bondYield == null) {
        return json({ error: `Missing data: EPS=${EPS}, growthRate=${growthRatePercent}, bondYield=${bondYield}` }, { status: 500 });
    }

    const fairValue = (EPS * (8.5 + 2 * growthRatePercent) * bondYieldAverage) / bondYield;
    const currentPrice = getCurrentPrice(quote);
    const fairValueGap = fairValue - currentPrice;
    const fairValueGapPercent = (fairValueGap / currentPrice) * 100;

    return new Response(JSON.stringify({
        EPS,
        currency,
        fairValue,
        fairValueGap,
        fairValueGapPercent,
    }));
}
