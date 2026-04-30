<script lang="ts">
	import { Sun, Moon, Monitor } from '@lucide/svelte';
	import { setMode, mode } from 'mode-watcher';
	import { onMount } from 'svelte';

	let isOpen = $state(false);
    let currentMode = $state('system');
    let container: HTMLDivElement;

    // Manually subscribe to handle Svelte 5 SSR more robustly
    onMount(() => {
        const unsubscribe = mode.subscribe((v) => {
            currentMode = v || 'system';
        });

        const handleClick = (e: MouseEvent) => {
            if (isOpen && container && !container.contains(e.target as Node)) {
                isOpen = false;
            }
        };

        document.addEventListener('click', handleClick);
        
        return () => {
            unsubscribe();
            document.removeEventListener('click', handleClick);
        };
    });

	function select(val: any) {
		setMode(val === 'system' ? undefined : val);
		isOpen = false;
	}
</script>

<div class="relative" bind:this={container}>
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex items-center justify-center size-8 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-foreground"
		title="Toggle theme"
	>
		{#if currentMode === 'dark'}
			<Moon size={14} />
		{:else if currentMode === 'light'}
			<Sun size={14} />
		{:else}
			<Monitor size={14} />
		{/if}
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 animate-fade-in"
		>
			<button
				onclick={() => select('light')}
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {currentMode ===
				'light'
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Sun size={12} />
				<span>Light</span>
			</button>
			<button
				onclick={() => select('dark')}
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {currentMode ===
				'dark'
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Moon size={12} />
				<span>Dark</span>
			</button>
			<button
				onclick={() => select('system')}
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {currentMode ===
				'system'
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Monitor size={12} />
				<span>System</span>
			</button>
		</div>
	{/if}
</div>
