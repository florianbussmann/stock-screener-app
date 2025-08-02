<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";

    let { data } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card.Root>
        <Card.Header>
            <Card.Title>Daily Gainers</Card.Title>
            <Card.Description>{data.gainers.description}</Card.Description>
        </Card.Header>
        <Card.Content>
            {#each data.gainers.quotes as quote}
                <div class="flex justify-between text-sm">
                    <a href="/stocks/{quote.symbol}" class="hover:underline"
                        ><span class="font-medium"
                            >{quote.shortName || quote.symbol}</span
                        ></a
                    >
                    <span class="text-emerald-600 font-mono"
                        >+{quote.regularMarketChangePercent?.toFixed(2)}%</span
                    >
                </div>
            {/each}
        </Card.Content>
    </Card.Root>
    <Card.Root>
        <Card.Header>
            <Card.Title>Daily Losers</Card.Title>
            <Card.Description>{data.losers.description}</Card.Description>
        </Card.Header>
        <Card.Content>
            {#each data.losers.quotes as quote}
                <div class="flex justify-between text-sm">
                    <a href="/stocks/{quote.symbol}" class="hover:underline"
                        ><span class="font-medium"
                            >{quote.shortName || quote.symbol}</span
                        ></a
                    >
                    <span class="text-red-600 font-mono"
                        >{quote.regularMarketChangePercent?.toFixed(2)}%</span
                    >
                </div>
            {/each}
        </Card.Content>
    </Card.Root>
</div>
