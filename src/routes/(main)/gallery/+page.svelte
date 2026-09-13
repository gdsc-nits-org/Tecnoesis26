<script lang="ts">
    import { GalleryButton } from '$lib/components';

    interface GalleryItem {
        src: string;
        title: string;
        date: string;
    }

    let { images = [
        { src: '/images/image1.png', title: 'Mystery Sphere 1', date: '10.03.2026' },
        { src: '/images/image2.png', title: 'Mystery Sphere 2', date: '11.03.2026' },
        { src: '/images/image3.png', title: 'Mystery Sphere 3', date: '12.03.2026' },
        { src: '/images/image4.png', title: 'Mystery Sphere 4', date: '12.03.2026' },
        { src: '/images/image5.png', title: 'Mystery Sphere 5', date: '12.03.2026' },
        { src: '/images/image6.png', title: 'Mystery Sphere 6', date: '12.03.2026' },
    ] }: { images?: GalleryItem[] } = $props();

    let currentIndex = $state(0);
    let isAnimating = $state(false);

    // Kept in sync with the 1500ms transition
    const DURATION = 1500;

    function handleWheel(e: WheelEvent): void {
        if (isAnimating) return;

        if (e.deltaY > 30) {
            nextSlide();
        } else if (e.deltaY < -30) {
            prevSlide();
        }
    }

    function nextSlide(): void {
        if (currentIndex < images.length - 1 && !isAnimating) {
            isAnimating = true;
            currentIndex += 1;
            setTimeout(() => {
                isAnimating = false;
            }, DURATION);
        }
    }

    function prevSlide(): void {
        if (currentIndex > 0 && !isAnimating) {
            isAnimating = true;
            currentIndex -= 1;
            setTimeout(() => {
                isAnimating = false;
            }, DURATION);
        }
    }
</script>

<main
    class="flex justify-center items-center fixed inset-0 overflow-hidden bg-[url('/GalleryBgImg.png')] bg-cover bg-center bg-no-repeat select-none font-game-demo"
    onwheel={handleWheel}
>
    <!-- Background MEDIA Text -->
    <div class="pointer-events-none select-none absolute bottom-0 left-[20vw] -translate-x-1/6 translate-y-1/8 z-0 text-white text-[20vw] font-bold text-center leading-none whitespace-nowrap">
        <h1>
            MEDIA
        </h1>
    </div>

    <!-- Foreground Viewport (Exactly Card Size) -->
    <div class="relative z-10 w-[56vw] h-[52vh] flex justify-center pointer-events-auto">
        
        <!-- Moving Column Reel -->
        <div
            class="absolute top-0 flex flex-col items-center gap-[18vh] transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style="transform: translateY(-{currentIndex * 70}vh);"
        >
            {#each images as item, i (item.src)}
                <div
                    class="w-[56vw] h-[52vh] flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-[1500ms] ease-out"
                    style="
                        {i === currentIndex
                            ? 'opacity: 1; transform: translateX(0px);'
                            : i < currentIndex
                            ? 'opacity: 0.65; transform: translateX(5vw);'
                            : 'opacity: 0.65; transform: translateX(5vw);'
                        }
                    "
                >
                    <img
                        src={item.src}
                        alt={item.title}
                        class="w-full h-full object-contain select-none pointer-events-none"
                        loading="eager"
                        decoding="sync"
                    />
                </div>
            {/each}
        </div>

    </div>
    <div class="absolute right-[6vw] top-[48%] -translate-y-1/2 z-20 flex items-center gap-6 pointer-events-none select-none">
    
    <div class="flex flex-col items-end text-right font-mono space-y-1.5 text-white">
        <span class="w-full text-left text-sm tracking-wider text-white font-game-demo">
            • {images.length} Images
        </span>
        <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent "></div>
        <div class=" flex flex-col gap-4">
            <h2 class="text-base text-xs  font-game-demo tracking-wide leading-snug drop-shadow-md">
                {images[currentIndex]?.title ?? ''}
            </h2>
            <h2 class="text-base text-xs  font-game-demo tracking-wide leading-snug drop-shadow-md">
                {images[currentIndex+1]?.title ?? ''}
            </h2>
        </div>
    </div>

    <div class="flex flex-col gap-5 items-end">
        {#each images as _, idx}
            <span
                class="h-[2px] rounded-full transition-all duration-300 ease-out {idx === currentIndex
                    ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'w-4 bg-white/25'}"
            ></span>
        {/each}
    </div>

</div>
    <GalleryButton />
</main>