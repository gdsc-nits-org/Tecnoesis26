<script lang="ts">
	import { GalleryButton } from '$lib/components';
	interface GalleryItem {
		src: string;
		title: string;
		date: string;
	}

	let {
		images = [
			{ src: '/images/image1.png', title: 'Mystery Sphere 1', date: '10.03.2026' },
			{ src: '/images/image2.png', title: 'Mystery Sphere 2', date: '11.03.2026' },
			{ src: '/images/image3.png', title: 'Mystery Sphere 3', date: '12.03.2026' }
		]
	}: { images?: GalleryItem[] } = $props();

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
	class="fixed inset-0 flex items-center justify-center overflow-hidden bg-[url('/GalleryBgImg.png')] bg-cover bg-center bg-no-repeat"
	onwheel={handleWheel}
>
	<!-- Background MEDIA Text -->
	<div
		class="pointer-events-none absolute bottom-0 left-[20vw] z-0 -translate-x-1/6 translate-y-1/8 text-center font-game-demo text-[20vw] leading-none font-bold whitespace-nowrap text-white select-none"
	>
		<h1>MEDIA</h1>
	</div>
	<!-- Foreground Content -->
	<div
		class="pointer-events-auto relative z-10 flex h-full w-full flex-col items-center justify-center"
	>
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
							: 'opacity: 0; transform: translate(0, 100px) scale(0.92); pointer-events: none; z-index: 0;'}
                        "
				>
					<div class="flex h-[50%] w-[50%] flex-col overflow-hidden rounded-2xl">
						<img
							src={item.src}
							alt={item.title}
							class="pointer-events-none h-full w-full object-contain select-none"
						/>
					</div>
				</div>
			{/each}
		</div>
		<GalleryButton />
	</div>
</main>
