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
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-baseline gap-3">
				<div class="flex items-center gap-2">
                    <div class="bg-primary p-1 rounded-md text-primary-foreground">
                        <LayoutGrid size={18} />
                    </div>
                    <span class="font-black text-xl tracking-tight">{title}</span>
                </div>
                {#if slogan}
                    <span class="hidden md:inline text-xs italic text-muted-foreground font-medium opacity-80">{slogan}</span>
                {/if}
			</div>

			<div class="flex items-center gap-4">
				{#if isAuthenticated}
					<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-xs">
						{#if page.data.user.picture}
							<img src={page.data.user.picture} alt={page.data.user.username} class="size-5 rounded-full object-cover" />
						{:else}
							<UserCircle size={14} class="text-primary" />
						{/if}
						<span class="font-semibold">{page.data.user.username}</span>
					</div>
					<a
						href="/logout"
						class="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-secondary hover:bg-secondary/80 transition-colors border border-border"
					>
						<LogOut size={14} />
						<span>Logout</span>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="py-12 border-t border-border bg-card/20">
		<div class="max-w-7xl mx-auto px-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
			<p>© {new Date().getFullYear()} {title}</p>
			<p class="mt-2 opacity-50">Powered by Pocket ID</p>
		</div>
	</footer>
</div>
