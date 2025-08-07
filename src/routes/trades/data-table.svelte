<script lang="ts" generics="TData, TValue">
    import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
        renderSnippet,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import type { WatchlistEntry } from "$lib/schema";

    import type { ColumnMeta, Row } from "@tanstack/table-core";
    // Extend the meta interface
    export interface ExtendedMeta extends ColumnMeta<any, any> {
        class?: string;
    }

    export const columns: ColumnDef<WatchlistEntry>[] = [
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "symbol",
            header: "Symbol",
            cell: ({ row }) => renderSnippet(DataTableSymbol, { row }),
        },
        {
            accessorKey: "shares",
            header: "Shares",
        },
        {
            accessorKey: "price",
            header: "Price",
        },
        {
            accessorKey: "date",
            header: "Timestamp"
        }
    ];

    let { data }: { data: WatchlistEntry[] } = $props();

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
</script>

{#snippet DataTableSymbol({ row }: { row: Row<WatchlistEntry> })}
    <div class="w-16">
        <a
            class="text-blue-700 hover:underline"
            href="/stocks/{row.original.symbol}">{row.original.symbol}</a
        >
    </div>
{/snippet}

<div class="rounded-md border">
    <Table.Root>
        <Table.Header class="bg-muted sticky top-0 z-10">
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row>
                    {#each headerGroup.headers as header (header.id)}
                        <Table.Head
                            colspan={header.colSpan}
                            class={(
                                header.column.columnDef.meta as ExtendedMeta
                            )?.class ?? ""}
                        >
                            {#if !header.isPlaceholder}
                                <FlexRender
                                    content={header.column.columnDef.header}
                                    context={header.getContext()}
                                />
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body class="**:data-[slot=table-cell]:first:w-8">
            {#each table.getRowModel().rows as row (row.id)}
                <Table.Row data-state={row.getIsSelected() && "selected"}>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <Table.Cell>
                            <FlexRender
                                content={cell.column.columnDef.cell}
                                context={cell.getContext()}
                            />
                        </Table.Cell>
                    {/each}
                </Table.Row>
            {:else}
                <Table.Row>
                    <Table.Cell
                        colspan={columns.length}
                        class="h-24 text-center"
                    >
                        No results.
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
