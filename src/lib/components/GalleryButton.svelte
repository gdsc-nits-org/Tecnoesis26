<script>
    import wave from '$lib/assets/wave.svg?raw';
    let isPlaying = $state(true);
</script>

<button
    type="button"
    onclick={() => (isPlaying = !isPlaying)}
    class="fixed bottom-4 md:bottom-6 right-6 md:right-auto md:left-8 z-50 flex h-7 w-12 md:h-10 md:w-24 items-center justify-center gap-1.5 rounded-[16px] bg-white/90 backdrop-blur-md px-2 text-[11px] font-bold tracking-wider text-[#1a1a24] shadow-lg transition hover:bg-white active:scale-95"
>
    <div class="relative flex h-5 w-full items-center overflow-hidden md:w-1/2">
        {#if isPlaying}
            <div class="flex w-max shrink-0 animate-[wave_1.2s_linear_infinite] items-center [&_svg]:block [&_svg]:h-[16px] md:[&_svg]:h-[18px] [&_svg]:w-auto">
                <span class="flex shrink-0">{@html wave}</span>
                <span class="flex shrink-0">{@html wave}</span>
            </div>
        {:else}
            <div class="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-neutral-500/70 to-transparent"></div>
        {/if}
    </div>

    <div class="hidden font-delicatus text-xs md:block md:text-sm">
        {#if isPlaying}
            ON
        {:else}
            OFF
        {/if}
    </div>
</button>