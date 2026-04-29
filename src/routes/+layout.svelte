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

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
	<header class="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-baseline gap-4">
				<div class="flex items-center gap-2.5 group cursor-default">
                    <div class="bg-primary p-1.5 rounded-lg text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <LayoutGrid size={18} strokeWidth={3} />
                    </div>
                    <span class="font-playfair font-black text-2xl tracking-tight text-foreground">{title}</span>
                </div>
                {#if slogan}
                    <span class="hidden lg:inline text-xs italic text-muted-foreground font-medium border-l border-border pl-4 py-1">{slogan}</span>
                {/if}
			</div>

			<div class="flex items-center gap-4">
				{#if isAuthenticated}
					<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border text-xs transition-colors hover:bg-secondary/60">
						{#if page.data.user.picture}
							<img src={page.data.user.picture} alt={page.data.user.username} class="size-5 rounded-full object-cover ring-1 ring-border" />
						{:else}
							<UserCircle size={14} class="text-primary" />
						{/if}
						<span class="font-bold tracking-tight">{page.data.user.username}</span>
					</div>
					<a
						href="/logout"
						class="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black bg-secondary hover:bg-secondary/80 transition-all border border-border active:scale-95"
					>
						<LogOut size={14} />
						<span class="uppercase tracking-widest">Logout</span>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="py-12 border-t border-border bg-card/10">
		<div class="max-w-7xl mx-auto px-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-40">
			<p>© {new Date().getFullYear()} {title}</p>
			<p class="mt-2">Powered by Pocket ID</p>
		</div>
	</footer>
</div>
