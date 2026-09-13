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
    ] }: { images?: GalleryItem[] } = $props();

    let currentIndex = $state(0);
    let isAnimating = $state(false);

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
            }, 1800);
        }
    }

    function prevSlide(): void {
        if (currentIndex > 0 && !isAnimating) {
            isAnimating = true;
            currentIndex -= 1;
            setTimeout(() => {
                isAnimating = false;
            }, 1800);
        }
    }
    
</script>

<main
    class="flex justify-center items-center fixed inset-0 overflow-hidden bg-[url('/GalleryBgImg.png')] bg-cover bg-center bg-no-repeat"
    onwheel={handleWheel}
>
    
   
        <!-- Background MEDIA Text -->
        <div class="pointer-events-none select-none absolute bottom-0 left-[20vw] -translate-x-1/6 translate-y-1/8 z-0 font-game-demo text-white text-[20vw] font-bold text-center leading-none whitespace-nowrap">
            <h1>
                MEDIA
            </h1>
        </div>
        <!-- Foreground Content -->
        <div class="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-auto">
            <div class="flex flex-1 items-center justify-center">
                {#each images as item, i (item.src)}
                <!-- Card Container with Circular Exit Path -->
                    <div
                        class="absolute inset-0 flex items-center justify-center transition-all duration-1800 ease-out will-change-transform"
                        style="
                            transform-origin: 80% 120%;
                            {i === currentIndex
                                ? 'opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); pointer-events: auto; z-index: 20;'
                                : i < currentIndex
                                ? 'opacity: 0; transform: translate(20%, -120%) rotate(20deg) scale(0.85); pointer-events: none; z-index: 10;'
                                : 'opacity: 0; transform: translate(0, 100px) scale(0.92); pointer-events: none; z-index: 0;'
                            }
                        "
                    >
                        <div class="w-[50%] h-[50%] rounded-2xl overflow-hidden flex flex-col">
                            <img 
                                src={item.src} 
                                alt={item.title} 
                                class="w-full h-full object-contain select-none pointer-events-none" 
                            />
                        </div>
                    </div>
                {/each}
            </div>
            <GalleryButton />
        </div>
</main>