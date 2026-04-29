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

    const displayUrl = $derived(app.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
</script>

<div class="group bg-card border border-border rounded-lg p-3.5 flex flex-col h-full transition-colors hover:border-muted-foreground/30 animate-fade-in">
	<div class="flex items-start justify-between gap-3 mb-3">
		<div class="flex items-center gap-3 min-w-0">
			<div class="size-11 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
				{#if app.logo_url}
					<img src={app.logo_url} alt={app.name} class="size-7 object-contain" />
				{:else}
					<span class="text-lg font-bold text-primary/80 uppercase">{app.name.charAt(0)}</span>
				{/if}
			</div>
			<div class="flex flex-col min-w-0">
				<h3 class="font-bold text-sm truncate text-white tracking-tight leading-tight">{app.name}</h3>
				<span class="text-[10px] text-muted-foreground truncate opacity-60 mt-0.5">{displayUrl}</span>
			</div>
		</div>
		<button class="text-muted-foreground hover:text-white transition-colors">
			<MoreVertical size={14} />
		</button>
	</div>

    <div class="mt-auto flex items-center justify-between pt-2">
        <div class="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium uppercase tracking-wider opacity-40">
            <div class="size-1 rounded-full bg-primary"></div>
            <span>Ready</span>
        </div>
        
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors uppercase tracking-tight"
        >
            <span>Launch</span>
            <ExternalLink size={12} />
        </a>
    </div>
</div>
