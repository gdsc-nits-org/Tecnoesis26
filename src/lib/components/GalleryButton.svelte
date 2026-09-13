<script>
    import wave from '$lib/assets/wave.svg?raw';
  let isPlaying = $state(true);
</script>

<button
  type="button"
  onclick={() => (isPlaying = !isPlaying)}
  class="fixed bottom-[30px] left-[30px]  z-50 flex h-10 w-25 items-center justify-center gap-1.5 rounded-[16px] border border-white/40 bg-white px-2 text-[11px] font-bold tracking-wider text-[#1a1a24] shadow-sm transition hover:bg-neutral-100 active:translate-y-0 "
>
    <div class="w-1/2 overflow-hidden">
        {#if isPlaying}
            {@html wave}
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