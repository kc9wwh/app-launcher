<script lang="ts">
	import '../app.css';
	import { LogOut, LayoutGrid, UserCircle } from '@lucide/svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
    import { ModeWatcher } from 'mode-watcher';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children, data } = $props();

	const title = env.PUBLIC_LAUNCHER_TITLE || 'App Launcher';
    const slogan = env.PUBLIC_LAUNCHER_DESCRIPTION || '';
    const pocketIdUrl = data.pocketIdUrl || '';
    
	const isAuthenticated = $derived(data.user !== undefined && data.user !== null);
    const displayName = $derived(data.user?.firstName || data.user?.username || 'User');
</script>

<ModeWatcher />

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased transition-colors duration-300">
	<header class="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
                    <div class="bg-primary p-1.5 rounded-lg text-white">
                        <LayoutGrid size={16} strokeWidth={3} />
                    </div>
                    <span class="font-bold text-lg tracking-tight">{title}</span>
                </div>
                {#if slogan}
                    <span class="hidden lg:inline text-[9px] text-muted-foreground font-semibold border-l border-border pl-4 py-1 uppercase tracking-widest opacity-50">{slogan}</span>
                {/if}
			</div>

			<div class="flex items-center gap-3">
				{#if isAuthenticated}
                    <ThemeToggle />

					<a 
                        href="{pocketIdUrl}/settings/account" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-[10px] font-bold hover:bg-secondary/80 transition-colors shadow-sm"
                        title="Manage Account"
                    >
						{#if data.user.picture}
							<img src={data.user.picture} alt={displayName} class="size-4 rounded-full object-cover" />
						{:else}
							<UserCircle size={12} class="text-primary" />
						{/if}
						<span class="">{displayName}</span>
					</a>
					<a
						href="/logout"
						class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-secondary hover:bg-secondary/80 transition-colors border border-border"
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

	<footer class="py-12 border-t border-border bg-black/5 dark:bg-black/40">
		<div class="max-w-7xl mx-auto px-6 text-center text-[9px] text-muted-foreground font-bold opacity-20">
			<p>© {new Date().getFullYear()} {title}</p>
			<p class="mt-2">Powered by Pocket ID</p>
		</div>
	</footer>
</div>
