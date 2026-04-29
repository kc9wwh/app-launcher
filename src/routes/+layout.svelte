<script lang="ts">
	import '../app.css';
	import { LogOut, LayoutGrid, UserCircle } from '@lucide/svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';

	let { children } = $props();

	const title = env.PUBLIC_LAUNCHER_TITLE || 'App Launcher';
    const slogan = env.PUBLIC_LAUNCHER_DESCRIPTION || '';
	const isAuthenticated = $derived(page.data.user !== undefined && page.data.user !== null);
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans">
	<header class="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
                    <div class="bg-primary p-1 rounded-md text-white">
                        <LayoutGrid size={16} strokeWidth={3} />
                    </div>
                    <span class="font-playfair font-black text-xl tracking-tight text-white">{title}</span>
                </div>
                {#if slogan}
                    <span class="hidden lg:inline text-[10px] italic text-muted-foreground font-medium border-l border-border pl-4 py-1 uppercase tracking-wider opacity-60">{slogan}</span>
                {/if}
			</div>

			<div class="flex items-center gap-3">
				{#if isAuthenticated}
					<div class="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary/50 border border-border text-[10px] font-bold">
						{#if page.data.user.picture}
							<img src={page.data.user.picture} alt={page.data.user.username} class="size-4 rounded-full object-cover" />
						{:else}
							<UserCircle size={12} class="text-primary" />
						{/if}
						<span class="text-white opacity-90">{page.data.user.username}</span>
					</div>
					<a
						href="/logout"
						class="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-secondary hover:bg-secondary/80 transition-colors border border-border uppercase tracking-widest text-white"
					>
						<LogOut size={12} />
						<span>Logout</span>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="py-10 border-t border-border bg-black/20">
		<div class="max-w-7xl mx-auto px-6 text-center text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold opacity-30">
			<p>© {new Date().getFullYear()} {title}</p>
			<p class="mt-1.5">Powered by Pocket ID</p>
		</div>
	</footer>
</div>
