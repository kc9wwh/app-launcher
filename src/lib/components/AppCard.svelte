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

<div class="group bg-card border border-border rounded-lg p-4 flex flex-col h-full transition-all duration-150 hover:border-muted-foreground/20 animate-fade-in shadow-sm">
	<div class="flex items-start justify-between gap-3 mb-4">
		<div class="flex items-center gap-3.5 min-w-0">
			<div class="size-11 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/5 shrink-0 shadow-inner">
				{#if app.logo_url}
					<img src={app.logo_url} alt={app.name} class="size-7 object-contain" />
				{:else}
					<span class="text-lg font-black text-primary/90 uppercase">{app.name.charAt(0)}</span>
				{/if}
			</div>
			<div class="flex flex-col min-w-0">
				<h3 class="font-bold text-[13px] truncate text-white tracking-tight leading-none">{app.name}</h3>
				<span class="text-[10px] text-muted-foreground truncate opacity-50 mt-1.5 font-medium">{displayUrl}</span>
			</div>
		</div>
		<button class="text-muted-foreground hover:text-white transition-colors p-1">
			<MoreVertical size={14} />
		</button>
	</div>

    <div class="mt-auto flex items-center justify-between pt-2">
        <div class="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-[0.05em] opacity-30">
            <div class="size-1 rounded-full bg-primary/80"></div>
            <span>Ready</span>
        </div>
        
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tight shadow-lg shadow-primary/10 active:scale-95"
        >
            <span>Launch</span>
            <ExternalLink size={12} strokeWidth={3} />
        </a>
    </div>
</div>
