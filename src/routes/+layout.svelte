<script lang="ts">
	import '../app.css';
	import { LogOut, LayoutGrid, UserCircle } from '@lucide/svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';

	let { children, data } = $props();

	const title = env.PUBLIC_LAUNCHER_TITLE || 'App Launcher';
	const isAuthenticated = $derived(page.data.user !== undefined && page.data.user !== null);
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
	<!-- Background Decoration -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
		<div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
		<div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
	</div>

	<header class="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="bg-primary p-1.5 rounded-lg text-primary-foreground">
					<LayoutGrid size={20} />
				</div>
				<span class="font-bold text-xl tracking-tight">{title}</span>
			</div>

			<div class="flex items-center gap-4">
				{#if isAuthenticated}
					<div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border text-sm">
						<UserCircle size={16} class="text-muted-foreground" />
						<span class="font-medium">{page.data.user.username}</span>
					</div>
					<a
						href="/logout"
						class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors"
						title="Sign Out"
					>
						<LogOut size={18} />
						<span class="hidden sm:inline">Logout</span>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1 flex flex-col">
		{@render children()}
	</main>

	<footer class="py-8 border-t bg-muted/30">
		<div class="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
			<p>© {new Date().getFullYear()} {title}</p>
			<p class="mt-1 opacity-50">Powered by Pocket ID</p>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background-color: hsl(var(--background));
		color: hsl(var(--foreground));
	}
</style>
