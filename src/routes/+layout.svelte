<script lang="ts">
	import '../app.css';
	import { LogOut, LayoutGrid, UserCircle } from '@lucide/svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	const title = env.PUBLIC_LAUNCHER_TITLE || 'App Launcher';
    const slogan = env.PUBLIC_LAUNCHER_DESCRIPTION || '';
    const pocketIdUrl = $derived(data.pocketIdUrl || '');
    
	const isAuthenticated = $derived(data.user !== undefined && data.user !== null);
    const displayName = $derived(data.user?.firstName || data.user?.username || 'User');

    // Manual Theme Management (Svelte 5)
    let theme = $state('dark');

    onMount(() => {
        const saved = localStorage.getItem('app-theme');
        theme = saved || 'dark';
        applyTheme(theme);
    });

    function applyTheme(newTheme: string) {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('app-theme', newTheme);
        theme = newTheme;
    }

    function toggleTheme() {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
    }

    let logoError = $state(false);
    const customLogoUrl = $derived(theme === 'dark' ? data.customLogoDark : data.customLogoLight);

    $effect(() => {
        // Reset logo error when URL changes
        if (customLogoUrl) {
            logoError = false;
        }
    });
</script>

<svelte:head>
    <script>
        (function() {
            const saved = localStorage.getItem('app-theme');
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
	<header class="border-b border-border bg-card sticky top-0 z-50 transition-colors duration-200">
		<div class="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
                    {#if customLogoUrl && !logoError}
                        <img 
                            src={customLogoUrl} 
                            alt="Logo" 
                            class="size-7 object-contain rounded-lg" 
                            onerror={() => logoError = true}
                        />
                    {:else}
                        <div class="bg-primary p-1.5 rounded-lg text-white">
                            <LayoutGrid size={16} strokeWidth={3} />
                        </div>
                    {/if}
                    <span class="font-bold text-lg tracking-tight">{title}</span>
                </div>
                {#if slogan}
                    <span class="hidden lg:inline text-[10px] italic text-muted-foreground font-medium border-l border-border pl-4 py-1 opacity-50 uppercase tracking-widest">{slogan}</span>
                {/if}
			</div>

			<div class="flex items-center gap-3">
				{#if data.user}
                    <button
                        onclick={toggleTheme}
                        class="flex items-center justify-center size-8 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-foreground shadow-sm active:scale-90"
                        title="Toggle theme"
                    >
                        {#if theme === 'dark'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/></svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M22 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        {/if}
                    </button>

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
					<form action="/logout" method="POST" class="flex">
						<button
							type="submit"
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-secondary hover:bg-secondary/80 transition-colors border border-border text-white"
						>
							<LogOut size={12} />
							<span>Logout</span>
						</button>
					</form>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1 w-full flex flex-col">
		{@render children()}
	</main>

    <div class="py-12 text-center text-[9px] text-muted-foreground font-bold opacity-30 mt-auto">
        <p>© {new Date().getFullYear()} {title}</p>
        <p class="mt-2">Powered by Pocket ID</p>
    </div>
</div>
