<script lang="ts">
	import { ExternalLink, ArrowRight } from '@lucide/svelte';

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

<div class="group bg-card border border-border rounded-xl p-5 flex flex-col h-full transition-all duration-150 hover:bg-secondary/40 animate-fade-in shadow-sm">
	<div class="flex items-start gap-4 mb-4">
		<div class="size-12 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center overflow-hidden border border-border shrink-0 shadow-inner">
			{#if app.logo_url}
				<img src={app.logo_url} alt={app.name} class="size-8 object-contain" />
			{:else}
				<span class="text-xl font-bold text-primary uppercase">{app.name.charAt(0)}</span>
			{/if}
		</div>
		<div class="flex flex-col min-w-0">
			<div class="mb-1 flex items-start gap-2">
				<h3 class="text-foreground line-clamp-2 leading-tight font-semibold break-words break-all text-ellipsis text-base">
					{app.name}
				</h3>
			</div>
			<span class="text-xs text-muted-foreground truncate font-medium tracking-tight opacity-70">{displayUrl}</span>
		</div>
	</div>

    <div class="mt-auto flex items-center justify-between pt-2">
        <div class="flex items-center gap-2 text-[10px] text-muted-foreground font-medium opacity-60">
            <div class="size-1.5 rounded-full bg-primary/60"></div>
            <span>Ready to launch</span>
        </div>
        
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
        >
            <span>Launch</span>
            <ExternalLink size={14} strokeWidth={2.5} />
        </a>
    </div>
</div>
