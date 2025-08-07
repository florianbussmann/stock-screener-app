<script lang="ts">
    import { loadTrades } from "$lib/stores/trades";
    import * as Card from "$lib/components/ui/card";

    import DataTable from "./data-table.svelte";

    import { onMount } from "svelte";
    import { type Trade } from "$lib/schema";

    let trades : Trade[] = [];

    onMount(async () => {
        trades = loadTrades();
    });
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Trades</Card.Title>
        <Card.Description>Your traded stocks</Card.Description>
    </Card.Header>
    <Card.Content>
        <DataTable data={trades} />
    </Card.Content>
</Card.Root>

