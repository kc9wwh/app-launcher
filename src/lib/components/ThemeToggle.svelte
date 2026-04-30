<script lang="ts">
	import { Sun, Moon, Monitor } from '@lucide/svelte';
	import { setMode, mode } from 'mode-watcher';
	import { clickOutside } from '$lib/utils/click-outside';

	let isOpen = $state(false);

	const options = [
		{ label: 'Light', value: 'light', icon: Sun },
		{ label: 'Dark', value: 'dark', icon: Moon },
		{ label: 'System', value: 'system', icon: 'system' }
	];

	function select(val: any) {
		setMode(val === 'system' ? undefined : val);
		isOpen = false;
	}
</script>

<div class="relative" use:clickOutside={() => (isOpen = false)}>
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex items-center justify-center size-8 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-foreground"
		title="Toggle theme"
	>
		{#if $mode === 'dark'}
			<Moon size={14} />
		{:else if $mode === 'light'}
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
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {$mode ===
				'light'
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Sun size={12} />
				<span>Light</span>
			</button>
			<button
				onclick={() => select('dark')}
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {$mode ===
				'dark'
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Moon size={12} />
				<span>Dark</span>
			</button>
			<button
				onclick={() => select('system')}
				class="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold hover:bg-secondary transition-colors {$mode ===
				undefined
					? 'text-primary'
					: 'text-foreground'}"
			>
				<Monitor size={12} />
				<span>System</span>
			</button>
		</div>
	{/if}
</div>
