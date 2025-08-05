<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { onMount } from "svelte";
    import { Button } from "$lib/components/ui/button";
    import PlusIcon from "@lucide/svelte/icons/plus";
    import { addToWatchlist, isInWatchlist } from "$lib/stores/watchlist";
    import {
        createChart,
        LineSeries,
        type IChartApi,
        type MouseEventParams,
    } from "lightweight-charts";

    const formatPercent = (value: number) => formatChange(value) + " %";
    const formatChange = (value: number) =>
        (value > 0 ? "+" : "") +
        new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    let { data } = $props();
    let watched = $state(false);

    let chartContainer: HTMLDivElement | undefined = $state();
    let rsiChartContainer: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (!chartContainer) return;
        if (!rsiChartContainer) return;

        const chart = createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 300,
            layout: {
                background: { color: "#ffffff" },
                textColor: "#1e293b",
            },
            grid: {
                vertLines: { color: "#e2e8f0" },
                horzLines: { color: "#e2e8f0" },
            },
        });

        const series = chart.addSeries(LineSeries);
        series.applyOptions({
            color: "#0ea5e9",
            lineWidth: 2,
            title: "Close",
        });

        const smaSeries = chart.addSeries(LineSeries);
        smaSeries.applyOptions({
            color: "red",
            lineWidth: 2,
            title: "SMA200",
        });

        const rsiChart = createChart(rsiChartContainer, {
            width: rsiChartContainer.clientWidth,
            height: 200,
            layout: {
                background: { color: "#ffffff" },
                textColor: "#1e293b",
            },
            grid: {
                vertLines: { color: "#e2e8f0" },
                horzLines: { color: "#e2e8f0" },
            },
        });

        const rsiSeries = rsiChart.addSeries(LineSeries);
        rsiSeries.applyOptions({
            color: "purple",
            lineWidth: 2,
            title: "RSI",
        });

        // Add horizontal "line" at RSI = 70
        const rsi70Series = rsiChart.addSeries(LineSeries);
        rsi70Series.applyOptions({
            color: "red",
            lineStyle: 2,
            lineWidth: 1,
        });
        rsi70Series.setData(
            data.rsiData.map((d) => ({ time: d.time, value: 70 })),
        );

        // Add horizontal "line" at RSI = 30
        const rsi30Series = rsiChart.addSeries(LineSeries);
        rsi30Series.applyOptions({
            color: "green",
            lineStyle: 2,
            lineWidth: 1,
        });
        rsi30Series.setData(
            data.rsiData.map((d) => ({ time: d.time, value: 30 })),
        );

        // https://tradingview.github.io/lightweight-charts/tutorials/how_to/set-crosshair-position#syncing-two-charts
        chart.timeScale().subscribeVisibleTimeRangeChange((timeRange) => {
            if (timeRange) {
                rsiChart.timeScale().setVisibleRange(timeRange);
            }
        });
        rsiChart.timeScale().subscribeVisibleTimeRangeChange((timeRange) => {
            if (timeRange) {
                chart.timeScale().setVisibleRange(timeRange);
            }
        });

        function getCrosshairDataPoint(series: any, param: MouseEventParams) {
            if (!param.time) {
                return null;
            }
            const dataPoint = param.seriesData.get(series);
            return dataPoint || null;
        }

        function syncCrosshair(chart: IChartApi, series: any, dataPoint: any) {
            if (dataPoint) {
                chart.setCrosshairPosition(
                    dataPoint.value,
                    dataPoint.time,
                    series,
                );
                return;
            }
            chart.clearCrosshairPosition();
        }
        chart.subscribeCrosshairMove((param) => {
            const dataPoint = getCrosshairDataPoint(series, param);
            syncCrosshair(rsiChart, rsiSeries, dataPoint);
        });
        rsiChart.subscribeCrosshairMove((param) => {
            const dataPoint = getCrosshairDataPoint(rsiSeries, param);
            syncCrosshair(chart, series, dataPoint);
        });

        $effect(() => {
            series.setData(data.chartData);
            smaSeries.setData(data.smaData);
            rsiSeries.setData(data.rsiData);
            watched = isInWatchlist(data.props?.symbol);
        });

        const resizeObserver = new ResizeObserver(() => {
            chart.applyOptions({ width: chartContainer?.clientWidth });
            rsiChart.applyOptions({ width: chartContainer?.clientWidth });
        });
        resizeObserver.observe(chartContainer);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
            rsiChart.remove();
        };
    });
</script>

{#if data.stockData}
    <Card.Root
        ><Card.Header class="flex items-start justify-between">
            <div class="flex flex-col">
                <Card.Title>Stock overview</Card.Title>
                <Card.Description>
                    {data.stockData.displayName || data.stockData.longName} ({data
                        .props.symbol})
                </Card.Description>
            </div>

            <Button
                size="sm"
                onclick={() => {
                    addToWatchlist(data.props?.symbol);
                    watched = true;
                }}
                disabled={watched}
            >
                <PlusIcon class="w-4 h-4" />Watch</Button
            >
        </Card.Header>
        <Card.Content>
            <div class="grid grid-cols-5">
                <div>
                    <div class="text-sm text-gray-500">Price</div>
                    <div class="text-xl font-bold">
                        {data.stockData.regularMarketPrice}
                        {data.stockData.currency}
                    </div>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Today +/-</div>
                    <div
                        class="text-lg font-semibold {(data.stockData
                            .regularMarketChange ?? 0) >= 0
                            ? 'text-emerald-600'
                            : 'text-red-600'}"
                    >
                        {formatChange(data.stockData.regularMarketChange ?? 0)}
                        {data.stockData?.currency}
                    </div>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Today %</div>
                    <div
                        class="text-lg font-semibold text-{(data.stockData
                            .regularMarketChangePercent ?? 0) >= 0
                            ? 'emerald'
                            : 'red'}-600"
                    >
                        {formatPercent(
                            data.stockData.regularMarketChangePercent ?? 0,
                        )}
                    </div>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Exchange</div>
                    <div class="text-base font-semibold">
                        {data.stockData.exchange}
                    </div>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Analyst Rating</div>
                    <div class="text-base font-semibold">
                        {data.stockData.averageAnalystRating}
                    </div>
                </div>
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root class="mt-4">
        <Card.Header>
            <Card.Title>Stock price</Card.Title>
            <Card.Description>in {data.stockData.currency}</Card.Description>
        </Card.Header>
        <Card.Content>
            <div
                bind:this={chartContainer}
                class="w-full"
                style="height: 300px;"
            ></div>
            <div
                bind:this={rsiChartContainer}
                class="w-full"
                style="height: 200px;"
            ></div>
        </Card.Content>
    </Card.Root>
{:else}
    Symbol ({data.props?.symbol}) could not be resolved.
{/if}
