<script lang="ts">
	import { Sun, Moon, Monitor } from '@lucide/svelte';
	import { setMode, mode } from 'mode-watcher';
	import { onMount } from 'svelte';

    let currentMode = $state('system');

    onMount(() => {
        const unsubscribe = mode.subscribe((v) => {
            currentMode = v || 'system';
        });
        return unsubscribe;
    });

	function toggle() {
		if (currentMode === 'light') {
			setMode('dark');
		} else if (currentMode === 'dark') {
			setMode(undefined); // system
		} else {
			setMode('light');
		}
	}
</script>

<button
    onclick={toggle}
    class="flex items-center justify-center size-8 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-foreground shadow-sm active:scale-90"
    title="Current theme: {currentMode}"
>
    {#if currentMode === 'dark'}
        <Moon size={14} />
    {:else if currentMode === 'light'}
        <Sun size={14} />
    {:else}
        <Monitor size={14} />
    {/if}
</button>
