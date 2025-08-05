<script lang="ts" module>
    import { page } from "$app/state";
    import { menuItems } from "$lib/menu.js";
</script>

<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { ComponentProps } from "svelte";
    import ChartCandlestickIcon from "@lucide/svelte/icons/chart-candlestick";

    let {
        ref = $bindable(null),
        ...restProps
    }: ComponentProps<typeof Sidebar.Root> = $props();

    function isActivePath(itemPath: string): boolean {
        if (page.route.id === "/") {
            return false; // Avoid matching root path as active
        }

        return itemPath.endsWith(page.route.id || "404") || false;
    }
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
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.Menu>
                {#each menuItems as item, index (item.name)}
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton
                            class="font-medium"
                            isActive={isActivePath(item.path)}
                        >
                            {#snippet child({ props })}
                                <a href={item.path} {...props}>
                                    {item.name}
                                </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                        {#if item.children?.length}
                            <Sidebar.MenuSub>
                                {#each item.children as subItem (subItem.name)}
                                    <Sidebar.MenuSubItem>
                                        <Sidebar.MenuSubButton
                                            isActive={isActivePath(
                                                subItem.path,
                                            )}
                                        >
                                            {#snippet child({ props })}
                                                <a
                                                    href={subItem.path}
                                                    {...props}>{subItem.name}</a
                                                >
                                            {/snippet}
                                        </Sidebar.MenuSubButton>
                                    </Sidebar.MenuSubItem>
                                {/each}
                            </Sidebar.MenuSub>
                        {/if}
                    </Sidebar.MenuItem>
                {/each}
            </Sidebar.Menu>
        </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Rail />
</Sidebar.Root>
