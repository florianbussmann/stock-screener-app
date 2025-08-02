<script lang="ts">
    const formatPercent = (value: number) => formatChange(value) + " %";
    const formatChange = (value: number) =>
        (value > 0 ? "+" : "") +
        new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    let { data } = $props();

    const mandata = {
        price: "205.06 USD",
        change: "+2.35 USD",
        changePercent: "+1.32 %",
        ticker: "AAPL",
        isin: "US0378331005",
        wkn: "865985",
    };
</script>

{#if data.stockData}
    <div class="text-center mb-6">
        <h1 class="text-3xl font-bold">
            {data.stockData.displayName} ({data.props.symbol})
        </h1>
        <p class="text-muted-foreground">Stock Overview</p>
    </div>
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
                {formatPercent(data.stockData.regularMarketChangePercent ?? 0)}
            </div>
        </div>
        <div>
            <div class="text-sm text-gray-500">Exchange</div>
            <div class="text-base font-semibold">{data.stockData.exchange}</div>
        </div>
        <div>
            <div class="text-sm text-gray-500">Analyst Rating</div>
            <div class="text-base font-semibold">
                {data.stockData.averageAnalystRating}
            </div>
        </div>
    </div>
{:else}
    Symbol ({data.props?.symbol}) could not be resolved.
{/if}
