<script lang="ts">
	import ShapeBlur from './ShapeBlur.svelte';
	import previousSponsors from '$lib/data/previous-sponsors.json';

	type Sponsor = {
		sponsor_name: string;
		sponsor_img: string;
	};

	let { sponsors = [] }: { sponsors?: Sponsor[] } = $props();

	type PreviousSponsor = (typeof previousSponsors.topRow)[number];
	const sponsorRows: PreviousSponsor[][] = [previousSponsors.topRow, previousSponsors.bottomRow];
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
			{#if sponsors.length}
				<div
					class="grid h-auto w-full shrink-0 auto-rows-[11rem] grid-cols-2 sm:auto-rows-[13rem] md:grid-cols-3 lg:auto-rows-[16rem] lg:grid-cols-3"
				>
					{#each sponsors as sponsor (sponsor.sponsor_name)}
						<div class="relative h-full w-full overflow-hidden">
							<img
								src={sponsor.sponsor_img}
								alt={sponsor.sponsor_name}
								class="absolute top-1/2 left-1/2 z-0 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 object-contain p-2 lg:h-[70%] lg:w-[70%] lg:p-8"
							/>
							<div class="pointer-events-none absolute inset-0 z-10">
								<ShapeBlur variation={0} borderSize={0.02} shapeSize={1.4} circleSize={0.4} />
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex min-h-[24rem] items-center justify-center">
					<p
						class="text-center font-['Bruno_Ace'] text-2xl tracking-[0.18em] text-white/80 sm:text-4xl"
					>
						REVEALING SOON!
					</p>
				</div>
			{/if}

			<section
				class="flex w-full min-w-0 flex-col items-center justify-center gap-4 py-5 lg:gap-6 lg:py-8"
			>
				<h2 class="font-['Bruno_Ace'] text-2xl text-white sm:text-3xl">Previous Sponsors</h2>
				<div class="flex w-full flex-col gap-5 lg:w-4/5 lg:gap-7">
					{#each sponsorRows as row, rowIndex (rowIndex)}
						<div
							class="sponsor-marquee"
							aria-label={`${rowIndex === 0 ? 'Primary' : 'Community'} previous sponsors`}
						>
							<div class:reverse={rowIndex === 1} class="sponsor-track">
								{#each [0, 1] as pass (pass)}
									<div class="sponsor-set" aria-hidden={pass === 1}>
										{#each row as sponsor (sponsor.name)}
											<div class="sponsor-logo">
												<img src={sponsor.image} alt={pass === 0 ? sponsor.name : ''} />
											</div>
										{/each}
									</div>
								{/each}
							</div>
						</div>
					{/each}
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

		.sponsor-marquee {
			width: 100%;
			overflow: hidden;
			mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
		}

		.sponsor-track {
			display: flex;
			width: max-content;
			animation: sponsors-scroll 22s linear infinite;
		}

		.sponsor-track.reverse {
			animation-name: sponsors-scroll-reverse;
			animation-duration: 25s;
		}

		.sponsor-set {
			display: flex;
			min-width: 100%;
			align-items: center;
			justify-content: space-around;
			gap: clamp(1.5rem, 4vw, 4.5rem);
			padding: 0 clamp(0.75rem, 2vw, 2rem);
		}

		.sponsor-logo {
			display: grid;
			width: clamp(6rem, 13vw, 14rem);
			height: clamp(4.5rem, 8vw, 7rem);
			flex: 0 0 clamp(6rem, 13vw, 14rem);
			place-items: center;
		}

		.sponsor-logo img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			filter: drop-shadow(0 0 12px rgba(216, 160, 255, 0.18));
		}

		@keyframes sponsors-scroll-reverse {
			from {
				transform: translateX(-50%);
			}
			to {
				transform: translateX(0);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.sponsor-track {
				animation-play-state: paused;
			}
		}
	}
</style>
