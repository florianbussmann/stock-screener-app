<script lang="ts">
    import { watchlist } from "$lib/stores/watchlist";
    import * as Card from "$lib/components/ui/card";

    import DataTable from "./data-table.svelte";
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Watchlist</Card.Title>
        <Card.Description>Your currently tracked stocks</Card.Description>
    </Card.Header>
    <Card.Content>
        <DataTable data={$watchlist.map((symbol) => ({ symbol }))} />
    </Card.Content>
</Card.Root>
