<script lang="ts" generics="TData, TValue">
    import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
        renderComponent,
        renderSnippet,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import type { WatchlistEntry } from "$lib/schema";
    import DataTableActions from "./data-table-actions.svelte";

    import { formatChange, formatPercent } from "$lib/formatter.js";

    import type { ColumnMeta, Row } from "@tanstack/table-core";
    // Extend the meta interface
    export interface ExtendedMeta extends ColumnMeta<any, any> {
        class?: string;
    }

    async function fetchRSI(symbol: string) {
        const response = await fetch(
            `/api/indicators/rsi?symbol=${encodeURIComponent(symbol)}`,
        );

        if (response.ok) {
            return (await response.json()).rsi;
        } else {
            return [];
        }
    }

    async function fetchFairValueGap(symbol: string) {
        const response = await fetch(
            `/api/valuation/fair-value-gap?symbol=${encodeURIComponent(symbol)}`,
        );

        if (response.ok) {
            return await response.json();
        } else {
            return [];
        }
    }

    export const columns: ColumnDef<WatchlistEntry>[] = [
        {
            accessorKey: "symbol",
            header: "Symbol",
            cell: ({ row }) => renderSnippet(DataTableSymbol, { row }),
        },
        {
            accessorKey: "fvg",
            header: "Fair Value Gap",
            cell: ({ row }) => renderSnippet(DataTableFairValueGap, { row }),
            meta: {
                class: "text-right w-[1%] whitespace-nowrap",
            },
        },
        {
            accessorKey: "rsi",
            header: "RSI",
            cell: ({ row }) => renderSnippet(DataTableRSI, { row }),
            meta: {
                class: "text-right w-[1%] whitespace-nowrap",
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                // You can pass whatever you need from `row.original` to the component
                return renderComponent(DataTableActions, {
                    symbol: row.original.symbol,
                });
            },
            meta: {
                class: "text-right w-[1%] whitespace-nowrap",
            },
        },
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

{#snippet DataTableFairValueGap({ row }: { row: Row<WatchlistEntry> })}
    <div class="text-right">
        {#await fetchFairValueGap(row.original.symbol)}
            N/A
        {:then valuation}
            <div class="group">
                <div
                    class="font-mono {valuation.fairValueGap > 0
                        ? 'text-emerald-600'
                        : valuation.fairValueGap < 0
                          ? 'text-red-600'
                          : 'text-gray-600'}"
                >
                    {formatChange(valuation.fairValueGap)}
                    {valuation.currency}
                </div>

                <div
                    class="font-mono {valuation.fairValueGap > 0
                        ? 'text-emerald-600'
                        : valuation.fairValueGap < 0
                          ? 'text-red-600'
                          : 'text-gray-600'}"
                >
                    {formatPercent(valuation.fairValueGapPercent)}
                </div>
            </div>
        {:catch error}
            N/A {error}
        {/await}
    </div>
{/snippet}

{#snippet DataTableRSI({ row }: { row: Row<WatchlistEntry> })}
    <div class="text-right">
        {#await fetchRSI(row.original.symbol)}
            N/A
        {:then indicator}
            <div
                class="font-mono {indicator < 30
                    ? 'text-emerald-600'
                    : indicator > 70
                      ? 'text-red-600'
                      : 'text-purple-600'}"
            >
                {indicator}
            </div>
        {:catch error}
            N/A {error}
        {/await}
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
