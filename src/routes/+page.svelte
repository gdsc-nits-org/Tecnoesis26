<script>
    import MeIntoButton from '$lib/components/MeIntoButton.svelte';
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Bruno+Ace&family=Doto:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/how-are-you-today" rel="stylesheet">
</svelte:head>

<main class="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#2a4aad_0%,#1a2e8a_30%,#0f1e6e_60%,#0a1550_100%)]">

    <!-- Faint starry dots -->
    <div class="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:55px_55px]"></div>

    <!-- Radial center glow -->
    <div class="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(ellipse,rgba(80,120,255,0.25)_0%,transparent_70%)]"></div>

    <!-- STRAIGHT LINES PERSPECTIVE GRID -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden [perspective:500px] [perspective-origin:50%_50%]">
        <div class="absolute top-1/2 left-[-50%] w-[200%] h-[150%] bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:80px_80px] origin-top [transform:rotateX(80deg)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]"></div>
    </div>

    <!-- Screen Corner Brackets -->
    <div class="absolute top-5 left-5 w-8 h-8 border-t border-l border-white/20 pointer-events-none"></div>
    <div class="absolute top-5 right-5 w-8 h-8 border-t border-r border-white/20 pointer-events-none"></div>
    <div class="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-white/20 pointer-events-none"></div>
    <div class="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-white/20 pointer-events-none"></div>

    <!-- MAIN ROW: IMMERSE [Button] FUTURE -->
    <!-- Reduced gap significantly to bring them much closer -->
    <div class="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 w-full max-w-[850px] h-auto md:h-[200px] px-2 mx-auto">
        
        <!-- Left Text: IMMERSE (Made font bigger again: up to 120px) -->
        <h1 class="text-white m-0 leading-[100%] uppercase text-center font-['How_Are_You_Today'] font-normal tracking-[0.02em] text-[clamp(45px,8vw,120px)] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            IMMERSE
        </h1>

        <!-- The Me Into Button -->
        <div class="shrink-0 flex items-center justify-center">
            <MeIntoButton />
        </div>

        <!-- Right Text: FUTURE (Made font bigger again: up to 120px) -->
        <h1 class="text-white m-0 leading-[100%] uppercase text-center font-['How_Are_You_Today'] font-normal tracking-[0.02em] text-[clamp(45px,8vw,120px)] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            FUTURE
        </h1>
        
    </div>

    <!-- BOTTOM CONTROLS & TEXT -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 w-full px-4 text-center">
        
        <!-- ON Button -->
        <div class="flex items-center gap-2 bg-white rounded-full px-3.5 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
            <svg class="w-[22px] h-[12px]" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6 C3 1, 5 1, 6 6 C7 11, 9 11, 10 6 C11 1, 13 1, 14 6 C15 11, 17 11, 18 6 C19 1, 21 1, 21 6" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-['Doto'] font-bold text-black leading-[100%] tracking-[0.02em] text-[12.4px]">ON</span>
        </div>

        <!-- Bottom text -->
        <div class="font-['Bruno_Ace'] font-normal text-[15px] leading-[160%] tracking-[0.03em] text-white/60 text-center">
            <div>USE SOUND EFFECTS</div>
            <div>TO IMMERSE MORE IMMERSIVELY</div>
        </div>
        
    </div>

</main>
