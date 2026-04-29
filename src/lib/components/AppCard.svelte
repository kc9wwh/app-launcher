<script lang="ts">
	import { ExternalLink, MoreVertical, ArrowRight } from '@lucide/svelte';

	interface Props {
		app: {
			id: string;
			name: string;
			description?: string;
			url: string;
			logo_url?: string | null;
		};
	}

	let { app }: Props = $props();

    // Remove protocol from URL for cleaner display
    const displayUrl = $derived(app.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
</script>

<div class="group relative bg-card border border-border rounded-xl p-4 flex flex-col h-full transition-all duration-200 hover:border-primary/50 shadow-sm">
	<div class="flex items-start justify-between mb-4">
		<div class="flex items-center gap-4">
			<div class="size-12 rounded-lg bg-black/20 flex items-center justify-center overflow-hidden border border-white/5">
				{#if app.logo_url}
					<img src={app.logo_url} alt={app.name} class="size-8 object-contain" />
				{:else}
					<span class="text-xl font-bold text-primary/80 uppercase">{app.name.charAt(0)}</span>
				{/if}
			</div>
			<div class="flex flex-col min-w-0">
				<h3 class="font-bold text-base truncate text-white">{app.name}</h3>
				<span class="text-xs text-muted-foreground truncate">{displayUrl}</span>
			</div>
		</div>
		<button class="text-muted-foreground hover:text-white transition-colors p-1">
			<MoreVertical size={18} />
		</button>
	</div>

    <div class="mt-auto pt-4 flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <ArrowRight size={12} />
            <span>Ready to launch</span>
        </div>
        
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
            <span>Launch</span>
            <ExternalLink size={14} />
        </a>
    </div>
</div>
