<script lang="ts">
	import { Search, Zap, Loader2 } from '@lucide/svelte';
	import AppCard from '$lib/components/AppCard.svelte';
	import { env } from '$env/dynamic/public';

	let { data } = $props();

	let searchTerm = $state('');

	const filteredApps = $derived(
		data.apps.filter((app: any) =>
			app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()))
		)
	);

	const title = env.PUBLIC_LAUNCHER_TITLE || 'App Launcher';
	const description = env.PUBLIC_LAUNCHER_DESCRIPTION || 'Access your shared services below.';
</script>

<div class="max-w-7xl mx-auto px-4 py-12 w-full">
	<div class="mb-12 text-center">
		<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
			{title}
		</h1>
		<p class="text-muted-foreground text-lg max-w-2xl mx-auto">
			{description}
		</p>
	</div>

	<div class="max-w-md mx-auto mb-16">
		<div class="relative group">
			<Search
				class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
				size={20}
			/>
			<input
				type="text"
				placeholder="Search for an application..."
				class="w-full pl-12 pr-4 py-4 rounded-2xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
				bind:value={searchTerm}
			/>
		</div>
	</div>

	{#if data.error}
		<div class="p-8 rounded-2xl border bg-destructive/5 text-destructive text-center mb-12">
			<p class="font-semibold text-lg">{data.error}</p>
			<p class="text-sm opacity-80 mt-1">Please check your configuration or contact your administrator.</p>
		</div>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each filteredApps as app}
			<AppCard {app} />
		{:else}
			<div class="col-span-full py-24 text-center">
				<div class="inline-flex p-4 rounded-full bg-muted mb-4">
					<Zap size={32} class="text-muted-foreground" />
				</div>
				<h3 class="text-xl font-semibold">No applications found</h3>
				<p class="text-muted-foreground mt-2">
					{#if searchTerm}
						No applications match your search "{searchTerm}".
					{:else}
						You don't have access to any applications yet.
					{/if}
				</p>
			</div>
		{/each}
	</div>
</div>
