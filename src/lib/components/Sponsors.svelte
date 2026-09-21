<script lang="ts">
	import ShapeBlur from './ShapeBlur.svelte';
</script>

<main data-sponsors-section class="relative flex h-screen flex-col overflow-hidden lg:flex-row">
	<div
		class="flex h-[15vh] w-full items-center justify-center font-['Bruno_Ace'] text-[clamp(2rem,7vw,3rem)] text-white sm:text-[clamp(2.25rem,5vw,3rem)] md:text-[clamp(2.5rem,4vw,3.25rem)] lg:hidden"
	>
		SPONSORS
	</div>
	<!-- Content Section (Flows naturally with standard page scroll) -->
	<div
		class="flex w-full flex-1 items-center justify-center py-8  lg:w-[85vw] lg:py-12"
	>
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
				class="col-span-2 flex flex-col items-center justify-center gap-4 py-5 lg:col-span-3 lg:gap-6 lg:py-8"
			>
				<h2 class="font-['Bruno_Ace'] text-2xl text-white sm:text-3xl">Previous Sponsors</h2>
				<div class="lg:w-4/5 overflow-hidden">
					<div class="flex w-max animate-[sponsors-scroll_20s_linear_infinite]">
						{#each Array(2) as _}
							<div class="flex shrink-0">
								{#each Array(8) as _, index}
									<img
										src="/Amul.png"
										alt={`Previous sponsor ${index + 1}`}
										class="mx-2 h-24 w-32 rounded-xl object-contain p-3"
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
           