<script lang="ts">
	import ShapeBlur from './ShapeBlur.svelte';

	// The marquee is rendered twice back to back so the -50% scroll animation loops
	// seamlessly. Named arrays keep the {#each} blocks keyed and free of unused bindings.
	const MARQUEE_PASSES = [0, 1];
	const PREVIOUS_SPONSORS = Array.from({ length: 8 }, (_, index) => index);
</script>

<!-- Phones let the grid set the height: a fixed h-screen with overflow-hidden clipped
     the last sponsor row and the marquee. Desktop keeps the one-screen layout. -->
<main
	data-sponsors-section
	class="relative flex min-h-screen flex-col overflow-visible pb-4 lg:h-screen lg:min-h-0 lg:flex-row lg:overflow-hidden lg:pb-0"
>
	<div
		class="flex min-h-[12vh] w-full items-center justify-center py-6 font-['Bruno_Ace'] text-[clamp(2rem,7vw,3rem)] text-white sm:text-[clamp(2.25rem,5vw,3rem)] md:text-[clamp(2.5rem,4vw,3.25rem)] lg:hidden"
	>
		SPONSORS
	</div>
	<!-- Content Section (Flows naturally with standard page scroll) -->
	<div class="flex w-full flex-1 items-center justify-center py-8 lg:w-[85vw] lg:py-12">
		<div class="w-full px-4 lg:w-[90%]">
			<div
				class="grid h-auto w-full shrink-0 auto-rows-[11rem] grid-cols-2 sm:auto-rows-[13rem] md:grid-cols-3 lg:auto-rows-[16rem] lg:grid-cols-3"
			>
				<div class="relative h-full w-full overflow-hidden">
					<img
						src="/Amul.png"
						alt="Sponsor 6"
						class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
					/>
					<div class="pointer-events-none absolute inset-0 z-10">
						<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
					</div>
				</div>
				<div class="relative h-full w-full overflow-hidden">
					<img
						src="/Amul.png"
						alt="Sponsor 7"
						class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
					/>
					<div class="pointer-events-none absolute inset-0 z-10">
						<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
					</div>
				</div>
				<div class="relative h-full w-full overflow-hidden">
					<img
						src="/Amul.png"
						alt="Sponsor 8"
						class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
					/>
					<div class="pointer-events-none absolute inset-0 z-10">
						<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
					</div>
				</div>
				<div class="relative h-full w-full overflow-hidden">
					<img
						src="/Amul.png"
						alt="Sponsor 9"
						class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
					/>
					<div class="pointer-events-none absolute inset-0 z-10">
						<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
					</div>
				</div>
				<div class="relative h-full w-full overflow-hidden">
					<img
						src="/Amul.png"
						alt="Sponsor 9"
						class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
					/>
					<div class="pointer-events-none absolute inset-0 z-10">
						<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
					</div>
				</div>
			</div>

			<section
				class="flex w-full min-w-0 flex-col items-center justify-center gap-4 py-5 lg:gap-6 lg:py-8"
			>
				<h2 class="font-['Bruno_Ace'] text-2xl text-white sm:text-3xl">Previous Sponsors</h2>
				<!-- w-full + min-w-0 matter: with no width this wrapper sizes to its w-max
				     marquee child and pushes ~970px of horizontal scroll onto phones. -->
				<div class="w-full min-w-0 overflow-hidden lg:w-4/5">
					<div class="flex w-max animate-[sponsors-scroll_20s_linear_infinite]">
						{#each MARQUEE_PASSES as pass (pass)}
							<div class="flex shrink-0">
								{#each PREVIOUS_SPONSORS as index (index)}
									<img
										src="/Amul.png"
										alt={`Previous sponsor ${index + 1}`}
										class="mx-2 h-16 w-24 rounded-xl object-contain p-2 sm:h-20 sm:w-28 lg:h-24 lg:w-32 lg:p-3"
									/>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');

	:global {
		@keyframes sponsors-scroll {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(-50%);
			}
		}
	}
</style>
