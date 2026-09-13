<script>
    import wave from '$lib/assets/wave.svg?raw';
    let isPlaying = $state(true);
</script>

<button
    type="button"
    onclick={() => (isPlaying = !isPlaying)}
    class="fixed bottom-[30px] left-[30px] z-50 flex h-10 w-25 items-center justify-center gap-1.5 rounded-[16px] border border-white/40 bg-white px-2 text-[11px] font-bold tracking-wider text-[#1a1a24] shadow-sm transition hover:bg-neutral-100 active:translate-y-0"
>
    <div class="relative flex h-5 w-1/2 items-center overflow-hidden">
        {#if isPlaying}
            <div class="flex w-max shrink-0 animate-[wave_1.2s_linear_infinite] items-center [&_svg]:block [&_svg]:h-[18px] [&_svg]:w-auto">
                <span class="flex shrink-0">{@html wave}</span>
                <span class="flex shrink-0">{@html wave}</span>
            </div>
        {:else}
<div class="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-neutral-500/70 to-transparent"></div>
        {/if}
    </div>

    <div class="font-delicatus text-sm">
        {#if isPlaying}
            ON
        {:else}
            OFF
        {/if}
    </div>
</button>