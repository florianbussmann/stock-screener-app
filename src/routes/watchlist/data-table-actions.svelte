<script lang="ts" module>
    function removeFromWatchlist(symbol: string) {
        watchlist.update((list) => list.filter((s) => s !== symbol));
    }
</script>

<script lang="ts">
    import DotsVerticalIcon from "@tabler/icons-svelte/icons/dots-vertical";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import { watchlist } from "$lib/stores/watchlist";

    let { symbol }: { symbol: string } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="ghost"
                size="icon"
                class="relative size-8 p-0 justify-right"
            >
                <DotsVerticalIcon />
                <span class="sr-only">Open menu</span>
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
        <DropdownMenu.Item
            variant="destructive"
            onclick={() => {
                removeFromWatchlist(symbol);
            }}>Unwatch</DropdownMenu.Item
        >
    </DropdownMenu.Content>
</DropdownMenu.Root>
