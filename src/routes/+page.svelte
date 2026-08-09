<script lang="ts">
	import { LayoutGrid, AlertCircle } from '@lucide/svelte';
	import AppCard from '$lib/components/AppCard.svelte';
	import { enhance } from '$app/forms';

	let { data, form = $bindable(null) } = $props();

	let showSupportModal = $state(false);
	let isSubmitting = $state(false);

	function closeModal() {
		showSupportModal = false;
		form = null;
	}
</script>

<div class="max-w-[1600px] mx-auto px-6 py-8 w-full">
	<div class="flex items-center justify-between mb-8">
		<div class="flex items-center gap-3">
			<div class="p-2 rounded-lg bg-primary/10 text-primary">
				<LayoutGrid size={20} />
			</div>
			<h2 class="text-xl font-bold tracking-tight text-foreground">My apps</h2>
		</div>

		<!-- Support Button -->
		<button
			class="flex items-center px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
			onclick={() => (showSupportModal = true)}
			aria-label="Report an issue"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="4" />
				<line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
				<line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
				<line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
				<line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
			</svg>
			Support
		</button>
	</div>

	{#if data.error}
		<div class="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-4 mb-8">
			<AlertCircle size={20} class="shrink-0 mt-0.5" />
			<div class="flex flex-col gap-1">
				<p class="font-bold text-sm">Error loading applications</p>
				<p class="text-xs opacity-80">{data.error}</p>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
		{#each data.apps as app}
			<AppCard {app} />
		{:else}
			{#if !data.error}
				<div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card/20 rounded-2xl border border-dashed border-border">
					<div class="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
						<LayoutGrid size={32} class="text-muted-foreground" />
					</div>
					<h3 class="text-lg font-bold">No applications found</h3>
					<p class="text-xs text-muted-foreground mt-2 max-w-xs">
						You don't have access to any applications yet. Contact your administrator to request access.
					</p>
				</div>
			{/if}
		{/each}
	</div>
</div>

<!-- Support Modal -->
{#if showSupportModal}
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="presentation"
		tabindex="-1"
	>
		<div
			class="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden z-50 p-6 text-zinc-100"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<h2 class="text-xl font-semibold mb-2">Report an Issue</h2>
			<p class="text-sm text-zinc-400 mb-6">Let me know what isn't working.</p>

			{#if form?.success}
				<div class="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-md mb-6">
					Ticket submitted! I'll look into it soon.
				</div>
				<button
					class="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-md transition cursor-pointer"
					onclick={closeModal}
				>
					Close
				</button>
			{:else}
				<form
					method="POST"
					action="?/reportIssue"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-4"
				>
					{#if form?.error}
						<div class="text-red-400 text-sm">{form.error}</div>
					{/if}

					<div>
						<label for="apps" class="block text-sm font-medium mb-1">
							Which apps are affected?
						</label>
						<select
							name="apps"
							id="apps"
							multiple
							required
							class="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
						>
							{#each data.apps as app}
								<option value={app.name}>{app.name}</option>
							{/each}
							<option value="Other">Other (General Issue)</option>
						</select>
						<p class="text-xs text-zinc-500 mt-1">
							Hold Ctrl/Cmd to select multiple apps.
						</p>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium mb-1">
							What's going on?
						</label>
						<textarea
							name="description"
							id="description"
							required
							rows="4"
							placeholder="e.g., 'Plex won't load' or 'Audiobookshelf returns a 500 error.'"
							class="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						></textarea>
					</div>

					<div class="flex justify-end space-x-3 pt-4 border-t border-zinc-800 mt-6">
						<button
							type="button"
							class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition cursor-pointer"
							onclick={closeModal}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-md transition disabled:opacity-50 cursor-pointer"
						>
							{isSubmitting ? 'Submitting...' : 'Submit Ticket'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

