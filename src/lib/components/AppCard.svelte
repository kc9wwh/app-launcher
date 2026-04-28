<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import { env } from '$env/dynamic/public';
    import { env as privateEnv } from '$env/dynamic/private';

	interface Props {
		app: {
			id: string;
			name: string;
			description?: string;
			url: string;
			logo_url?: string;
		};
	}

	let { app }: Props = $props();

    // In Pocket ID, logos are often relative to the instance URL
    // We might need to proxy them or just use the absolute URL if available.
</script>

<a
	href={app.url}
	target="_blank"
	rel="noopener noreferrer"
	class="group relative flex flex-col items-center justify-center p-6 rounded-2xl border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
>
	<div class="mb-4 relative">
		{#if app.logo_url}
			<img
				src={app.logo_url}
				alt={app.name}
				class="size-16 object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
			/>
		{:else}
			<div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
				<span class="text-2xl font-bold uppercase">{app.name.charAt(0)}</span>
			</div>
		{/if}
        
        <div class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="bg-primary text-primary-foreground p-1 rounded-full shadow-sm">
                <ExternalLink size={12} />
            </div>
        </div>
	</div>

	<h3 class="font-semibold text-lg text-center group-hover:text-primary transition-colors">
		{app.name}
	</h3>
    
    {#if app.description}
        <p class="mt-2 text-xs text-muted-foreground text-center line-clamp-2 max-w-[150px]">
            {app.description}
        </p>
    {/if}
</a>
