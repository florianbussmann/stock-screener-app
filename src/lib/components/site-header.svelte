<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { Kbd } from "$lib/components/ui/kbd";
    import CommandIcon from "@lucide/svelte/icons/command";

    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/state";
    import { menuItems } from "$lib/menu.js";
    import { findBreadcrumb } from "$lib/breadcrumb.js";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { breadcrumbStore } from "$lib/stores/breadcrumb";

    // Store breadcrumb in reactive variable
    let defaultBreadcrumb = [{ name: "Home", path: "/" }];

    // On client-side navigation
    afterNavigate(() => {
        breadcrumbStore.set(
            findBreadcrumb(page.route.id || "", menuItems) || defaultBreadcrumb,
        );
    });

    import { searchOpen } from "$lib/stores/search";
</script>

<header
    class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Sidebar.Trigger class="-ml-1" />
        <Separator
            orientation="vertical"
            class="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb.Root>
            <Breadcrumb.List>
                {#each $breadcrumbStore as item, i}
                    {#if i < $breadcrumbStore.length - 1}
                        <Breadcrumb.Item class="hidden md:block">
                            <Breadcrumb.Link href={item.path}
                                >{item.name}</Breadcrumb.Link
                            >
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator class="hidden md:block" />
                    {:else}
                        <title>Stock Screener - {item.name}</title>
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>{item.name}</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    {/if}
                {/each}
            </Breadcrumb.List>
        </Breadcrumb.Root>

        <div class="ml-auto flex items-center gap-2">
            <Button variant="secondary" onclick={() => searchOpen.set(true)}
                >Search stocks using

                <Kbd>
                    <CommandIcon class="inline size-4" />
                    + K
                </Kbd>
            </Button>
        </div>
    </div>
</header>
