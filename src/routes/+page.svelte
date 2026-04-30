<script lang="ts">
	import { LayoutGrid, AlertCircle } from '@lucide/svelte';
	import AppCard from '$lib/components/AppCard.svelte';

	let { data } = $props();
</script>

<div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-center gap-3 mb-8">
        <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <LayoutGrid size={20} />
        </div>
        <h2 class="text-xl font-bold tracking-tight text-foreground">My apps</h2>
    </div>

	{#if data.error}
		<div class="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-4 mb-8">
			<AlertCircle size={20} class="shrink-0 mt-0.5" />
            <div class="flex flex-col gap-1">
                <p class="font-bold text-sm">Error loading applications</p>
                <p class="text-xs opacity-80">{data.error}</p>
            </div>
		</div>
	{/if}

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
		{#each data.apps as app}
			<AppCard {app} />
		{:else}
			{#if !data.error}
                <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card/20 rounded-2xl border border-dashed border-border">
                    <div class="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <LayoutGrid size={32} class="text-muted-foreground" />
                    </div>
                    <h3 class="text-lg font-bold">No applications found</h3>
                    <p class="text-xs text-muted-foreground mt-2 max-w-xs">
                        You don't have access to any applications yet. Contact your administrator to request access.
                    </p>
                </div>
            {/if}
		{/each}
	</div>
</div>
