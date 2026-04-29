<script lang="ts">
	import { ExternalLink, MoreVertical } from '@lucide/svelte';

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

<div class="group relative bg-background border border-border rounded-xl p-5 flex flex-col h-full transition-all duration-300 hover:bg-secondary/20 hover:border-primary/30 animate-fade-in shadow-sm">
	<div class="flex items-start justify-between mb-5">
		<div class="flex items-center gap-4 min-w-0">
			<div class="size-14 rounded-xl bg-secondary/30 flex items-center justify-center overflow-hidden border border-border shrink-0">
				{#if app.logo_url}
					<img src={app.logo_url} alt={app.name} class="size-10 object-contain" />
				{:else}
					<span class="text-2xl font-bold text-primary uppercase">{app.name.charAt(0)}</span>
				{/if}
			</div>
			<div class="flex flex-col min-w-0">
				<h3 class="font-bold text-lg truncate text-foreground tracking-tight">{app.name}</h3>
				<span class="text-xs text-muted-foreground truncate opacity-70">{displayUrl}</span>
			</div>
		</div>
		<button class="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/50">
			<MoreVertical size={18} />
		</button>
	</div>

    <div class="mt-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">
            <div class="size-1.5 rounded-full bg-primary/60"></div>
            <span>Ready</span>
        </div>
        
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
        >
            <span>Launch</span>
            <ExternalLink size={14} />
        </a>
    </div>
</div>
