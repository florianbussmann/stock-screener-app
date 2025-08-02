<script lang="ts">
	import { goto } from "$app/navigation";

	import * as Command from "$lib/components/ui/command/index.js";
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import BookMarkedIcon from "@lucide/svelte/icons/book-marked";

	import { watchlist } from "$lib/stores/watchlist";

	import { pwaInfo } from "virtual:pwa-info";

	let { children } = $props();

	let search = $state("");
	let searchPromise = $derived.by(() => {
		return fetchResults(search);
	});

	async function fetchResults(q: string) {
		if (!q) {
			return [];
		}

		const response = await fetch(
			`/api/search-stocks?q=${encodeURIComponent(q)}`,
		);

		if (response.ok) {
			return response.json();
		} else {
			return [];
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen.update((value) => !value);
		}
	}

	const webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/site-header.svelte";
	import { searchOpen } from "$lib/stores/search";

	import { isInWatchlist } from "$lib/stores/watchlist";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{@html webManifestLink}
</svelte:head>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader />

		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div class="px-4 lg:px-6">
						{@render children()}
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={$searchOpen}>
	<Command.Input bind:value={search} placeholder="Type to search..." />
	<Command.List>
		{#await searchPromise}
			<Command.Empty>Searching..</Command.Empty>
		{:then quotes}
			<Command.Empty>No results found.</Command.Empty>
			{#if search === '' && $watchlist.length > 0}
				<Command.Group heading="Watchlist">
					{#each $watchlist as symbol}
						<Command.Item onclick={() => {
							searchOpen.set(false);
							goto(`/stocks/${symbol}`);
						}}>{symbol}</Command.Item>
					{/each}
				</Command.Group>
			{:else}
			<Command.Group>
				{#each quotes as quote}
					<Command.Item
						class="flex justify-between items-center"
						onclick={() => {
							searchOpen.set(false);
							goto(`/stocks/${quote.symbol}`);
						}}
						value={quote.symbol + " " + quote.shortname}
					>
						<div class="flex flex-col">
							<span class="font-semibold">{quote.symbol}</span>
							<span class="text-sm text-muted-foreground">
								{quote.longname}
							</span>
						</div>
						{#if isInWatchlist(quote.symbol)}
							<div
								class="flex items-center gap-1 text-sm font-medium"
							>
								<BookMarkedIcon />
								<span>Watching</span>
							</div>
						{/if}</Command.Item
					>
				{/each}
			</Command.Group>
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</Command.List>
</Command.Dialog>
