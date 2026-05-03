<script lang="ts">
    import { onMount } from 'svelte';
    import { clsx, type ClassValue } from 'clsx';
    import { twMerge } from 'tailwind-merge';

    function cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
    }

    let { config } = $props<{ config: { url?: string, slug?: string } }>();

    let statusData = $state<Record<string, any> | null>(null);
    let error = $state(false);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const kumaUrl = $derived(config?.url);
    const kumaSlug = $derived(config?.slug);
    
    const baseKumaUrl = $derived(kumaUrl?.startsWith('http') ? kumaUrl : `https://${kumaUrl}`);
    const endpoint = $derived(kumaUrl && kumaSlug ? `${baseKumaUrl.replace(/\/$/, '')}/api/status-page/heartbeat/${kumaSlug}` : null);
    const statusPageUrl = $derived(kumaUrl && kumaSlug ? `${baseKumaUrl.replace(/\/$/, '')}/status/${kumaSlug}` : null);

    async function fetchStatus() {
        if (!endpoint) return;
        try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error('Fetch failed');
            statusData = await res.json();
            error = false;
        } catch (e) {
            console.error('Status fetch error:', e);
            error = true;
        }
    }

    function startPolling() {
        if (!intervalId && endpoint) {
            console.log('Starting health status polling:', endpoint);
            fetchStatus();
            intervalId = setInterval(fetchStatus, 60000);
        }
    }

    function stopPolling() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    onMount(() => {
        if (!endpoint) return;

        startPolling();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startPolling();
            } else {
                stopPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    });

    function calculateDuration(timestamp: string) {
        if (!timestamp) return '...';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '...';
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return '1m';
    }

    const aggregated = $derived.by(() => {
        if (error || !statusData) return { state: -1, services: [] };
        
        const heartbeats = statusData.heartbeatList || {};
        const monitors = statusData.monitorList || [];
        const monitorMap = new Map(monitors.map((m: any) => [m.id, m]));
        
        let worstStatus = 1;
        const statusPriority: Record<number, number> = { 0: 4, 3: 3, 2: 2, 1: 1 };
        const affected: { name: string, status: number, duration: string }[] = [];

        for (const monitorId in heartbeats) {
            const list = heartbeats[monitorId];
            if (list && list.length > 0) {
                const last = list[list.length - 1];
                const status = last.status;
                
                if (statusPriority[status] > (statusPriority[worstStatus] || 0)) {
                    worstStatus = status;
                }
                
                if (status !== 1) {
                    const monitor: any = monitorMap.get(Number(monitorId));
                    affected.push({
                        name: monitor?.name || `Service ${monitorId}`,
                        status,
                        duration: calculateDuration(last.time)
                    });
                }
            }
        }

        return { state: worstStatus, services: affected };
    });

    const statusConfig = $derived.by(() => {
        switch (aggregated.state) {
            case 1:
                return {
                    label: 'Operational',
                    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    dot: 'bg-emerald-500 animate-pulse',
                    tooltip: 'All systems operational'
                };
            case 0:
                return {
                    label: 'Service Disruption',
                    color: 'bg-red-500/10 text-red-500 border-red-500/20',
                    dot: 'bg-red-500',
                    tooltip: aggregated.services
                };
            case 3:
                return {
                    label: 'Maintenance',
                    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    dot: 'bg-blue-500',
                    tooltip: aggregated.services
                };
            case 2:
                return {
                    label: 'Systems Checking',
                    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    dot: 'bg-amber-500',
                    tooltip: aggregated.services
                };
            default:
                return {
                    label: 'Status Unknown',
                    color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
                    dot: 'bg-zinc-500',
                    tooltip: 'Could not reach status API'
                };
        }
    });
</script>

{#if endpoint}
<div class="relative group flex items-center">
    <a 
        href={statusPageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        class={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all shadow-sm active:scale-95 hover:brightness-95 dark:hover:brightness-110",
            statusConfig.color
        )}
    >
        <div class={cn("size-1.5 rounded-full", statusConfig.dot)}></div>
        <span>{statusConfig.label}</span>
    </a>

    <!-- Tooltip -->
    <div class="absolute top-full right-0 mt-2 w-64 p-3 bg-card border border-border rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200 z-[100] text-foreground">
        <div class="text-[11px] font-bold mb-2 border-b border-border pb-1.5 opacity-80 uppercase tracking-wider">System Status</div>
        
        {#if Array.isArray(statusConfig.tooltip)}
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                {#each statusConfig.tooltip as service}
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-[10px] font-medium truncate flex-1">{service.name}</span>
                        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground whitespace-nowrap">
                            {service.duration}
                        </span>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-[10px] font-medium text-muted-foreground">{statusConfig.tooltip}</p>
        {/if}
        
        <div class="mt-3 pt-2 border-t border-border flex items-center justify-between text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            <span class="opacity-70">Click to view details</span>
            <span>Every 60s</span>
        </div>
    </div>
</div>
{/if}
