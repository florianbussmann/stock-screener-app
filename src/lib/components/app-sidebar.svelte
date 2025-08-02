<script lang="ts" module>
    import { page } from "$app/state";
</script>

<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { ComponentProps } from "svelte";
    import ChartCandlestickIcon from "@lucide/svelte/icons/chart-candlestick";

    let {
        ref = $bindable(null),
        ...restProps
    }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton size="lg">
                    {#snippet child({ props })}
                        <a href="/" {...props}>
                            <div
                                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                            >
                                <ChartCandlestickIcon class="size-4" />
                            </div>
                            <div class="flex flex-col gap-0.5 leading-none">
                                <span class="font-medium">Stock Screener</span>
                            </div>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Rail />
</Sidebar.Root>
