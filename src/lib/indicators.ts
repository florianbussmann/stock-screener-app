import { RSI, SMA } from 'technicalindicators';
import type { Indicator } from "technicalindicators/declarations/indicator/indicator.js";

function alignIndicatorToTime(indicatorValues: number[], chartData: any, offset: number) {
    return indicatorValues.map((value: number, idx: number) => ({
        time: chartData[idx + offset].time,
        value: parseFloat(value.toFixed(2)),
    }));
}

function calculateIndicator(indicator: typeof Indicator, chartData: any, period: number, offset: number = period) {
    const closes = chartData.map((point: { time: string, value: number; }) => point.value);

    const indicatorValues = indicator.calculate({ period: period, values: closes });

    return alignIndicatorToTime(indicatorValues, chartData, offset);
}

export function calculateSMA(chartData: any, period: number) {
    return calculateIndicator(SMA, chartData, period, period - 1);
}

export function calculateRSI(chartData: any, period: number) {
    return calculateIndicator(RSI, chartData, period);
}
